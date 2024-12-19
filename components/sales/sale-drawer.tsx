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
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';

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
          <div className="mt-6 space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-lg border p-4">
                <h3 className="mb-2 font-semibold">Client</h3>
                <div className="space-y-1 text-sm">
                  <p className="font-medium">{sale.customerName}</p>
                  <p className="text-muted-foreground">{sale.customerPhone}</p>
                </div>
              </div>
              <div className="rounded-lg border p-4">
                <h3 className="mb-2 font-semibold">Paiement</h3>
                <div className="space-y-1 text-sm">
                  <p>
                    Type:{' '}
                    <span className="font-medium">
                      {sale.paymentType === 'CASH'
                        ? 'Espèces'
                        : sale.paymentType === 'CARD'
                        ? 'Carte'
                        : 'Virement'}
                    </span>
                  </p>
                  <p>
                    Total:{' '}
                    <span className="font-medium">
                      {new Intl.NumberFormat('fr-FR', {
                        style: 'currency',
                        currency: 'EUR',
                      }).format(sale.totalAmount)}
                    </span>
                  </p>
                  <div className="pt-1">
                    <Badge
                      variant={
                        sale.status === 'PAID'
                          ? 'success'
                          : sale.status === 'PENDING'
                          ? 'warning'
                          : 'destructive'
                      }
                    >
                      {sale.status === 'PAID'
                        ? 'Payé'
                        : sale.status === 'PENDING'
                        ? 'En attente'
                        : 'Annulé'}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <h3 className="mb-4 font-semibold">Produits</h3>
              <div className="space-y-3">
                {sale.items?.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-md bg-muted/50 p-3"
                  >
                    <div>
                      <p className="font-medium">
                        {item.productName || 'Produit inconnu'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Quantité: {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium">
                      {new Intl.NumberFormat('fr-FR', {
                        style: 'currency',
                        currency: 'EUR',
                      }).format(item.unitPrice)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-end border-t pt-4">
                <p className="text-lg font-semibold">
                  Total:{' '}
                  {new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: 'EUR',
                  }).format(sale.totalAmount)}
                </p>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
