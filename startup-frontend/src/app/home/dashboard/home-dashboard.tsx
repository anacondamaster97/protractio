import React from 'react';
import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import axios from 'axios';
import AuthToken from '@/auth/auth-token';
import { supabase } from '@/supabaseClient';
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router";

const api = import.meta.env.VITE_API_URL;

interface DashboardData {
  dataSources: Array<{
    id: string;
    name: string;
    description: string;
    connection: string;
  }>;
  dashboards: Array<{
    id: string;
    name: string;
    createdAt: string;
    status: string;
  }>;
}

export default function HomeDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const userData = React.useMemo(() => {
    const storedData = localStorage.getItem('userData');
    return storedData ? JSON.parse(storedData) : { user: { name: 'User' } };
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        
        const token = await AuthToken({setError: setError, setIsLoading: setIsLoading});
        const { data: { user } } = await supabase.auth.getUser();
        const user_id = user?.id;
        const user_email = user?.email;
        const user_name = user?.user_metadata.name;
        setIsLoading(true);
        const response = await axios.post(`${api}/login`, 
          {user_id, email: user_email, name: user_name},
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setData(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const EmptyState = ({ title }: { title: string }) => (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <p className="text-sm text-gray-500">No {title} found</p>
      <p className="mt-1 text-xs text-gray-400">Add your first {title.toLowerCase()} to get started</p>
    </div>
  );

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to load dashboard data. Please try again later.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-8 p-8 max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="flex flex-col space-y-2 mt-24">
        <h1 className="text-[80px] font-normal text-gray-900 flex items-center gap-3">
          <span className="opacity-90">👋</span>
          Welcome{userData.user.name && `, ${userData.user.name.split(' ')[0]}`}!
        </h1>
        <p className="text-gray-500 text-lg">
          Here's an overview of your workspace, where you can see your data sources and dashboards.
        </p>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {/* Data Sources Card */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Sources</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Connection</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.dataSources && data.dataSources.length > 0 ? (
                      data.dataSources.map((source) => (
                        <TableRow key={source.id}>
                          <TableCell>{source.name}</TableCell>
                          <TableCell>{source.description}</TableCell>
                          <TableCell>{source.connection}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3}>
                          <EmptyState title="Data Sources" />
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
          <Card className="border-dashed cursor-pointer hover:border-gray-400 transition-colors"
                onClick={() => navigate('/app/home/data-sources')}>
            <CardContent className="flex items-center justify-center py-6">
              <Button variant="ghost" className="h-auto p-0">
                <PlusCircle className="h-5 w-5 mr-2 text-gray-500" />
                <span className="text-gray-500">Create New Data Source</span>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Dashboards Card */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Dashboards</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.dashboards && data.dashboards.length > 0 ? (
                      data.dashboards.map((dashboard) => (
                        <TableRow key={dashboard.id}>
                          <TableCell>{dashboard.name}</TableCell>
                          <TableCell>{dashboard.createdAt}</TableCell>
                          <TableCell>{dashboard.status}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3}>
                          <EmptyState title="Dashboards" />
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
          <Card className="border-dashed cursor-pointer hover:border-gray-400 transition-colors"
                onClick={() => navigate('/app/home/my-dashboards')}>
            <CardContent className="flex items-center justify-center py-6">
              <Button variant="ghost" className="h-auto p-0">
                <PlusCircle className="h-5 w-5 mr-2 text-gray-500" />
                <span className="text-gray-500">Create New Dashboard</span>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 