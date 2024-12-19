import { LoginCredentials, AuthResponse } from '@/types/auth';

// Simuler une base de données d'utilisateurs
const MOCK_USER = {
  id: '1',
  email: 'admin@example.com',
  name: 'Admin User',
  role: 'admin' as const,
  password: 'passer', // Ne jamais stocker les mots de passe en clair en production !
};

// Simuler un délai d'API
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const AuthService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    await delay(1000);

    if (
      credentials.email === MOCK_USER.email &&
      credentials.password === MOCK_USER.password
    ) {
      return {
        user: {
          id: MOCK_USER.id,
          email: MOCK_USER.email,
          name: MOCK_USER.name,
          role: MOCK_USER.role,
        },
        token: 'mock_jwt_token',
      };
    }

    throw new Error('Invalid credentials');
  },

  async logout(): Promise<void> {
    await delay(500);
    // Simuler la déconnexion
  },

  async getCurrentUser(): Promise<AuthResponse['user'] | null> {
    await delay(500);
    // Simuler la récupération de l'utilisateur connecté
    return {
      id: MOCK_USER.id,
      email: MOCK_USER.email,
      name: MOCK_USER.name,
      role: MOCK_USER.role,
    };
  },
};
