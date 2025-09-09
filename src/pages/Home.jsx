import React, { useState } from "react";
import Navbar from "@/components/shared/Navbar";
import TodoList from "@/components/home/TodoList";
import {
  useGetTodosQuery,
  useAddTodoMutation,
  useDeleteTodoMutation,
  useToggleTodoMutation,
} from "@/features/todo/todoApi";

export function Home() {
  const [newTodo, setNewTodo] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const { data: todos, isLoading, isError, error } = useGetTodosQuery();
  const [addTodo, { isLoading: isAdding }] = useAddTodoMutation();
  const [deleteTodo] = useDeleteTodoMutation();
  const [toggleTodo] = useToggleTodoMutation();

  const handleAdd = async () => {
    if (newTodo.trim() === "") {
      alert("Title is required");
      return;
    }
    try {
      // Wait for the mutation to complete
      await addTodo({ title: newTodo, description: newDesc }).unwrap();
      // Clear inputs only after successful addition
      setNewTodo("");
      setNewDesc("");
    } catch (error) {
      console.error("Failed to add todo:", error);
      // Don't clear inputs if there was an error
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTodo(id).unwrap();
    } catch (error) {
      console.error("Failed to delete todo:", error);
    }
  };

  const handleToggle = async (id) => {
    const todo = todos.find((t) => t._id === id);
    try {
      await toggleTodo({ id, completed: !todo.completed }).unwrap();
    } catch (error) {
      console.error("Failed to toggle todo:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Todos</h1>
        </div>

        <div className="mt-8 bg-white p-6 rounded-lg shadow-md mb-8 ">
          <h2 className="text-xl font-semibold mb-4">Add New Todo</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Todo title"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              placeholder="Todo description"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
            <button
              onClick={handleAdd}
              disabled={isAdding}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md transition-colors disabled:opacity-50"
            >
              {isAdding ? "Adding..." : "Add Todo"}
            </button>
          </div>
        </div>

        {isLoading && (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading...</p>
          </div>
        )}

        {isError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>
              Error loading todos:{" "}
              {error?.data?.message || error?.message || "Unknown error"}
            </p>
          </div>
        )}

        {todos && (
          <TodoList
            todos={todos}
            onDelete={handleDelete}
            onToggleCompleted ={handleToggle}
          />
        )}
      </div>
    </div>
  );
}
