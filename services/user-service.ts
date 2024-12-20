import { API_URL, getAuthHeader } from '@/lib/config';
import { User, CreateUserData, UpdateUserData, ResetPasswordDto } from '@/types/user';

export class UserService {
  static async getUsers(): Promise<User[]> {
    const response = await fetch(`${API_URL}/users`, {
      headers: getAuthHeader(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    return response.json();
  }

  static async getUser(id: string): Promise<User> {
    const response = await fetch(`${API_URL}/users/${id}`, {
      headers: getAuthHeader(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    return response.json();
  }

  static async createUser(data: CreateUserData): Promise<User> {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    return response.json();
  }

  static async updateUser(id: string, data: UpdateUserData): Promise<User> {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'PUT',
      headers: getAuthHeader(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    return response.json();
  }

  static async deleteUser(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }
  }

  static async resetPassword(id: string, data: ResetPasswordDto): Promise<void> {
    const response = await fetch(`${API_URL}/users/${id}/reset-password`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }
  }
}

// Export des fonctions individuelles pour la compatibilité
export const getUsers = UserService.getUsers;
export const getUser = UserService.getUser;
