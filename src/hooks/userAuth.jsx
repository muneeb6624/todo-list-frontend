// client/src/hooks/userAuth.jsx
import { useState, useEffect } from 'react';
import { useRegisterUserMutation, useLoginUserMutation } from '../features/auth/authApi';
import { setCredentials, logout } from '../features/auth/authSlice';
import { useSelector } from 'react-redux';

const useUserAuth = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const { data: userData, error, isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userData && userData.user && userData.token) {
      setUser(userData.user);
      setToken(userData.token);
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [userData]);

  const handleLogout = async () => {
    try {
      // Call API to logout user (if needed)
      // await logoutUserMutation();
      logout();
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return { user, token, isLoggedIn, handleLogout };
};

export default useUserAuth;