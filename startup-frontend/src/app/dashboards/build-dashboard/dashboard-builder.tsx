'use client'

import { useEffect, useState } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Database, GripHorizontal, GripVertical, Plus, PlusIcon, RotateCw, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ChartSelector } from '../../agents/charts'

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useNavigate, useLocation } from 'react-router'
import { Input } from '@/components/ui/input'
import axios from 'axios'
import { supabase } from '@/supabaseClient'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { CodingEditorPage } from '../../example/coder'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { ToastAction } from '@/components/ui/toast'
import { useToast } from '@/hooks/use-toast'


const api = import.meta.env.VITE_API_URL

// Define types for our dashboard components
type LayoutType = 'three-equal' | 'two-unequal' | 'two-equal' | 'three-header' | 'four-header'
type ChartData = {
  id: string
  layout: LayoutType
  components: Array<{
    graphType: string
    data: any[],
    sql_query?: string
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

// Add this new component for draggable layout items
function DraggableLayoutItem({ item, removeLayout, children }: {
  item: ChartData
  removeLayout: (id: string) => void
  children: React.ReactNode
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 2 : 1,
  }


  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative border rounded-lg p-4 ${isDragging ? 'opacity-50' : ''}`}
      {...attributes}
    >
      <div className="absolute left-2 -top-2 cursor-move" {...listeners}>
        <div className="flex items-center justify-center w-8 h-8 bg-white border rounded-full shadow-sm">
         {/*  <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5.5 4.625C5.5 5.06 5.14 5.42 4.705 5.42C4.27 5.42 3.91 5.06 3.91 4.625C3.91 4.19 4.27 3.83 4.705 3.83C5.14 3.83 5.5 4.19 5.5 4.625ZM5.5 7.5C5.5 7.935 5.14 8.295 4.705 8.295C4.27 8.295 3.91 7.935 3.91 7.5C3.91 7.065 4.27 6.705 4.705 6.705C5.14 6.705 5.5 7.065 5.5 7.5ZM4.705 11.17C5.14 11.17 5.5 10.81 5.5 10.375C5.5 9.94 5.14 9.58 4.705 9.58C4.27 9.58 3.91 9.94 3.91 10.375C3.91 10.81 4.27 11.17 4.705 11.17ZM11.09 5.42C11.525 5.42 11.885 5.06 11.885 4.625C11.885 4.19 11.525 3.83 11.09 3.83C10.655 3.83 10.295 4.19 10.295 4.625C10.295 5.06 10.655 5.42 11.09 5.42ZM11.885 7.5C11.885 7.935 11.525 8.295 11.09 8.295C10.655 8.295 10.295 7.935 10.295 7.5C10.295 7.065 10.655 6.705 11.09 6.705C11.525 6.705 11.885 7.065 11.885 7.5ZM11.09 11.17C11.525 11.17 11.885 10.81 11.885 10.375C11.885 9.94 11.525 9.58 11.09 9.58C10.655 9.58 10.295 9.94 10.295 10.375C10.295 10.81 10.655 11.17 11.09 11.17Z"
              fill="currentColor"
            />
          </svg> */}
          <GripHorizontal className="w-4 h-4" />
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-2 -top-2"
        onClick={() => removeLayout(item.id)}
      >
        <X className="w-4 h-4" />
      </Button>
      {children}
    </div>
  )
}

export function SheetDemo({sql_query}: {sql_query: string}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        
        <button className=''>
            <Database className="w-4 h-4"/>
          </button>

      </SheetTrigger>
      <SheetContent className="h-full w-full min-w-[600px] overflow-y-auto overflow-x-auto">
        <SheetHeader>
          <SheetTitle>
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4"/>
              SQL Query
            </div>
          </SheetTitle>
          <SheetDescription>
            This is the SQL query that was used to generate this chart.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-4">
          {/* <Textarea value={sql_query} className="h-32" readOnly /> */}
          <div className="border rounded-md p-4 h-full max-w-full w-full">
            <CodingEditorPage code={sql_query} isDarkTheme={false} language="sql"/>
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            {/* <Button type="submit">Save changes</Button> */}
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

// Replace DraggableChartItem with SortableChartItem
function SortableChartItem({ 
  itemId, 
  componentIndex, 
  component, 
  removeChart 
}: {
  itemId: string
  componentIndex: number
  component: { graphType: string; data: any[]; sql_query?: string } | null
  removeChart: (itemId: string, index: number) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `${itemId}-${componentIndex}`,
    data: {
      itemId,
      componentIndex,
      component
    }
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 2 : 1,
  }

  if (!component) return null

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`relative ${isDragging ? 'opacity-50' : ''}`}
    >
      <div className="absolute left-0 top-0 z-10 flex gap-2">
        <Button

          size="icon"
          className="bg-red-200 hover:bg-red-300 rounded-full"
          onClick={() => removeChart(itemId, componentIndex)}
        >
          <X className="w-4 h-4 text-black" />
        </Button>
      </div>
      <div className="absolute right-2 top-2 z-10 flex gap-2">
        <div 
          className="cursor-move bg-white p-1 rounded-full border shadow-sm flex mx-auto justify-center items-center"
          {...listeners}
        >
          <GripVertical className="w-4 h-4"/>
        </div>
        <div className="flex items-center justify-center p-2 rounded-full border shadow-sm">
          {/* <button className='' onClick={() => {
            console.log("database")
          }}>
            <Database className="w-4 h-4"/>
          </button> */}
          <SheetDemo sql_query={component.sql_query || 'none'} />
        </div>
      </div>
      <ChartSelector
        graphType={component.graphType}
        data={component.data}
      />
    </div>
  )
}

type MockData = {
    dashboard: Array<{
      graphType: string;
      data: any[];
      sql_query?: string;
    }>;
  };

  const MOCK_DATA: MockData = {
    dashboard: [
      {
        "graphType": "areachart",
        "data": [
            { "date": "2023-01", "netflix": 4000, "instagram": 2400, "tiktok": 2400 },
            { "date": "2023-02", "netflix": 3000, "instagram": 1398, "tiktok": 2210 },
            { "date": "2023-03", "netflix": 2000, "instagram": 9800, "tiktok": 2290 },
        ],
        "sql_query": "SELECT * FROM netflix"
      }
    ]
  };

export default function DashboardBuilder() {
    const navigate = useNavigate()
    const location = useLocation()
    const [dashboardTitle, setDashboardTitle] = useState<string>("")
    const [dashboardDescription, setDashboardDescription] = useState<string>("")
    const [dashboardItems, setDashboardItems] = useState<ChartData[]>([
        {
        id: '1',
        layout: 'three-equal',
        components: Array(3).fill(MOCK_DATA.dashboard[0])
        }
    ])
    const [dashboardData, setDashboardData] = useState<any>(null)
    const [startingDashboard, setStartingDashboard] = useState<ChartData[]>(dashboardItems)
    const [newChartType, setNewChartType] = useState<string>("")
    const [newChartData, setNewChartData] = useState<any>(null)
    const [newChartDataDescription, setNewChartDataDescription] = useState<string>("")
    const [activeComponent, setActiveComponent] = useState<{ graphType: string; data: any[]; sql_query?: string } | null>(null)
    const [newChartAddError, setNewChartAddError] = useState<string>("")
    const { toast } = useToast()

    console.log(dashboardItems)
  
    useEffect(() => {
        if (!location.state) {
            navigate('/app/agents/marketing')
        }
        const data = location.state.dashboard.data
        setDashboardTitle(location.state.dashboard.title)
        setDashboardDescription(location.state.dashboard.description)
        const dashboard = [{id:'1', layout:'three-equal', components:[...data]}]

        setDashboardData([...data])
        setStartingDashboard(dashboard as any)
        console.log(dashboard, [...data, MOCK_DATA.dashboard[0]])
        setDashboardItems(dashboard as any)
    }, [location.state])

  const handleResetData = () => {
    setDashboardItems(startingDashboard)
    setDashboardTitle(location.state.dashboard.title)
    setDashboardDescription(location.state.dashboard.description)
  }

  const handleAddNewChart = async (newChartType: string, newChartDataDescription: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token
      const response = await axios.post(api + '/charts/create-chart', {
        graphType: newChartType,
        dataDescription: newChartDataDescription
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      console.log(response.data)
      console.log(dashboardData)
      setDashboardData([...dashboardData, MOCK_DATA.dashboard[0]])
      toast({
        title: "Chart created successfully",
      })
      setNewChartAddError("")
    } catch (error) {
      setNewChartAddError("Could not create chart")
    }
  };

  const addLayout = (layout: LayoutType) => {
    const newItem: ChartData = {
      id: crypto.randomUUID(),
      layout,
      components: Array(LAYOUT_CONFIGS[layout].cols).fill(null)
    }
    setDashboardItems([...dashboardItems, newItem])
  }

  const removeLayout = (id: string) => {
    setDashboardItems(dashboardItems.filter(item => item.id !== id))
  }

  const updateComponent = (itemId: string, componentIndex: number, data: { graphType: string, data: any[] }) => {
    setDashboardItems(dashboardItems.map(item => {
      if (item.id === itemId) {
        const newComponents = [...item.components]
        newComponents[componentIndex] = data
        return { ...item, components: newComponents }
      }
      return item
    }))
  }

  const handleAddChart = (itemId: string, componentIndex: number, selection: { graphType: string, data: any[] }) => {
    updateComponent(itemId, componentIndex, selection);
  };

  const removeChart = (itemId: string, componentIndex: number) => {
    setDashboardItems(dashboardItems.map(item => {
      if (item.id === itemId) {
        const newComponents = [...item.components]
        newComponents[componentIndex] = null
        return { ...item, components: newComponents }
      }
      return item
    }))
  }

  const handlePublish = () => {
    // Store dashboard data in localStorage or your preferred storage method
    // push to database, then redirect based on id.
    localStorage.setItem('dashboardTitle', dashboardTitle)
    localStorage.setItem('publishedDashboard', JSON.stringify(dashboardItems))
    const publishDashboard = async () => { 
        const { data: { session } } = await supabase.auth.getSession()
        const token = session?.access_token
        try {
            const response = await axios.post(api + '/dashboards/publish', {
                title: dashboardTitle,
                dashboardData: dashboardData,
                dashboard: dashboardItems,
                userId: session?.user.id,
                description: dashboardDescription
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            navigate(`/app/dashboards/${response.data.id}`)
        } catch (error) {
            console.error('Error publishing dashboard:', error)
        }
    }
    publishDashboard()
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    setDashboardItems((items) => {
      const oldIndex = items.findIndex((item) => item.id === active.id)
      const newIndex = items.findIndex((item) => item.id === over.id)
      return arrayMove(items, oldIndex, newIndex)
    })
  }

  const handleComponentDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return

    const activeIdParts = (active.id as string).split('-')
    const overIdParts = (over.id as string).split('-')
    
    const activeItemId = activeIdParts[0]
    const activeIndex = parseInt(activeIdParts[1])
    const overItemId = overIdParts[0]
    const overIndex = parseInt(overIdParts[1])

    if (activeItemId === overItemId && activeIndex !== overIndex) {
      setDashboardItems(items => 
        items.map(item => {
          if (item.id === activeItemId) {
            const newComponents = [...item.components]
            // Use arrayMove from @dnd-kit/sortable for better reordering
            return { ...item, components: arrayMove(newComponents, activeIndex, overIndex) }
          }
          return item
        })
      )
    }

    setActiveComponent(null)
  }

  const handleComponentDragStart = (event: DragStartEvent) => {
    const { active } = event
    const activeIdParts = (active.id as string).split('-')
    const activeItemId = activeIdParts[0]
    const activeIndex = parseInt(activeIdParts[1])
    const activeComponent = dashboardItems.find(item => item.id === activeItemId)?.components[activeIndex]
    setActiveComponent(activeComponent as any)
  }

  const ResetDashboard = () => {
    return (
          <AlertDialog>
          <AlertDialogTrigger>
            <Button 
            variant="default"
            className="flex items-center gap-2 bg-white text-black hover:bg-red-200 hover:text-red-500"
          >
            <RotateCw className="w-4 h-4" /> 
          </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reset Dashboard</AlertDialogTitle>
              <AlertDialogDescription>
                This action will reset your dashboard to the original state.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={handleResetData}>Reset</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-col gap-1 font-bold w-1/4">
        
        <h1 className="text-3xl font-bold">
        
            <Input 
                placeholder="Dashboard Title"
                value={dashboardTitle}
                onChange={(e) => setDashboardTitle(e.target.value)}
                />
            </h1>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add Layout
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Choose Layout</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 p-4">
                {Object.entries(LAYOUT_CONFIGS).map(([key, config]) => (
                  <Button
                    key={key}
                    variant="outline"
                    className="h-24 flex flex-col items-center justify-center"
                    onClick={() => addLayout(key as LayoutType)}
                  >
                    <div className={`w-full h-full grid ${config.className} p-2`}>
                      {Array(config.cols).fill(0).map((_, i) => (
                        <div
                          key={i}
                          className={`bg-gray-200 rounded ${
                            ('special' in config && config.special) && i === 0 ? 'col-span-3' : ''
                          }`}
                        />
                      ))}
                    </div>
                    {key.replace('-', ' ').toUpperCase()}
                  </Button>
                ))}
              </div>
            </DialogContent>
          </Dialog>
          <Button 
            variant="default"
            onClick={handlePublish}
            className="flex items-center gap-2"
          >
            Publish Dashboard
          </Button>
          {/* <Button 
            variant="default"
            onClick={handleResetData}
            className="flex items-center gap-2 bg-white text-black hover:bg-red-200 hover:text-red-500"
          >
            <RotateCw className="w-4 h-4" /> 
          </Button> */}
          <ResetDashboard />
        </div>
      </div>
      <div className='mb-6'>
      <h2 className="text-md font-light mb-1 ml-2">
        Description
      </h2>
        <Input 
          placeholder="Dashboard Description"
          value={dashboardDescription}
          onChange={(e) => setDashboardDescription(e.target.value)}
          className=""
        />
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleComponentDragStart}
        onDragEnd={(event) => {
          handleDragEnd(event)
          handleComponentDragEnd(event)
        }}
      >
        <SortableContext
          items={dashboardItems.map(item => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-6">
            {dashboardItems.map((item) => (
              <DraggableLayoutItem
                key={item.id}
                item={item}
                removeLayout={removeLayout}
              >
                <SortableContext
                  items={item.components.map((_, index) => `${item.id}-${index}`)}
                  strategy={horizontalListSortingStrategy}
                >
                  <div className={`grid ${LAYOUT_CONFIGS[item.layout].className}`}>
                    {item.components.map((component, index) => (
                      <div
                        key={`${item.id}-${index}`}
                        className={`bg-gray-50 rounded-lg p-4 ${
                          item.layout === 'two-unequal' && index === 0 ? 'col-span-3' : ''
                        }`}
                      >
                        {component ? (
                          <SortableChartItem
                            itemId={item.id}
                            componentIndex={index}
                            component={component}
                            removeChart={removeChart}
                          />
                        ) : (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" className="w-full h-full hover:bg-blue-100 relative h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
                                    <PlusIcon className="w-4 h-4" />
                                    Add Chart
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="flex flex-col max-w-7xl h-[90%] overflow-y-auto my-auto">
                              <DialogHeader>
                                <DialogTitle>Add Chart</DialogTitle>
                              </DialogHeader>
                              <div className=''>
                              <Tabs defaultValue="existing" className="w-full h-full">
                                <TabsList className="grid w-full grid-cols-2">
                                  <TabsTrigger value="existing">Use Existing Data</TabsTrigger>
                                  <TabsTrigger value="new">Create New Data</TabsTrigger>
                                </TabsList>

                                <TabsContent value="existing" className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4 h-full">
                                    {dashboardData.map((chart: any, idx: any) => (
                                      <Button
                                        key={idx}
                                        variant="outline"
                                        className="h-full flex flex-col items-center justify-center p-4"
                                        onClick={() => handleAddChart(item.id, index, chart as any)}
                                      >
                                        <div className="text-sm font-medium mb-2">
                                          {chart?.graphType.toUpperCase()}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                          {chart?.data.length} data points
                                        </div>
                                        <div className="mt-2 w-full h-full bg-gray-100 rounded flex items-center justify-center">
                                          <ChartSelector graphType={chart?.graphType as string} data={chart?.data as any[]} />
                                        </div>
                                      </Button>
                                    ))}
                                  </div>
                                </TabsContent>

                                <TabsContent value="new">
                                  <div className="space-y-4">
                                    <div className="grid gap-4">
                                      <div className="space-y-2">
                                        <Label>Chart Type</Label>
                                        <Select
                                          onValueChange={(value) => setNewChartType(value)}
                                        >
                                          <SelectTrigger>
                                            <SelectValue placeholder="Select chart type" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="barchart">Bar Chart</SelectItem>
                                            <SelectItem value="linechart">Line Chart</SelectItem>
                                            <SelectItem value="piechart">Pie Chart</SelectItem>
                                            <SelectItem value="radarchart">Radar Chart</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>

                                      <div className="space-y-2">
                                        <Label>Describe the data you want to see in this chart</Label>
                                        <Textarea 
                                          placeholder="Write descriptive information about the data you want to see in this chart, based on the data values in your database."
                                          className="h-32"
                                          onChange={(e) => {
                                            setNewChartDataDescription(e.target.value)
                                          }}
                                        />
                                        
                                      </div>

                                      <Button 
                                        onClick={() => {
                                          handleAddNewChart(newChartType, newChartDataDescription)
                                        }}
                                        disabled={!newChartDataDescription || !newChartType}
                                      >
                                        Create Chart
                                      </Button>
                                      {newChartAddError && (
                                          <p className="text-sm text-red-500">Could not create chart</p>
                                        )}
                                    </div>
                                  </div>
                                </TabsContent>
                              </Tabs>
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}
                      </div>
                    ))}
                  </div>
                </SortableContext>
              </DraggableLayoutItem>
            ))}
          </div>
        </SortableContext>
        <DragOverlay>
          {activeComponent ? (
            <div className="bg-white shadow-lg rounded-lg p-4">
              <ChartSelector
                graphType={activeComponent.graphType}
                data={activeComponent.data}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
