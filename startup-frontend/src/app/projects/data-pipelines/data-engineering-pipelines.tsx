'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { Eye, Edit2, BarChart3, Search, Send, Plus } from 'lucide-react'
import { format } from 'date-fns'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useNavigate } from 'react-router'

// Constants
const ITEMS_PER_PAGE = 10

// Mock data interface
interface Dashboard {
  id: string
  title: string
  description: string
  chartCount: number
  lastUpdated: Date
}

const api = import.meta.env.VITE_API_URL

export default function MyDashboards() {
  const [dashboards, setDashboards] = useState<Dashboard[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate();

  // Mock data
  const mockDashboards: Dashboard[] = [
    {
      id: '1',
      title: 'Sales Analytics',
      description: 'Key metrics for quarterly sales performance. Key metrics for quarterly sales performance. Key metrics for quarterly sales performance',
      chartCount: 8,
      lastUpdated: new Date('2024-03-15'),
    },
    {
      id: '2',
      title: 'User Engagement',
      description: 'Daily active users and retention metrics',
      chartCount: 5,
      lastUpdated: new Date('2024-03-14'),
    },
    {
        id: '3',
        title: 'User Engagement',
        description: 'Daily active users and retention metrics',
        chartCount: 5,
        lastUpdated: new Date('2024-03-14'),
      },
      {
        id: '4',
        title: 'User Engagement',
        description: 'Daily active users and retention metrics',
        chartCount: 5,
        lastUpdated: new Date('2024-03-14'),
      },
      {
        id: '5',
        title: 'User Engagement',
        description: 'Daily active users and retention metrics',
        chartCount: 5,
        lastUpdated: new Date('2024-03-14'),
      },
      {
        id: '6',
        title: 'User Engagement',
        description: 'Daily active users and retention metrics',
        chartCount: 5,
        lastUpdated: new Date('2024-03-14'),
      },
      {
        id: '7',
        title: 'User Engagement',
        description: 'Daily active users and retention metrics',
        chartCount: 5,
        lastUpdated: new Date('2024-03-14'),
      },
      {
        id: '8',
        title: 'User Engagement',
        description: 'Daily active users and retention metrics',
        chartCount: 5,
        lastUpdated: new Date('2024-03-14'),
      },
        {
            id: '9',
            title: 'User Engagement',
            description: 'Daily active users and retention metrics',
            chartCount: 5,
            lastUpdated: new Date('2024-03-14'),
        },
        {
            id: '10',
            title: 'User Engagement',
            description: 'Daily active users and retention metrics',
            chartCount: 5,
            lastUpdated: new Date('2024-03-14'),
        },
        {
            id: '11',
            title: 'User Engagement',
            description: 'Daily active users and retention metrics',
            chartCount: 5,
            lastUpdated: new Date('2024-03-14'),
        },
    // Add more mock data as needed
  ]

  useEffect(() => {
    const fetchDashboards = async () => {
      try {
        // TODO: Replace with actual API endpoint
        // In a real API call, you would pass the page number and limit:
        // const response = await axios.get(`/api/dashboards?page=${currentPage}&limit=${ITEMS_PER_PAGE}`)
        const response = await axios.get(api + `/dashboards`)
        // For mock data: calculate the slice of data to show based on current page
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        // const allMockData = mockDashboards;
        const allMockData = response.data.dashboards;

        setDashboards(allMockData.slice(startIndex, endIndex));
      } catch (error) {
        console.error('Error fetching dashboards:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboards()
  }, [currentPage]) // Add currentPage as dependency

  // Filter dashboards based on search query
  const filteredDashboards = dashboards.filter(dashboard =>
    dashboard.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Update total pages calculation
  const totalPages = Math.ceil(60 / ITEMS_PER_PAGE) // Assuming 60 total items in mock data

  // Remove the pagination calculation since we're now handling it in the useEffect
  const paginatedDashboards = filteredDashboards

  return (
    <div className="p-8 w-full max-w-screen mx-auto">
      {/* Header Section */}
      <div className="mb-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              My Pipelines
            </h1>
            <p className="text-gray-500 mt-2">
              Manage and analyze your data insights
            </p>
          </div>
          <Button className="py-0.5 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800"
            onClick={() => {
             navigate('/app/agents/marketing')
            }}
          >
            <Plus className="w-4 h-4" />
            Create Dashboard
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            className="pl-10 bg-white"
            placeholder="Search dashboards..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 pl-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-center">Charts</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedDashboards.map((dashboard) => (
              <TableRow
                key={dashboard.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <TableCell className="font-medium">
                  {dashboard.title}
                </TableCell>
                <TableCell className="text-gray-600">
                  {dashboard.description.slice(0, 100) + (dashboard.description.length > 100 ? '...' : '')}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-2">
                    <BarChart3 className="w-4 h-4 text-gray-500" />
                    <span>{dashboard.chartCount}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {format(dashboard.lastUpdated, 'MMM d, yyyy')}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:text-blue-600 hover:bg-blue-50"
                      onClick={() => {/* TODO: Handle view */}}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:text-green-600 hover:bg-green-50"
                      onClick={() => {/* TODO: Handle edit */}}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:text-purple-600 hover:bg-purple-50"
                      onClick={() => {/* TODO: Handle edit */}}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredDashboards.length)} of {filteredDashboards.length} dashboards
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
