'use client';

import { User } from '@/types/user';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Mail, Phone, MapPin, Building, Globe, Calendar, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ResetPasswordForm } from './forms/reset-password-form';

interface UserDetailsProps {
  user: User;
}

export function UserDetails({ user }: UserDetailsProps) {
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const formatDate = (date: Date | string) => {
    const dateObj = date instanceof Date ? date : new Date(date);
    return format(dateObj, 'dd MMMM yyyy', { locale: fr });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Informations de l'utilisateur</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            {/* Colonne de gauche avec avatar et infos principales */}
            <div className="flex flex-col items-center space-y-4 md:w-1/3">
              <Avatar className="h-32 w-32">
                <AvatarFallback className="text-2xl bg-primary/10">
                  {getInitials(user.firstname + ' ' + user.lastname)}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h3 className="text-2xl font-semibold">{user.firstname} {user.lastname}</h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="mt-2">
                {user.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
              </Badge>
              <Button 
                variant="outline" 
                className="mt-4 w-full"
                onClick={() => setIsResetPasswordOpen(true)}
              >
                <KeyRound className="mr-2 h-4 w-4" />
                Réinitialiser le mot de passe
              </Button>
            </div>

            {/* Colonne de droite avec les détails */}
            <div className="flex-1 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email */}
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Mail className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>

                {/* Téléphone */}
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Phone className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Téléphone</p>
                    <p className="text-sm text-muted-foreground">
                      {user.phoneNumber || 'Non renseigné'}
                    </p>
                  </div>
                </div>

                {/* Date de naissance */}
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <CalendarDays className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Date de naissance</p>
                    <p className="text-sm text-muted-foreground">
                      {user.date_naissance ? formatDate(user.date_naissance) : 'Non renseignée'}
                    </p>
                  </div>
                </div>

                {/* Date d'inscription */}
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Date d'inscription</p>
                    <p className="text-sm text-muted-foreground">
                      {user.createdAt ? formatDate(user.createdAt) : 'Non renseignée'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Section adresse */}
              <div className="border-t pt-6 mt-6">
                <h4 className="text-sm font-semibold mb-4">Adresse</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Adresse */}
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      <MapPin className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Rue</p>
                      <p className="text-sm text-muted-foreground">
                        {user.address || 'Non renseignée'}
                      </p>
                    </div>
                  </div>

                  {/* Ville */}
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      <Building className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Ville</p>
                      <p className="text-sm text-muted-foreground">
                        {user.city || 'Non renseignée'}
                      </p>
                    </div>
                  </div>

                  {/* Pays */}
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      <Globe className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Pays</p>
                      <p className="text-sm text-muted-foreground">
                        {user.country || 'Non renseigné'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
