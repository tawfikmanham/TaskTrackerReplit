import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { insertTodoSchema } from "@shared/schema";

async function seedDatabase() {
  const todos = await storage.getTodos();
  if (todos.length === 0) {
    await storage.createTodo({ text: "Buy groceries", completed: false });
    await storage.createTodo({ text: "Walk the dog", completed: true });
    await storage.createTodo({ text: "Build a todo app", completed: false });
    console.log("Database seeded!");
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  await seedDatabase();

  app.get(api.todos.list.path, async (req, res) => {
    const todos = await storage.getTodos();
    res.json(todos);
  });

  app.post(api.todos.create.path, async (req, res) => {
    try {
      const data = insertTodoSchema.parse(req.body);
      const todo = await storage.createTodo(data);
      res.status(201).json(todo);
    } catch (error) {
       if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });

  app.patch(api.todos.update.path, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = insertTodoSchema.partial().parse(req.body);
      const todo = await storage.updateTodo(id, data);
      if (!todo) {
        return res.status(404).json({ message: "Todo not found" });
      }
      res.json(todo);
    } catch (error) {
       if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });

  app.delete(api.todos.delete.path, async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.deleteTodo(id);
    res.status(204).send();
  });

  return httpServer;
}
