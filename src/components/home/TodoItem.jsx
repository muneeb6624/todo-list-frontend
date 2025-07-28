import React from 'react';

const TodoItem = ({ todo, onDelete, onToggleCompleted }) => {
  return (
    <div className="mb-4 p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-bold">{todo.title}</h2>
      <p className="text-sm">{todo.description}</p>
      <div className="flex justify-between mt-4">
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => onToggleCompleted(todo._id)}
        >
          {todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
        </button>
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => onDelete(todo._id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TodoItem;