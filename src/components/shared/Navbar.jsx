// client/src/components/shared/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import useUserAuth from '../../hooks/userAuth';
 
const Navbar = () => {
  const { user, isLoggedIn, handleLogout } = useUserAuth();

  return (
    <nav className="bg-blue-800 shadow-md py-4">
      <div className="container mx-auto flex justify-between">
        <Link to="/" className="text-2xl font-bold text-white">
          MyTaskBuddy
        </Link>
        <div className="flex items-center">
          {isLoggedIn ? (
            <div className="flex items-center">
              <span className="mr-4 text-white">{user.name}</span>
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center">
              <Link to="/login" className="text-white mr-4">
                Login
              </Link>
              <Link to="/register" className="text-white">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;