import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import { Home } from "./Home";
import { it, describe, expect, beforeEach, vi } from "vitest";
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from "react-redux";
import { authApi } from '../features/auth/authApi';
import authReducer from '../features/auth/authSlice';

// Mock the API calls
const mockAddTodo = vi.fn();
const mockGetTodos = vi.fn();
const mockDeleteTodo = vi.fn();
const mockToggleTodo = vi.fn();

// Mock the RTK Query hooks
vi.mock('@/features/todo/todoApi', () => ({
  useGetTodosQuery: () => ({
    data: [],
    isLoading: false,
    isError: false,
    error: null
  }),
  useAddTodoMutation: () => [mockAddTodo, { isLoading: false }],
  useDeleteTodoMutation: () => [mockDeleteTodo],
  useToggleTodoMutation: () => [mockToggleTodo],
  todoApi: {
    reducer: (state = {}) => state,
    reducerPath: 'todoApi',
    middleware: () => (next) => (action) => next(action)
  }
}));

// Mock other components
vi.mock('@/components/shared/Navbar', () => ({
  default: () => <div data-testid="navbar">Navbar</div>
}));

vi.mock('@/components/home/TodoList', () => ({
  default: ({ todos }) => (
    <div data-testid="todo-list">
      {todos.map((todo, index) => (
        <div key={index}>{todo.title}</div>
      ))}
    </div>
  )
}));

// Mock window.alert
Object.defineProperty(window, 'alert', {
  writable: true,
  value: vi.fn(),
});

describe("Home component", () => {
  let store;

  beforeEach(() => {
    // Create a fresh store for each test
    store = configureStore({
      reducer: {
        [authApi.reducerPath]: authApi.reducer,
        todoApi: (state = {}) => state, // Mock reducer
        auth: authReducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(authApi.middleware),
    });

    // Clear all mocks
    vi.clearAllMocks();
  });

  it("should call addTodo when form is submitted with valid input", async () => {
    // Create a proper mock that returns a promise with unwrap method
    const mockUnwrap = vi.fn().mockResolvedValue({});
    mockAddTodo.mockReturnValue({
      unwrap: mockUnwrap
    });

    render(
      <Provider store={store}>
        <Home />
      </Provider>
    );
    
    const input = screen.getByPlaceholderText("Todo title");
    const descInput = screen.getByPlaceholderText("Todo description");
    const submitButton = screen.getByText("Add Todo");

    fireEvent.change(input, { target: { value: "New Todo Item" } });
    fireEvent.change(descInput, { target: { value: "Todo description" } });
    fireEvent.click(submitButton);

    // Wait for the API call
    await waitFor(() => {
      expect(mockAddTodo).toHaveBeenCalledWith({
        title: "New Todo Item",
        description: "Todo description"
      });
    });

    // Wait for unwrap to be called
    await waitFor(() => {
      expect(mockUnwrap).toHaveBeenCalled();
    });

    // Now check that inputs are cleared after the async operation completes
    await waitFor(() => {
      expect(input.value).toBe('');
      expect(descInput.value).toBe('');
    });
  });

  it("should show alert when input is empty", async () => {
    render(
      <Provider store={store}>
        <Home />
      </Provider>
    );
    
    const input = screen.getByPlaceholderText("Todo title");
    const submitButton = screen.getByText("Add Todo");

    fireEvent.change(input, { target: { value: "" } });
    fireEvent.click(submitButton);

    expect(window.alert).toHaveBeenCalledWith('Title is required');
    expect(mockAddTodo).not.toHaveBeenCalled();
  });

  it("should not submit when input contains only whitespace", async () => {
    render(
      <Provider store={store}>
        <Home />
      </Provider>
    );
    
    const input = screen.getByPlaceholderText("Todo title");
    const submitButton = screen.getByText("Add Todo");

    fireEvent.change(input, { target: { value: "   " } });
    fireEvent.click(submitButton);

    expect(window.alert).toHaveBeenCalledWith('Title is required');
    expect(mockAddTodo).not.toHaveBeenCalled();
  });
});