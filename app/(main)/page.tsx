"use client";

import { useEffect, useMemo, useState } from "react";
import TaskForm from "@/components/task/TaskForm";
import TaskBoard from "@/components/TaskBoard";
import { generateNextRecurringTask } from "@/lib/recurrence";
import TaskSummaryAnalytics from "@/components/task/TaskSummaryAnalytics";
import WeeklyTrendsChart from "@/components/task/WeeklyTrendsChart";
import ThemeModeToggle from "@/components/ThemeModeToggle";
import { Button } from "@/components/ui/button";
import { Loader, Menu, Plus } from "lucide-react";
import TaskCalendar from "@/components/task/TaskCalendar";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { motion } from 'framer-motion';
import { Task } from "@prisma/client";
import { getTasks } from "@/utils/controller";
import { toast } from "sonner";


const mockUser = {
  id: "mock-user-id",
  fullName: "Mock User",
  username: "mockuser",
  email: "mock@example.com",
  password: "",
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export default function HomePage() {

  const [loadingTasks, setLoadingTasks] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredTasks = useMemo(() => {
    if (!selectedDate) return tasks;
    return tasks.filter(
      (task) =>
        task.dueDate &&
        format(new Date(task.dueDate), "yyyy-MM-dd") ===
        format(selectedDate, "yyyy-MM-dd")
    )
  }, [tasks, selectedDate]);

  useEffect(() => {
    const fetchData = async () => {
      setLoadingTasks(true)
      try {
        const res = await getTasks();
        setTasks(res);
      } catch {
        setLoadingTasks(false)
        toast.error("Failed to fetch tasks")
        // console.error("Failed to fetch tasks:", error);
      } finally {
        setLoadingTasks(false)
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const updatedTasks = [...tasks];
    tasks.forEach((task) => {
      const nextRecurring = generateNextRecurringTask(task);
      if (nextRecurring) {
        updatedTasks.push(nextRecurring);
      }
    });
    if (updatedTasks.length !== tasks.length) {
      setTasks(updatedTasks);
    }
  }, [tasks]);

  const onAddTask = (taskData: Partial<Task>) => {
    if (taskToEdit) {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskToEdit.id
            ? { ...task, ...taskData, }
            : task
        )
      );
      setTaskToEdit(null);
    } else {
      const newTask: Task = taskData as Task;
      setTasks((prev) => [newTask, ...prev]);
    }
    setIsDialogOpen(false);
  };

  const onDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const onToggleComplete = (id: string, status: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: status } : task
      )
    );
  };

  return (
    <div className="h-screen flex flex-col">
      {/* HEADER */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 shadow bg-white dark:bg-gray-900 px-6 py-4">
        <div className="flex items-center gap-2">
          {/* Mobile sidebar toggle */}
          <button
            className="lg:hidden p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-2xl font-bold">📋 To-Do Dashboard</span>
        </div>
        <div className="flex flex-wrap items-center gap-3">

          {/* Add Task Button */}
          <Button
            variant={"outline"}
            onClick={() => {
              setTaskToEdit(null);
              setIsDialogOpen(true)
            }}
          >
            <Plus /> Add Task
          </Button>
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Welcome, {mockUser.fullName}
          </span>
          <ThemeModeToggle />
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex flex-1 flex-col lg:flex-row overflow-hidden">
        {/* LEFT SIDEBAR - desktop only */}
        <aside className="hidden lg:block lg:w-1/4 xl:w-1/5 border-r overflow-y-auto p-4 sticky space-y-4">
          <TaskSummaryAnalytics tasks={filteredTasks} />
          <TaskCalendar tasks={tasks} onDateSelect={setSelectedDate} />
        </aside>

        {/* RIGHT CONTENT */}
        <div className="flex-1 px-4 sm:px-6 py-4 space-y-6 overflow-y-auto">
          {loadingTasks ?
            (
              <div className="w-full flex items-center flex-col gap-5 justify-center min-h-[570px]">
                <Loader className="animate-spin" /> Loading...
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="w-full flex items-center flex-col gap-5 justify-center min-h-[570px]">
                {tasks.length === 0 ? "No Task Available" : "No Task for today"}

                {/* Add Task Dialog */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant={"outline"}
                      onClick={() => {
                        setTaskToEdit(null);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Plus /> Add Task
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="w-full">
                    <DialogHeader>
                      <DialogTitle>
                        {taskToEdit ? "Edit Task" : "Add Task"}
                      </DialogTitle>
                      <DialogDescription>
                        {taskToEdit
                          ? "Edit the selected task details"
                          : "Add a new task you made recently"}
                      </DialogDescription>
                    </DialogHeader>

                    <TaskForm
                      setIsDialogOpen={setIsDialogOpen}
                      onAddTask={onAddTask}
                      initialTask={taskToEdit || undefined}
                    />

                  </DialogContent>
                </Dialog>
              </div>
            ) :
              (
                <>
                  <TaskBoard
                    tasks={filteredTasks}
                    onEditTask={(task) => {
                      setTaskToEdit(task);
                      setIsDialogOpen(true);
                    }}
                    onDeleteTask={onDeleteTask}
                    onToggleComplete={onToggleComplete}
                    setTasks={setTasks}
                  />
                  <WeeklyTrendsChart tasks={tasks} />
                </>
              )}

          {/* FOOTER */}
          <footer className="text-center py-3 text-sm text-gray-600 border-t">
            &copy; {new Date().getFullYear()} To-Do Dashboard. All rights reserved.
          </footer>
        </div>
      </main>


      {/* MOBILE SLIDE-IN SIDEBAR */}
      <Dialog open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <DialogContent className="p-0 max-w-sm w-3/4 left-0 translate-x-0 m-0 bg-white dark:bg-gray-900 border-r shadow-lg overflow-y-auto "
        >
          {/* BACKDROP */}
          <motion.div
            className="fixed inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setSidebarOpen(false)}
          />
          {/* SLIDE-IN SIDEBAR */}
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
            className="flex flex-col h-full ' top-0 left-0 p-4 "
          >
            <div className="flex items-center justify-between p-4 border-b">
              <DialogTitle className="text-lg font-semibold">Overview</DialogTitle>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <TaskSummaryAnalytics tasks={filteredTasks} />
              <TaskCalendar tasks={tasks} onDateSelect={setSelectedDate} />
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
