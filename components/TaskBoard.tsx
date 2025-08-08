import React, { useMemo } from "react";
import { Task, StatusType } from "@/lib/types";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import TaskCard from "@/components/task/TaskCard";
import { cn } from "@/lib/utils";

const STATUS_COLUMNS: {
    key: StatusType;
    label: string;
    bgLight: string;
    bgDark: string;
}[] = [
        { key: "pending", label: "Pending", bgLight: "bg-yellow-50", bgDark: "dark:bg-yellow-900/20" },
        { key: "in_progress", label: "In Progress", bgLight: "bg-blue-50", bgDark: "dark:bg-blue-900/20" },
        { key: "completed", label: "Completed", bgLight: "bg-green-50", bgDark: "dark:bg-green-900/20" },
        { key: "archived", label: "Archived", bgLight: "bg-gray-100", bgDark: "dark:bg-gray-800" },
    ];

type Props = {
    tasks: Task[];
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
    onEditTask: (task: Task) => void;
    onDeleteTask: (id: string) => void;
    onToggleComplete: (id: string) => void;
};

export default function TaskBoard({
    tasks,
    setTasks,
    onEditTask,
    onDeleteTask,
    onToggleComplete,
}: Props) {
    const handleDragEnd = (result: DropResult) => {
        const { source, destination, draggableId } = result;
        if (!destination || source.droppableId === destination.droppableId) return;

        setTasks((prev) =>
            prev.map((task) =>
                task.id === draggableId
                    ? { ...task, status: destination.droppableId as StatusType }
                    : task
            )
        );
    };

    // Pre-group tasks for performance
    const groupedTasks = useMemo(() => {
        return STATUS_COLUMNS.reduce((acc, { key }) => {
            acc[key] = tasks.filter((task) => task.status === key);
            return acc;
        }, {} as Record<StatusType, Task[]>);
    }, [tasks]);

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {STATUS_COLUMNS.map(({ key, label, bgLight, bgDark }) => (
                    <Droppable key={key} droppableId={key}>
                        {(provided) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className={cn(
                                    "rounded p-3 min-h-[200px] border transition-colors",
                                    "border-gray-200 dark:border-gray-700",
                                    bgLight,
                                    bgDark
                                )}
                            >
                                <h3 className="font-semibold capitalize mb-3 text-gray-800 dark:text-gray-100">
                                    {label} - {groupedTasks[key].length}
                                </h3>
                                {groupedTasks[key].map((task, index) => (
                                    <Draggable key={task.id} draggableId={task.id} index={index}>
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                            >
                                                <TaskCard
                                                    task={task}
                                                    onEdit={() => onEditTask(task)}
                                                    onDelete={() => onDeleteTask(task.id)}
                                                    onToggleComplete={() => onToggleComplete(task.id)}
                                                />
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                ))}
            </div>
        </DragDropContext>
    );
}
