import { PriorityType, StatusType } from "./types";

export const recurrenceOptions = ["none", "daily", "weekly", "monthly"] as const;

export const statuses: StatusType[] = ["pending", "in_progress", "completed", "archived"];
export const priorities: PriorityType[] = ["low", "medium", "high", "urgent"];