import { serve } from "inngest/next"
import { inngest } from "@/services/inngest/client"
import { clerkCreateOrganization, clerkCreateOrgMembership, clerkCreateUser, clerkDeleteOrganization, clerkDeleteOrgMembership, clerkDeleteUser, clerkUpdateOrganization, clerkUpdateUser } from "@/services/inngest/functions/clerk"
import { createAiSummaryOfUploadedResume } from "@/services/inngest/functions/resume"
import { rankApplicant } from "@/services/inngest/functions/jobListingApplications"
import { prepareDailyOrganizationUserApplicationNotifications, prepareDailyUserJobListingNotifications, sendDailyOrganizationUserApplicationEmail, sendDailyUserJobListingEmail } from "@/services/inngest/functions/email"

export const { GET, POST, PUT } = serve({
    client: inngest,
    functions: [
        clerkCreateUser,
        clerkUpdateUser,
        clerkDeleteUser,
        clerkCreateOrganization,
        clerkUpdateOrganization,
        clerkDeleteOrganization,
        clerkCreateOrgMembership,
        clerkDeleteOrgMembership,
        createAiSummaryOfUploadedResume,
        rankApplicant,
        prepareDailyUserJobListingNotifications,
        sendDailyUserJobListingEmail,
        prepareDailyOrganizationUserApplicationNotifications,
        sendDailyOrganizationUserApplicationEmail
    ]
})