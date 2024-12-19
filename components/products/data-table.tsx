'use client';

import { DataTable as BaseDataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Product } from '@/types/product';

interface ProductDataTableProps {
  columns: ColumnDef<Product>[];
  data: Product[];
  onEdit?: (product: Product) => void;
  onView?: (product: Product) => void;
}

export function DataTable({ columns, data, onEdit, onView }: ProductDataTableProps) {
  return (
    <BaseDataTable
      columns={columns}
      data={data}
      meta={{
        onEdit,
        onView,
      }}
    />
  );
}