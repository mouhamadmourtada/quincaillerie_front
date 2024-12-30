'use client';

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { UserCreateForm } from './forms/user-create-form';
import { UserEditForm } from './forms/user-edit-form';
import { UserDetails } from './user-details';
import type { User, CreateUserDto, UpdateUserDto } from '@/types/user';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { UserService } from '@/services/user-service';
import { z } from 'zod';

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

interface UserDrawerProps {
  user?: User;
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  mode: 'create' | 'edit' | 'details';
}

export function UserDrawer({ user, open, onClose, onSaved, mode }: UserDrawerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleCreateSubmit = async (formData: UserFormValues) => {
    try {
      setIsLoading(true);
      const userData: CreateUserDto = {
        ...formData,
        username: formData.email,
        date_naissance: new Date(formData.date_naissance),
      };
      
      console.log('Creating user with data:', userData);
      
      await UserService.createUser(userData);
      toast({
        title: 'Utilisateur créé avec succès',
        description: 'Le nouvel utilisateur a été ajouté',
        variant: 'success'
      });
      onClose();
      onSaved();
    } catch (error) {
      console.error('Failed to create user:', error);
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Une erreur est survenue lors de la création',
        variant: 'destructive'
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditSubmit = async (formData: UpdateUserDto) => {
    try {
      setIsLoading(true);
      
      console.log('Updating user with data:', formData);
      
      await UserService.updateUser(user!.id, formData);
      toast({
        title: 'Utilisateur modifié avec succès',
        description: 'Les modifications ont été enregistrées',
        variant: 'success'
      });
      onClose();
      onSaved();
    } catch (error) {
      console.error('Failed to update user:', error);
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Une erreur est survenue lors de la modification',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle>
            {mode === 'create'
              ? 'Nouvel utilisateur'
              : mode === 'edit'
              ? 'Modifier l\'utilisateur'
              : 'Détails de l\'utilisateur'}
          </SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          {mode === 'create' ? (
            <UserCreateForm onSaved={handleCreateSubmit} />
          ) : user ? (
            mode === 'details' ? (
              <UserDetails user={user} />
            ) : (
              <UserEditForm user={user} onSaved={handleEditSubmit} />
            )
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  );
}
