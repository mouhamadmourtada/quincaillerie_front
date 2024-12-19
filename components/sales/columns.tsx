'use client';

import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Sale } from '@/types/sale';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { DataTableRowActions } from '@/components/ui/data-table-row-actions';

export const columns: ColumnDef<Sale>[] = [
  {
    accessorKey: 'customerName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Client" />
    ),
  },
  {
    accessorKey: 'customerPhone',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Téléphone" />
    ),
  },
  {
    accessorKey: 'totalAmount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Montant" />
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('totalAmount'));
      const formatted = new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
      }).format(amount);

      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: 'saleDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date de vente" />
    ),
    cell: ({ row }) => {
      return (
        <div>
          {format(new Date(row.getValue('saleDate')), 'Pp', {
            locale: fr,
          })}
        </div>
      );
    },
  },
  {
    accessorKey: 'paymentDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date de paiement" />
    ),
    cell: ({ row }) => {
      const date = row.getValue('paymentDate');
      return (
        <div>
          {date
            ? format(new Date(date as string), 'Pp', {
                locale: fr,
              })
            : '-'}
        </div>
      );
    },
  },
  {
    accessorKey: 'paymentType',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type de paiement" />
    ),
    cell: ({ row }) => {
      const paymentType = row.getValue('paymentType') as string;
      return (
        <div>
          {paymentType === 'CASH'
            ? 'Espèces'
            : paymentType === 'CARD'
            ? 'Carte'
            : 'Virement'}
        </div>
      );
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Statut" />
    ),
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return (
        <Badge
          variant={
            status === 'PAID'
              ? 'success'
              : status === 'PENDING'
              ? 'warning'
              : 'destructive'
          }
        >
          {status === 'PAID'
            ? 'Payé'
            : status === 'PENDING'
            ? 'En attente'
            : 'Annulé'}
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return (
        <DataTableRowActions
          row={row}
          actions={row.original.actions}
        />
      );
    },
  },
];
