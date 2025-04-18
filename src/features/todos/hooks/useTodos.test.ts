import { renderHook } from "@testing-library/react";
import { waitFor } from "@testing-library/react";
import axios from "axios";
import { useTodos } from "./useTodos";

vi.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("useTodos", () => {
  it("fetches todos", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: [{ id: 1, title: "A Todo", completed: false }],
    });

    const { result } = renderHook(() => useTodos());

    await waitFor(() => expect(result.current.todos).toHaveLength(1));
    expect(result.current.todos[0].title).toBe("A Todo");
  });

  it("handles fetch error", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("Failed"));

    const { result } = renderHook(() => useTodos());

    await waitFor(() => expect(result.current.error).toBe("Failed to fetch todos."));
  });
});
