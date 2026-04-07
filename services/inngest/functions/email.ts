import { db } from "@/drizzle/db";
import { inngest } from "../client";
import { JobListingTable, UserNotificationSettingsTable } from "@/drizzle/schema";
import { and, eq, gte } from "drizzle-orm";
import { subDays } from "date-fns";
import { GetEvents } from "inngest";
import { getMatchingJobListings } from "../ai/getMatchingJobListings";
import { resend } from "@/services/resend/client";
import DailyJobListingEmail from "@/services/resend/components/DailyJobListingEmail";

export const prepareDailyUserJobListingNotifications = inngest.createFunction(
    {
        id: "prepare-daily-user-job-listing-notifications",
        name: "Prepare daily user job listing notifications"
    },
    {
        cron: "TZ=America/Chicago 0 7 * * *"
    }, async ({ step, event }) => {
        const getUsers = step.run("get-users", async () => {
            return await db.query.UserNotificationSettingsTable.findMany({
                where: eq(UserNotificationSettingsTable.newJobEmailNotifications, true),
                columns: {
                    userId: true,
                    newJobEmailNotifications: true,
                    aiPropmp: true
                },
                with: {
                    user: {
                        columns: {
                            email: true,
                            name: true
                        }
                    }
                }
            })
        })

        const getJobListings = step.run("get-recent-job-listings", async () => {
            return await db.query.JobListingTable.findMany({
                where: and(
                    gte(
                        JobListingTable.postedAt, 
                        subDays(new Date(event.ts ?? Date.now()), 1),
                    ),
                    eq(JobListingTable.status, "published")
                ),
                columns: {
                    createdAt: false,
                    postedAt: false,
                    updatedAt: false,
                    status: false,
                    organizationId: false,
                },
                with: {
                    organization: {
                        columns: { name: true }
                    }
                }
            })
        })

        const [userNotifications, jobListings] = await Promise.all([
            getUsers,
            getJobListings
        ])

        if (jobListings.length === 0 || userNotifications.length === 0) return

        const events = userNotifications.map(notification => {
            return {
                name: "app/email.daily-user-job-listings",
                user: {
                    email: notification.user.email,
                    name: notification.user.name
                },
                data: {
                    aiPropmp: notification.aiPropmp ?? undefined,
                    jobListings: jobListings.map(listing => {
                        return {
                            ...listing, 
                            organizationName: listing.organization.name
                        }
                    })
                },
            } as const satisfies GetEvents<typeof inngest>["app/email.daily-user-job-listings"]
        })

        step.sendEvent("send-emails", events)
    }
)

export const sendDailyUserJobListingEmail = inngest.createFunction(
    {
        id: "send-daily-user-job-listing-email",
        name: "Send Daily User Job Listing Email",
        throttle: {
            limit: 10,
            period: "1m"
        }
    },
    {event: "app/email.daily-user-job-listings"},
    async ({ event, step }) => {
        const { jobListings, aiPropmp } = event.data
        const user = event.user

        if (jobListings.length === 0) return null

        let matchingJobListings: typeof jobListings = []
        if (aiPropmp == null || aiPropmp.trim() == "") {
            matchingJobListings = jobListings
        } else {
            const matchingIds = await getMatchingJobListings(aiPropmp, jobListings)
            matchingJobListings = jobListings.filter(listing => matchingIds.includes(listing.id))
        }

        if (matchingJobListings.length === 0) return

        step.run("send-email", async () => {
            await resend.emails.send({
                from: "Intelli-Job <onboarding@resend.dev>",
                to: user.email,
                subject: "Daily job listings",
                react: DailyJobListingEmail()
            })
        })
    }
)