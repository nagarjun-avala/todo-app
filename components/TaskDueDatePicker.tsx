// components/TaskDueDatePicker.tsx
"use client";

import { format, formatDistanceToNowStrict, isPast, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Calendar } from "./ui/calendar";
import { Button } from "./ui/button";
import { ChevronDownIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

export type TaskDueDatePickerProps = {
    dueDate?: string; // ISO string
    onChange: (date: string) => void;
};

export function TaskDueDatePicker({ dueDate, onChange }: TaskDueDatePickerProps) {
    const [localDate, setLocalDate] = useState<string>(dueDate || "");
    const [open, setOpen] = useState(false)

    const isOverdue = dueDate && isPast(parseISO(dueDate));
    const displayText = dueDate
        ? isOverdue
            ? "Overdue by " + formatDistanceToNowStrict(parseISO(dueDate))
            : "Due in " + formatDistanceToNowStrict(parseISO(dueDate))
        : "No due date";

    return (
        <div className="flex items-center gap-2">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        id="date"
                        className="w-3/5 justify-between font-normal"
                    >
                        {localDate ? format(localDate, "Pp") : "Select due date"}
                        <ChevronDownIcon />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={new Date(localDate)}
                        captionLayout="dropdown"
                        onSelect={(date) => {
                            setLocalDate(date?.toString() ?? ""); // ✅ always string
                            onChange(date ? date.toISOString() : ""); // or keep format consistent
                            setOpen(false);
                        }}

                    />
                </PopoverContent>
            </Popover>
            <div
                className={cn(
                    "text-xs px-2 py-1 rounded-full",
                    isOverdue
                        ? "bg-red-100 text-red-600 border border-red-300 flex items-center gap-1 dark:bg-red-900/20 dark:text-red-400 dark:border-red-700"
                        : "bg-gray-100 text-gray-600 border border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                )}
            >
                {/* {isOverdue && <TriangleAlert className="w-3 h-3" />} */}
                {displayText}
            </div>

        </div>
    );
}
