import { z } from "zod";
import { priorityOptions, recurrenceOptions, statusOptions } from "./constants";

export const taskSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    priority: z.enum(priorityOptions).default("medium"),   // Prisma enum
    status: z.enum(statusOptions).default("pending"),       // Prisma enum
    recurrence: z.enum(recurrenceOptions).default("none"), // Prisma enum
    dueDate: z
        .union([z.string(), z.date()]).optional().default(undefined)
        .transform((val) => (typeof val === "string" ? new Date(val) : val)),
});

export const loginSchema = z.object({
    email: z.email("Invalid email format"),
    password: z.string().min(6, "Password length must be at least 6 characters"),
});

export const registerSchema = z.object({
    fullName: z.string().min(1, "Full name is required"),
    email: z.email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export const userSchema = z.object({
    id: z.string(),
    fullName: z.string(),
    username: z.string(),
    email: z.email(),
    password: z.string(),
    isActive: z.boolean(),
    lastLogin: z.date().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

// 🔹 Types
export type LoginFormValues = z.infer<typeof loginSchema>;
export type TaskFormValues = z.infer<typeof taskSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type UserType = z.infer<typeof userSchema>;
