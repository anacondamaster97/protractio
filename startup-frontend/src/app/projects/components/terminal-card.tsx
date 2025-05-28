import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, CheckCircleIcon, CircleIcon, CircleSlashIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import "./terminal-card.css";

interface DashboardCardProps {
    title: string;
    description: string;
    createdAt: string;
    status: string;
    type: string;
}

function DashboardCard({ title, description, createdAt, status, type }: DashboardCardProps) {
    const statusBadge = () => {
      switch (status) {
        case "active":
          return <Badge variant="default" className="bg-green-500 hover:bg-green-600"><CheckCircleIcon className="mr-1 h-3 w-3" />Active</Badge>;
        case "draft":
          return <Badge variant="secondary"><CircleIcon className="mr-1 h-3 w-3" />Draft</Badge>;
        case "archived":
          return <Badge variant="destructive"><CircleSlashIcon className="mr-1 h-3 w-3" />Archived</Badge>;
        default:
          return null;
      }
    };
  
    return (
      <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer">
        <CardHeader>
          <CardTitle>{title.slice(0, 16) + (title.length > 16 ? '...' : '')}</CardTitle>
          
        </CardHeader>
        <CardFooter className="flex justify-between items-center">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <CalendarIcon className="h-4 w-4" />
            <span>{createdAt}</span>
          </div>
          {statusBadge()}
        </CardFooter>
      </Card>
    );
  }

const TerminalCard = ({ title, description, createdAt, status, type }: DashboardCardProps) => {
    return (
        <div className="container ml-12">
            <div className="terminal_toolbar">
                <div className="butt">
                    <button className="btn btn-color"></button>
                    <button className="btn"></button>
                    <button className="btn"></button>
            </div>
            <p className="user">@admin: ~</p>
            <div className="add_tab">
                +
            </div>
            </div>
            <div className="terminal_body flex flex-col justify-center items-center bg-black">
                <div className="terminal_promt ml-3 mb-6 mr-auto">
                    <span className="terminal_user">@admin:</span>
                    <span className="terminal_location">~</span>
                    <span className="terminal_bling">$</span>
                    <span className="terminal_cursor"></span>
                    
                </div>
                <DashboardCard title={title} description={description} createdAt={createdAt} status={status} type={type} />
            </div>
            
        </div>
    )
}

export default TerminalCard;