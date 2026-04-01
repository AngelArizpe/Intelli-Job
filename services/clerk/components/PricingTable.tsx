import { PricingTable as ClerkPricingtable } from "@clerk/nextjs";

export function PricingTable() {
    return (
        <ClerkPricingtable 
            for={"organization"}
            newSubscriptionRedirectUrl="/employer/pricing" 
        />
    )
}