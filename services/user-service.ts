import { User } from '@/types/auth';

// Simulation d'une base de données
let users: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin',
    status: 'active',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'user',
    status: 'active',
  },
];

export class UserService {
  static async getUsers(): Promise<User[]> {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 500));
    return users;
  }

  static async createUser(userData: Omit<User, 'id'>): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newUser = {
      ...userData,
      id: Math.random().toString(36).substring(7),
    };
    users.push(newUser);
    return newUser;
  }

  static async updateUser(id: string, userData: Partial<User>): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = users.findIndex(user => user.id === id);
    if (index === -1) {
      throw new Error('Utilisateur non trouvé');
    }
    users[index] = { ...users[index], ...userData };
    return users[index];
  }

  static async deleteUser(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = users.findIndex(user => user.id === id);
    if (index === -1) {
      throw new Error('Utilisateur non trouvé');
    }
    users = users.filter(user => user.id !== id);
  }
}
