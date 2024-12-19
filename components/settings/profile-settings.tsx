'use client';

import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { AuthService } from '@/services/auth-service';
import { useToast } from '@/hooks/use-toast';
import type { User } from '@/types/auth';

const profileFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: 'Le nom doit contenir au moins 2 caractères.',
    })
    .max(30, {
      message: 'Le nom ne doit pas dépasser 30 caractères.',
    }),
  email: z
    .string({
      required_error: 'Veuillez entrer une adresse email.',
    })
    .email(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileSettings() {
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: '',
      email: '',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await AuthService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          form.reset({
            name: currentUser.name,
            email: currentUser.email,
          });
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        toast({
          variant: 'destructive',
          title: 'Erreur',
          description: 'Impossible de récupérer les informations du profil.',
        });
      }
    };

    fetchUser();
  }, [form, toast]);

  async function onSubmit(data: ProfileFormValues) {
    try {
      // Simuler la mise à jour du profil
      toast({
        title: 'Succès',
        description: 'Votre profil a été mis à jour.',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de mettre à jour le profil.',
      });
    }
  }

  if (!user) {
    return null;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom</FormLabel>
              <FormControl>
                <Input placeholder="Votre nom" {...field} />
              </FormControl>
              <FormDescription>
                C&apos;est le nom qui sera affiché sur votre profil.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Votre email" {...field} />
              </FormControl>
              <FormDescription>
                Votre adresse email pour la connexion.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Mettre à jour le profil</Button>
      </form>
    </Form>
  );
}