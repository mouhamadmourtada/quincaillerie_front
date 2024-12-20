'use client';

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserCreateForm } from './forms/user-create-form';
import { UserEditForm } from './forms/user-edit-form';
import { UserDetails } from './user-details';
import type { User } from '@/types/user';

interface UserDrawerProps {
  user?: User;
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  mode: 'create' | 'edit' | 'details';
}

export function UserDrawer({ user, open, onClose, onSaved, mode }: UserDrawerProps) {
  const isEditing = !!user;

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
            <UserCreateForm onSuccess={onSaved} />
          ) : user ? (
            mode === 'details' ? (
              <UserDetails user={user} />
            ) : (
              <UserEditForm user={user} onSuccess={onSaved} />
            )
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  );
}
