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
import { showToast } from '@/lib/toast';
import { User } from '@/types/user';
import { format, parseISO } from 'date-fns';

const userFormSchema = z.object({
  firstname: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastname: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  date_naissance: z.string().min(1, 'La date de naissance est requise'),
  lieu_naissance: z.string().min(2, 'Le lieu de naissance doit contenir au moins 2 caractères'),
  role: z.enum(['admin', 'user'], {
    required_error: 'Veuillez sélectionner un rôle',
  }),
  isActive: z.boolean(),
});

type UserFormValues = z.infer<typeof userFormSchema>;

interface UserEditFormProps {
  user: User;
  onSaved: () => void;
}

export function UserEditForm({ user, onSaved }: UserEditFormProps) {
  const { toast } = useToast();

  const formatDateForInput = (date: string | Date | null) => {
    if (!date) return '';
    try {
      const dateObj = typeof date === 'string' ? parseISO(date) : date;
      return format(dateObj, 'yyyy-MM-dd');
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  console.log('Date reçue:', user.date_naissance);
  const formattedDate = formatDateForInput(user.date_naissance);
  console.log('Date formatée:', formattedDate);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      date_naissance: formattedDate,
      lieu_naissance: user.lieu_naissance,
      role: user.role,
      isActive: user.isActive,
    },
  });

  const onSubmit = async (data: UserFormValues) => {
    try {
      console.log('Date de naissance avant envoi:', data.date_naissance);
      const userData = {
        ...data,
        date_naissance: new Date(data.date_naissance + 'T00:00:00Z'),
      };
      console.log('Date de naissance après conversion:', userData.date_naissance);

      await UserService.updateUser(user.id, userData);
      console.log('User updated successfully');
      toast({
        title: 'Utilisateur modifié avec succès',
        description: 'Les modifications ont été enregistrées',
        variant: 'success'
      });
      onSaved();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Une erreur est survenue',
        variant: 'destructive'
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

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Statut</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(value === 'true')}
                defaultValue={field.value ? 'true' : 'false'}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le statut" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="true">Actif</SelectItem>
                  <SelectItem value="false">Inactif</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-4">
          <Button type="submit">Modifier</Button>
        </div>
      </form>
    </Form>
  );
}
