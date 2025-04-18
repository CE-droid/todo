import { Dialog, Transition } from "@headlessui/react"
import { Fragment, useEffect, useState } from "react"
import { Todo } from "../hooks/useTodos"

interface Props {
  todo: Todo;
  onClose: () => void;
  onSave?: (updatedTodo: Todo) => void; 
}

const EditTodoModal = ({ todo, onClose, onSave }: Props) => {
  const [title, setTitle] = useState(todo.title);
  const [completed, setCompleted] = useState(todo.completed);

  useEffect(() => {
    setTitle(todo.title);
    setCompleted(todo.completed);
  }, [todo]);

  const handleSave = () => {
    if (onSave) {
      onSave({ ...todo, title, completed });
    }
    onClose();
  };

  return (
    <Transition appear show={true} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all"
                aria-labelledby="edit-todo-title"
              >
                <Dialog.Title
                  as="h3"
                  id="edit-todo-title"
                  className="text-lg font-medium leading-6 text-gray-900 dark:text-white"
                >
                  Edit Todo
                </Dialog.Title>
                <div className="mt-4 space-y-4">
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:bg-gray-700 dark:text-white"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    aria-label="Todo Title"
                  />
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={completed}
                      onChange={(e) => setCompleted(e.target.checked)}
                    />
                    Mark as Completed
                  </label>
                </div>

                <div className="mt-6 flex justify-end gap-2">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Save
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default EditTodoModal;
