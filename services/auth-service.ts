import { API_URL } from '@/lib/config';
import type { User } from '@/types/auth';

interface AuthResponse {
    user: User;
    token: string;
}

interface ChangePasswordDto {
    currentPassword: string;
    newPassword: string;
}

function getAuthHeader() {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
    };
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
            throw new Error(error.message || 'Failed to login');
        }

        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        return data;
    },

    async getCurrentUser(): Promise<User | null> {
        const userStr = localStorage.getItem('user');
        if (!userStr) return null;

        try {
            const response = await fetch(`${API_URL}/auth/me`, {
                headers: getAuthHeader(),
            });

            if (!response.ok) {
                throw new Error('Failed to get current user');
            }

            const user = await response.json();
            localStorage.setItem('user', JSON.stringify(user));
            return user;
        } catch (error) {
            console.error('Error getting current user:', error);
            return null;
        }
    },

    async logout(): Promise<void> {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    async changePassword(data: ChangePasswordDto): Promise<void> {
        const response = await fetch(`${API_URL}/auth/change-password`, {
            method: 'POST',
            headers: getAuthHeader(),
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to change password');
        }
    }
};
