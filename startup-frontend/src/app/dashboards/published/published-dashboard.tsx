'use client'

import { useEffect, useState } from 'react'
import { ChartSelector } from '../../agents/charts'
import axios from 'axios'
import { supabase } from '@/supabaseClient'
import { useParams } from 'react-router'
import { Button } from '@/components/ui/button'

type LayoutType = 'three-equal' | 'two-unequal' | 'two-equal' | 'three-header' | 'four-header'
type ChartData = {
  id: string
  layout: LayoutType
  components: Array<{
    graphType: string
    data: any[]
  } | null>
}

const LAYOUT_CONFIGS = {
  'three-equal': { cols: 3, className: 'grid-cols-3 gap-4 h-full' },
  'four-equal': { cols: 4, className: 'grid-cols-4 gap-4 h-full' },
  'two-unequal': { cols: 2, className: 'grid-cols-4 gap-4 h-full', special: true },
  'two-equal': { cols: 2, className: 'grid-cols-2 gap-4 h-full' },
  'three-header': { cols: 3, className: 'grid-cols-3 gap-4 h-full' },
  'four-header': { cols: 4, className: 'grid-cols-4 gap-4 h-full' },
  'one-equal': { cols: 1, className: 'grid-cols-1 gap-4 h-full' }
}

export default function PublishedDashboard() {
  const [dashboardItems, setDashboardItems] = useState<ChartData[]>([])
  const params = useParams()
  const [dashboardTitle, setDashboardTitle] = useState<string>("")
  const [dashboardDescription, setDashboardDescription] = useState<string>("")

  useEffect(() => {
    // get the dashboard items from api
    console.log(params)
    const getDashboardItems = async () => {
      const id = params.id
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token
      const response = await axios.get(import.meta.env.VITE_API_URL + '/dashboards/' + id, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      console.log(response.data)
      setDashboardItems(response.data.publishedDashboard.dashboard)
      setDashboardTitle(response.data.publishedDashboard.title)
      setDashboardDescription(response.data.publishedDashboard.description)
    }
    getDashboardItems()
    
  }, [])

  return (
    <div className="p-6">
      <div className="flex justify-between items-center">
        <div className="flex flex-col mb-6">
          <h1 className="text-2xl font-bold">{dashboardTitle}</h1>
          <p>{dashboardDescription}</p>
        </div>
        <Button className="bg-blue-500 text-white px-4 py-2 rounded-md">Edit Dashboard</Button>
      </div>

      <div className="space-y-6">
        {dashboardItems.map((item) => (
          <div key={item.id} className="border rounded-lg p-4">
            <div className={`grid ${LAYOUT_CONFIGS[item.layout].className}`}>
              {item.components.map((component, index) => (
                component && (
                  <div
                    key={index}
                    className={`bg-gray-50 ${
                      item.layout === 'two-unequal' && index === 0 ? 'col-span-3' : ''
                    }`}
                  >
                    <ChartSelector
                      graphType={component.graphType}
                      data={component.data}
                    />
                  </div>
                )
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 

//rounded-lg p-4