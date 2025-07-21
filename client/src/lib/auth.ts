import { apiRequest } from "./queryClient";

export interface User {
  id: number;
  name: string;
  email: string;
  country: string;
  profilePicture?: string;
  isAdmin: boolean;
  isVerified: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
}

class AuthService {
  private token: string | null = null;
  private user: User | null = null;

  constructor() {
    // Load token and user from localStorage on initialization
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      this.user = userData ? JSON.parse(userData) : null;
    }
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await apiRequest('POST', '/api/auth/login', { email, password });
    const data = await response.json();
    
    this.setAuth(data.token, data.user);
    return data;
  }

  async register(userData: { name: string; email: string; password: string; country: string }): Promise<{ message: string; email: string }> {
    const response = await apiRequest('POST', '/api/auth/register', userData);
    return await response.json();
  }

  async verifyEmail(email: string, code: string): Promise<{ message: string }> {
    const response = await apiRequest('POST', '/api/auth/verify-email', { email, code });
    return await response.json();
  }

  async resendCode(email: string): Promise<{ message: string }> {
    const response = await apiRequest('POST', '/api/auth/resend-code', { email });
    return await response.json();
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await apiRequest('POST', '/api/auth/forgot-password', { email });
    return await response.json();
  }

  async resetPassword(email: string, code: string, newPassword: string): Promise<{ message: string }> {
    const response = await apiRequest('POST', '/api/auth/reset-password', { email, code, newPassword });
    return await response.json();
  }

  private setAuth(token: string, user: User) {
    this.token = token;
    this.user = user;
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    }
  }

  logout() {
    this.token = null;
    this.user = null;
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }

  getToken(): string | null {
    return this.token;
  }

  getUser(): User | null {
    return this.user;
  }

  isAuthenticated(): boolean {
    return !!this.token && !!this.user;
  }

  isAdmin(): boolean {
    return this.user?.isAdmin || false;
  }

  updateUser(userData: Partial<User>) {
    if (this.user) {
      this.user = { ...this.user, ...userData };
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(this.user));
      }
    }
  }
}

export const authService = new AuthService();

// Helper function to get auth headers
export function getAuthHeaders(): Record<string, string> {
  const token = authService.getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}
