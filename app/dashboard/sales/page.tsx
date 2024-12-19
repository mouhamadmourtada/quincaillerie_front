'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { columns } from '@/components/sales/columns';
import { useSales } from '@/hooks/use-sales';
import { Sale } from '@/types/sale';
import { SaleDrawer } from '@/components/sales/sale-drawer';
import { LoadingPage } from '@/components/loading-page';
import { cn } from '@/lib/utils';
import { PageHeader } from '@/components/page-header';

export default function SalesPage() {
  const { sales, isLoading, refresh: refreshSales } = useSales();
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit' | 'view'>('create');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleCreate = () => {
    setSelectedSale(null);
    setDrawerMode('create');
    setIsDrawerOpen(true);
  };

  const handleEdit = (sale: Sale) => {
    setSelectedSale(sale);
    setDrawerMode('edit');
    setIsDrawerOpen(true);
  };

  const handleView = (sale: Sale) => {
    setSelectedSale(sale);
    setDrawerMode('view');
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedSale(null);
  };

  const handleSuccess = () => {
    refreshSales();
    handleCloseDrawer();
  };

  const salesWithActions = sales.map((sale) => ({
    ...sale,
    actions: [
      {
        label: 'Voir',
        onClick: () => handleView(sale),
      },
      {
        label: 'Modifier',
        onClick: () => handleEdit(sale),
      },
    ],
  }));

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <div className="flex flex-col gap-4 p-8">
      <PageHeader
        title="Ventes"
        description="Gérez vos ventes"
        action={
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle vente
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={salesWithActions}
        filterColumn="customerName"
        filterPlaceholder="Filtrer par client..."
      />

      <SaleDrawer
        sale={selectedSale}
        mode={drawerMode}
        open={isDrawerOpen}
        onClose={handleCloseDrawer}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
