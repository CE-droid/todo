import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TodoList from "./features/todos/components/TodoList";


function App() {
  return (
   
       <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-white">
      <TodoList />
      <ToastContainer position="bottom-right" />
    </div>
   
   
  );
}

export default App;