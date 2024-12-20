'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Store } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/services/auth-service';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const formSchema = z.object({
  email: z.string().email({
    message: 'Veuillez entrer une adresse email valide.',
  }),
  password: z.string().min(6, {
    message: 'Le mot de passe doit contenir au moins 6 caractères.',
  }),
});

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      const response = await AuthService.login(values);
      router.push('/dashboard');
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      form.setError('root', {
        message: 'Email ou mot de passe incorrect.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Store className="mx-auto h-12 w-12 text-primary" />
        <h2 className="mt-6 text-3xl font-bold">Quincaillerie Manager</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Connectez-vous à votre compte
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="admin@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mot de passe</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Connexion...' : 'Se connecter'}
          </Button>

          {form.formState.errors.root && (
            <p className="text-sm text-destructive text-center">
              {form.formState.errors.root.message}
            </p>
          )}
        </form>
      </Form>
    </div>
  );
}
