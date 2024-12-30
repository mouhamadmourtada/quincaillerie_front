'use client';

import { useState } from 'react';
import { DataTable } from '@/components/suppliers/data-table';
import { columns } from '@/components/suppliers/columns';
import { SupplierDrawer } from '@/components/suppliers/supplier-drawer';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useSuppliers } from '@/hooks/use-suppliers';
import { Supplier } from '@/types/supplier';
import { LoadingPage } from '@/components/loading-page';
import { PageHeader } from '@/components/page-header';

export default function SuppliersPage() {
  const { suppliers, isLoading, refresh: refreshSuppliers } = useSuppliers();
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | undefined>(undefined);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit' | 'view'>('create');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleCreate = () => {
    setSelectedSupplier(undefined);
    setDrawerMode('create');
    setIsDrawerOpen(true);
  };

  const handleEdit = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setDrawerMode('edit');
    setIsDrawerOpen(true);
  };

  const handleView = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setDrawerMode('view');
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedSupplier(undefined);
  };

  const handleSuccess = () => {
    refreshSuppliers();
    handleCloseDrawer();
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Fournisseurs</h1>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau fournisseur
        </Button>
      </div>
      
      <DataTable 
        columns={columns} 
        data={suppliers} 
        onEdit={handleEdit}
        onView={handleView}
      />

      <SupplierDrawer
        supplier={selectedSupplier}
        mode={drawerMode}
        open={isDrawerOpen}
        onClose={handleCloseDrawer}
        onSuccess={handleSuccess}
      />
    </div>
  );
}