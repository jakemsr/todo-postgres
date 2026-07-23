"use server";

import { createClient } from "@/lib/supabase/server";
import { Todo } from "@/lib/todo";


export async function getTodos(user_id: string): Promise<{ error: Error | null; data: Todo[] | null }> {
  const supabase = await createClient();
  const { error, data } = await supabase.from("todo").select("*").eq("user_id", user_id);
  return { error, data };
}

export async function addTodo(newTodo: Todo): Promise<{ error: Error | null; data: { id: string } | null }> {
  const supabase = await createClient();
  const { error, data } = await supabase
    .from("todo").insert({
      user_id: newTodo.user_id,
      title: newTodo.title,
      completed: newTodo.completed,
      position: newTodo.position,
    })
    .select("id")
    .single();
  return { error, data };
}

export async function updateTodoCompleted(id: string, completed: boolean): Promise<{ error: Error | null; data: any | null }> {
  const supabase = await createClient();
  const { error, data } = await supabase.from("todo").update({ completed }).eq("id", id);
  return { error, data };
}  

export async function updateTodoPosition(id: string, position: number): Promise<{ error: Error | null; data: any | null }> {
  const supabase = await createClient();
  const { error, data } = await supabase.from("todo").update({ position }).eq("id", id);
  return { error, data };
}

export async function deleteTodo(id: string): Promise<{ error: Error | null; data: any | null }> {
  const supabase = await createClient();
  const { error, data } = await supabase.from("todo").delete().eq("id", id);
  return { error, data };
}
