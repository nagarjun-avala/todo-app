// lib/mockTasks.ts
import { Task, User } from "@/lib/types";
import { formatISO } from "date-fns";
import { priorities, recurrenceOptions, statuses } from "./constants";

const mockUser: User = {
    id: "user_1",
    fullName: "John Doe",
    username: "johndoe",
    email: "johndoe@example.com",
    password: "hashedpassword",
    isActive: true,
    createdAt: formatISO(new Date(Date.now() - 100000000)),
    updatedAt: formatISO(new Date()),
};

export const generateMockTasks = (count = 10, options?: { includeRecurrence?: boolean }): Task[] => {
    const tasks: Task[] = [];

    for (let i = 1; i <= count; i++) {
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const priority = priorities[Math.floor(Math.random() * priorities.length)];
        const createdAt = new Date(Date.now() - Math.random() * 100000000);
        const dueDate = new Date(createdAt.getTime() + Math.random() * 100000000);
        const completed = status === "completed";

        const recurrence = options?.includeRecurrence
            ? recurrenceOptions[Math.floor(Math.random() * recurrenceOptions.length)]
            : "none";

        tasks.push({
            id: `task_${i}`,
            title: `Task #${i}`,
            description: `Description for task ${i}`,
            completed,
            status,
            priority,
            dueDate: Math.random() > 0.3 ? formatISO(dueDate) : undefined,
            deleted: false,
            createdAt: formatISO(createdAt),
            updatedAt: formatISO(new Date()),
            userId: mockUser.id,
            user: mockUser,
            recurrence, // new field
        } as Task);
    }

    return tasks;
};
