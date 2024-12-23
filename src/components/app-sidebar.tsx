"use client";

import * as React from "react";
import { LayoutGrid, Bolt, Framer } from "lucide-react";
import { useRouter } from "next/navigation";

import { type LucideIcon } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { usePathname } from "next/navigation";

import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useCredits } from "@/hooks/use-credits";

const data = {
  navItems: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutGrid,
    },
    // {
    //   title: "My Resumes",
    //   url: "/dashboard/my-resumes",
    //   icon: FileText,
    // },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Bolt,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu className="mt-2">
          <SidebarMenuItem
            className="flex cursor-pointer items-center gap-2 overflow-hidden pl-1.5"
            onClick={() => router.push("/dashboard")}
          >
            <Framer className="size-5 shrink-0 text-blue-400 transition-colors hover:fill-blue-400" />
            ResumeX
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navItems} />
      </SidebarContent>
      <SidebarFooter>
        <UserPlan />
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
  }[];
}) {
  const pathName = usePathname();
  const router = useRouter();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item, index) => (
          <SidebarMenuItem
            key={`${item.title}-${index}-sidebar-item`}
            onClick={() => router.push(item.url)}
            className={cn(
              "rounded-md hover:bg-muted",
              pathName === item.url && "bg-muted",
            )}
          >
            <SidebarMenuButton tooltip={item.title}>
              {item.icon && <item.icon />}
              <span>{item.title}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

export const UserPlan = () => {
  const credits = useCredits();
  const { open } = useSidebar();

  if (!open) return null;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col items-center justify-between rounded-3xl bg-indigo-100 p-1 text-xs shadow-sm shadow-indigo-300">
        <p className="uppercase">{credits.data?.subscription.plan} Plan</p>
      </div>
      <div className="flex flex-col items-center justify-between rounded-3xl bg-muted p-1 text-xs shadow-sm">
        <p className="uppercase">{credits.data?.credits} Credits Left </p>
      </div>
    </div>
  );
};
