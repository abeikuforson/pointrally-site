import { AuthProvider, AuthTokens } from '@/types/auth.types';
import { createClient } from '@/lib/supabase/client';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { Database } from '@/types/supabase.types';

interface SupabaseAuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  metadata?: {
    creationTime?: string;
    lastSignInTime?: string;
  };
}

type ProfilesInsert = Database['public']['Tables']['profiles']['Insert'];
type ProfilesUpdate = Database['public']['Tables']['profiles']['Update'];

export class SupabaseAuthService {
  private supabase = createClient();

  async signInWithEmailPassword(
    email: string,
    password: string
  ): Promise<{ user: SupabaseAuthUser; tokens: AuthTokens }> {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.user || !data.session) {
      throw new Error('Login failed');
    }

    return {
      user: this.mapSupabaseUser(data.user),
      tokens: {
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
        expiresIn: data.session.expires_in || 3600
      }
    };
  }

  async createUserWithEmailPassword(
    email: string,
    password: string,
    displayName: string
  ): Promise<{ user: SupabaseAuthUser; tokens: AuthTokens }> {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName
        }
      }
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.user || !data.session) {
      throw new Error('Signup failed');
    }

    // Profile creation is handled by database trigger on user signup
    // We can optionally update the profile with display name here
    const { error: profileError } = await (this.supabase
      .from('profiles') as any)
      .upsert({
        id: data.user.id,
        display_name: displayName,
        total_points: 0,
        tier: 'bronze'
      });

    if (profileError) {
      console.error('Profile creation error:', profileError);
    }

    return {
      user: this.mapSupabaseUser(data.user),
      tokens: {
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
        expiresIn: data.session.expires_in || 3600
      }
    };
  }

  async signInWithProvider(
    provider: AuthProvider
  ): Promise<{ user: SupabaseAuthUser; tokens: AuthTokens }> {
    const { data, error } = await this.supabase.auth.signInWithOAuth({
      provider: provider as 'google' | 'apple',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`
      }
    });

    if (error) {
      throw new Error(error.message);
    }

    // OAuth flow will redirect, so we return a temporary response
    // The actual user data will be available after redirect
    return {
      user: {
        uid: 'pending',
        email: null,
        displayName: null,
        photoURL: null,
        emailVerified: false
      },
      tokens: {
        accessToken: 'pending',
        refreshToken: 'pending',
        expiresIn: 0
      }
    };
  }

  async signOut(): Promise<void> {
    const { error } = await this.supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
  }

  async refreshTokens(): Promise<AuthTokens | null> {
    const { data, error } = await this.supabase.auth.refreshSession();

    if (error || !data.session) {
      return null;
    }

    return {
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      expiresIn: data.session.expires_in || 3600
    };
  }

  async getCurrentUser(): Promise<SupabaseAuthUser | null> {
    const { data: { user } } = await this.supabase.auth.getUser();

    if (!user) {
      return null;
    }

    return this.mapSupabaseUser(user);
  }

  async updateProfile(updates: Partial<SupabaseAuthUser>): Promise<SupabaseAuthUser> {
    const { data: { user }, error } = await this.supabase.auth.updateUser({
      data: {
        display_name: updates.displayName,
        avatar_url: updates.photoURL
      }
    });

    if (error || !user) {
      throw new Error(error?.message || 'Profile update failed');
    }

    // Update profile in profiles table
    if (user.id) {
      await (this.supabase
        .from('profiles') as any)
        .update({
          display_name: updates.displayName || undefined,
          avatar_url: updates.photoURL || undefined
        })
        .eq('id', user.id);
    }

    return this.mapSupabaseUser(user);
  }

  async sendPasswordResetEmail(email: string): Promise<void> {
    const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`
    });

    if (error) {
      throw new Error(error.message);
    }
  }

  async sendEmailVerification(): Promise<void> {
    // Supabase handles email verification automatically on signup
    // This method is kept for compatibility
    console.log('Email verification handled by Supabase');
  }

  onAuthStateChanged(callback: (user: SupabaseAuthUser | null) => void): () => void {
    const { data: { subscription } } = this.supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        callback(this.mapSupabaseUser(session.user));
      } else {
        callback(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }

  private mapSupabaseUser(user: SupabaseUser): SupabaseAuthUser {
    return {
      uid: user.id,
      email: user.email || null,
      displayName: user.user_metadata?.display_name || user.user_metadata?.full_name || null,
      photoURL: user.user_metadata?.avatar_url || null,
      emailVerified: !!user.email_confirmed_at,
      metadata: {
        creationTime: user.created_at,
        lastSignInTime: user.last_sign_in_at
      }
    };
  }
}