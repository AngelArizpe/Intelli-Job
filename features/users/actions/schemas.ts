import z from "zod";

export const userNotificationSettingsSchema = z.object({
    newJobEmailNotifications: z.boolean(),
    aiPropmp: z
        .string()
        .transform(val => (val.trim() === "" ? null : val))
        .nullable()
})