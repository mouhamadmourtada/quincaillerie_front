'use client';

import { DataTable as BaseDataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Supplier } from '@/types/supplier';

interface SupplierDataTableProps {
  columns: ColumnDef<Supplier>[];
  data: Supplier[];
  onEdit?: (supplier: Supplier) => void;
  onView?: (supplier: Supplier) => void;
}

export function DataTable({ columns, data, onEdit, onView }: SupplierDataTableProps) {
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