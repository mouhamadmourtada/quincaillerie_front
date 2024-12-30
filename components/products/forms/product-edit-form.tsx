'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
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
import { Product } from '@/types/product';
import { useToast } from '@/hooks/use-toast';

const productSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  category: z.string().optional(),
  price: z.string().min(1, 'Le prix est requis').transform((val) => Number(val)),
  stock: z.string().min(1, 'Le stock est requis').transform((val) => Number(val)),
});

type ProductFormSchema = z.infer<typeof productSchema>;

interface ProductFormValues {
  name: string;
  category: string;
  price: string;
  stock: string;
}

interface ProductEditFormProps {
  product: Product;
  onSuccess: (data: ProductFormSchema) => Promise<void>;
}

export function ProductEditForm({ product, onSuccess }: ProductEditFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product.name,
      category: product.categoryId,
      price: product.price.toString(),
      stock: product.stock.toString(),
    },
  });

  const onSubmit = async (data: ProductFormValues) => {
    try {
      setIsLoading(true);
      await onSuccess(data as unknown as ProductFormSchema);
      form.reset();
    } catch (error) {
      console.error('Error in form submission:', error);
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Une erreur est survenue lors de la modification du produit',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom</FormLabel>
              <FormControl>
                <Input placeholder="Nom du produit" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Catégorie</FormLabel>
              <FormControl>
                <Input placeholder="Catégorie du produit" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prix</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="0.00" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="stock"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stock</FormLabel>
              <FormControl>
                <Input type="number" placeholder="0" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Modification...' : 'Modifier le produit'}
        </Button>
      </form>
    </Form>
  );
}
