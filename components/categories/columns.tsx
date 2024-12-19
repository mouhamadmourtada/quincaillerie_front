'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Category } from '@/types/category';
import { Button } from '@/components/ui/button';
import { Eye, Pencil } from 'lucide-react';

export const columns: ColumnDef<Category>[] = [
  {
    accessorKey: 'name',
    header: 'Nom',
  },
  {
    accessorKey: 'description',
    header: 'Description',
  },
  {
    id: 'actions',
    cell: ({ row, table }) => {
      const category = row.original;
      const { onView, onEdit } = table.options.meta || {};
      
      return (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onView?.(category)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit?.(category)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];