'use client';

import { Sale, PaymentType } from '@/types/sale';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
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
import { useToast } from '@/hooks/use-toast';

interface SaleDetailsProps {
  sale: Sale;
  onUpdate?: () => void;
}

export function SaleDetails({ sale, onUpdate }: SaleDetailsProps) {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPaymentType, setSelectedPaymentType] = useState<PaymentType>(sale.paymentType || 'CASH');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  console.log('Sale status:', sale.status); // Debug log

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
      
      toast({
        variant: 'default',
        title: 'Paiement enregistré avec succès',
        description: 'La vente a été marquée comme payée'
      });
      
      setIsPaymentModalOpen(false);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Une erreur est survenue lors du paiement'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Informations de la vente</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <span className="font-medium">Client:</span>
            <p>{sale.customerName}</p>
          </div>
          <div>
            <span className="font-medium">Téléphone:</span>
            <p>{sale.customerPhone}</p>
          </div>
          <div>
            <span className="font-medium">Date de vente:</span>
            <p>{formatDate(sale.saleDate)}</p>
          </div>
          <div>
            <span className="font-medium">Statut:</span>
            <Badge 
              variant={sale.status === 'PAID' ? 'secondary' : sale.status === 'CANCELLED' ? 'destructive' : 'default'}
              className="ml-2"
            >
              {sale.status === 'PAID' ? 'Payé' : sale.status === 'CANCELLED' ? 'Annulé' : 'En attente'}
            </Badge>
          </div>
          {sale.paymentDate && (
            <div>
              <span className="font-medium">Date de paiement:</span>
              <p>{formatDate(sale.paymentDate)}</p>
            </div>
          )}
          {sale.paymentType && (
            <div>
              <span className="font-medium">Mode de paiement:</span>
              <Badge variant="outline" className="ml-2">
                {sale.paymentType === 'CASH' ? 'Espèces' : 
                 sale.paymentType === 'CARD' ? 'Carte' : 'Virement'}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Articles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sale.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-medium">{item.productName}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.quantity} x {formatPrice(item.unitPrice)}
                  </p>
                </div>
                <p className="font-medium">{formatPrice(item.totalPrice)}</p>
              </div>
            ))}
            <div className="flex justify-between items-center pt-2">
              <p className="font-bold">Total</p>
              <p className="font-bold">{formatPrice(sale.totalAmount)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {sale.status === 'PENDING' && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-end">
              <Button
                variant="default"
                onClick={() => setIsPaymentModalOpen(true)}
                className="w-full sm:w-auto"
              >
                Marquer comme payé
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

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
                {isProcessing ? 'Traitement...' : 'Confirmer le paiement'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
