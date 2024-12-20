'use client';

import { ColumnDef } from '@tanstack/react-table';
import { User } from '@/types/user';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { DataTableColumnHeader } from '@/components/ui/data-table-header';
import { DataTableRowActions } from './data-table-row-actions';

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'firstName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Prénom" />
    ),
  },
  {
    accessorKey: 'lastName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nom" />
    ),
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: 'date_naissance',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date de naissance" />
    ),
    cell: ({ row }) => {
      const date = row.getValue('date_naissance') as Date;
      return date ? format(new Date(date), 'dd/MM/yyyy', { locale: fr }) : '-';
    },
  },
  {
    accessorKey: 'lieu_naissance',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Lieu de naissance" />
    ),
  },
  {
    accessorKey: 'role',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Rôle" />
    ),
    cell: ({ row }) => {
      const role = row.getValue('role') as string;
      return (
        <Badge variant={role === 'ADMIN' ? 'default' : 'secondary'}>
          {role === 'ADMIN' ? 'Administrateur' : 'Utilisateur'}
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
