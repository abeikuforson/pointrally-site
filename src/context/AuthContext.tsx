'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { useAuthViewModel } from '@/viewmodels/AuthViewModel';
import { AuthState, LoginCredentials, SignupCredentials, AuthProvider } from '@/types/auth.types';

interface AuthContextType {
  authState: AuthState;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  signInWithProvider: (provider: AuthProvider) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    authState,
    login,
    signup,
    signInWithProvider,
    logout,
    refreshSession,
    clearError
  } = useAuthViewModel();

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  return (
    <AuthContext.Provider
      value={{
        authState,
        login,
        signup,
        signInWithProvider,
        logout,
        refreshSession,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthContextProvider');
  }
  return context;
};