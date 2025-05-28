import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, CheckCircleIcon, CircleIcon, CircleSlashIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DashboardCardProps {
  title: string;
  description: string;
  createdAt: string; // Consider using a Date type and formatting it appropriately
  status: string; // Example statuses
}

export function DashboardCard({ title, description, createdAt, status }: DashboardCardProps) {
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
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
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