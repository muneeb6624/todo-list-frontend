import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import todoApi from './todoApi';

const initialState = {
  todos: [],
  status: 'idle',
  error: null,
};

export const fetchTodos = createAsyncThunk('todos/fetchTodos', async () => {
  const response = await todoApi.getTodos();
  return response.data;
});

export const addTodo = createAsyncThunk('todos/addTodo', async (newTodo) => {
  const response = await todoApi.addTodo(newTodo);
  return response.data;
});

export const deleteTodo = createAsyncThunk('todos/deleteTodo', async (id) => {
  await todoApi.deleteTodo(id);
  return id;
});

export const toggleCompleted = createAsyncThunk('todos/toggleCompleted', async (id) => {
  const response = await todoApi.toggleCompleted(id);
  return response.data;
});

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.todos = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addTodo.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addTodo.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.todos.push(action.payload);
      })
      .addCase(addTodo.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(deleteTodo.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.todos = state.todos.filter((todo) => todo.id !== action.payload);
      })
      .addCase(deleteTodo.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(toggleCompleted.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(toggleCompleted.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.todos.findIndex((todo) => todo.id === action.payload.id);
        state.todos[index] = action.payload;
      })
      .addCase(toggleCompleted.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default todoSlice.reducer;
export const { selectAll: selectTodos, selectById: selectTodoById } = todoSlice.getSelectors(
  (state) => state.todos
);