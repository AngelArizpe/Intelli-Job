"use server";

import z from "zod";
import { JobListingSchema } from "./schemas";
import { getCurrentOrganization } from "@/services/clerk/lib/getCurrentAuth";
import { redirect } from "next/navigation";
import { 
    insertJobListing, 
    updateJobListing as updateJobListingDb,
    deleteJobListing as deleteJobListingDb
} from "../db/jobListings";
import { cacheTag } from "next/cache";
import { getJobListingsIdTag } from "../db/cache/jobListings";
import { db } from "@/drizzle/db";
import { and, eq } from "drizzle-orm";
import { JobListingTable } from "@/drizzle/schema";
import { hasOrgUserPermissions } from "@/services/clerk/lib/orgUserPermissions";
import { getNextJobListingStatus } from "../lib/utils";
import { hasReachedMaxFeaturedJobListings, hasReachedMaxPublishedJobListings } from "../lib/planFeatureHelpers";

export async function createJobListing(unsafeData: z.infer<typeof JobListingSchema>) {
  const { orgId } = await getCurrentOrganization()
  if (orgId == null || !(await hasOrgUserPermissions("org:job_listing_manager_permissions:job_listings_create"))) {
    return {
      error: true,
      message: "You don't have permission to create a job listing",
    }
  }

  const { success, data } = JobListingSchema.safeParse(unsafeData);
  if (!success) {
    return {
      error: true,
      message: "There was an error creating your job listing",
    }
  }

  const jobListing = await insertJobListing({
    ...data,
    organizationId: orgId,
    status: "draft",
  })

  redirect(`/employer/job-listings/${jobListing.id}`)
}

export async function updateJobListing(
  id: string,
  unsafeData: z.infer<typeof JobListingSchema>,
) {
  const { orgId } = await getCurrentOrganization()
  if (
    orgId == null || 
    !(await hasOrgUserPermissions("org:job_listing_manager_permissions:job_listings_update"))
  ) {
    return {
      error: true,
      message: "You don't have permission to update a job listing",
    }
  }

  const { success, data } = JobListingSchema.safeParse(unsafeData)
  if (!success) {
    return {
      error: true,
      message: "There was an error updating your job listing",
    }
  }

  const jobListing = await getJobListing(id, orgId)
  if (jobListing == null) {
    return {
      error: true,
      message: "There was an error updating your job listing",
    }
  }

  const updatedJobListing = await updateJobListingDb(id, data)

  redirect(`/employer/job-listings/${updatedJobListing.id}`)
}

export async function deleteJobListing(id: string) {
  const error = {
    error: true,
    message: "You don't have permission to delete a job listing",
  }

  const { orgId } = await getCurrentOrganization()
  if (orgId == null) return error

  const jobListing = await getJobListing(id, orgId)
  if (jobListing == null) return error

  if (!(await hasOrgUserPermissions("org:job_listing_manager_permissions:job_listings_delete"))) {
    return error
  }

  await deleteJobListingDb(id)

  redirect("/employer")
}

export async function toggleJobListingStatus(id: string) {
  const error = {
    error: true,
    message: "There was an error updating your job listing's status",
  }

  const { orgId } = await getCurrentOrganization()
  if (orgId == null) return error

  const jobListing = await getJobListing(id, orgId)
  if (jobListing == null) return error

  const newStatus = getNextJobListingStatus(jobListing.status)
  if (
    !(await hasOrgUserPermissions("org:job_listing_manager_permissions:job_listing_change_status")) || 
    (newStatus === "published" && (await hasReachedMaxPublishedJobListings()))
  ) {
    return error
  }

  await updateJobListingDb(id, {
    status: newStatus,
    isFeatured: newStatus === "published" ? undefined : false,
    postedAt: 
      newStatus === "published" && jobListing.postedAt == null
      ? new Date()
      : undefined
  })

  return  { error: false }
}

export async function toggleJobListingFeatured(id: string) {
  const error = {
    error: true,
    message: "There was an error updating your job listing's featured status",
  }

  const { orgId } = await getCurrentOrganization()
  if (orgId == null) return error

  const jobListing = await getJobListing(id, orgId)
  if (jobListing == null) return error

  const newFeaturedStatus = !jobListing.isFeatured
  if (
    !(await hasOrgUserPermissions("org:job_listing_manager_permissions:job_listing_change_status")) || 
    (newFeaturedStatus && (await hasReachedMaxFeaturedJobListings()))
  ) {
    return error
  }

  await updateJobListingDb(id, {
    isFeatured: newFeaturedStatus
  })

  return  { error: false }
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
