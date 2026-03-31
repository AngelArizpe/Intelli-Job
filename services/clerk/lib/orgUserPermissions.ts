import { auth } from "@clerk/nextjs/server"

type UserPermission =
    | "org:job_listing_manager_permissions:job_listings_create"
    | "org:job_listing_manager_permissions:job_listings_delete"
    | "org:job_listing_manager_permissions:job_listings_update"
    | "org:job_listing_manager_permissions:job_listing_change_status"
    | "org:applicant_manager_permissions:applicant_change_rating"
    | "org:applicant_manager_permissions:applicant_change_state"

export async function hasOrgUserPermissions(permission: UserPermission) {
    const { has } = await auth()
    return has({ permission })
}