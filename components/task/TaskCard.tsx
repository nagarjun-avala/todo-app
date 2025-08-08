import { Task } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CheckCircle2, Trash2, Pencil, Repeat, CalendarClock } from "lucide-react";
import { motion, useAnimation, PanInfo } from "framer-motion";
import { useEffect, useState } from "react";
import { format, parseISO, isPast } from "date-fns";

interface Props {
    task: Task;
    onEdit: () => void;
    onDelete: () => void;
    onToggleComplete: () => void;
    onToggleRecurrencePreview?: () => void; // Optional callback
}

const badgeStyles = {
    pending: "bg-yellow-100 text-yellow-800",
    in_progress: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    archived: "bg-gray-200 text-gray-600",
};

const recurrenceLabels: Record<string, string> = {
    daily: "Daily",
    weekly: "Weekly",
    monthly: "Monthly",
};

const TaskCard = ({ task, onEdit, onDelete, onToggleComplete, onToggleRecurrencePreview }: Props) => {
    const controls = useAnimation();
    const [showRecurrenceInfo, setShowRecurrenceInfo] = useState(false);

    const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        if (info.offset.x > 100) {
            onToggleComplete();
        } else if (info.offset.x < -100) {
            onDelete();
        } else {
            controls.start({ x: 0 });
        }
    };

    useEffect(() => {
        controls.start({ x: 0, opacity: 1, y: 0 });
    }, [controls, task]);

    const isOverdue = task.dueDate ? isPast(parseISO(task.dueDate)) : false;
    const formattedDue = task.dueDate ? format(parseISO(task.dueDate), "MMM d, yyyy") : "No due date";

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={controls}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            className={cn(
                "p-4 mb-2 rounded shadow border cursor-grab touch-pan-y",
                task.completed && "opacity-70 line-through"
            )}
        >
            <div className="flex justify-between items-start">
                <div className="space-y-1">
                    <h4 className="font-medium text-sm text-gray-800">{task.title}</h4>
                    {task.description && <p className="text-xs text-gray-500">{task.description}</p>}

                    <div className="flex gap-2 items-center flex-wrap">
                        <span className={cn("text-xs px-2 py-0.5 rounded-full", badgeStyles[task.status])}>
                            {task.status.replace("_", " ")}
                        </span>

                        {task.recurrence && task.recurrence !== "none" && (
                            <button
                                onClick={() => {
                                    setShowRecurrenceInfo(!showRecurrenceInfo);
                                    onToggleRecurrencePreview?.();
                                }}
                                className="flex items-center text-xs text-purple-600 gap-1 hover:underline"
                            >
                                <Repeat size={12} /> {recurrenceLabels[task.recurrence]}
                            </button>
                        )}

                        <div
                            className={cn(
                                "text-xs flex items-center gap-1 px-2 py-0.5 rounded-full border",
                                isOverdue
                                    ? "bg-red-50 dark:bg-red-800/10 text-red-600 border-red-300"
                                    : "bg-gray-50 dark:bg-gray-800/10 text-gray-600 border-gray-300"
                            )}
                        >
                            <CalendarClock size={12} /> {formattedDue}
                        </div>
                    </div>

                    {showRecurrenceInfo && task.recurrence !== "none" && (
                        <p className="text-[11px] text-purple-500 italic">
                            This task recurs {recurrenceLabels[task.recurrence].toLowerCase()}.
                        </p>
                    )}
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={onToggleComplete}
                        className="text-green-600 hover:text-green-800"
                        title="Toggle Complete"
                    >
                        <CheckCircle2 size={16} />
                    </button>
                    <button onClick={onEdit} className="text-blue-600 hover:text-blue-800" title="Edit">
                        <Pencil size={16} />
                    </button>
                    <button onClick={onDelete} className="text-red-600 hover:text-red-800" title="Delete">
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default TaskCard;
