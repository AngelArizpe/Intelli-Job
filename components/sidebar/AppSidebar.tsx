import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarProvider, 
  SidebarTrigger 
} from "@/components/ui/sidebar";

import { SignedIn } from "@/services/clerk/components/SignInStatus";
import { AppSidebarClient } from "./_AppSidebarClient";
import { ReactNode } from "react";

export function AppSidebar({ 
    content, 
    footerButton,
    children
}: { 
    content: ReactNode, 
    footerButton: ReactNode,
    children: ReactNode
}) {
    return (
    <SidebarProvider className="overflow-y-hidden">
      <AppSidebarClient>
        <Sidebar collapsible="icon" className="overflow-y-hidden">
          <SidebarHeader className="flex-row">
            <SidebarTrigger />
              <span className="text-xl text-nowrap">Intelli-Job</span>
          </SidebarHeader>
          <SidebarContent>{content}</SidebarContent>
          <SignedIn>
            <SidebarFooter>
              <SidebarMenu>
                <SidebarMenuItem>
                  {footerButton}
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
          </SignedIn>
        </Sidebar>
        <main className="flex-1">{children}</main>
      </AppSidebarClient>
    </SidebarProvider>
  )
}