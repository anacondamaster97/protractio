import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useNavigate } from 'react-router';
import DatabaseHover from '@/styled-components/database-hover';
import { PlusIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { supabase } from '@/supabaseClient';

// Dummy data for the data sources list
const mockDataSources = [
  {
    name: 'Data Source 1',
    description: 'Description for data source 1',
    connection: 'AWS',
  },
  {
    name: 'Data Source 2',
    description: 'Description for data source 2',
    connection: 'Azure',
  },
  {
    name: 'Data Source 2',
    description: 'Description for data source 2',
    connection: 'Azure',
  },
  {
    name: 'Data Source 2',
    description: 'Description for data source 2',
    connection: 'Azure',
  },
  // ... more data sources
];

const dataConnections = [
  { value: 'aws', label: 'AWS' },
  { value: 'azure', label: 'Azure' },
  { value: 'gcp', label: 'Google Cloud Platform' },
  // ... more data connections based on user information
];

interface DataSource {
  id: string;
  name: string;
  description: string;
  connection: string;
}

function DataSources() {
  const navigate = useNavigate();

  const handleNewDataSourceClick = () => {
    navigate('/app/home/data-sources/new', { state: { dataConnections } });
  };
  const [dataSources, setDataSources] = useState<DataSource[]>([]);

  useEffect(() => {
    const fetchDataSources = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/data-sources`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    setDataSources(response.data.dataSources);
    console.log(response.data);
  };
  fetchDataSources();
  }, []);

  const handleDataSourceClick = (id: string) => {
    navigate(`/app/home/data-sources/${id}`);
  };

  return (
    <div className='px-32'>
      <div className="flex justify-end mb-16">
        <Button onClick={handleNewDataSourceClick}>
          <PlusIcon className='w-4 h-4 mr-2' />
          New Data Source
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
        {dataSources.map((dataSource, index) => (
          <button key={index} onClick={() => handleDataSourceClick(dataSource?.id)}>
          <Card className='justify-center items-center bg-white text-black shadow-none' >
            <div className=''>
            <button className=''>
              {/* <DatabaseHover /> */}
            </button>
            <CardHeader>
              <CardTitle>{dataSource?.name}</CardTitle>
              <CardDescription>{dataSource?.description}</CardDescription>
              <CardDescription>Connection: {dataSource?.connection}</CardDescription>
            </CardHeader>
            </div>
            {/* <CardContent>
              <p>Connection: {dataSource.connection}</p>
            </CardContent> */}
            <CardFooter>
              {/* Add actions for each data source here, e.g., Edit, Delete */}
            </CardFooter>
          </Card>
          </button>
        ))}
      </div>
    </div>
  );
}

export default DataSources;