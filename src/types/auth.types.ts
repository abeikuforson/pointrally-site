export interface User {
  id: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  metadata: UserMetadata;
}

export interface UserMetadata {
  totalPoints: number;
  connectedTeams: string[];
  favoriteTeam?: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  joinDate: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials extends LoginCredentials {
  displayName: string;
  agreeToTerms: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export type AuthProvider = 'google' | 'apple' | 'email';

export interface AuthError {
  code: string;
  message: string;
  details?: unknown;
}