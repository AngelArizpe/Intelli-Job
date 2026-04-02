import { AppSidebar } from "@/components/sidebar/AppSidebar";
import { SidebarNavMenuGroup } from "@/components/sidebar/SidebarNavMenuGroup";
import { SideBarUserButton } from "@/features/users/components/SideBarUserButton";
import { BrainCircuit, ClipboardListIcon, LayoutDashboard, LogInIcon } from "lucide-react";
import { ReactNode } from "react";

export default function JobSeekerLayout({ 
  children, 
  sidebar 
}: { 
  children: ReactNode, 
  sidebar: ReactNode 
}) {
  return (
    <AppSidebar
      content={
        <>
          {sidebar}
          <SidebarNavMenuGroup
            className="mt-auto" 
            items={[
              { 
                href: "/", 
                icon: <ClipboardListIcon />, 
                label: "Job board"
              },
              { 
                href: "/ai-search", 
                icon: <BrainCircuit />, 
                label: "AI search"
              },
              { 
                href: "/employer", 
                icon: <LayoutDashboard />, 
                label: "Employer dashboard", 
                authStatus: "signedIn"
              },
              { 
                href: "/sign-in", 
                icon: <LogInIcon />, 
                label: "Sign in", 
                authStatus: "signedOut"
              },
            ]} 
          />
        </>
      }
      footerButton={<SideBarUserButton />}
    >
      {children}
    </AppSidebar>
  );
}
