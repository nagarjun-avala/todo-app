import { Priority, Recurrence, Status } from "@prisma/client";

export const recurrenceOptions: Recurrence[] = ["none", "daily", "weekly", "monthly"] as const;

export const statusOptions: Status[] = ["pending", "in_progress", "completed", "archived"];
export const priorityOptions: Priority[] = ["low", "medium", "high", "urgent"];