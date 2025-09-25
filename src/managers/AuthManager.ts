import { SupabaseAuthService } from '@/services/SupabaseAuthService';
import { AuthCoordinator } from '@/coordinators/AuthCoordinator';
import {
  User,
  LoginCredentials,
  SignupCredentials,
  AuthProvider,
  AuthTokens,
  UserMetadata
} from '@/types/auth.types';

export class AuthManager {
  private authService: SupabaseAuthService;
  private authCoordinator: AuthCoordinator;
  private currentUser: User | null = null;
  private tokens: AuthTokens | null = null;

  constructor() {
    this.authService = new SupabaseAuthService();
    this.authCoordinator = new AuthCoordinator();
  }

  async signIn(credentials: LoginCredentials): Promise<User> {
    try {
      const { user, tokens } = await this.authService.signInWithEmailPassword(
        credentials.email,
        credentials.password
      );

      this.currentUser = this.mapFirebaseUserToUser(user);
      this.tokens = tokens;

      await this.authCoordinator.onLoginSuccess(this.currentUser);

      return this.currentUser;
    } catch (error) {
      await this.authCoordinator.onLoginFailure(error as Error);
      throw error;
    }
  }

  async signUp(credentials: SignupCredentials): Promise<User> {
    if (!credentials.agreeToTerms) {
      throw new Error('You must agree to the terms and conditions');
    }

    try {
      const { user, tokens } = await this.authService.createUserWithEmailPassword(
        credentials.email,
        credentials.password,
        credentials.displayName
      );

      this.currentUser = this.mapFirebaseUserToUser(user);
      this.tokens = tokens;

      await this.authCoordinator.onSignupSuccess(this.currentUser);

      return this.currentUser;
    } catch (error) {
      await this.authCoordinator.onSignupFailure(error as Error);
      throw error;
    }
  }

  async signInWithProvider(provider: AuthProvider): Promise<User> {
    try {
      const { user, tokens } = await this.authService.signInWithProvider(provider);

      this.currentUser = this.mapFirebaseUserToUser(user);
      this.tokens = tokens;

      await this.authCoordinator.onLoginSuccess(this.currentUser);

      return this.currentUser;
    } catch (error) {
      await this.authCoordinator.onLoginFailure(error as Error);
      throw error;
    }
  }

  async signOut(): Promise<void> {
    try {
      await this.authService.signOut();
      this.currentUser = null;
      this.tokens = null;
      await this.authCoordinator.onLogout();
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  async refreshSession(): Promise<User | null> {
    try {
      const refreshedTokens = await this.authService.refreshTokens();

      if (refreshedTokens) {
        this.tokens = refreshedTokens;
        const currentFirebaseUser = await this.authService.getCurrentUser();

        if (currentFirebaseUser) {
          this.currentUser = this.mapFirebaseUserToUser(currentFirebaseUser);
          return this.currentUser;
        }
      }

      return null;
    } catch (error) {
      console.error('Session refresh error:', error);
      this.currentUser = null;
      this.tokens = null;
      return null;
    }
  }

  async updateProfile(updates: Partial<User>): Promise<User> {
    if (!this.currentUser) {
      throw new Error('No user is currently signed in');
    }

    try {
      const firebaseUpdates = {
        displayName: updates.displayName,
        photoURL: updates.photoURL,
        email: updates.email
      };
      const updatedFirebaseUser = await this.authService.updateProfile(firebaseUpdates);
      this.currentUser = this.mapFirebaseUserToUser(updatedFirebaseUser);
      return this.currentUser;
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  }

  async sendPasswordResetEmail(email: string): Promise<void> {
    await this.authService.sendPasswordResetEmail(email);
  }

  async verifyEmail(): Promise<void> {
    await this.authService.sendEmailVerification();
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  getAccessToken(): string | null {
    return this.tokens?.accessToken || null;
  }

  isAuthenticated(): boolean {
    return !!this.currentUser && !!this.tokens;
  }

  private mapFirebaseUserToUser(supabaseUser: {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    emailVerified: boolean;
    metadata?: {
      creationTime?: string;
      lastSignInTime?: string;
    };
  }): User {
    const metadata: UserMetadata = {
      totalPoints: 0,
      connectedTeams: [],
      tier: 'bronze',
      joinDate: supabaseUser.metadata?.creationTime
        ? new Date(supabaseUser.metadata.creationTime)
        : new Date()
    };

    return {
      id: supabaseUser.uid,
      email: supabaseUser.email || '',
      displayName: supabaseUser.displayName,
      photoURL: supabaseUser.photoURL,
      emailVerified: supabaseUser.emailVerified || false,
      createdAt: supabaseUser.metadata?.creationTime
        ? new Date(supabaseUser.metadata.creationTime)
        : new Date(),
      updatedAt: supabaseUser.metadata?.lastSignInTime
        ? new Date(supabaseUser.metadata.lastSignInTime)
        : new Date(),
      metadata
    };
  }
}