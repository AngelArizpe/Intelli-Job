"use client"

import { UserNotificationSettingsTable } from "@/drizzle/schema";

export function NotificationForm({ 
    notificationSettings
}: {
    notificationSettings?: Pick<
        typeof UserNotificationSettingsTable.$inferSelect,
        "newJobEmailNotifications" | "aiPropmp"
    >
}) {
    return null
}