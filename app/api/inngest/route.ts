import { serve } from "inngest/next"
import { inngest } from "@/services/inngest/client"
import { clerkCreateOrganization, clerkCreateUser, clerkDeleteOrganization, clerkDeleteUser, clerkUpdateOrganization, clerkUpdateUser } from "@/services/inngest/functions/clerk"
import { createAiSummaryOfUploadedResume } from "@/services/inngest/functions/resume"
import { rankApplicant } from "@/services/inngest/functions/jobListingApplications"

export const { GET, POST, PUT } = serve({
    client: inngest,
    functions: [
        clerkCreateUser,
        clerkUpdateUser,
        clerkDeleteUser,
        clerkCreateOrganization,
        clerkUpdateOrganization,
        clerkDeleteOrganization,
        createAiSummaryOfUploadedResume,
        rankApplicant
    ]
})