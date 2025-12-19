import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertTodo, type Todo } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

// Callback for handling undo
let onUndoDelete: ((todo: Todo) => void) | null = null;

export function setUndoDeleteCallback(callback: (todo: Todo) => void) {
  onUndoDelete = callback;
}

export function useTodos() {
  return useQuery({
    queryKey: [api.todos.list.path],
    queryFn: async () => {
      const res = await fetch(api.todos.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch todos");
      return api.todos.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateTodo() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertTodo) => {
      const validated = api.todos.create.input.parse(data);
      const res = await fetch(api.todos.create.path, {
        method: api.todos.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.todos.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to create todo");
      }
      return api.todos.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.todos.list.path] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useUpdateTodo() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & Partial<InsertTodo>) => {
      const validated = api.todos.update.input.parse(updates);
      const url = buildUrl(api.todos.update.path, { id });
      
      const res = await fetch(url, {
        method: api.todos.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 404) throw new Error("Todo not found");
        throw new Error("Failed to update todo");
      }
      return api.todos.update.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.todos.list.path] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useDeleteTodo() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, todo }: { id: number; todo: Todo }) => {
      const url = buildUrl(api.todos.delete.path, { id });
      const res = await fetch(url, {
        method: api.todos.delete.method,
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 404) throw new Error("Todo not found");
        throw new Error("Failed to delete todo");
      }
      return todo;
    },
    onMutate: async ({ id }) => {
      // Optimistically remove the todo from the UI
      await queryClient.cancelQueries({ queryKey: [api.todos.list.path] });
      const previousTodos = queryClient.getQueryData<Todo[]>([api.todos.list.path]);
      
      if (previousTodos) {
        queryClient.setQueryData(
          [api.todos.list.path],
          previousTodos.filter((t) => t.id !== id)
        );
      }
      
      return { previousTodos, id };
    },
    onSuccess: (_, { todo }) => {
      if (onUndoDelete) {
        onUndoDelete(todo);
      }
    },
    onError: (error, _, context) => {
      // Restore the previous todos on error
      if (context?.previousTodos) {
        queryClient.setQueryData([api.todos.list.path], context.previousTodos);
      }
      
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
