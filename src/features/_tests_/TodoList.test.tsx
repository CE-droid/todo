import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TodoList from "../todos/components/TodoList";
import { vi } from "vitest";

// Mock useTodos hook
vi.mock("../todos/hooks/useTodos", () => ({
  useTodos: () => ({
    todos: [
      { id: 1, title: "Test Todo 1", completed: false },
      { id: 2, title: "Test Todo 2", completed: true },
    ],
    loading: false,
    error: null,
    fetchTodos: vi.fn(),
    updateTodo: vi.fn(),
    deleteTodo: vi.fn(),
  }),
}));

// Mock useTheme hook
vi.mock("../todos/hooks/ThemeContext", () => ({
  useTheme: () => ({
    isDarkMode: false,
    toggleDarkMode: vi.fn(),
  }),
}));


describe("TodoList", () => {
  it("renders todos", () => {
    render(<TodoList />);
    expect(screen.getByText("Test Todo 1")).toBeInTheDocument();
    expect(screen.getByText("Test Todo 2")).toBeInTheDocument();
  });

  it("filters completed todos", async () => {
    render(<TodoList />);
    const completedButton = screen.getByRole("button", { name: "Completed" });
    await userEvent.click(completedButton);

    // Confirm completed todo is shown and incomplete one is not
    expect(screen.getByText("Test Todo 2")).toBeInTheDocument();
    expect(screen.queryByText("Test Todo 1")).not.toBeInTheDocument();
  });
});
