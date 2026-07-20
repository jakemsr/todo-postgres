import { Todo } from "@/lib/todo";

interface TodoItemsProps {
  todo: Todo;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
}

export default function TodoItem({ todo, setTodos }: TodoItemsProps) {
  return (
    <div key={todo.id} className="group flex justify-start items-center gap-4 p-4">
      <div
        className={`rounded-full w-6 h-6 flex justify-center items-center mx-2 check border border-gray-300 dark:border-gray-600 ${todo.completed ? "bg-check" : ""}`}
        onClick={() => {
          setTodos(prevTodos => prevTodos.map(t => t.id === todo.id ? { ...t, completed: !t.completed } : t));
        }}
      >
        {todo.completed && (<img src="/icon-check.svg" alt="Completed" />)}
      </div>
      <div
        className={`${todo.completed ? "line-through" : ""} flex-1`}
      >
        {todo.title}
      </div>
      <div>
        <img
          src="/icon-cross.svg"
          alt="Delete"
          onClick={() => { setTodos(prevTodos => prevTodos.filter(t => t.id !== todo.id)); }}
          className="hidden group-hover:block cursor-pointer mx-2"
        />
      </div>
    </div>
  );
}
