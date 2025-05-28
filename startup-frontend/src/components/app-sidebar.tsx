import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  HomeIcon,
  Database,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { getCurrentUser } from "@/get-user"
import logo from "../../public/logo.png"


// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Protractio",
      logo: logo,
      plan: "Enterprise version",
    }
  ],
  navMain: [
    {
      title: "Home",
      url: "#",
      icon: HomeIcon,
      isActive: true,
      items: [
        {
          title: "Dashboard",
          url: "/app/home/dashboard",
          instructions: "This is the dashboard"
        },
        {
          title: "My Dashboards",
          url: "/app/home/my-dashboards",
        },
        {
          title: "Data Sources",
          url: "/app/home/data-sources",
        },
        {
          title: "Learn",
          url: "/app/home/learn",
        },
      ],
    },
    {
      title: "Agents",
      url: "/app/agents",
      icon: Bot,
      items: [
        {
          title: "Explore",
          url: "/app/agents/explore",
        },
        {
          title: "Marketing Agent",
          url: "/app/agents/marketing",
        },
        {
          title: "Sales Agent",
          url: "/app/agents/sales",
        },
        {
          title: "Reporting Agent",
          url: "/app/agents/reporting",
        },
        {
          title: "Data Engineering",
          url: "/app/agents/data-engineering",
        },
      ],
    },
    {
      title: "Learn Platform",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "/app/introduction",
        },
        {
          title: "Get Started",
          url: "/app/get-started",
        },
        {
          title: "Tutorials",
          url: "/app/tutorials",
        }
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Data Engineering Pipelines",
      url: "/app/views/data-engineering-pipelines",
      icon: Database,
    },
    {
      name: "Sales & Marketing",
      url: "/app/dashboards/sales-marketing",
      icon: PieChart,
    },
    
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [userData, setUserData] = React.useState<any>(null)

  React.useEffect(() => {
    const fetchUser = async () => {
      const user = await getCurrentUser()
      setUserData(user)
      console.log(localStorage.getItem('userData'), data.user)
    }
    fetchUser()
  }, [])
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} learnMode={true} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={JSON.parse(localStorage.getItem('userData') || '{}').user || data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
