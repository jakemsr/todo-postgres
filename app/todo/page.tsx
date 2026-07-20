"use client";

import { useState } from "react";
import { Todo } from "@/lib/todo";
import TodoItem from "@/components/todo-item";


export default function Page() {

  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newTodo.trim() !== "") {
      const newTodoItem: Todo = {
        id: Date.now(),
        title: newTodo,
        completed: false,
        position: todos.length,
      };
      setTodos([...todos, newTodoItem]);
      setNewTodo("");
    }
  };

  return (
    <div className="w-136 mt-8">
      <div className="flex justify-start items-center text-xl gap-4 rounded-sm bg-white dark:bg-navy-900 p-4 shadow-xl">
        <div className="rounded-full w-6 h-6 mx-2 border border-gray-300 dark:border-gray-600"></div>
        <input
          type="text" className="flex-1 border-none focus:outline-none focus:ring-0 caret-sidebar-primary"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      <div className="w-full mt-8 flex flex-col divide-y text-xl rounded-sm bg-white dark:bg-navy-900 shadow-xl">

        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} setTodos={setTodos} />
        ))}

      </div>

    </div>
  );
}