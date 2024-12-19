'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Product } from '@/types/product';
import { formatCurrency } from '@/lib/formatters';
import { Button } from '@/components/ui/button';
import { Eye, Pencil } from 'lucide-react';

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: 'name',
    header: 'Nom',
  },
  {
    accessorKey: 'category',
    header: 'Catégorie',
  },
  {
    accessorKey: 'price',
    header: 'Prix',
    cell: ({ getValue }) => formatCurrency(getValue<number>()),
  },
  {
    accessorKey: 'stock',
    header: 'Stock',
  },
  {
    id: 'actions',
    cell: ({ row, table }) => {
      const product = row.original;
      const { onView, onEdit } = table.options.meta || {};
      
      return (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onView?.(product)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit?.(product)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];