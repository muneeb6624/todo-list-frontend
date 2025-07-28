import React from 'react'
import { BackgroundBeams } from './components/ui/background-beams'
import { useNavigate } from 'react-router-dom'
import './index.css';

const App = () => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate('/login')
  }

  return (
    <div className="h-screen bg-gray-700 flex items-center justify-center">
      <div className="flex flex-col items-center justify-center text-white p-5 rounded-lg">
        <h1 className="text-center text-8xl font-bold font-sans text-shadow-white">
          <span className="animate-pulse">T</span>
          <span className="animate-pulse delay-100">o</span>
          <span className="animate-pulse delay-200">d</span>
          <span className="animate-pulse delay-300">o</span>
          <span className="animate-pulse delay-400"> </span>
          <span className="animate-pulse delay-500">L</span>
          <span className="animate-pulse delay-600">i</span>
          <span className="animate-pulse delay-700">s</span>
          <span className="animate-pulse delay-800">t</span>
        </h1>
        <p className="mt-2"> <i> Your Task Buddy | Manage your tasks with ease! </i> </p>
        <button
          className="mt-7 px-6 py-2 bg-[#150F4C] hover:bg-[#100C33] cursor-pointer transform hover:scale-105 transition-all duration-300 z-10 text-white rounded-lg"
          onClick={handleClick}
        >
          Get Started
        </button>
      </div>
      <BackgroundBeams />
    </div>
  )
}

export default App
