import { useEffect, useState, useCallback } from "react";
import axios from "axios";

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://jsonplaceholder.typicode.com/todos");
      setTodos(res.data.slice(0, 50)); // limit for performance
    } catch (err) {
      setError("Failed to fetch todos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const updateTodo = async (updated: Todo) => {
    const prev = [...todos];
    setTodos((prevTodos) =>
      prevTodos.map((todo) => (todo.id === updated.id ? updated : todo))
    );
    try {
      await axios.put(`https://jsonplaceholder.typicode.com/todos/${updated.id}`, updated);
    } catch {
      setTodos(prev); // rollback on error
      throw new Error("Update failed");
    }
  };

  const deleteTodo = async (id: number) => {
    const prev = [...todos];
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    try {
      await axios.delete(`https://jsonplaceholder.typicode.com/todos/${id}`);
    } catch {
      setTodos(prev); // rollback
      throw new Error("Delete failed");
    }
  };

  return {
    todos,
    loading,
    error,
    fetchTodos,
    updateTodo,
    deleteTodo,
  };
};
