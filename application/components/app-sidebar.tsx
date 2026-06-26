"use client";

import * as React from "react";

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
  BriefcaseBusiness,
  LayoutDashboardIcon,
  SettingsIcon,
  ShapesIcon,
} from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback } from "./ui/avatar";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <LayoutDashboardIcon />,
    },
    {
      title: "Site Settings",
      url: "/dashboard/site-settings",
      icon: <SettingsIcon />,
    },
    {
      title: "Experiences",
      url: "/dashboard/experiences",
      icon: <BriefcaseBusiness />,
    },
    {
      title: "Skill Categories",
      url: "/dashboard/skill-categories",
      icon: <ShapesIcon />,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="px-0">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="w-auto! data-[slot=sidebar-menu-button]:p-1.5!"
              style={{
                width: "auto !important",
              }}
            >
              <Link href="/" className="p-0">
                <Avatar className="p-0">
                  <AvatarFallback>KH</AvatarFallback>
                </Avatar>
                <span className="text-base font-semibold">
                  Khaldoun Portfolio Dashboard
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
