import { experienceLevel, jobListingType, locationRequirement, WageInterval } from "@/drizzle/schema";

export function formatWageInterval(interval: WageInterval) {
    switch(interval) {
        case "hourly":
            return "Hour"
        case "yearly":
            return "Year"
        default:
            throw new Error(`Invalid wage interval: ${interval satisfies never}`)
    }
}

export function formatLocationRequirement(locationRequirement: locationRequirement) {
    switch (locationRequirement) {
        case "remote":
            return "Remote"
        case "in-office":
            return "In office"
        case "hybrid": 
            return "Hybrid"
        default:
            throw new Error (
                `Unknown location requirement ${locationRequirement satisfies never}`
            )
    }
}

export function formatJobType(type: jobListingType) {
    switch (type) {
        case "full-time":
            return "Full time"
        case "part-time":
            return "Part time"
        case "internship": 
            return "Internship"
        default:
            throw new Error (
                `Unknown location requirement ${type satisfies never}`
            )
    }
}

export function formatExperienceLevel(experienceLevel: experienceLevel) {
    switch (experienceLevel) {
        case "junior":
            return "Junior"
        case "mid-level":
            return "Mid Level"
        case "senior": 
            return "Senior"
        default:
            throw new Error (
                `Unknown location requirement ${experienceLevel satisfies never}`
            )
    }
}