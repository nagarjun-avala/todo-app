import React from "react";
import { Task, StatusType } from "@/lib/types";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import TaskCard from "@/components/task/TaskCard";

const STATUS_COLUMNS: StatusType[] = [
    "pending",
    "in_progress",
    "completed",
    "archived",
];

type Props = {
    tasks: Task[];
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
    onEditTask: (task: Task) => void;
    onDeleteTask: (id: string) => void;
    onToggleComplete: (id: string) => void;
};

const TaskBoard = ({ tasks, setTasks, onEditTask, onDeleteTask, onToggleComplete }: Props) => {
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

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {STATUS_COLUMNS.map((statusKey) => (
                    <Droppable key={statusKey} droppableId={statusKey}>
                        {(provided) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className="bg-gray-100/50 dark:bg-gray-900/50 rounded p-2 min-h-[200px]"
                            >
                                <h3 className="font-bold capitalize mb-2">{statusKey.replace("_", " ")}</h3>
                                {tasks
                                    .filter((task) => task.status === statusKey)
                                    .map((task, index) => (
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
};

export default TaskBoard;
