// components/task/TaskBadge.tsx
import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";

export function TaskBadge({ status }: { status: string }) {
    const statusColors: Record<string, string> = {
        pending: "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-200",
        in_progress: "bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200",
        completed: "bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200",
        archived: "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300",
    };

    return (
        <Badge className={cn(
            "px-2 py-1 rounded-full text-xs font-semibold",
            statusColors[status] ?? "bg-gray-200 text-gray-800"
        )}>
            {status.replace("_", " ")}
        </Badge>
    );
}
