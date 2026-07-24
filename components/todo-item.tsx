import { Todo } from "@/lib/todo";
import { updateTodoCompleted, deleteTodo } from "@/app/todo/actions";


interface TodoItemsProps {
  todo: Todo;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
}

export default function TodoItem({ todo, setTodos }: TodoItemsProps) {
  return (
    <div key={todo.id} className="group flex justify-start items-center gap-4 p-4">
      <div
        className={`rounded-full w-6 h-6 flex justify-center items-center mx-2 check
          border border-gray-300 dark:border-gray-600 ${todo.completed ? "bg-check" : ""}`}
        onClick={async () => {
          setTodos(prevTodos => prevTodos.map(t => t.id === todo.id ? { ...t, completed: !t.completed } : t));
          const { error, data } = await updateTodoCompleted(todo.id, !todo.completed);
          if (error) {
            console.error("Failed to update todo:", error.message);
            // Revert the optimistic update if the server update fails
            setTodos(prevTodos => prevTodos.map(t => t.id === todo.id ? { ...t, completed: !t.completed } : t));
          }
        }}
      >
        {todo.completed && (<img src="/icon-check.svg" alt="Completed" />)}
      </div>
      <div
        className={`${todo.completed ? "line-through text-gray-300 dark:text-gray-500" : ""} flex-1`}
      >
        {todo.title}
      </div>
      <div>
        <img
          src="/icon-cross.svg"
          alt="Delete"
          onClick={async () => {
            setTodos(prevTodos => prevTodos.filter(t => t.id !== todo.id));
            const { error, data } = await deleteTodo(todo.id);
            if (error) {
              console.error("Failed to delete todo:", error.message);
              // Revert the optimistic update if the server delete fails
              setTodos(prevTodos => [...prevTodos, todo]);
            }
          }}
          className="hidden group-hover:block cursor-pointer mx-2"
        />
      </div>
    </div>
  );
}
