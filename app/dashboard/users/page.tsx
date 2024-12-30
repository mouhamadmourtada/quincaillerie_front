'use client';

import { UserTable } from '@/components/users/user-table';
import { UserDrawer } from '@/components/users/user-drawer';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useState } from 'react';

export default function UsersPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit' | 'details'>('create');

  const handleUserSaved = () => {
    setIsDrawerOpen(false);
  };

  const handleCreate = () => {
    setDrawerMode('create');
    setIsDrawerOpen(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary">Gestion des Utilisateurs</h1>
        <Button onClick={handleCreate} className="gap-2">
          <PlusCircle className="h-4 w-4" />
          Nouvel Utilisateur
        </Button>
      </div>
      <UserTable />
      <UserDrawer 
        open={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        onSaved={handleUserSaved}
        mode={drawerMode}
      />
    </div>
  );
}
