import * as React from "react";
import { IconTicket } from "@tabler/icons-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Building2,
  CalendarClock,
  Film,
  MessageCircle,
  Settings,
  User2,
} from "lucide-react";
import { useAppSelector } from "@/store/hooks";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: () => <Settings />,
    },
    {
      title: "Movies",
      url: "/admin/movies",
      icon: () => <Film />,
    },
    {
      title: "Theaters",
      url: "/admin/theaters",
      icon: () => <Building2 />,
    },
    {
      title: "Bookings",
      url: "/admin/bookings",
      icon: () => <IconTicket />,
    },
    {
      title: "ShowTimes",
      url: "/admin/showtimes",
      icon: () => <CalendarClock />,
    },
    { title: "Users", url: "/admin/users", icon: () => <User2 /> },
    {
      title: "Comments",
      url: "/admin/comments",
      icon: () => <MessageCircle />,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAppSelector((state) => state.auth);
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <span className="text-2xl font-semibold">Mooyie</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>{user && <NavUser user={user} />}</SidebarFooter>
    </Sidebar>
  );
}
