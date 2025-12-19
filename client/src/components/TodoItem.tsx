import { type Todo } from "@shared/schema";
import { useUpdateTodo, useDeleteTodo } from "@/hooks/use-todos";
import { Check, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface TodoItemProps {
  todo: Todo;
}

export function TodoItem({ todo }: TodoItemProps) {
  const updateTodo = useUpdateTodo();
  const deleteTodo = useDeleteTodo();

  const handleToggle = () => {
    updateTodo.mutate({ id: todo.id, completed: !todo.completed });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteTodo.mutate(todo.id);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "group flex items-center gap-4 p-4 rounded-xl border border-border/40 bg-card shadow-sm transition-all duration-300 hover:shadow-md hover:border-border/80",
        todo.completed && "bg-secondary/30"
      )}
    >
      <button
        onClick={handleToggle}
        className={cn(
          "relative flex items-center justify-center w-6 h-6 rounded-full border-2 transition-all duration-200 animate-check focus:outline-none focus:ring-2 focus:ring-primary/20",
          todo.completed
            ? "bg-primary border-primary"
            : "border-muted-foreground/30 hover:border-primary/50"
        )}
      >
        <Check
          className={cn(
            "w-3.5 h-3.5 text-primary-foreground transition-transform duration-200",
            todo.completed ? "scale-100" : "scale-0"
          )}
          strokeWidth={3}
        />
      </button>

      <span
        className={cn(
          "flex-1 text-base font-medium transition-colors duration-200 select-none cursor-pointer",
          todo.completed ? "text-muted-foreground line-through decoration-muted-foreground/50" : "text-foreground"
        )}
        onClick={handleToggle}
      >
        {todo.text}
      </span>

      <button
        onClick={handleDelete}
        disabled={deleteTodo.isPending}
        className="opacity-0 group-hover:opacity-100 p-2 rounded-lg text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 transition-all duration-200 focus:opacity-100 focus:outline-none"
        aria-label="Delete task"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </motion.div>
  );
}
