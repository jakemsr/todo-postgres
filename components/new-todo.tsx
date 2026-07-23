"use client";

import { Todo } from "@/lib/todo";
import { useState } from "react";
import { addTodo } from "@/app/todo/actions";


interface NewTodoProps {
  userId: string;
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
}

export default function NewTodo({ userId, todos, setTodos }: NewTodoProps) {

  const [newTodoTitle, setNewTodoTitle] = useState("");

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newTodoTitle.trim() !== "") {
      const newTodo: Todo = {
        id: "-1",
        user_id: userId,
        title: newTodoTitle,
        completed: false,
        position: todos.length,
      };
      setTodos([...todos, newTodo]);
      setNewTodoTitle("");
      const { error, data } = await addTodo(newTodo);
      if (error) {
        console.error("Failed to add todo:", error);
        // remove the temporary todo with id "-1" from the list
        // need to report error to user
        setTodos([...todos.filter(todo => todo.id !== "-1")]);
      } else if (data?.id) {
        // replace the temporary todo id with the one returned from the server
        setTodos(prevTodos => prevTodos.map(t => t.id === "-1" ? { ...t, id: data.id } : t));
      }
    }
  };

  return (
    <div className="flex justify-start items-center text-xl gap-4 rounded-sm bg-white dark:bg-navy-900 p-4 shadow-xl">
      <div className="rounded-full w-6 h-6 mx-2 border border-gray-300 dark:border-gray-600"></div>
      <label htmlFor="new-todo-title" className="sr-only">New Todo</label>
      <input
        id="new-todo-title"
        type="text"
        className="flex-1 border-none focus:outline-none focus:ring-0 caret-sidebar-primary"
        value={newTodoTitle}
        onChange={(e) => setNewTodoTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        autoFocus
      />
    </div>
  )
}
