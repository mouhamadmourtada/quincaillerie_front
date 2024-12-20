'use client';

import { Sale, PaymentType } from '@/types/sale';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SaleService } from '@/services/sale-service';
import { showToast } from '@/lib/toast';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface SaleDetailsTableProps {
  sale: Sale;
  onUpdate?: () => void;
}

export function SaleDetailsTable({ sale, onUpdate }: SaleDetailsTableProps) {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPaymentType, setSelectedPaymentType] = useState<PaymentType>(sale.paymentType || 'CASH');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const formatDate = (date: Date | string | null) => {
    if (!date) return 'Non spécifié';
    try {
      return format(new Date(date), 'dd MMMM yyyy HH:mm', { locale: fr });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Date invalide';
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  const handlePayment = async () => {
    try {
      setIsProcessing(true);
      await SaleService.markAsPaid(sale.id, {
        paymentType: selectedPaymentType,
        paymentDate: new Date(),
      });
      
      toast(showToast.success({
        title: 'Paiement enregistré avec succès',
        description: 'La vente a été marquée comme payée'
      }));
      
      setIsPaymentModalOpen(false);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error:', error);
      toast(showToast.error({
        title: 'Erreur de paiement',
        description: error instanceof Error ? error.message : 'Une erreur est survenue lors du paiement'
      }));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = async () => {
    try {
      setIsProcessing(true);
      await SaleService.cancelSale(sale.id);
      
      toast(showToast.success({
        title: 'Vente annulée avec succès',
        description: 'La vente a été annulée'
      }));
      
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error:', error);
      toast(showToast.error({
        title: 'Erreur d\'annulation',
        description: error instanceof Error ? error.message : 'Une erreur est survenue lors de l\'annulation'
      }));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      {sale.status === 'PENDING' ? (
        <div className="flex justify-end gap-2">
          <Button
            variant="default"
            onClick={() => setIsPaymentModalOpen(true)}
            disabled={isProcessing}
            className="w-auto"
          >
            Marquer comme payé
          </Button>
          <Button
            variant="destructive"
            onClick={handleCancel}
            disabled={isProcessing}
            className="w-auto"
          >
            Annuler la vente
          </Button>
        </div>
      ) : (
        <div className={cn(
          "p-4 rounded-lg flex items-center justify-between",
          sale.status === 'PAID' 
            ? "bg-green-50 border border-green-200" 
            : "bg-red-50 border border-red-200"
        )}>
          <div className="flex items-center gap-3">
            {sale.status === 'PAID' ? (
              <>
                <CheckCircle className="h-6 w-6 text-green-500" />
                <div>
                  <p className="font-medium text-green-800">Vente payée</p>
                  <p className="text-sm text-green-600">
                    Payée le {formatDate(sale.paymentDate)} en {sale.paymentType === 'CASH' ? 'espèces' : 
                    sale.paymentType === 'CARD' ? 'carte' : 'virement'}
                  </p>
                </div>
              </>
            ) : (
              <>
                <XCircle className="h-6 w-6 text-red-500" />
                <div>
                  <p className="font-medium text-red-800">Vente annulée</p>
                  <p className="text-sm text-red-600">
                    Cette vente a été annulée
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Informations générales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <tbody>
                <tr className="border-b">
                  <td className="py-2 font-medium">Client</td>
                  <td>{sale.customerName}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Téléphone</td>
                  <td>{sale.customerPhone}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Date de vente</td>
                  <td>{formatDate(sale.saleDate)}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Statut</td>
                  <td>
                    <Badge 
                      variant={sale.status === 'PAID' ? 'success' : sale.status === 'CANCELLED' ? 'destructive' : 'default'}
                    >
                      {sale.status === 'PAID' ? 'Payé' : sale.status === 'CANCELLED' ? 'Annulé' : 'En attente'}
                    </Badge>
                  </td>
                </tr>
                {sale.paymentDate && (
                  <tr className="border-b">
                    <td className="py-2 font-medium">Date de paiement</td>
                    <td>{formatDate(sale.paymentDate)}</td>
                  </tr>
                )}
                {sale.paymentType && (
                  <tr className="border-b">
                    <td className="py-2 font-medium">Mode de paiement</td>
                    <td>
                      <Badge variant="outline">
                        {sale.paymentType === 'CASH' ? 'Espèces' : 
                         sale.paymentType === 'CARD' ? 'Carte' : 'Virement'}
                      </Badge>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Articles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Produit</th>
                  <th className="text-right py-2">Quantité</th>
                  <th className="text-right py-2">Prix unitaire</th>
                  <th className="text-right py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {sale.items.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2">{item.productName}</td>
                    <td className="text-right">{item.quantity}</td>
                    <td className="text-right">{formatPrice(item.unitPrice)}</td>
                    <td className="text-right">{formatPrice(item.totalPrice)}</td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={3} className="text-right py-4 font-bold">Total</td>
                  <td className="text-right py-4 font-bold">{formatPrice(sale.totalAmount)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enregistrer le paiement</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Mode de paiement</label>
              <Select
                value={selectedPaymentType}
                onValueChange={(value: PaymentType) => setSelectedPaymentType(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le mode de paiement" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CASH">Espèces</SelectItem>
                  <SelectItem value="CARD">Carte</SelectItem>
                  <SelectItem value="TRANSFER">Virement</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="pt-4 flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsPaymentModalOpen(false)}
              >
                Annuler
              </Button>
              <Button
                onClick={handlePayment}
                disabled={isProcessing}
              >
                Confirmer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
