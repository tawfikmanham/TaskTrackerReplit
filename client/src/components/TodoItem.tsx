import { type Todo } from "@shared/schema";
import { useUpdateTodo, useDeleteTodo } from "@/hooks/use-todos";
import { Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface TodoItemProps {
  todo: Todo;
}

export function TodoItem({ todo }: TodoItemProps) {
  const updateTodo = useUpdateTodo();
  const deleteTodo = useDeleteTodo();

  const handleToggle = () => {
    updateTodo.mutate({ id: todo.id, completed: !todo.completed });
  };

  const handleDelete = () => {
    deleteTodo.mutate(todo.id);
  };

  return (
    <Card className="p-4 flex items-center gap-3 hover:shadow-md transition-shadow">
      <Checkbox
        checked={todo.completed}
        onCheckedChange={handleToggle}
        disabled={updateTodo.isPending}
        data-testid={`checkbox-todo-${todo.id}`}
      />
      <span
        onClick={handleToggle}
        className={cn(
          "flex-1 cursor-pointer text-sm transition-all duration-200 select-none",
          todo.completed && "line-through text-muted-foreground"
        )}
        data-testid={`text-todo-${todo.id}`}
      >
        {todo.text}
      </span>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleDelete}
        disabled={deleteTodo.isPending}
        data-testid={`button-delete-${todo.id}`}
      >
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>
    </Card>
  );
}
