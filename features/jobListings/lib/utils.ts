import { jobListingStatus } from "@/drizzle/schema";

export function getNextJobListingStatus(status: jobListingStatus) {
    switch (status) {
        case "draft":
        case "delisted":
            return "published"
        case "published":
            return "delisted"
        default:
            throw new Error(
                `Unknown job listing status: ${status satisfies never}`
            )
    }
}