import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye,
  ArrowLeft,
  Database,
  Calendar,
  Table as TableIcon,
  Search,
  ArrowUpDown,
  MoreHorizontal,
  FileText
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import axios from 'axios';
import { supabase } from '@/supabaseClient';

interface DataTable {
  id: string;
  name: string;
  source: 'aws' | 'snowflake' | 'bigquery';
  rowCount: number;
  lastUpdated: string;
  sizeInGB: number;
  schema: string;
  owner: string;
  columns: Column[];
}

interface Column {
  name: string;
  type: string;
  description?: string;
  isPrimaryKey?: boolean;
  isForeignKey?: boolean;
}

const fetchDataSources = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/data-sources`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
}

export default function DataSourcePage() {
  const [selectedTable, setSelectedTable] = useState<DataTable | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [previewData, setPreviewData] = useState<any[] | null>(null);
  
  // Mock data with more examples
  const tables: DataTable[] = [
    {
      id: '1',
      name: 'users',
      source: 'snowflake',
      rowCount: 1000000,
      lastUpdated: '2024-03-20',
      sizeInGB: 2.5,
      schema: 'public',
      owner: 'analytics_team',
      columns: [
        { name: 'id', type: 'uuid', isPrimaryKey: true },
        { name: 'email', type: 'varchar(255)' },
        { name: 'created_at', type: 'timestamp' },
      ]
    },
    {
        id: '2',
        name: 'dsers',
        source: 'snowflake',
        rowCount: 1000000,
        lastUpdated: '2024-03-20',
        sizeInGB: 2.5,
        schema: 'public',
        owner: 'analytics_team',
        columns: [
          { name: 'id', type: 'uuid', isPrimaryKey: true },
          { name: 'email', type: 'varchar(255)' },
          { name: 'created_at', type: 'timestamp' },
        ]
      },
    // Add 10+ more mock tables
  ];

  const ITEMS_PER_PAGE = 10;

  // Filter tables based on search
  const filteredTables = tables.filter(table => 
    table.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    table.schema.toLowerCase().includes(searchQuery.toLowerCase()) ||
    table.owner.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort tables
  const sortedTables = [...filteredTables].sort((a, b) => {
    if (!sortColumn) return 0;
    const aValue = a[sortColumn as keyof DataTable];
    const bValue = b[sortColumn as keyof DataTable];
    return sortDirection === 'asc' ? 
      String(aValue).localeCompare(String(bValue)) :
      String(bValue).localeCompare(String(aValue));
  });

  // Paginate tables
  const paginatedTables = sortedTables.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(sortedTables.length / ITEMS_PER_PAGE);

  return (
    <div className="p-6 min-w-8xl w-full mx-auto px-24">
      <AnimatePresence mode="wait">
        {!selectedTable ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            key="table-list"
          >
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold">Data Tables</h1>
                <p className="text-gray-500 mt-1">
                  Browse and manage your data sources
                </p>
              </div>
              <Button variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Export Schema
              </Button>
            </div>

            <div className="mb-6">
              <div className="relative max-w-md">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search tables..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="bg-white rounded-lg border shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setSortColumn('name');
                          setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
                        }}
                      >
                        Name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>Schema</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead className="text-right">Row Count</TableHead>
                    <TableHead className="text-right">Size</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead className="w-[100px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedTables.map((table) => (
                    <TableRow key={table.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Database className="h-4 w-4 text-gray-500" />
                          {table.name}
                        </div>
                      </TableCell>
                      <TableCell>{table.schema}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {table.source}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {table.rowCount.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        {table.sizeInGB}GB
                      </TableCell>
                      <TableCell>
                        {new Date(table.lastUpdated).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{table.owner}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setSelectedTable(table)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Schema
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setPreviewData([])}>
                              <FileText className="mr-2 h-4 w-4" />
                              Preview Data
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="flex items-center justify-between px-4 py-4 border-t">
                <div className="text-sm text-gray-500">
                  Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, sortedTables.length)} of {sortedTables.length} results
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            key="table-detail"
          >
            <button
              onClick={() => setSelectedTable(null)}
              className="flex items-center gap-2 mb-6 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Tables
            </button>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center gap-3 mb-6">
                <TableIcon className="h-6 w-6 text-gray-500" />
                <div>
                  <h2 className="text-xl font-bold">{selectedTable.name}</h2>
                  <p className="text-sm text-gray-500">
                    {selectedTable.source} • {selectedTable.sizeInGB}GB
                  </p>
                </div>
              </div>

              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4">Column</th>
                    <th className="text-left py-2 px-4">Type</th>
                    <th className="text-left py-2 px-4">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedTable.columns.map((column) => (
                    <motion.tr
                      key={column.name}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="py-2 px-4">
                        <div className="flex items-center gap-2">
                          {column.name}
                          {column.isPrimaryKey && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                              PK
                            </span>
                          )}
                          {column.isForeignKey && (
                            <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
                              FK
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-2 px-4 text-gray-600">{column.type}</td>
                      <td className="py-2 px-4 text-gray-600">{column.description || '-'}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Data Preview Dialog */}
      <Dialog open={!!previewData} onOpenChange={() => setPreviewData(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Data Preview</DialogTitle>
          </DialogHeader>
          <div className="max-h-[500px] overflow-auto">
            {/* Add preview table content here */}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
