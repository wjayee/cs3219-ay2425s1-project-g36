import React, { createContext, useContext, useEffect, useState } from 'react';

/** TODO: add username, email if required */
// authentication state
interface AuthState {
  isLoggedIn: boolean; // whether a user is logged in.
  isAdmin: boolean; // whether a user is an admin.
}

// the default authentication state.
const DEFAULT_AUTH_STATE = {
  isLoggedIn: false,
  isAdmin: false,
}

interface AuthContextType {
  auth: AuthState; // current authentication state (logged in? admin?)
  login: (isAdmin?: boolean) => void; // function for login
  logout: () => void; // function for logout
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


// Function to load auth state from localStorage
const loadAuthState = (): AuthState => {
  const storedAuth = localStorage.getItem('authState');
  return storedAuth ? JSON.parse(storedAuth) : DEFAULT_AUTH_STATE;
};

// Function to save auth state to localStorage
const saveAuthState = (auth: AuthState) => {
  localStorage.setItem('authState', JSON.stringify(auth));
};

export const AuthProvider = ({ children } : { children: React.ReactNode }) => {
  const [auth, setAuth] = useState<AuthState>(loadAuthState);

  const login = (isAdmin: boolean = false) => {
    const newAuthState = { isLoggedIn: true, isAdmin };

    setAuth(newAuthState);
    saveAuthState(newAuthState);
  };

  const logout = () => {
    const newAuthState = DEFAULT_AUTH_STATE;

    setAuth(newAuthState);
    saveAuthState(newAuthState);
  };

  // Effect to sync auth state changes to localStorage
  useEffect(() => {
    saveAuthState(auth);
  }, [auth]);

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      { children }
    </AuthContext.Provider> 
  )
};

// Custom hook to use authentication context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};