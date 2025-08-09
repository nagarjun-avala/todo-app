// components/task/TaskDueDate.tsx
import React from "react";

export function TaskDueDate({ dueDate }: { dueDate?: string }) {
    if (!dueDate) return null;

    const dateObj = new Date(dueDate);
    if (isNaN(dateObj.getTime())) return null; // ✅ Fixes "Invalid time value"

    return (
        <p className="text-xs">
            Due: {dateObj.toLocaleDateString()}
        </p>
    );
}
