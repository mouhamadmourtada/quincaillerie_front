'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserService } from '@/services/user-service';
import { useToast } from '@/hooks/use-toast';
import { showToast } from '@/lib/toast';
import type { User } from '@/types/user';
import { UserDrawer } from './user-drawer';
import { Eye, Pencil, Trash } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export function UserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | undefined>();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const { toast } = useToast();
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit' | 'details'>('create');
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const data = await UserService.getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast(showToast.error({
        title: 'Erreur',
        description: 'Impossible de récupérer la liste des utilisateurs'
      }));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = () => {
    setSelectedUser(undefined);
    setDrawerMode('create');
    setIsDrawerOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setDrawerMode('edit');
    setIsDrawerOpen(true);
  };

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setDrawerMode('details');
    setIsDrawerOpen(true);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      await UserService.deleteUser(userToDelete.id);
      toast(showToast.success({
        title: 'Utilisateur supprimé avec succès',
        description: 'L\'utilisateur a été supprimé de la base de données'
      }));
      fetchUsers();
    } catch (error) {
      console.error('Error:', error);
      toast(showToast.error({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la suppression'
      }));
    } finally {
      setUserToDelete(null);
    }
  };

  if (isLoading) {
    return <div className="text-center py-4">Chargement...</div>;
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={handleCreateUser}>Nouvel utilisateur</Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Prénom</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.firstname}</TableCell>
                <TableCell>{user.lastname}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                    {user.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={user.isActive === true ? 'success' : 'destructive'}>
                    {user.isActive === true ? 'Actif' : 'Inactif'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleViewDetails(user)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditUser(user)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setUserToDelete(user)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <UserDrawer
        user={selectedUser}
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSaved={() => {
          fetchUsers();
          setIsDrawerOpen(false);
        }}
        mode={drawerMode}
      />

      <AlertDialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Cela supprimera définitivement
              l&apos;utilisateur {userToDelete?.firstname} {userToDelete?.lastname}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              className="bg-red-600 hover:bg-red-700"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
