import { Suspense } from "react";
import { getCurrentOrganization, getCurrentUser } from "@/services/clerk/lib/getCurrentAuth";
import { SignOutButton } from "@/services/clerk/components/AuthButtons";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { LogOutIcon } from "lucide-react";
import { SideBarOrganizationButtonClient } from "./_SideBarOrganizationButtonClient";

export function SideBarOrganizationButton() {
    return (
        <Suspense>
            <SideBarOrganizationSuspense />
        </Suspense>
    )
}

async function SideBarOrganizationSuspense() {
    const [{ user }, { organization }] = await Promise.all([
        getCurrentUser({ allData: true }), 
        getCurrentOrganization({ allData: true })
    ])

    if (user == null || organization == null) {
        return (
            <SignOutButton>
                <SidebarMenuButton>
                    <LogOutIcon />
                    <span>Log out</span>
                </SidebarMenuButton>
            </SignOutButton>
        )
    }

    return (
        <SideBarOrganizationButtonClient user = {user} organization = {organization} />
    )
}