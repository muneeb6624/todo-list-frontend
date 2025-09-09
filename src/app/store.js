import { configureStore } from '@reduxjs/toolkit';
import { authApi } from '../features/auth/authApi';
import authReducer from '../features/auth/authSlice';
import { todoApi } from '../features/todo/todoApi';


/* ONLY FOR TESTING */
const loggerMiddleware = (storeAPI) => (next) => (action) => {
  const result = next(action);
  const state = storeAPI.getState();

  if (state.auth.error || state.todo?.error) {
    console.error('Redux Error:', state.auth.error || state.todo.error);
  }

  return result;
};

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [todoApi.reducerPath]: todoApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, todoApi.middleware, loggerMiddleware),
});