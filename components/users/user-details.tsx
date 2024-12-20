'use client';

import { User } from '@/types/user';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ResetPasswordForm } from './forms/reset-password-form';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface UserDetailsProps {
  user: User;
}

export function UserDetails({ user }: UserDetailsProps) {
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);

  const formatDate = (date: Date | string | null) => {
    if (!date) return 'Non spécifié';
    try {
      return format(new Date(date), 'dd MMMM yyyy', { locale: fr });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Date invalide';
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Informations personnelles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <span className="font-medium">Nom complet:</span>
            <p>{user.firstname} {user.lastname}</p>
          </div>
          <div>
            <span className="font-medium">Email:</span>
            <p>{user.email}</p>
          </div>
          <div>
            <span className="font-medium">Date de naissance:</span>
            <p>{formatDate(user.date_naissance)}</p>
          </div>
          <div>
            <span className="font-medium">Lieu de naissance:</span>
            <p>{user.lieu_naissance}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informations du compte</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <span className="font-medium">Rôle:</span>
            <Badge variant="outline" className="ml-2">
              {user.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
            </Badge>
          </div>
          <div>
            <span className="font-medium">Statut:</span>
            <Badge variant={user.isActive ? 'success' : 'destructive'} className="ml-2">
              {user.isActive ? 'Actif' : 'Inactif'}
            </Badge>
          </div>
          <div className="pt-4">
            <Button 
              variant="outline" 
              onClick={() => setIsResetPasswordOpen(true)}
            >
              Réinitialiser le mot de passe
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isResetPasswordOpen} onOpenChange={setIsResetPasswordOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Réinitialiser le mot de passe</DialogTitle>
          </DialogHeader>
          <ResetPasswordForm 
            userId={user.id} 
            onSuccess={() => setIsResetPasswordOpen(false)} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
