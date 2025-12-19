import { useState } from "react";
import { useTodos, useCreateTodo } from "@/hooks/use-todos";
import { TodoItem } from "@/components/TodoItem";
import { Plus, ListTodo, CheckCircle2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">My Tasks</h1>
          <p className="text-muted-foreground">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Add Todo Form */}
        <Card className="p-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              type="text"
              value={newTodoText}
              onChange={(e) => setNewTodoText(e.target.value)}
              placeholder="Add a new task..."
              disabled={createTodo.isPending}
              data-testid="input-new-todo"
            />
            <Button
              type="submit"
              disabled={!newTodoText.trim() || createTodo.isPending}
              size="icon"
              data-testid="button-add-todo"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </form>
        </Card>

        {/* Tabs for Filtering */}
        <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all" data-testid="tab-all">
              <span>All</span>
              <span className="ml-2 text-xs text-muted-foreground">({todos?.length || 0})</span>
            </TabsTrigger>
            <TabsTrigger value="active" data-testid="tab-active">
              <span>Active</span>
              <span className="ml-2 text-xs text-muted-foreground">({activeCount})</span>
            </TabsTrigger>
            <TabsTrigger value="completed" data-testid="tab-completed">
              <span>Done</span>
              <span className="ml-2 text-xs text-muted-foreground">({completedCount})</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value={filter} className="mt-6 space-y-2">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin mb-2" />
                <p>Loading tasks...</p>
              </div>
            ) : filteredTodos?.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <ListTodo className="w-12 h-12 text-muted-foreground/40 mb-3" />
                <p className="font-medium text-foreground mb-1">
                  {filter === "all" && "No tasks yet"}
                  {filter === "active" && "All caught up!"}
                  {filter === "completed" && "No completed tasks"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {filter === "all" && "Add a task to get started."}
                  {filter === "active" && "Take a break, you've earned it!"}
                  {filter === "completed" && "Finish some tasks to see them here."}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredTodos?.map((todo) => (
                  <TodoItem key={todo.id} todo={todo} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
