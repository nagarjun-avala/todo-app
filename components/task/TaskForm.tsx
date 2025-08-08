import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TaskDueDatePicker } from "@/components/TaskDueDatePicker";
import { Task } from "@/lib/types";
import { taskFormSchema, TaskFormValues } from "@/lib/zodSchems";

interface Props {
    setShowForm: (show: boolean) => void;
    onAddTask: (data: Partial<Task>) => void;
    initialTask?: Partial<Task>;
}

const TaskForm = ({ setShowForm, onAddTask, initialTask }: Props) => {
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm<TaskFormValues>({
        resolver: zodResolver(taskFormSchema),
        defaultValues: {
            title: "",
            description: "",
            status: "pending",
            priority: "medium",
            dueDate: undefined,
        },
    });

    useEffect(() => {
        if (initialTask) {
            reset({
                title: initialTask.title || "",
                description: initialTask.description || "",
                status: initialTask.status || "pending",
                priority: initialTask.priority || "medium",
                dueDate: initialTask.dueDate ? new Date(initialTask.dueDate) : undefined,
            });

        }
    }, [initialTask, reset]);

    const onSubmit = (data: TaskFormValues) => {
        onAddTask({
            ...data,
            dueDate: data.dueDate?.toISOString(), // 💡 Convert Date → string
        });
    };


    return (
        <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex justify-center items-center z-50">
            <form onSubmit={handleSubmit(onSubmit)}>
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>{initialTask ? "Edit Task" : "Add Task"}</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-3">
                        <Input placeholder="Title" {...register("title")} />
                        <p className="text-xs text-red-500">{errors.title?.message}</p>

                        <textarea
                            placeholder="Description"
                            className="w-full p-2 border rounded"
                            {...register("description")}
                        />
                        <p className="text-xs text-red-500">{errors.description?.message}</p>

                        <select className="w-full p-2 border rounded" {...register("priority")}>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="urgent">Urgent</option>
                        </select>

                        <select className="w-full p-2 border rounded" {...register("status")}>
                            <option value="pending">Pending</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="archived">Archived</option>
                        </select>

                        <TaskDueDatePicker
                            dueDate={watch("dueDate") ? watch("dueDate").toISOString() : undefined}

                            onChange={(date) => setValue("dueDate", date)}
                        />

                    </CardContent>

                    <CardFooter className="flex justify-end gap-2">
                        <Button type="button" variant="destructive" onClick={() => setShowForm(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="outline">
                            {initialTask ? "Update Task" : "Save Task"}
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    );
};

export default TaskForm;
