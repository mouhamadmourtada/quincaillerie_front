'use client';

import { Sale } from '@/types/sale';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { SaleCreateForm } from './forms/sale-create-form';
import { SaleEditForm } from './forms/sale-edit-form';
import { SaleDetailsTable } from './sale-details-table';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { showToast } from '@/lib/toast';

interface SaleDrawerProps {
  sale: Sale | null;
  mode: 'create' | 'edit' | 'view';
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function SaleDrawer({
  sale,
  mode,
  open,
  onClose,
  onSuccess,
}: SaleDrawerProps) {
  const title = {
    create: 'Nouvelle vente',
    edit: 'Modifier la vente',
    view: 'Détails de la vente',
  }[mode];

  const toast = useToast();

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-[800px] sm:max-w-[800px] overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>

        {mode === 'create' && <SaleCreateForm onSuccess={onSuccess} />}
        {mode === 'edit' && sale && (
          <SaleEditForm sale={sale} onSuccess={onSuccess} />
        )}
        {mode === 'view' && sale && (
          <div className="py-6">
            <SaleDetailsTable sale={sale} onUpdate={onSuccess} />
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
