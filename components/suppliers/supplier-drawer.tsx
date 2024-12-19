'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
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
import { Textarea } from '@/components/ui/textarea';
import { Supplier } from '@/types/supplier';
import { SupplierService } from '@/services/supplier-service';

const supplierSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  phone: z.string().min(10, 'Le numéro de téléphone doit contenir au moins 10 caractères'),
  address: z.string().min(5, 'L\'adresse doit contenir au moins 5 caractères'),
});

interface SupplierDrawerProps {
  open: boolean;
  onClose: () => void;
  supplier?: Supplier;
  mode: 'create' | 'edit' | 'view';
  onSuccess: () => void;
}

export function SupplierDrawer({ 
  open, 
  onClose, 
  supplier,
  mode,
  onSuccess 
}: SupplierDrawerProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof supplierSchema>>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      name: supplier?.name || '',
      email: supplier?.email || '',
      phone: supplier?.phone || '',
      address: supplier?.address || '',
    },
  });

  // Mettre à jour les valeurs du formulaire lorsque le fournisseur change
  useEffect(() => {
    if (supplier && (mode === 'edit' || mode === 'view')) {
      form.reset({
        name: supplier.name,
        email: supplier.email,
        phone: supplier.phone,
        address: supplier.address,
      });
    } else {
      form.reset({
        name: '',
        email: '',
        phone: '',
        address: '',
      });
    }
  }, [supplier, mode, form]);

  async function onSubmit(values: z.infer<typeof supplierSchema>) {
    try {
      setIsLoading(true);
      // TODO: Implement supplier creation/update
      if (mode === 'create') {
        await SupplierService.createSupplier(values);
      } else if (mode === 'edit') {
        await SupplierService.updateSupplier(supplier!.id, values);
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to save supplier:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const title =
    mode === 'create'
      ? 'Nouveau Fournisseur'
      : mode === 'edit'
      ? 'Modifier le Fournisseur'
      : 'Détails du Fournisseur';

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-[800px] sm:max-w-[800px] overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>
        <div className="space-y-4 py-4">
          {mode === 'create' && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom</FormLabel>
                      <FormControl>
                        <Input disabled={isLoading} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" disabled={isLoading} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Téléphone</FormLabel>
                      <FormControl>
                        <Input disabled={isLoading} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adresse</FormLabel>
                      <FormControl>
                        <Textarea disabled={isLoading} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button disabled={isLoading} type="submit">
                  Créer
                </Button>
              </form>
            </Form>
          )}
          {mode === 'edit' && supplier && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom</FormLabel>
                      <FormControl>
                        <Input disabled={isLoading} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" disabled={isLoading} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Téléphone</FormLabel>
                      <FormControl>
                        <Input disabled={isLoading} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adresse</FormLabel>
                      <FormControl>
                        <Textarea disabled={isLoading} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button disabled={isLoading} type="submit">
                  Modifier
                </Button>
              </form>
            </Form>
          )}
          {mode === 'view' && supplier && (
            <div className="space-y-6">
              <div>
                <h3 className="font-medium">Nom</h3>
                <p>{supplier.name}</p>
              </div>
              <div>
                <h3 className="font-medium">Email</h3>
                <p>{supplier.email || '-'}</p>
              </div>
              <div>
                <h3 className="font-medium">Téléphone</h3>
                <p>{supplier.phone || '-'}</p>
              </div>
              <div>
                <h3 className="font-medium">Adresse</h3>
                <p>{supplier.address || '-'}</p>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}