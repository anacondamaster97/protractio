import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Check, ChevronsUpDown, ArrowLeft, CircleArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Particles } from '@/components/ui/particles';
import { PostgresForm } from './database-forms/PostgresForm';
import { MySQLForm } from './database-forms/MySQLForm';
import { SQLServerForm } from './database-forms/SQLServerForm';
import axios from 'axios';
import { supabase } from '@/supabaseClient';

/* const dataSources = [
  { value: 'aws', label: 'AWS' },
  { value: 'azure', label: 'Azure' },
  { value: 'gcp', label: 'Google Cloud Platform' },
  // ... more data connections based on user information
]; */

function NewDataSource() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [dataSourceName, setDataSourceName] = useState('');
  const [dataSourceDescription, setDataSourceDescription] = useState('');
  const [selectedConnection, setSelectedConnection] = useState('');
  const location = useLocation();
  const dataConnections = location.state.dataConnections as { value: string; label: string }[];
  const [dbType, setDbType] = useState<string>('');
  const [dbCredentials, setDbCredentials] = useState({
    host: '',
    user: '',
    password: '',
    database: '',
    port: '',
    // Add any additional fields needed
  });

  const dbTypes = [
    { value: 'postgresql', label: 'PostgreSQL' },
    { value: 'mysql', label: 'MySQL' },
    { value: 'sqlserver', label: 'SQL Server' },
  ];

  const handleCredentialChange = (field: string, value: string) => {
    setDbCredentials(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    // Update the API call to include database credentials
    const payload = {
      name: dataSourceName,
      description: dataSourceDescription,
      dbType,
      credentials: dbCredentials,
    };
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/data-sources`, payload, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log(response);
      navigate('/app/home/data-sources');
    } catch (error) {
      console.error('Error creating data source:', error);
    }
  };

  const handleGoBack = () => {
    navigate('/app/home/data-sources');
  };

  const renderDatabaseForm = () => {
    switch (dbType) {
      case 'postgresql':
        return <PostgresForm credentials={dbCredentials} onChange={handleCredentialChange} />;
      case 'mysql':
        return <MySQLForm credentials={dbCredentials} onChange={handleCredentialChange} />;
      case 'sqlserver':
        return <SQLServerForm credentials={dbCredentials} onChange={handleCredentialChange} />;
      default:
        return null;
    }
  };

  const isFormValid = () => {
    if (!dbType) return false;
    
    switch (dbType) {
      case 'postgresql':
        return !!(dbCredentials.host && dbCredentials.port && dbCredentials.database && 
                  dbCredentials.user && dbCredentials.password);
      case 'mysql':
        return !!(dbCredentials.host && dbCredentials.database && 
                  dbCredentials.user && dbCredentials.password);
      case 'sqlserver':
        return !!(dbCredentials.host && dbCredentials.database && 
                  dbCredentials.user && dbCredentials.password);
      default:
        return false;
    }
  };

  if (!dataConnections) {
    return <button onClick={() => navigate('/app/home/data-sources')}>No data sources available</button>;
  }

  return (
    <div>
      <Particles
        className="absolute inset-0"
        quantity={5000}
        ease={80}
        color={"#00A1FF"}
        refresh
      />

      <div className="flex justify-center my-24">
      
      <Card className="w-full max-w-md border p-8 mb-8 shadow-none relative">
        <Button variant="outline" onClick={handleGoBack} className='absolute top-2 left-2'>
          <ArrowLeft className='w-4 h-4'/>
        </Button>
        <CardHeader className="space-y-2 pb-8 my-8">
          <CardTitle className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Data Source Connection
          </CardTitle>
          <p className="text-base text-zinc-500 dark:text-zinc-400">
            Connect to your data tables
          </p>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Data Source Name
              </label>
              <Input
                placeholder="Enter data source name"
                value={dataSourceName}
                onChange={(e) => setDataSourceName(e.target.value)}
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Description
              </label>
              <Input
                placeholder="Enter description"
                value={dataSourceDescription}
                onChange={(e) => setDataSourceDescription(e.target.value)}
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Database Type
              </label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full h-12 justify-between"
                  >
                    {dbType
                      ? dbTypes.find((type) => type.value === dbType)?.label
                      : "Select database type..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search database type..." />
                    <CommandList>
                      <CommandEmpty>No database type found.</CommandEmpty>
                      <CommandGroup>
                        {dbTypes.map((type) => (
                          <CommandItem
                            key={type.value}
                            onSelect={() => {
                              setDbType(type.value);
                              setOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                dbType === type.value ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {type.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {dbType && renderDatabaseForm()}
          </div>

          <Button
            className="w-full h-12 text-lg font-medium bg-black hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-black rounded-xl transition-all duration-200"
            onClick={handleSubmit}
            disabled={!dataSourceName || !dataSourceDescription || !dbType || !isFormValid()}
          >
            Create Source
          </Button>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}

export default NewDataSource;