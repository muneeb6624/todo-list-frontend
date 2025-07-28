import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import "./tailwind.output.css";import App from './App.jsx'
import { Provider } from 'react-redux'
import { store } from './app/store.js'
import { PostHogProvider } from 'posthog-js/react'
import { Routes, Route, BrowserRouter,  } from "react-router-dom";
import Login from './pages/Login.jsx'
import './index.css'
import App from './App.jsx'
import { Test } from './pages/Test.jsx'
import Register from './pages/Register.jsx'
import { Home } from './pages/Home.jsx'
import UploadImage from "./on-boarding/UploadImage.jsx";


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PostHogProvider
      apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY}
      options={{
        api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
        defaults: '2025-05-24',
        capture_exceptions: true,
        debug: import.meta.env.MODE === 'development',
      }}
    >
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
             <Route path="/" element={<App />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/test" element= { <Test /> } />
            <Route path="/home" element={<Home />} />
            <Route path="/upload-image" element={<UploadImage />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </PostHogProvider>
  </StrictMode>,
)