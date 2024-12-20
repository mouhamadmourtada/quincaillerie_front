'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UserService } from '@/services/user-service';
import { useToast } from '@/hooks/use-toast';

const userFormSchema = z.object({
  firstname: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastname: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  date_naissance: z.string().min(1, 'La date de naissance est requise'),
  lieu_naissance: z.string().min(2, 'Le lieu de naissance doit contenir au moins 2 caractères'),
  role: z.enum(['admin', 'user'], {
    required_error: 'Veuillez sélectionner un rôle',
  }),
});

type UserFormValues = z.infer<typeof userFormSchema>;

interface UserCreateFormProps {
  onSuccess: () => void;
}

export function UserCreateForm({ onSuccess }: UserCreateFormProps) {
  const { toast } = useToast();

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      date_naissance: '',
      lieu_naissance: '',
      role: 'user',
    },
  });

  const onSubmit = async (data: UserFormValues) => {
    try {
      console.log('Date de naissance avant envoi:', data.date_naissance);
      const userData = {
        ...data,
        username: data.email,
        date_naissance: new Date(data.date_naissance + 'T00:00:00Z'),
      };
      console.log('Date de naissance après conversion:', userData.date_naissance);
      
      await UserService.createUser(userData);

      toast({
        title: 'Utilisateur créé avec succès',
      });
      onSuccess();
    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Une erreur est survenue',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="firstname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prénom</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Prénom" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lastname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Nom" />
              </FormControl>
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
                <Input {...field} type="email" placeholder="Email" />
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
                <Input {...field} type="password" placeholder="Mot de passe" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date_naissance"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date de naissance</FormLabel>
              <FormControl>
                <Input {...field} type="date" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lieu_naissance"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lieu de naissance</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Lieu de naissance" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rôle</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un rôle" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="admin">Administrateur</SelectItem>
                  <SelectItem value="user">Utilisateur</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-4">
          <Button type="submit">Créer</Button>
        </div>
      </form>
    </Form>
  );
}
