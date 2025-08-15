
import { Task } from "@prisma/client";
import { addDays, addWeeks, addMonths, isBefore, parseISO } from "date-fns";

export function generateNextRecurringTask(task: Task): Task | null {
    if (!task.recurrence || task.recurrence === "none" || !task.dueDate) return null;

    const lastDueDate = parseISO(task.dueDate.toString());
    let nextDueDate: Date;

    switch (task.recurrence) {
        case "daily":
            nextDueDate = addDays(lastDueDate, 1);
            break;
        case "weekly":
            nextDueDate = addWeeks(lastDueDate, 1);
            break;
        case "monthly":
            nextDueDate = addMonths(lastDueDate, 1);
            break;
        default:
            return null;
    }

    const now = new Date();
    // Only generate a new one if the current date has passed the previous due date
    if (isBefore(lastDueDate, now)) {
        return {
            ...task,
            id: crypto.randomUUID(), // you may use uuid or nanoid
            status: "pending",
            createdAt: new Date(),
            updatedAt: new Date(),
            dueDate: nextDueDate,
        };
    }

    return null;
}
