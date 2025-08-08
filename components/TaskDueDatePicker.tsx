// components/TaskDueDatePicker.tsx
"use client";

import { formatDistanceToNowStrict, isPast, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { useState } from "react";

export type TaskDueDatePickerProps = {
    dueDate?: string; // ISO string
    onChange: (date: Date) => void;
};

export function TaskDueDatePicker({ dueDate, onChange }: TaskDueDatePickerProps) {
    const [localDate, setLocalDate] = useState<string>(dueDate || "");

    const isOverdue = dueDate && isPast(parseISO(dueDate));
    const displayText = dueDate
        ? isOverdue
            ? "Overdue by " + formatDistanceToNowStrict(parseISO(dueDate))
            : "Due in " + formatDistanceToNowStrict(parseISO(dueDate))
        : "No due date";

    return (
        <div className="flex items-center gap-2">
            <label className="text-sm text-gray-700">Due Date:</label>
            <input
                type="date"
                value={localDate?.split("T")[0]}
                onChange={(e) => {
                    const selected = new Date(e.target.value);
                    setLocalDate(e.target.value);
                    onChange(selected);
                }}
                className="border px-2 py-1 rounded text-sm"
            />

            <div
                className={cn(
                    "text-xs px-2 py-1 rounded-full",
                    isOverdue
                        ? "bg-red-100 text-red-600 border border-red-300 flex items-center gap-1"
                        : "bg-gray-100 text-gray-600 border border-gray-300"
                )}
            >
                {/* {isOverdue && <TriangleAlert className="w-3 h-3" />} */}
                {displayText}
            </div>
        </div>
    );
}
