'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/services/auth-service';
import { LoginForm } from '@/components/auth/login-form';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const currentUser = await AuthService.getCurrentUser();
          if (currentUser) {
            router.push('/dashboard');
            return;
          }
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return null;
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-sm"
        style={{
          backgroundImage: 'url("https://th.bing.com/th/id/OIP.WJtxB_tncjRrOqNSCa96sAHaE7?w=300&h=200&c=7&r=0&o=5&dpr=1.3&pid=1.7")',
          opacity: '0.8',
        }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-md p-6">
        <div className="rounded-lg border bg-card text-card-foreground p-8 shadow-lg backdrop-blur-sm bg-white/80">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}