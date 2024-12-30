'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Supplier } from '@/types/supplier';
import { Button } from '@/components/ui/button';
import { Eye, Pencil } from 'lucide-react';
import { TableMeta } from '@/types/table';

export const columns: ColumnDef<Supplier>[] = [
  {
    accessorKey: 'name',
    header: 'Nom',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'phone',
    header: 'Téléphone',
  },
  {
    accessorKey: 'address',
    header: 'Adresse',
  },
  {
    id: 'actions',
    cell: ({ row, table }) => {
      const supplier = row.original;
      const meta = table.options.meta as TableMeta<Supplier>;
      const { onView, onEdit } = meta || {};
      
      return (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onView?.(supplier)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit?.(supplier)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];