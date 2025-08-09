import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TaskDueDatePicker } from "@/components/TaskDueDatePicker";
import { taskSchema, TaskSchemaType } from "@/lib/zodSchems";
import { Task } from "@prisma/client";
import { Textarea } from "../ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { recurrenceOptions, statusOptions } from "@/lib/constants";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import { Loader2 } from "lucide-react";
import { createOrUpdateTask } from "@/utils/controller";
import { toast } from "sonner";

interface Props {
    setIsDialogOpen: (show: boolean) => void;
    onAddTask: (data: Partial<Task>) => void;
    initialTask?: Partial<Task>;
}

const TaskForm = ({ setIsDialogOpen, onAddTask, initialTask }: Props) => {
    const [loading, setLoading] = useState(false);

    const form = useForm<TaskSchemaType>({
        resolver: zodResolver(taskSchema),
        defaultValues: {
            title: initialTask?.title || "",
            description: initialTask?.description || "",
            priority: initialTask?.priority || "medium",
            status: initialTask?.status || "pending",
            recurrence: initialTask?.recurrence || "none",
            dueDate: initialTask?.dueDate
                ? new Date(initialTask?.dueDate).toISOString().split("T")[0] // ✅ Date → "YYYY-MM-DD"
                : undefined, // matches form type
        },
    });

    const onSubmit = async (data: TaskSchemaType) => {
        try {
            setLoading(true);
            const safeDueDate = data.dueDate ? new Date(data.dueDate) : null;
            const res = await createOrUpdateTask({
                ...data,
                dueDate: safeDueDate,
            });
            onAddTask(res);
            toast.success(`Task ${initialTask ? "updated" : "created"} successfully`);
            form.reset();
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                {/* Title */}
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input placeholder="Title" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {/* Description */}
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Type your Description here."
                                    id="description"
                                    {...field}
                                // className="w-full p-2 border rounded"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="grid gap-4 sm:grid-cols-3">
                    {/* Priority */}
                    <FormField
                        control={form.control}
                        name="priority"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Priority</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a priority type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="flex flex-col space-y-1 sm:space-x-4 sm:flex-row">
                                        <SelectItem value="low">Low</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="high">High</SelectItem>
                                        <SelectItem value="urgent">Urgent</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/* Status */}
                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Status</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a status type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="flex flex-col space-y-1 sm:space-x-4 sm:flex-row">
                                        {statusOptions.map((op) => (
                                            <SelectItem key={op} value={op}>
                                                <span className="capitalize">
                                                    {op.replace("_", " ")}
                                                </span>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/* Recurrence */}
                    <FormField
                        control={form.control}
                        name="recurrence"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Recurrence</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a recurrence type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="flex flex-col space-y-1 sm:space-x-4 sm:flex-row">
                                        {recurrenceOptions.map((op) => (
                                            <SelectItem key={op} value={op}>
                                                <span className="capitalize">
                                                    {op.replace("_", " ")}
                                                </span>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                {/* Due Date */}
                <FormField
                    control={form.control}
                    name="dueDate"
                    render={() => (
                        <FormItem>
                            <FormLabel>Due Date</FormLabel>
                            <FormControl>
                                <TaskDueDatePicker
                                    dueDate={form.watch("dueDate")}
                                    onChange={(date) => form.setValue("dueDate", date ?? null)}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end space-x-3 pt-4 border-t">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsDialogOpen(false)}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" variant="default" disabled={loading}>
                        {loading && <Loader2 className="animate-spin" />}
                        {initialTask ? "Update" : "Add"}
                        {loading && "ing"} Task
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default TaskForm;
