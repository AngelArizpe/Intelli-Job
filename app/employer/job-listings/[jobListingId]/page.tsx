import { AsyncIf } from "@/components/AsyncIf";
import { MarkdownPartial } from "@/components/markdown/MarkdownPartial";
import { MarkDownRenderer } from "@/components/markdown/MarkdownRenderer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { db } from "@/drizzle/db";
import { jobListingStatus, JobListingTable } from "@/drizzle/schema";
import { JobListingBadges } from "@/features/jobListings/components/jobListingBadges";
import { getJobListingsIdTag } from "@/features/jobListings/db/cache/jobListings";
import { formatJobListingStatus } from "@/features/jobListings/lib/formatters";
import { hasReachedMaxFeaturedJobListings } from "@/features/jobListings/lib/planFeatureHelpers";
import { getNextJobListingStatus } from "@/features/jobListings/lib/utils";
import { getCurrentOrganization } from "@/services/clerk/lib/getCurrentAuth";
import { hasOrgUserPermissions } from "@/services/clerk/lib/orgUserPermissions";
import { and, eq } from "drizzle-orm";
import { EditIcon, EyeIcon, EyeOffIcon } from "lucide-react";
import { cacheTag } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

type Props = { params: Promise<{ jobListingId: string }> };

export default function JobListingPage(props: Props) {
  return (
    <Suspense>
      <SuspendedPage {...props} />
    </Suspense>
  );
}

async function SuspendedPage({ params }: Props) {
  const { orgId } = await getCurrentOrganization()
  if (orgId == null) return null

  const { jobListingId } = await params
  const jobListing = await getJobListing(jobListingId, orgId)
  if (jobListing == null) return notFound()
  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 @container">
      <div className="flex items-center justify-between gap-4 @max-4xl:flex-col @max-4xl:items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {jobListing.title}
          </h1>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge>{formatJobListingStatus(jobListing.status)}</Badge>
            <JobListingBadges jobListing={jobListing} />
          </div>
        </div>
        <div className="flex items-center gap-2 empty:-mt-4">
          <AsyncIf 
            condition={() => hasOrgUserPermissions("org:job_listing_manager_permissions:job_listings_update")}
          >
            <Button asChild variant="outline">
              <Link href={`/employer/job-listings/${jobListing.id}/edit`}>
                <EditIcon className="size-4" />
                Edit
              </Link>
            </Button>
          </AsyncIf>
          <StatusUpdateButton status={jobListing.status} />
        </div>
      </div>
      <MarkdownPartial
        dialogMarkdown={<MarkDownRenderer source={jobListing.description} />}
        mainMarkdown={<MarkDownRenderer className="prose-sm" source={jobListing.description} />}
        dialogTitle="Description"
      />
    </div>
  );
}

function StatusUpdateButton({ status }: { status: jobListingStatus }) {
  const button = <Button variant="outline">Toggle</Button>
  return (
    <AsyncIf 
      condition={() => hasOrgUserPermissions("org:job_listing_manager_permissions:job_listing_change_status")}
    >
      {getNextJobListingStatus(status) === "published" ? (
        <AsyncIf 
          condition={async () => {
            const isMaxed = await hasReachedMaxFeaturedJobListings()
            return !isMaxed
          }}
          otherwise={
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  {statusToggleButtonText(status)}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="flex flex-col gap-2">
                You must upgrade your plan to public more job listings.
                <Button asChild>
                  <Link href="/employer/pricing">
                    Upgrade plan
                  </Link>
                </Button>
              </PopoverContent>
            </Popover>
          }
        >
          {button}
        </AsyncIf>
      ) : (
        button
      )}
    </AsyncIf>
  )
}

async function getJobListing(id: string, orgId: string) {
  "use cache";
  cacheTag(getJobListingsIdTag(id));

  return db.query.JobListingTable.findFirst({
    where: and(
      eq(JobListingTable.id, id),
      eq(JobListingTable.organizationId, orgId),
    ),
  });
}

function statusToggleButtonText(status: jobListingStatus) {
  switch (status) {
    case "delisted":
    case "draft":
      return (
        <>
          <EyeIcon className="size-4" />
          Publish
        </>
      )
    case "published":
      return (
        <>
          <EyeOffIcon className="size-4" />
          Delist
        </>
      )
    default:
      throw new Error(`Unknow status: ${status satisfies never}`)
  }
}
