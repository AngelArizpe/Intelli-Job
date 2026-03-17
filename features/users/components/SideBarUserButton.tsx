import { Suspense } from "react";
import { SideBarUserButtonClient } from "./_SideBarUserButtonClient";
import { getCurrentUser } from "@/services/clerk/lib/getCurrentAuth";
import { SignOutButton } from "@/services/clerk/components/AuthButtons";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { LogOutIcon } from "lucide-react";

export function SideBarUserButton() {
    return (
        <Suspense>
            <SideBarUserSuspense />
        </Suspense>
    )
}

async function SideBarUserSuspense() {
    const { user } = await getCurrentUser({ allData: true })

    if (user == null) {
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
        <SideBarUserButtonClient user = {user} />
    )
}