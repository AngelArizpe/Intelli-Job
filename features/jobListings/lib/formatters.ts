import { experienceLevel, jobListingStatus, jobListingType, locationRequirement, WageInterval } from "@/drizzle/schema";

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

export function formatJobListingStatus(status: jobListingStatus) {
    switch(status) {
        case "published":
            return "Active"
        case "draft":
            return "Draft"
        case "delisted":
            return "Delisted"
        default:
            throw new Error (
                `Unknown location requirement ${status satisfies never}`
            )
    }
}

export function formateWage(wage: number, wageInterval: WageInterval) {
    const wageFormatter = new Intl.NumberFormat("en-MX", {
        style: "currency",
        currency: "MXN",
        minimumFractionDigits: 0
    })

    switch(wageInterval) {
        case "hourly":
            return `${wageFormatter.format(wage)} / hr`
        case "yearly":
            return `${wageFormatter.format(wage)}`
        default:
            throw new Error (
                `Unknown location requirement ${wageInterval satisfies never}`
            )
    }
}

export function formatJobListingLocation({
    stateAbbreviation, 
    city
}: {
    stateAbbreviation: string | null
    city: string | null
}) {
    if (stateAbbreviation == null && city == null) return "None"

    const locationParts = []
    if (city != null) locationParts.push(city)
    if (stateAbbreviation != null) locationParts.push(stateAbbreviation)

    return locationParts.join(", ")
}