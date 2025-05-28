import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, CheckCircleIcon, CircleIcon, CircleSlashIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
        </CardFooter>
      </Card>
    );
  }

const FolderCard = ({ title, description, createdAt, status, type }: DashboardCardProps) => {
    const typeColor = () => {
        
        switch (type) {
            case "marketing":
                return "amber";
            default:
                return "amber";
        }
    }
    return (
    <button>
      
    <section
    className="relative group flex flex-col items-center justify-center w-full h-full"
    >

    <div
        className="file relative w-60 h-40 cursor-pointer origin-bottom [perspective:1500px] z-50"
    >
    <div
      className={`work-5 bg-amber-600 w-full h-full origin-top rounded-2xl rounded-tl-none group-hover:shadow-[0_20px_40px_rgba(0,0,0,.2)] transition-all ease duration-300 relative after:absolute after:content-[''] after:bottom-[99%] after:left-0 after:w-20 after:h-4 after:bg-amber-600 after:rounded-t-2xl before:absolute before:content-[''] before:-top-[15px] before:left-[75.5px] before:w-4 before:h-4 before:bg-amber-600 before:[clip-path:polygon(0_35%,0%_100%,50%_100%);]`}
    ></div>
    <div
        className={`work-4 absolute inset-1 bg-zinc-400 rounded-2xl transition-all ease duration-300 origin-bottom select-none group-hover:[transform:rotateX(-20deg)]`}
        ></div>
        <div
        className={`work-3 absolute inset-1 bg-zinc-300 rounded-2xl transition-all ease duration-300 origin-bottom group-hover:[transform:rotateX(-30deg)]`}
        ></div>
        <div
        className={`work-2 absolute inset-1 bg-zinc-200 rounded-2xl transition-all ease duration-300 origin-bottom group-hover:[transform:rotateX(-38deg)]`}
        ></div>
        <div
        className={`work-1 absolute justify-center items-center bottom-0 bg-gradient-to-t from-amber-500 to-amber-400 w-full h-[156px] rounded-2xl rounded-tr-none after:absolute after:content-[''] after:bottom-[99%] after:right-0 after:w-[146px] after:h-[16px] after:bg-amber-400 after:rounded-t-2xl before:absolute before:content-[''] before:-top-[10px] before:right-[142px] before:size-3 before:bg-amber-400 before:[clip-path:polygon(100%_14%,50%_100%,100%_100%);] transition-all ease duration-300 origin-bottom flex items-end group-hover:shadow-[inset_0_20px_40px_#fbbf24,_inset_0_-20px_40px_#d97706] group-hover:[transform:rotateX(-46deg)_translateY(1px)]`}
        >
            <div className="flex justify-center items-center p-4">
            <DashboardCard title={title} description={description} createdAt={createdAt} status={status} type={type} />
            </div>
        </div>
    </div>
    
    </section>

    </button>
  )
}

export default FolderCard;