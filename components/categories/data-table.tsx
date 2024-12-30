'use client';

import { DataTable as BaseDataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Category } from '@/types/category';
import { TableMeta } from '@/types/table';

interface CategoryDataTableProps {
  columns: ColumnDef<Category>[];
  data: Category[];
  onEdit?: (category: Category) => void;
  onView?: (category: Category) => void;
}

export function DataTable({ columns, data, onEdit, onView }: CategoryDataTableProps) {
  return (
    <BaseDataTable<Category>
      columns={columns}
      data={data}
      meta={{
        onEdit,
        onView,
      }}
    />
  );
}