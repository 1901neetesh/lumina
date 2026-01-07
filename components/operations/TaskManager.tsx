"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useHaptics } from "@/hooks/use-haptics";

interface Task {
    id: string;
    text: string;
    completed: boolean;
}

export function TaskManager() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [inputValue, setInputValue] = useState("");
    const { medium, success } = useHaptics();

    // Load from local storage on mount (simulated)
    useEffect(() => {
        const saved = localStorage.getItem('lumina_tasks');
        if (saved) {
            try {
                setTasks(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to load tasks", e);
            }
        }
    }, []);

    const saveTasks = (newTasks: Task[]) => {
        setTasks(newTasks);
        localStorage.setItem('lumina_tasks', JSON.stringify(newTasks));
    };

    const addTask = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!inputValue.trim()) return;

        medium();
        const newTask: Task = {
            id: crypto.randomUUID(),
            text: inputValue.trim(),
            completed: false
        };
        saveTasks([newTask, ...tasks]);
        setInputValue("");
    };

    const toggleTask = (id: string) => {
        const newTasks = tasks.map(t => {
            if (t.id === id) {
                if (!t.completed) success();
                return { ...t, completed: !t.completed };
            }
            return t;
        });
        // Sort: incomplete first
        // newTasks.sort((a, b) => (a.completed === b.completed ? 0 : a.completed ? 1 : -1));
        saveTasks(newTasks);
    };

    const deleteTask = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        medium();
        saveTasks(tasks.filter(t => t.id !== id));
    };

    return (
        <div className="h-full flex flex-col">
            <h2 className="text-xl font-oswald text-muted-foreground mb-4 uppercase tracking-widest flex items-center justify-between">
                Operations
                <span className="text-xs font-sans text-muted-foreground bg-secondary px-2 py-1 rounded-full">
                    {tasks.filter(t => !t.completed).length} ACTIVE
                </span>
            </h2>

            <form onSubmit={addTask} className="relative mb-6">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="INPUT DIRECTIVE..."
                    className="w-full bg-secondary/50 border border-input rounded-lg py-3 pl-4 pr-12 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-muted-foreground/50 font-medium uppercase tracking-wide"
                />
                <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-background text-muted-foreground hover:text-primary transition-colors"
                >
                    <Plus className="w-5 h-5" />
                </button>
            </form>

            <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {tasks.length === 0 && (
                    <div className="h-32 flex items-center justify-center text-xs text-muted-foreground/30 uppercase tracking-widest border-2 border-dashed border-secondary/50 rounded-lg">
                        No Active Operations
                    </div>
                )}
                {tasks.map(task => (
                    <div
                        key={task.id}
                        className={cn(
                            "group flex items-center gap-3 p-3 rounded-lg border border-transparent hover:border-border/50 hover:bg-secondary/30 transition-all",
                            task.completed && "opacity-50 bg-secondary/10"
                        )}
                    >
                        <Checkbox
                            checked={task.completed}
                            onCheckedChange={() => toggleTask(task.id)}
                        />
                        <span className={cn(
                            "flex-1 text-sm font-medium uppercase tracking-wide truncate transition-all",
                            task.completed ? "line-through text-muted-foreground" : "text-foreground"
                        )}>
                            {task.text}
                        </span>
                        <button
                            onClick={(e) => deleteTask(task.id, e)}
                            className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-destructive transition-all"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
