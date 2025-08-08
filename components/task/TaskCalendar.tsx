import { Task } from "@/lib/types";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useMemo, useState } from "react";

interface Props {
    tasks: Task[];
}

export default function TaskCalendar({ tasks }: Props) {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

    const tasksByDate = useMemo(() => {
        return tasks.reduce((acc, task) => {
            if (!task.dueDate) return acc;
            const date = format(new Date(task.dueDate), "yyyy-MM-dd");
            if (!acc[date]) acc[date] = [];
            acc[date].push(task);
            return acc;
        }, {} as Record<string, Task[]>);
    }, [tasks]);

    const selectedDayTasks = selectedDate
        ? tasksByDate[format(selectedDate, "yyyy-MM-dd")] || []
        : [];

    return (
        <div className="mt-8 space-y-4">
            <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                modifiers={{
                    hasTasks: (date) => {
                        const key = format(date, "yyyy-MM-dd");
                        return tasksByDate[key]?.length > 0;
                    },
                }}
                modifiersClassNames={{
                    hasTasks: "bg-blue-100 text-blue-800",
                }}
            />

            {selectedDate && (
                <div className="bg-white shadow rounded p-4">
                    <h3 className="text-lg font-semibold mb-2">
                        Tasks on {format(selectedDate, "MMM dd, yyyy")}
                    </h3>
                    {selectedDayTasks.length > 0 ? (
                        <ul className="space-y-2">
                            {selectedDayTasks.map((task) => (
                                <li
                                    key={task.id}
                                    className="border rounded px-3 py-2 flex justify-between items-center"
                                >
                                    <span>{task.title}</span>
                                    <Badge variant="outline">{task.status}</Badge>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-gray-500">No tasks for this day.</p>
                    )}
                </div>
            )}
        </div>
    );
}
