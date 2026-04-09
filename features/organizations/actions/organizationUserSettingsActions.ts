"use server"

import z from "zod";
import { OrganizationUserSettingsSchema } from "./schemas";
import { getCurrentOrganization, getCurrentUser } from "@/services/clerk/lib/getCurrentAuth";
import { updateOrganizationUserSettings as updateOrganizationUserSettingsDb} from "../db/organizationUserSettings"

export async function updateOrganizationUserSettings(
    unsafeData: z.infer<typeof OrganizationUserSettingsSchema>
) {
    const { userId } = await getCurrentUser()
    const { orgId } = await getCurrentOrganization()

    if (userId == null || orgId == null) {
        return {
            error: true,
            message: "You must be signed in to update notification settings"
        }
    }

    const { success, data } = OrganizationUserSettingsSchema.safeParse(unsafeData)
    if (!success) {
        return {
            error: true,
            message: "There was an error updating your notification settings"
        }
    }

    await updateOrganizationUserSettingsDb(
        {
            userId,
            organizationId: orgId
        }, data)

    return {
        error: false,
        message: "Successfully updated your notification seetings"
    }
}