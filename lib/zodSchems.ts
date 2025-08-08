import z from "zod";
import { recurrenceOptions } from "./constants";

export const taskFormSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    priority: z.enum(["low", "medium", "high", "urgent"]),
    status: z.enum(["pending", "in_progress", "completed", "archived"]),
    recurrence: z.enum(recurrenceOptions),
    dueDate: z.date()
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;