import { MarkdownPartial } from "@/components/markdown/MarkdownPartial";
import { MarkDownRenderer } from "@/components/markdown/MarkdownRenderer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { db } from "@/drizzle/db";
import { JobListingTable } from "@/drizzle/schema";
import { JobListingBadges } from "@/features/jobListings/components/jobListingBadges";
import { getJobListingsIdTag } from "@/features/jobListings/db/cache/jobListings";
import { formatJobListingStatus } from "@/features/jobListings/lib/formatters";
import { getCurrentOrganization } from "@/services/clerk/lib/getCurrentAuth";
import { and, eq } from "drizzle-orm";
import { EditIcon } from "lucide-react";
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
  const { orgId } = await getCurrentOrganization();
  if (orgId == null) return null;

  const { jobListingId } = await params;
  const jobListing = await getJobListing(jobListingId, orgId);

  if (jobListing == null) return notFound();
  return (
    <div className="space-y-6 max-w-6xl max-auto p-4 @container">
      <div className="flex items-center justify-between gap-4 @max-4xl:flex-col @max-4xl:items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {jobListing.title}
          </h1>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge>{formatJobListingStatus(jobListing.status)}</Badge>
          <JobListingBadges jobListing={jobListing} />
        </div>
        <div className="flex items-center gap-2 empty:-mt-4">
          <Button asChild variant="outline">
            <Link href={`/employer/job-listing/${jobListing.id}/edit`}>
              <EditIcon className="size-4" />
              Edit
            </Link>
          </Button>
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
