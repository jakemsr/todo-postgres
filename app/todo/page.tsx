"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Todo } from "@/lib/todo";
import TodoItem from "@/components/todo-item";
import { LogoutButton } from "@/components/logout-button";


export default function Page() {

  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [userId, setUserId] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    let localUserId: string;
    let localUserEmail: string | undefined = undefined;
    async function fetchUserDetails() {
      const { data, error } = await supabase.auth.getClaims();
      if (error) {
        console.warn("Local claims verification failed:", error.message);

        // Fall back to getUser() to force an Auth server check/refresh
        const { data: userData, error: userError } = await supabase.auth.getUser();

        if (userError) {
          // Both failed: Token is completely invalid, expired, or user logged out
          // Clear local storage and redirect to login
          window.location.href = '/auth/login';
        } else {
          // Session was successfully refreshed server-side
          console.log("Session recovered:", userData.user);
          localUserId = userData.user.id;
          localUserEmail = userData.user.email;
        }

      } else if (data) {
        localUserId = data.claims.sub;
        localUserEmail = data.claims.email;
      }
      setUserId(localUserId);
      setUserEmail(localUserEmail);

      setLoading(false);
    }
    fetchUserDetails();
  }, []);

  if (loading) return <p>Loading state...</p>;

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
    <div className="flex flex-col w-136 mt-8">
      <div className="flex justify-start items-center text-xl gap-4 rounded-sm bg-white dark:bg-navy-900 p-4 shadow-xl">
        <div className="rounded-full w-6 h-6 mx-2 border border-gray-300 dark:border-gray-600"></div>
        <label htmlFor="new-todo" className="sr-only">New Todo</label>
        <input
          id="new-todo"
          type="text"
          className="flex-1 border-none focus:outline-none focus:ring-0 caret-sidebar-primary"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      </div>

      <div className="w-full mt-8 flex flex-col divide-y text-xl rounded-sm bg-white dark:bg-navy-900 shadow-xl">

        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} setTodos={setTodos} />
        ))}

      </div>

      <div className="flex w-full items-center justify-center mt-auto py-4 gap-2">
        <p>
          Logged in as <span>{userEmail}</span>
        </p>
        <LogoutButton />
      </div>

    </div>
  );
}