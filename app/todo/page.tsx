"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Todo } from "@/lib/todo";
import { getTodos } from "./actions";
import TodoItem from "@/components/todo-item";
import { LogoutButton } from "@/components/logout-button";
import NewTodo from "@/components/new-todo";


export default function Page() {

  const [todos, setTodos] = useState<Todo[]>([]);
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

      async function fetchTodos() {
        if (localUserId) {
          const { error, data } = await getTodos(localUserId);
          if (error) {
            console.error("Failed to fetch todos:", error.message);
          } else if (data) {
            data.sort((a, b) => a.position - b.position);
            setTodos(data);
          }
        }
      }
      await fetchTodos();
      setLoading(false);
    }
    fetchUserDetails();
  }, []);

  if (loading) return <p>Loading state...</p>;


  return (
    <div className="flex flex-col w-136 mt-8">

      <NewTodo userId={userId} todos={todos} setTodos={setTodos} />

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