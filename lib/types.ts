export type PriorityType = "low" | "medium" | "high" | "urgent"

export type StatusType = "pending" | "in_progress" | "completed" | "archived"

export type Recurrence = "none" | "daily" | "weekly" | "monthly";

export interface User {
    id: string
    fullName: string
    username: string
    email: string
    password: string
    isActive: boolean
    lastLogin?: string
    createdAt: string
    updatedAt: string
}


export interface Task {
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    status: StatusType;
    priority: PriorityType;
    dueDate?: string;
    deleted: boolean;
    createdAt: string;
    updatedAt: string;
    userId: string;
    user: User;
    recurrence: Recurrence;
}
