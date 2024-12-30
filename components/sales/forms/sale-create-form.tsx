'use client';

import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { SaleService } from '@/services/sale-service';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useProducts } from '@/hooks/use-products';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

const saleItemSchema = z.object({
  productId: z.string().min(1, 'Produit requis'),
  quantity: z.coerce.number().min(1, 'Quantité minimale de 1'),
  unitPrice: z.coerce.number().min(0, 'Prix unitaire invalide'),
});

const saleSchema = z.object({
  customerName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  customerPhone: z.string().min(10, 'Numéro de téléphone invalide'),
  paymentType: z.enum(['CASH', 'CARD', 'TRANSFER']),
  items: z.array(saleItemSchema).min(1, 'Au moins un produit est requis'),
});

type SaleFormValues = z.infer<typeof saleSchema>;

interface SaleCreateFormProps {
  onSuccess: () => void;
}

interface CreateSaleData {
  customerName: string;
  customerPhone: string;
  paymentType: 'CASH' | 'CARD' | 'TRANSFER';
  items: {
    productId: string;
    quantity: number;
    unitPrice: number;
  }[];
  status: 'PENDING';
}

export function SaleCreateForm({ onSuccess }: SaleCreateFormProps) {
  const { products, isLoading: isLoadingProducts } = useProducts();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<SaleFormValues>({
    resolver: zodResolver(saleSchema),
    defaultValues: {
      customerName: '',
      customerPhone: '',
      paymentType: 'CASH',
      items: [{ productId: '', quantity: 1, unitPrice: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: 'items',
    control: form.control,
  });

  const onSubmit = async (values: SaleFormValues) => {
    try {
      setIsLoading(true);

      const saleData: CreateSaleData = {
        customerName: values.customerName,
        customerPhone: values.customerPhone,
        paymentType: values.paymentType,
        items: values.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
        status: 'PENDING',
      };

      await SaleService.createSale(saleData);

      toast({
        variant: 'default',
        title: 'Vente créée avec succès',
        description: 'La nouvelle vente a été enregistrée'
      });
      
      onSuccess();
    } catch (error) {
      console.error('Failed to create sale:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Une erreur est survenue lors de la création de la vente',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductChange = (value: string, index: number) => {
    const product = products.find((p) => p.id === value);
    if (product) {
      form.setValue(`items.${index}.productId`, value);
      form.setValue(`items.${index}.unitPrice`, product.price);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="customerName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom du Client</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Nom du client" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="customerPhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Téléphone</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Numéro de téléphone" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="paymentType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type de Paiement</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le type de paiement" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="CASH">Espèces</SelectItem>
                  <SelectItem value="CARD">Carte</SelectItem>
                  <SelectItem value="TRANSFER">Virement</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <FormLabel>Produits</FormLabel>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                append({ productId: '', quantity: 1, unitPrice: 0 })
              }
            >
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un produit
            </Button>
          </div>

          {fields.map((field, index) => (
            <div key={field.id} className="flex items-start gap-4">
              <FormField
                control={form.control}
                name={`items.${index}.productId`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    {isLoadingProducts ? (
                      <Skeleton className="h-10 w-full" />
                    ) : (
                      <Select
                        onValueChange={(value) => handleProductChange(value, index)}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un produit" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {products.map((product) => (
                            <SelectItem key={product.id} value={product.id}>
                              {product.name} - {product.price}€
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`items.${index}.quantity`}
                render={({ field }) => (
                  <FormItem className="w-[100px]">
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => remove(index)}
                className="mt-2"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading || isLoadingProducts}>
            {isLoading ? 'Création...' : 'Créer'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
