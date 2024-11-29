import { AppSidebar } from "@/components/app-sidebar";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ourFileRouter } from "@/app/api/uploadthing/core";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider open={false}>
      <AppSidebar />
      <SidebarInset>
        <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
