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
import { UserService } from '@/services/user-service';
import { useToast } from '@/hooks/use-toast';
import { ResetPasswordDto } from '@/types/user';

const resetPasswordSchema = z.object({
  newPassword: z.string()
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères')
    .max(50, 'Le mot de passe ne doit pas dépasser 50 caractères'),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

interface ResetPasswordFormProps {
  userId: string;
  onSuccess: () => void;
}

export function ResetPasswordForm({ userId, onSuccess }: ResetPasswordFormProps) {
  const { toast } = useToast();
  const form = useForm<ResetPasswordDto>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: ResetPasswordDto) => {
    try {
      await UserService.resetPassword(userId, data);
      toast({
        title: 'Mot de passe réinitialisé avec succès',
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
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nouveau mot de passe</FormLabel>
              <FormControl>
                <Input {...field} type="password" placeholder="Nouveau mot de passe" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmer le mot de passe</FormLabel>
              <FormControl>
                <Input {...field} type="password" placeholder="Confirmer le mot de passe" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-4">
          <Button type="submit">Réinitialiser le mot de passe</Button>
        </div>
      </form>
    </Form>
  );
}
