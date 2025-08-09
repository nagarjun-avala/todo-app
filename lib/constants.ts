import { Status } from "@prisma/client";

export const recurrenceOptions = ["none", "daily", "weekly", "monthly"] as const;
export const statusOptions = ["pending", "in_progress", "completed", "archived"] as const;
export const priorityOptions = ["low", "medium", "high", "urgent"] as const;

export const STATUS_COLUMNS: {
    key: Status;
    label: string;
    bgLight: string;
    bgDark: string;
}[] = [
        { key: "pending", label: "Pending", bgLight: "bg-yellow-50", bgDark: "dark:bg-yellow-900/20" },
        { key: "in_progress", label: "In Progress", bgLight: "bg-blue-50", bgDark: "dark:bg-blue-900/20" },
        { key: "completed", label: "Completed", bgLight: "bg-green-50", bgDark: "dark:bg-green-900/20" },
        { key: "archived", label: "Archived", bgLight: "bg-gray-100", bgDark: "dark:bg-gray-800" },
    ];

// Then you can export types for convenience:
export type RecurrenceOption = typeof recurrenceOptions[number];
export type StatusOption = typeof statusOptions[number];
export type PriorityOption = typeof priorityOptions[number];
