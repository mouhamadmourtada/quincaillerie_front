'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/services/auth-service';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import type { User } from '@/types/auth';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const currentUser = await AuthService.getCurrentUser();
        if (!currentUser) {
          localStorage.removeItem('token');
          router.push('/login');
          return;
        }

        setUser(currentUser);
      } catch (error) {
        console.error('Error checking auth:', error);
        localStorage.removeItem('token');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading || !user) {
    return null;
  }

  return (
    <div className="relative min-h-screen">
      <Sidebar className="fixed left-0 top-0 z-30 hidden h-screen border-r bg-background lg:block lg:w-64" />
      <main className="flex-1 lg:pl-64">
        <Header />
        <div className="container mx-auto h-full p-4">{children}</div>
      </main>
    </div>
  );
}