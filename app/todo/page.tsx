"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Todo } from "@/lib/todo";
import { deleteTodo, getTodos, updateTodoPosition } from "./actions";
import TodoItem from "@/components/todo-item";
import { LogoutButton } from "@/components/logout-button";
import NewTodo from "@/components/new-todo";


export default function Page() {

  const [todos, setTodos] = useState<Todo[]>([]);
  const [userId, setUserId] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  enum Filter {
    All = "All",
    Active = "Active",
    Completed = "Completed"
  }

  const [filter, setFilter] = useState<Filter>(Filter.All);

  const clearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);
    const activeTodos = todos.filter(todo => !todo.completed);
    // optimisticly update UI
    setTodos(activeTodos);
    // update the positions
    activeTodos.forEach((todo, index) => {
      todo.position = index;
      updateTodoPosition(todo.id, index);
    });
    // save positions
    setTodos(activeTodos);
    // delete completed todos from the backend
    completedTodos.forEach((todo) => {
      deleteTodo(todo.id);
    });
  };

  const handleOnDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const initialIndex = result.source.index;
    const index = result.destination.index;

    if (initialIndex === index) {
      return;
    }

    const newItems: Todo[] = [...todos];
    const [removedTodo] = newItems.splice(initialIndex, 1);
    newItems.splice(index, 0, removedTodo);
    setTodos(newItems);

    const low = Math.min(initialIndex, index);
    const high = Math.max(initialIndex, index);
    for (let idx = low; idx <= high; idx++) {
      newItems[idx].position = idx;
      updateTodoPosition(newItems[idx].id, idx);
    }
    setTodos(newItems);
  };

  useEffect(() => {
    let localUserId: string;
    let localUserEmail: string | undefined = undefined;
    async function fetchUserDetails() {
      const supabase = createClient();
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


  if (loading) {
    return (
      <div className="flex flex-col w-136 mt-8">
        <div className="w-full flex flex-col mt-8 gap-8 text-xl rounded-sm bg-white dark:bg-navy-900 shadow-xl">
          <div className="flex items-center justify-center mt-8">
            Please wait while we load your data.
          </div>
          <div className="flex justify-center items-center mb-8">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-136 mt-8">

      <NewTodo userId={userId} todos={todos} setTodos={setTodos} />

      <div className="w-full mt-8 flex flex-col text-xl rounded-sm bg-white dark:bg-navy-900 shadow-xl">

        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="tasks-list">
            {(provided) => (
              <div
                className="tasks-container divide-y border-b"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {todos.filter(todo => {
                  if (filter === Filter.All) return true;
                  if (filter === Filter.Active) return !todo.completed;
                  if (filter === Filter.Completed) return todo.completed;
                  return true;
                }).map((todo, index) => (
                  <Draggable key={todo.id} draggableId={todo.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          userSelect: 'none',
                          cursor: 'pointer',
                          ...provided.draggableProps.style // Vital for calculating correct placements during drag
                        }}
                      >
                        <TodoItem todo={todo} setTodos={setTodos} />
                      </div>
                    )}
                  </Draggable>
                ))}

                {/* Acts as a layout placeholder to avoid layout shifts while dragging */}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <div className="flex justify-between items-center p-4 text-base text-gray-500">
          <div>
            {(() => {
              const activeItemsCount = todos.reduce((count, item) => !item.completed ? count + 1 : count, 0);
              return `${activeItemsCount} items left`;
            })()}
          </div>
          <div className="flex gap-4">
            <button onClick={() => setFilter(Filter.All)}>
              <span className={`cursor-pointer ${filter === Filter.All ? "text-blue-500" : "hover:text-white"}`}>
                All
              </span>
            </button>
            <button onClick={() => setFilter(Filter.Active)}>
              <span className={`cursor-pointer ${filter === Filter.Active ? "text-blue-500" : "hover:text-white"}`}>
                Active
              </span>
            </button>
            <button onClick={() => setFilter(Filter.Completed)}>
              <span className={`cursor-pointer ${filter === Filter.Completed ? "text-blue-500" : "hover:text-white"}`}>
                Completed
              </span>
            </button>
          </div>
          <div>
            <button onClick={clearCompleted}>
              <span className="cursor-pointer hover:text-white">
                Clear Completed
              </span>
            </button>
          </div>
        </div>

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