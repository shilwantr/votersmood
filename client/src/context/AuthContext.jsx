import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/client';
import { auth, googleProvider, signInWithPopup } from '../firebase';

const AuthContext = createContext({
  user: null,
  userProfile: null,
  isAdmin: false,
  loading: true,
  login: async () => {},
  signup: async () => {},
  loginWithGoogle: async () => {},
  updateUserAvatar: async () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const savedToken = localStorage.getItem('janmat_token');
      if (savedToken) {
        try {
          // Verify saved session with Firebase DB via backend server
          const data = await api.getMe();
          if (data && data.user) {
            setUser(data.user);
            setUserProfile(data.user);
            setIsAdmin(data.user.isAdmin === true);
          }
        } catch (e) {
          console.warn('Session verification failed, clearing tokens:', e);
          localStorage.removeItem('janmat_token');
          localStorage.removeItem('janmat_user');
          setUser(null);
          setUserProfile(null);
          setIsAdmin(false);
        }
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.login({ email, password });
      if (res && res.token && res.user) {
        localStorage.setItem('janmat_token', res.token);
        localStorage.setItem('janmat_user', JSON.stringify(res.user));
        setUser(res.user);
        setUserProfile(res.user);
        setIsAdmin(res.user.isAdmin === true);
        return res.user;
      }
    } catch (error) {
      console.error('API Login error:', error);
      throw error;
    }
  };

  const signup = async (name, email, password, state, constituency, isRegistered) => {
    try {
      const res = await api.signup({
        name,
        email,
        password,
        state: state || 'MH',
        constituency: constituency || 'Mumbai South',
        isRegisteredVoter: isRegistered !== false
      });

      if (res && res.token && res.user) {
        localStorage.setItem('janmat_token', res.token);
        localStorage.setItem('janmat_user', JSON.stringify(res.user));
        setUser(res.user);
        setUserProfile(res.user);
        setIsAdmin(res.user.isAdmin === true);
        return res.user;
      }
    } catch (error) {
      console.error('API Signup error:', error);
      throw error;
    }
  };

  const loginWithGoogle = async (state = 'MH', constituency = 'Mumbai South') => {
    try {
      // Trigger Google popup window to select logged in Gmail account
      const result = await signInWithPopup(auth, googleProvider);
      const googleUser = result.user;
      
      const email = googleUser.email;
      const name = googleUser.displayName || email.split('@')[0];
      const password = `google_oauth_${googleUser.uid.substring(0, 10)}`;

      let res;
      try {
        // Attempt login if Google user already registered
        res = await api.login({ email, password });
      } catch (loginErr) {
        // Otherwise register new profile with Google account details
        res = await api.signup({
          name,
          email,
          password,
          state,
          constituency,
          isRegisteredVoter: true
        });
      }

      if (res && res.token && res.user) {
        localStorage.setItem('janmat_token', res.token);
        localStorage.setItem('janmat_user', JSON.stringify(res.user));
        setUser(res.user);
        setUserProfile(res.user);
        setIsAdmin(res.user.isAdmin === true);
        return res.user;
      }
    } catch (error) {
      console.error('Google Sign In error:', error);
      throw error;
    }
  };

  const updateUserAvatar = async (avatarUrl, avatarStyle = 'avataaars') => {
    try {
      const res = await api.updateAvatar({ avatarUrl, avatarStyle });
      if (res && res.user) {
        setUser(res.user);
        setUserProfile(res.user);
        localStorage.setItem('janmat_user', JSON.stringify(res.user));
        return res.user;
      }
    } catch (error) {
      console.error('Update avatar error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('janmat_token');
    localStorage.removeItem('janmat_user');
    setUser(null);
    setUserProfile(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, userProfile, isAdmin, loading, login, signup, loginWithGoogle, updateUserAvatar, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
