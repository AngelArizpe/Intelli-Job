import { pgTable, varchar } from "drizzle-orm/pg-core";
import { createdAt, updatedAt } from "../schemaHelpers";
import { UserNotificationSettingsTable } from "./userNotificationsSettings";
import { UserResumeTable } from "./userResume";
import { relations } from "drizzle-orm";
import { OrganizationUserSettingsTable } from "./organizationUserSettings";

export const UserTable = pgTable("users", {
    id: varchar().primaryKey(),
    name: varchar().notNull(),
    imageURL: varchar().notNull(),
    email: varchar().notNull().unique(),
    createdAt,
    updatedAt
})

export const userRelations = relations(UserTable, ({ one, many }) => ({
    notificationSettings: one(UserNotificationSettingsTable),
    resume: one(UserResumeTable),
    organizationUserSettings: many(OrganizationUserSettingsTable),
}))