// lib/zodSchems.ts
import { z } from "zod";

export const taskSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    priority: z.enum(["low", "medium", "high", "urgent"]),
    status: z.enum(["pending", "in_progress", "completed", "archived"]),
    recurrence: z.enum(["none", "daily", "weekly", "monthly"]),
    // ✅ allow null or undefined, default to null
    dueDate: z.string().optional(), // string | null
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
export type LoginSchemaType = z.infer<typeof loginSchema>;
export type TaskSchemaType = z.infer<typeof taskSchema>;
export type RegisterSchemaType = z.infer<typeof registerSchema>;
export type userSchemaType = z.infer<typeof userSchema>;
