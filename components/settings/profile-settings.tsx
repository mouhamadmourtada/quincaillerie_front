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
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

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
  birthDate: z.string().optional(),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  role: z.string().optional(),
  createdAt: z.string().optional(),
});

const passwordFormSchema = z.object({
  currentPassword: z.string().min(1, 'Le mot de passe actuel est requis'),
  newPassword: z.string()
    .min(6, 'Le nouveau mot de passe doit contenir au moins 6 caractères')
    .max(50, 'Le nouveau mot de passe ne doit pas dépasser 50 caractères'),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;
type PasswordFormValues = z.infer<typeof passwordFormSchema>;

export function ProfileSettings() {
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: '',
      email: '',
      birthDate: '',
      phoneNumber: '',
      address: '',
      city: '',
      country: '',
      role: '',
      createdAt: '',
    },
    mode: 'onChange',
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await AuthService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          profileForm.reset({
            name: currentUser.name,
            email: currentUser.email,
            birthDate: currentUser.birthDate || '',
            phoneNumber: currentUser.phoneNumber || '',
            address: currentUser.address || '',
            city: currentUser.city || '',
            country: currentUser.country || '',
            role: currentUser.role || '',
            createdAt: currentUser.createdAt ? format(new Date(currentUser.createdAt), 'dd MMMM yyyy', { locale: fr }) : '',
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
  }, [profileForm, toast]);

  async function onProfileSubmit(data: ProfileFormValues) {
    try {
      setIsLoading(true);
      // TODO: Implémenter la mise à jour du profil
      toast({
        title: 'Succès',
        description: 'Votre profil a été mis à jour.',
        variant: 'success'
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de mettre à jour le profil.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function onPasswordSubmit(data: PasswordFormValues) {
    try {
      setIsLoading(true);
      await AuthService.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      });
      
      toast({
        title: 'Succès',
        description: 'Votre mot de passe a été modifié.',
        variant: 'success'
      });
      
      passwordForm.reset();
    } catch (error) {
      console.error('Error changing password:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Impossible de modifier le mot de passe.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-8">
      <Form {...profileForm}>
        <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={profileForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input placeholder="Votre nom" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={profileForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="exemple@email.com" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={profileForm.control}
              name="birthDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date de naissance</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} readOnly />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={profileForm.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Téléphone</FormLabel>
                  <FormControl>
                    <Input placeholder="Votre numéro de téléphone" {...field} readOnly />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={profileForm.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresse</FormLabel>
                  <FormControl>
                    <Input placeholder="Votre adresse" {...field} readOnly />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={profileForm.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ville</FormLabel>
                  <FormControl>
                    <Input placeholder="Votre ville" {...field} readOnly />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={profileForm.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pays</FormLabel>
                  <FormControl>
                    <Input placeholder="Votre pays" {...field} readOnly />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={profileForm.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rôle</FormLabel>
                  <FormControl>
                    <Input {...field} readOnly />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={profileForm.control}
              name="createdAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date d'inscription</FormLabel>
                  <FormControl>
                    <Input {...field} readOnly />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" disabled={isLoading}>
            Mettre à jour le profil
          </Button>
        </form>
      </Form>

      <Separator className="my-8" />
      
      <div>
        <h3 className="text-lg font-medium mb-4">Changer le mot de passe</h3>
        <Form {...passwordForm}>
          <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-8">
            <FormField
              control={passwordForm.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mot de passe actuel</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={passwordForm.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nouveau mot de passe</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={passwordForm.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmer le nouveau mot de passe</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isLoading}>
              Changer le mot de passe
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}