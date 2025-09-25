import { User } from '@/types/auth.types';

export class AuthCoordinator {
  private redirectAfterLogin = '/dashboard';
  private redirectAfterSignup = '/onboarding';
  private redirectAfterLogout = '/';

  async onLoginSuccess(user: User): Promise<void> {
    console.log('Login successful for user:', user.email);

    if (!user.emailVerified) {
      console.log('Email not verified, prompting verification');
    }

    if (user.metadata.connectedTeams.length === 0) {
      this.navigateTo('/teams/connect');
    } else {
      this.navigateTo(this.redirectAfterLogin);
    }

    this.trackLoginEvent(user);
  }

  async onSignupSuccess(user: User): Promise<void> {
    console.log('Signup successful for user:', user.email);

    this.navigateTo(this.redirectAfterSignup);
    this.trackSignupEvent(user);
    this.sendWelcomeEmail(user);
  }

  async onLoginFailure(error: Error): Promise<void> {
    console.error('Login failed:', error);

    if (error.message.includes('invalid-email')) {
      this.showNotification('Invalid email address');
    } else if (error.message.includes('wrong-password')) {
      this.showNotification('Incorrect password');
    } else if (error.message.includes('user-not-found')) {
      this.showNotification('No account found with this email');
    } else {
      this.showNotification('Login failed. Please try again.');
    }

    this.trackLoginFailureEvent(error);
  }

  async onSignupFailure(error: Error): Promise<void> {
    console.error('Signup failed:', error);

    if (error.message.includes('email-already-in-use')) {
      this.showNotification('An account already exists with this email');
    } else if (error.message.includes('weak-password')) {
      this.showNotification('Password should be at least 6 characters');
    } else {
      this.showNotification('Signup failed. Please try again.');
    }

    this.trackSignupFailureEvent(error);
  }

  async onLogout(): Promise<void> {
    console.log('User logged out');

    this.clearLocalStorage();
    this.navigateTo(this.redirectAfterLogout);
    this.trackLogoutEvent();
  }

  async onSessionExpired(): Promise<void> {
    console.log('Session expired');

    this.showNotification('Your session has expired. Please login again.');
    this.clearLocalStorage();
    this.navigateTo('/auth/login?session=expired');
  }

  setRedirectAfterLogin(path: string): void {
    this.redirectAfterLogin = path;
  }

  setRedirectAfterSignup(path: string): void {
    this.redirectAfterSignup = path;
  }

  setRedirectAfterLogout(path: string): void {
    this.redirectAfterLogout = path;
  }

  private navigateTo(path: string): void {
    if (typeof window !== 'undefined') {
      window.location.href = path;
    }
  }

  private showNotification(message: string): void {
    if (typeof window !== 'undefined') {
      console.log('Notification:', message);
    }
  }

  private clearLocalStorage(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_data');
      sessionStorage.clear();
    }
  }

  private trackLoginEvent(user: User): void {
    console.log('Analytics: Login event', {
      userId: user.id,
      email: user.email,
      timestamp: new Date().toISOString()
    });
  }

  private trackSignupEvent(user: User): void {
    console.log('Analytics: Signup event', {
      userId: user.id,
      email: user.email,
      timestamp: new Date().toISOString()
    });
  }

  private trackLogoutEvent(): void {
    console.log('Analytics: Logout event', {
      timestamp: new Date().toISOString()
    });
  }

  private trackLoginFailureEvent(error: Error): void {
    console.log('Analytics: Login failure', {
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }

  private trackSignupFailureEvent(error: Error): void {
    console.log('Analytics: Signup failure', {
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }

  private sendWelcomeEmail(user: User): void {
    console.log(`Welcome email queued for ${user.email}`);
  }
}