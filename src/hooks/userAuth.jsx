// client/src/hooks/userAuth.jsx
import { useState, useEffect } from 'react';
import { useRegisterUserMutation, useLoginUserMutation } from '../features/auth/authApi';
import { setCredentials, logout } from '../features/auth/authSlice';
import { useSelector } from 'react-redux';

const useUserAuth = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState(null);

  const { data: userData, error: userDataError, isLoading } = useSelector((state) => state.auth);

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
      setError(error);
    }
  };

  if (userDataError) {
    setError(userDataError);
  }

  return { user, token, isLoggedIn, handleLogout, error };
};

export default useUserAuth;