'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Category } from '@/types/category';
import { TableMeta } from '@/types/table';
import { Button } from '@/components/ui/button';
import { Eye, Pencil } from 'lucide-react';

type CategoryColumnDef = ColumnDef<Category> & {
  meta?: TableMeta<Category>;
};

export const columns: CategoryColumnDef[] = [
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
      const meta = table.options.meta as TableMeta<Category>;
      
      return (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => meta?.onView?.(category)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => meta?.onEdit?.(category)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];