import { API_URL } from '@/lib/config';

export interface AuthResponse {
    id: string;
    username: string;
    email: string;
    role: string;
    token: string;
}

export const AuthService = {
  async login(credentials: { email: string, password: string }): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
    }

    const data = await response.json();
    localStorage.setItem('token', data.token);
    // Stocker les informations de l'utilisateur
    localStorage.setItem('user', JSON.stringify(data));
    return data;
  },

  async getCurrentUser(): Promise<AuthResponse | null> {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;

    try {
        return JSON.parse(userStr);
    } catch {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        return null;
    }
  },

  async logout(): Promise<void> {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};
