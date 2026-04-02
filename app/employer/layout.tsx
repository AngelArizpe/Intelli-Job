import { ReactNode, Suspense } from "react";
import { AppSidebar } from "@/components/sidebar/AppSidebar";
import { ClipboardListIcon, Key, PlusIcon } from "lucide-react";
import { SidebarNavMenuGroup } from "@/components/sidebar/SidebarNavMenuGroup";
import { SidebarGroup, SidebarGroupAction, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import Link from "next/link";
import { SideBarOrganizationButton } from "@/features/organizations/components/SideBarOrganizationButton";
import { getCurrentOrganization } from "@/services/clerk/lib/getCurrentAuth";
import { redirect } from "next/navigation";
import { AsyncIf } from "@/components/AsyncIf";
import { hasOrgUserPermissions } from "@/services/clerk/lib/orgUserPermissions";
import { cacheTag } from "next/cache";
import { getJobListingsOrganizationTag } from "@/features/jobListings/db/cache/jobListings";
import { db } from "@/drizzle/db";
import { JobListingApplicationTable, jobListingStatus, JobListingTable } from "@/drizzle/schema";
import { count, desc, eq } from "drizzle-orm";
import { getJobListingApplicationJobListingTag } from "@/features/jobListingApplications/db/cache/jobListingApplications";
import { sortJobListingsByStatus } from "@/features/jobListings/lib/utils";
import { JobListingMenuGroup } from "./job-listings/_JobListingMenuGroup";

export default function EmployerLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense>
      <LayoutSuspense>
        {children}
      </LayoutSuspense>
    </Suspense>
  )
}

async function LayoutSuspense({ children }: { children: ReactNode }) {
  const { orgId } = await getCurrentOrganization()

  if (orgId == null) return redirect("/organizations/select")

  return (
    <AppSidebar
      content={
        <>
          <SidebarGroup>
            <SidebarGroupLabel>Job listings</SidebarGroupLabel>
            <AsyncIf 
              condition={() => hasOrgUserPermissions("org:job_listing_manager_permissions:job_listings_create")}
            >
              <SidebarGroupAction title="Add job listing" asChild>
                <Link href="/employer/job-listings/new">
                  <PlusIcon /> 
                  <span className="sr-only">Add job listing</span>
                </Link>
              </SidebarGroupAction>
            </AsyncIf>
            <SidebarGroupContent className="group-data-[state=collapsed]:hidden">
              <Suspense>
                <JobListingMenu orgId={orgId} />
              </Suspense>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarNavMenuGroup
            className="mt-auto" 
            items={[
              { 
                href: "/", 
                icon: <ClipboardListIcon />, 
                label: "Job board"
              },
            ]} 
          />
        </>
      }
      footerButton={<SideBarOrganizationButton />}
    >
      {children}
    </AppSidebar>
  )
}

async function JobListingMenu({ orgId }: { orgId: string }) {
  const jobListings = await getJobListings(orgId)
  if (
    jobListings.length === 0 && 
    (await hasOrgUserPermissions("org:job_listing_manager_permissions:job_listings_create"))
  ) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <Link href="/employer/job-listings/new">
              <PlusIcon />
              <span>Create your first job listing</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  return Object.entries(Object.groupBy(jobListings, j => j.status))
  .sort(([a], [b]) => 
    {
      return sortJobListingsByStatus(
        a as jobListingStatus, 
        b as jobListingStatus
      )
    }
  ).map(([status, jobListings]) => (
    <JobListingMenuGroup
      key={status}
      status={status as jobListingStatus}
      jobListings={jobListings}
    />
  ))
}

async function getJobListings(orgId: string) {
  "use cache"
  cacheTag(getJobListingsOrganizationTag(orgId))

  const data = await db.select({
    id: JobListingTable.id,
    title: JobListingTable.title,
    status: JobListingTable.status,
    applicationCount: count(JobListingApplicationTable.userId)
  })
  .from(JobListingTable)
  .where(eq(JobListingTable.organizationId, orgId))
  .leftJoin(JobListingApplicationTable,
    eq(JobListingTable.id, JobListingApplicationTable.jobListinId)
  )
  .groupBy(JobListingApplicationTable.jobListinId, JobListingTable.id)
  .orderBy(desc(JobListingTable.createdAt))

  data.forEach(jobListing => {
    cacheTag(getJobListingApplicationJobListingTag(jobListing.id))
  })

  return data
}