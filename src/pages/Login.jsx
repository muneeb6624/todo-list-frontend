/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import posthog from 'posthog-js';
import LampContainer from '../components/ui/lamp-effect';
import { motion } from 'motion/react';
import { useLoginUserMutation } from '../features/auth/authApi';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../features/auth/authSlice';
import { Input } from "@/components/ui/input";


function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [userName, setuserName] = useState('');
  const [password, setPassword] = useState('');
  const [showError, setShowError] = useState(false);

  const [loginUser, { isLoading }] = useLoginUserMutation();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const userData = {
        email: userName,
        password,
      };

      const res = await loginUser(userData).unwrap();
      dispatch(setCredentials(res)); // This stores your JWT token in Redux
      posthog.identify(res.user._id, { username: res.user.name });
      posthog.capture('user_logged_in', { username: res.user.name });

      localStorage.setItem('token', res.token); // Store token in localStorage

      navigate('/home');
    } catch (err) {
      console.error('Login error:', err);
      setShowError(true);
    }
  };

  return (
    <div className="min-h-screen flex md:flex-row flex-col items-center bg-slate-950 justify-center">
      <LampContainer className="w-full md:w-1/2">
        <div className="mt-4">
          <motion.h1
            initial={{ opacity: 0.5, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.3,
              duration: 0.8,
              ease: 'easeInOut',
            }}
            className="bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight text-transparent"
          >
            Login to <br /> MyTaskBuddy
          </motion.h1>
        </div>
      </LampContainer>

      <div className="w-full md:w-1/2 flex justify-center items-center p-4">
        <form 
          onSubmit={handleSubmit} 
          className="w-full max-w-md p-6 bg-gray-800 bg-opacity-90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-700"
        >
          <div className="mb-4">
            <label className="block mb-2 text-lg text-white font-semibold" htmlFor="username">
              Email
            </label>
            <Input
              className="w-full px-4 py-3 border border-gray-600 bg-gray-700 text-white rounded-md outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
              type="email"
              id="username"
              value={userName}
              onChange={(e) => setuserName(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-lg text-white font-semibold" htmlFor="password">
              Password
            </label>
            <Input
              className="w-full px-4 py-3 border border-gray-600 bg-gray-700 text-white rounded-md outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          {showError && (
            <div className="mb-4 p-3 bg-red-900 bg-opacity-50 border border-red-600 rounded-md">
              <p className="text-red-300 text-sm font-medium">Login failed. Please check your credentials.</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>

          <p className="mt-4 text-center text-gray-300">
            Don't have an account?{' '}
            {/* <a href="/register" className="underline text-blue-400 hover:text-blue-300">
              Sign up
            </a> */}

            <Link to="/register" className="underline text-blue-400 hover:text-blue-300">
              <i>Sign up </i>
            </Link>

          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;