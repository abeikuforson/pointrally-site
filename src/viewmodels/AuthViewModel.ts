import { useState, useCallback, useMemo } from 'react';
import { AuthManager } from '@/managers/AuthManager';
import { AuthState, LoginCredentials, SignupCredentials, AuthProvider } from '@/types/auth.types';

export class AuthViewModel {
  private authManager: AuthManager;
  private setAuthState: React.Dispatch<React.SetStateAction<AuthState>>;

  constructor(
    authManager: AuthManager,
    setAuthState: React.Dispatch<React.SetStateAction<AuthState>>
  ) {
    this.authManager = authManager;
    this.setAuthState = setAuthState;
  }

  async login(credentials: LoginCredentials): Promise<void> {
    this.setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const user = await this.authManager.signIn(credentials);
      this.setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
    } catch (error) {
      this.setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Login failed'
      }));
      throw error;
    }
  }

  async signup(credentials: SignupCredentials): Promise<void> {
    this.setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const user = await this.authManager.signUp(credentials);
      this.setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
    } catch (error) {
      this.setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Signup failed'
      }));
      throw error;
    }
  }

  async signInWithProvider(provider: AuthProvider): Promise<void> {
    this.setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const user = await this.authManager.signInWithProvider(provider);
      this.setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
    } catch (error) {
      this.setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Provider sign-in failed'
      }));
      throw error;
    }
  }

  async logout(): Promise<void> {
    this.setAuthState(prev => ({ ...prev, isLoading: true }));

    try {
      await this.authManager.signOut();
      this.setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      });
    } catch (error) {
      this.setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Logout failed'
      }));
    }
  }

  async refreshSession(): Promise<void> {
    try {
      const user = await this.authManager.refreshSession();
      this.setAuthState(prev => ({
        ...prev,
        user,
        isAuthenticated: !!user
      }));
    } catch (error) {
      this.setAuthState(prev => ({
        ...prev,
        user: null,
        isAuthenticated: false,
        error: error instanceof Error ? error.message : 'Session refresh failed'
      }));
    }
  }

  clearError(): void {
    this.setAuthState(prev => ({ ...prev, error: null }));
  }
}

export const useAuthViewModel = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null
  });

  const authManager = useMemo(() => new AuthManager(), []);
  const viewModel = useMemo(() => new AuthViewModel(authManager, setAuthState), [authManager]);

  return {
    authState,
    login: useCallback((credentials: LoginCredentials) => viewModel.login(credentials), [viewModel]),
    signup: useCallback((credentials: SignupCredentials) => viewModel.signup(credentials), [viewModel]),
    signInWithProvider: useCallback((provider: AuthProvider) => viewModel.signInWithProvider(provider), [viewModel]),
    logout: useCallback(() => viewModel.logout(), [viewModel]),
    refreshSession: useCallback(() => viewModel.refreshSession(), [viewModel]),
    clearError: useCallback(() => viewModel.clearError(), [viewModel])
  };
};