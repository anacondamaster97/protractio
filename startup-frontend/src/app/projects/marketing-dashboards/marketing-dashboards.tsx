import { Button } from "@/components/ui/button";
import { ChartNetwork, PlusIcon } from "lucide-react";

import DashboardFolderCard from "../components/folder-card";
import { Particles } from "@/components/ui/particles";
import { useEffect, useState } from "react";
import axios from "axios";
import { supabase } from "@/supabaseClient";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router";


interface DashboardCardProps {
  title: string;
  description: string;
  createdAt: string;
  status: string;
  type: string;
}

export function DashboardList({ dashboards }: { dashboards: DashboardCardProps[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-24 my-24">
      {dashboards.map((dashboard, index) => (
        <DashboardFolderCard key={index} {...dashboard} />
      ))}
    </div>
  );
}

function Home() {

  
  const [dashboardType, setDashboardType] = useState<string>("")
  const [dashboardData, setDashboardData] = useState<DashboardCardProps[]>([]) 
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const navigate = useNavigate()

  useEffect(() => {
    
    const fetchDashboardTypes = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/dashboards/marketing`,
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            }
          }
        )
        console.log(response.data)
        setIsLoading(false)
        setDashboardType(response.data.dashboardType)
        setDashboardData(response.data.dashboardData)
      } catch (error) {
        console.error(error)
      }
    }
    fetchDashboardTypes()
  }, []);

  const filteredDashboards = dashboardData.filter(dashboard =>
    dashboard.title.toLowerCase().startsWith(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-white p-8">
      <Particles
        className="absolute inset-0"
        quantity={3000}
        ease={80}
        color={"#FF4500"}
        refresh
      />
      <div className="relative mx-auto">
      
        <div className="flex justify-between items-center mb-8 px-4 p-4 rounded-full">
          <div className="flex items-center text-3xl font-bold bg-white text-orange-500 rounded-full relative z-10 p-4">
            <ChartNetwork size={36} />
            <h1 className="ml-4 text-3xl font-bold text-gray-800">Marketing Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            
            <Button className="bg-orange-500 rounded-lg text-white hover:bg-orange-600" onClick={() => navigate('/app/agents/marketing')}>
              <PlusIcon className="mr-2 h-4 w-4" />
              Build Dashboards
            </Button>
          </div>
        </div>
        <div className="relative flex justify-center">
          <input
            type="text"
            placeholder="Search dashboards..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white text-gray-800 placeholder-gray-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          )}
        </div>
        {isLoading &&
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-24 my-24">
            {[1,2,3,4,5,6,7,8].map((item) => (
              <Skeleton key={item} className="ml-12 h-40 w-60 bg-gray-200 rounded-lg animate-pulse"></Skeleton>
            ))
          }
          </div>
        }
        {dashboardType === "marketing" && <DashboardList dashboards={filteredDashboards} />}
      </div>
    </div>
  );
}

export default Home;