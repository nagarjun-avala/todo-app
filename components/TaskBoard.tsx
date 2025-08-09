
import { cn } from "@/lib/utils";
import React, { useMemo, useState } from "react";
import TaskCard from "./task/TaskCard";
import { Status, Task } from "@prisma/client";
import { STATUS_COLUMNS } from "@/lib/constants";

type Props = {
    tasks: Task[];
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
    onEditTask: (task: Task) => void;
    onDeleteTask: (id: string) => void;
    onToggleComplete: (id: string, status: string) => void;
};

export default function TaskBoard({
    tasks,
    setTasks,
    onEditTask,
    onDeleteTask,
    onToggleComplete,
}: Props) {
    const [draggedItem, setDraggedItem] = useState<{ columnId: string; task: Task } | null>(null);

    const columns = useMemo(
        () =>
            STATUS_COLUMNS.map(({ key, label, bgLight, bgDark }) => ({
                key,
                name: label,
                bgLight,
                bgDark,
                items: tasks.filter((task) => task.status === key),
            })),
        [tasks]
    );

    const handleDragStart = (columnId: string, task: Task) => {
        setDraggedItem({ columnId, task });
    };

    const handleDrop = (e: React.DragEvent, targetColumnId: string) => {
        e.preventDefault();
        if (!draggedItem || draggedItem.columnId === targetColumnId) return;

        setTasks((prevTasks) =>
            prevTasks.map((t) =>
                t.id === draggedItem.task.id ? { ...t, status: targetColumnId as Status } : t
            )
        );
        setDraggedItem(null);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            {columns.map(({ key, name, bgLight, bgDark, items }) => {
                const isEmpty = items.length === 0;
                return (
                    <div
                        key={key}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => handleDrop(e, key)}
                        className={cn(
                            "rounded p-3 border transition-all flex flex-col items-center justify-start min-h-[200px] w-full",
                            "border-gray-200 dark:border-gray-700",
                            bgLight,
                            bgDark,
                            isEmpty ? "max-w-[4rem]" : "flex-1"
                        )}
                    >
                        <h3
                            className={cn(
                                "font-semibold mb-3 text-gray-800 dark:text-gray-100",
                                isEmpty && "[writing-mode:vertical-rl] rotate-180 whitespace-nowrap"
                            )}
                        >
                            {name} - {items.length}
                        </h3>
                        {items.map((task) => (
                            <div
                                key={task.id}
                                draggable
                                onDragStart={() => handleDragStart(key, task)}
                                className="rounded"
                            >
                                <TaskCard
                                    task={task}
                                    onEdit={() => onEditTask(task)}
                                    onDelete={() => onDeleteTask(task.id)}
                                    onToggleComplete={(status: string) => onToggleComplete(task.id, status)}
                                />
                            </div>
                        ))}
                    </div>
                );
            })}
        </div>
    );
}
