import { Suspense, lazy, useCallback, useState, useEffect, useMemo } from "react";
import { useTodos, Todo } from "../hooks/useTodos";
import { useTheme } from "../hooks/ThemeContext"; // Import the ThemeContext hook

import { toast } from "react-toastify";
import { 
  Pencil, 
  Trash2, 
  GripVertical, 
  CheckCircle, 
  Circle, 
  Search,
  Moon,  // Add moon icon for dark mode
  Sun     // Add sun icon for light mode
} from "lucide-react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
const EditTodoModal = lazy(() => import("./EditTodoModal"));
const PAGE_SIZE = 5;

const TodoList = () => {
  const { isDarkMode, toggleDarkMode } = useTheme(); // Use the theme hook
  const { todos, loading, error, deleteTodo, updateTodo } = useTodos();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [orderedTodos, setOrderedTodos] = useState([]);
  const [page, setPage] = useState(1);

  // Filter todos based on search and filter criteria
  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      const matchesSearch = todo.title.toLowerCase().includes(search.toLowerCase());
      const matchesFilter =
        filter === "all"
          ? true
          : filter === "completed"
          ? todo.completed
          : !todo.completed;
      return matchesSearch && matchesFilter;
    });
  }, [todos, search, filter]);

  // Initialize orderedTodos with filteredTodos
  useEffect(() => {
    if (filteredTodos.length > 0) {
      setOrderedTodos(filteredTodos);
    }
  }, [filteredTodos]);

  // Ensure we display todos on first load
  useEffect(() => {
    // Force re-render of pagination data
    if (filteredTodos.length > 0) {
      setPage(1);
    }
  }, []);

  // Get current page of todos
  const paginatedTodos = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return orderedTodos.slice(start, start + PAGE_SIZE);
  }, [orderedTodos, page]);

  // Toggle todo completion status
  const toggleComplete = useCallback(async (todo) => {
    try {
      await updateTodo({ ...todo, completed: !todo.completed });
      toast.success(todo.completed ? "Marked as incomplete" : "Marked as complete!");
    } catch {
      toast.error("Failed to update status.");
    }
  }, [updateTodo]);

  // Delete a todo
  const handleDelete = useCallback(async (id) => {
    if (!confirm("Delete this todo?")) return;
    try {
      await deleteTodo(id);
      toast.success("Todo deleted successfully!");
    } catch {
      toast.error("Error deleting todo.");
    }
  }, [deleteTodo]);

  // Handle drag and drop reordering
  const handleDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination || destination.index === source.index) return;

    const updated = [...orderedTodos];
    const [moved] = updated.splice(source.index, 1);
    updated.splice(destination.index, 0, moved);
    setOrderedTodos(updated);
    toast.info("Todo order updated");
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 w-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 dark:border-indigo-400"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-4 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-lg w-full">
        <p>Error loading todos. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className={`w-full max-w-4xl mx-auto px-4 py-8 text-left transition-colors duration-300 ${isDarkMode ? 'dark:bg-gray-900 dark:text-white' : ''}`}>
      {/* Header with gradient background */}
      <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-800 rounded-lg p-6 mb-6 shadow-lg">
        <h1 className="text-2xl md:text-3xl font-bold text-center text-white">Todo Manager</h1>
        <p className="text-center text-blue-100 mt-2">Organize your tasks efficiently</p>
        
        {/* Add Dark Mode Toggle */}
        <button 
          onClick={toggleDarkMode}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          aria-label={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="relative w-full md:w-1/2">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Search todos..."
            className="border border-gray-300 dark:border-gray-700 pl-10 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex space-x-2 w-full md:w-auto">
          <button
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === "all" 
                ? "bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-800" 
                : "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            }`}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === "completed" 
                ? "bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-800" 
                : "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            }`}
            onClick={() => setFilter("completed")}
          >
            Completed
          </button>
          <button
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === "incomplete" 
                ? "bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-800" 
                : "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            }`}
            onClick={() => setFilter("incomplete")}
          >
            Incomplete
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md border-l-4 border-blue-500">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Todos</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">{todos.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md border-l-4 border-green-500">
          <p className="text-sm text-gray-500 dark:text-gray-400">Completed</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">{todos.filter(t => t.completed).length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md border-l-4 border-amber-500">
          <p className="text-sm text-gray-500 dark:text-gray-400">Incomplete</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">{todos.filter(t => !t.completed).length}</p>
        </div>
      </div>

      {/* Todo List */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="todos">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`${
                  snapshot.isDraggingOver 
                    ? 'bg-blue-50 dark:bg-blue-900/20' 
                    : 'dark:bg-gray-800'
                } divide-y divide-gray-200 dark:divide-gray-700`}
              >
                {paginatedTodos.length > 0 ? (
                  paginatedTodos.map((todo, index) => (
                    <Draggable
                      key={todo.id.toString()}
                      draggableId={todo.id.toString()}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`${
                            snapshot.isDragging
                              ? 'bg-blue-100 dark:bg-blue-900/50 shadow-lg'
                              : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                          } transition-colors`}
                        >
                          <div className="flex items-center p-4">
                            <div 
                              {...provided.dragHandleProps}
                              className="text-gray-400 dark:text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 cursor-grab mr-2"
                            >
                              <GripVertical size={18} />
                            </div>
                            
                            <div className="w-8 h-8 flex items-center justify-center mr-3">
                              <button 
                                onClick={() => toggleComplete(todo)}
                                className={`focus:outline-none transition-colors ${
                                  todo.completed 
                                    ? 'text-green-500 hover:text-green-600 dark:text-green-400 dark:hover:text-green-500' 
                                    : 'text-gray-400 hover:text-blue-500 dark:text-gray-500 dark:hover:text-blue-400'
                                }`}
                              >
                                {todo.completed ? (
                                  <CheckCircle size={20} />
                                ) : (
                                  <Circle size={20} />
                                )}
                              </button>
                            </div>
                            
                            <div className="flex-1">
                              <p className={`${
                                todo.completed 
                                  ? 'line-through text-gray-400 dark:text-gray-500' 
                                  : 'text-gray-800 dark:text-gray-200'
                              } font-medium`}>
                                <span className="text-gray-500 dark:text-gray-400 text-sm mr-2">#{todo.id}</span>
                                {todo.title}
                              </p>
                            </div>
                            
                            <div className="ml-4">
                              <span 
                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                  todo.completed 
                                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" 
                                    : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                                }`}
                              >
                                {todo.completed ? "Completed" : "Incomplete"}
                              </span>
                            </div>
                            
                            <div className="ml-4 flex space-x-1">
                              <button
                                onClick={() => setSelectedTodo(todo)}
                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-2 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                                aria-label="Edit"
                              >
                                <Pencil size={18} />
                              </button>
                              <button
                                onClick={() => handleDelete(todo.id)}
                                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                                aria-label="Delete"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                    {search || filter !== "all" ? (
                      <p>No todos match your search or filter criteria.</p>
                    ) : (
                      <p>No todos available. Add some tasks to get started!</p>
                    )}
                  </div>
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      {/* Pagination */}
      {orderedTodos.length > 0 && (
        <div className="mt-6 flex justify-between items-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing {Math.min(paginatedTodos.length, PAGE_SIZE)} of {orderedTodos.length} todos
          </p>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              className={`px-4 py-2 rounded-lg border text-sm font-medium ${
                page === 1
                  ? 'text-gray-400 bg-gray-100 dark:bg-gray-800 dark:text-gray-500 cursor-not-allowed'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:border-blue-300 dark:hover:border-blue-700 transition-colors dark:bg-gray-800 dark:border-gray-700'
              }`}
              disabled={page === 1}
            >
              Previous
            </button>
            <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-sm text-gray-800 dark:text-gray-300">
              Page {page} of {Math.ceil(orderedTodos.length / PAGE_SIZE) || 1}
            </div>
            <button
              onClick={() =>
                setPage((prev) =>
                  prev * PAGE_SIZE < orderedTodos.length ? prev + 1 : prev
                )
              }
              className={`px-4 py-2 rounded-lg border text-sm font-medium ${
                page * PAGE_SIZE >= orderedTodos.length
                  ? 'text-gray-400 bg-gray-100 dark:bg-gray-800 dark:text-gray-500 cursor-not-allowed'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:border-blue-300 dark:hover:border-blue-700 transition-colors dark:bg-gray-800 dark:border-gray-700'
              }`}
              disabled={page * PAGE_SIZE >= orderedTodos.length}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {selectedTodo && (
        <Suspense fallback={<div className="text-center py-4">Loading modal...</div>}>
          <EditTodoModal
            todo={selectedTodo}
            onClose={() => setSelectedTodo(null)}
            onSave={async (updatedTodo) => {
              const prev = [...todos];
              try {
                await updateTodo(updatedTodo);
                toast.success("Todo updated successfully!");
                setSelectedTodo(null);
              } catch {
                toast.error("Update failed.");
                setOrderedTodos(prev);
              }
            }}
          />
        </Suspense>
      )}
    </div>
  );
};

export default TodoList;