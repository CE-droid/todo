import { render, screen, fireEvent, act } from "@testing-library/react";
import EditTodoModal from "./EditTodoModal";
import { vi } from "vitest";

const mockTodo = { id: 1, title: "Old Title", completed: false };

describe("EditTodoModal", () => {
  it("renders and edits todo", async () => {
    const onSave = vi.fn();
    const onClose = vi.fn();

    render(<EditTodoModal todo={mockTodo} onClose={onClose} onSave={onSave} />);

    await act(async () => {
      fireEvent.change(screen.getByRole("textbox"), {
        target: { value: "New Title" },
      });

      fireEvent.click(screen.getByText("Save"));
    });

    expect(onSave).toHaveBeenCalledWith({
      ...mockTodo,
      title: "New Title",
      completed: false,
    });
  });
});
