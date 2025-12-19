import { useState } from "react";
import { useTodos, useCreateTodo } from "@/hooks/use-todos";
import { TodoItem } from "@/components/TodoItem";
import { Plus, ListTodo, CheckCircle2, Circle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type Filter = "all" | "active" | "completed";

export default function Home() {
  const { data: todos, isLoading, error } = useTodos();
  const createTodo = useCreateTodo();
  const [newTodoText, setNewTodoText] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoText.trim()) return;
    createTodo.mutate(
      { text: newTodoText, completed: false },
      { onSuccess: () => setNewTodoText("") }
    );
  };

  const filteredTodos = todos?.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  const activeCount = todos?.filter((t) => !t.completed).length || 0;
  const completedCount = todos?.filter((t) => t.completed).length || 0;

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-destructive">
        Error loading tasks
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8 selection:bg-primary/20">
      <div className="max-w-2xl mx-auto space-y-12">
        {/* Header */}
        <header className="space-y-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-heading text-foreground">
              Focus & Flow
            </h1>
            <p className="mt-4 text-muted-foreground text-lg font-light tracking-wide">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
          </motion.div>
        </header>

        {/* Input Form */}
        <motion.form
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="relative group"
        >
          <div className="relative">
            <input
              type="text"
              value={newTodoText}
              onChange={(e) => setNewTodoText(e.target.value)}
              placeholder="What needs to be done?"
              className="w-full pl-6 pr-14 py-4 text-lg bg-card rounded-2xl shadow-sm border border-border/50 focus:border-primary/20 focus:ring-4 focus:ring-primary/5 focus:outline-none placeholder:text-muted-foreground/60 transition-all duration-300"
              disabled={createTodo.isPending}
            />
            <button
              type="submit"
              disabled={!newTodoText.trim() || createTodo.isPending}
              className="absolute right-2 top-2 bottom-2 aspect-square flex items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>
        </motion.form>

        {/* Filters & Stats */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2"
        >
          <div className="flex p-1 bg-secondary/50 rounded-xl">
            {(["all", "active", "completed"] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 capitalize",
                  filter === f
                    ? "bg-white text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/50"
                )}
              >
                {f}
              </button>
            ))}
          </div>
          
          <div className="flex gap-4 text-sm text-muted-foreground font-medium">
            <span className="flex items-center gap-1.5">
              <Circle className="w-4 h-4" /> {activeCount} left
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> {completedCount} done
            </span>
          </div>
        </motion.div>

        {/* Todo List */}
        <div className="space-y-4 min-h-[300px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground space-y-4">
              <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              <p>Loading your tasks...</p>
            </div>
          ) : filteredTodos?.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-16 h-16 bg-secondary/50 rounded-full flex items-center justify-center mb-4">
                <ListTodo className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-lg font-medium text-foreground">
                {filter === "all" 
                  ? "No tasks yet" 
                  : filter === "active" 
                    ? "All caught up!" 
                    : "No completed tasks"}
              </p>
              <p className="text-muted-foreground">
                {filter === "all" 
                  ? "Add a task above to get started." 
                  : filter === "active" 
                    ? "Take a break, you've earned it." 
                    : "Finish some tasks to see them here."}
              </p>
            </motion.div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredTodos?.map((todo) => (
                <TodoItem key={todo.id} todo={todo} />
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}
