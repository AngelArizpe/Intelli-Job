import { JobListingTable } from "@/drizzle/schema"
import { Tailwind } from "@react-email/components"
import tailwindConfig from "../data/tailwindConfig"

type JobListing = Pick<
    typeof JobListingTable.$inferSelect,
    | "id"
    | "title"
    | "city"
    | "stateAbbreviation"
    | "type"
    | "experienceLevel"
    | "wage"
    | "wageInterval"
    | "locationRequirement"
> & {
    organizationName: string
}

export default function DailyJobListingEmail({

}: {
    userName: string,
    jobListings: JobListing[]
    serverUrl: string
}) {
    return (
        <Tailwind config={tailwindConfig}>
            dnaskj
        </Tailwind>
    )
}