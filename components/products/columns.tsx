'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Product } from '@/types/product';
import { formatCurrency } from '@/lib/formatters';
import { Button } from '@/components/ui/button';
import { Eye, Pencil } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { TableMeta } from '@/types/table';

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: 'name',
    header: 'Nom',
  },
  {
    accessorKey: 'category',
    header: 'Catégorie',
    cell: ({ row }) => (
      <Badge variant="outline">
        {row.original.category?.name || 'Non catégorisé'}
      </Badge>
    ),
  },
  {
    accessorKey: 'price',
    header: 'Prix',
    cell: ({ getValue }) => formatCurrency(getValue<number>()),
  },
  {
    accessorKey: 'stock',
    header: 'Stock',
    cell: ({ getValue }) => {
      const stock = getValue<number>();
      return (
        <Badge variant={stock > 10 ? 'default' : 'destructive'}>
          {stock}
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row, table }) => {
      const product = row.original;
      const meta = table.options.meta as TableMeta<Product>;
      
      return (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => meta?.onView?.(product)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => meta?.onEdit?.(product)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];