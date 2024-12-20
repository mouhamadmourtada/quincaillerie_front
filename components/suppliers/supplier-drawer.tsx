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
import { useToast } from '@/hooks/use-toast';
import { showToast } from '@/lib/toast';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  Globe, 
  Calendar,
  Briefcase,
  CreditCard,
  FileText
} from 'lucide-react';

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
  const { toast } = useToast();

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

  const handleSubmit = async (values: z.infer<typeof supplierSchema>) => {
    try {
      setIsLoading(true);
      if (mode === 'create') {
        await SupplierService.createSupplier(values);
        toast(showToast.success({
          title: 'Fournisseur créé avec succès',
          description: 'Le nouveau fournisseur a été ajouté'
        }));
      } else if (mode === 'edit') {
        await SupplierService.updateSupplier(supplier!.id, values);
        toast(showToast.success({
          title: 'Fournisseur modifié avec succès',
          description: 'Les modifications ont été enregistrées'
        }));
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to save supplier:', error);
      toast(showToast.error({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Une erreur est survenue lors de l\'enregistrement'
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const title =
    mode === 'create'
      ? 'Nouveau Fournisseur'
      : mode === 'edit'
      ? 'Modifier le Fournisseur'
      : 'Détails du Fournisseur';

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const formatDate = (date: string) => {
    return format(new Date(date), 'dd MMMM yyyy', { locale: fr });
  };

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
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 mt-4">
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
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 mt-4">
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
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Informations du fournisseur</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Colonne de gauche avec logo et infos principales */}
                    <div className="flex flex-col items-center space-y-4 md:w-1/3">
                      <Avatar className="h-32 w-32">
                        <AvatarFallback className="text-2xl bg-primary/10">
                          {getInitials(supplier.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-center">
                        <h3 className="text-2xl font-semibold">{supplier.name}</h3>
                        <p className="text-sm text-muted-foreground">{supplier.email}</p>
                      </div>
                      <Badge variant="outline" className="mt-2">
                        {supplier.type || 'Fournisseur'}
                      </Badge>
                    </div>

                    {/* Colonne de droite avec les détails */}
                    <div className="flex-1 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Email */}
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-full bg-primary/10">
                            <Mail className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Email</p>
                            <p className="text-sm text-muted-foreground">{supplier.email}</p>
                          </div>
                        </div>

                        {/* Téléphone */}
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-full bg-primary/10">
                            <Phone className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Téléphone</p>
                            <p className="text-sm text-muted-foreground">
                              {supplier.phone || 'Non renseigné'}
                            </p>
                          </div>
                        </div>

                        {/* Numéro SIRET */}
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-full bg-primary/10">
                            <FileText className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Numéro SIRET</p>
                            <p className="text-sm text-muted-foreground">
                              {supplier.siret || 'Non renseigné'}
                            </p>
                          </div>
                        </div>

                        {/* Date d'inscription */}
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-full bg-primary/10">
                            <Calendar className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Date d'inscription</p>
                            <p className="text-sm text-muted-foreground">
                              {supplier.createdAt ? formatDate(supplier.createdAt) : 'Non renseignée'}
                            </p>
                          </div>
                        </div>

                        {/* Secteur d'activité */}
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-full bg-primary/10">
                            <Briefcase className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Secteur d'activité</p>
                            <p className="text-sm text-muted-foreground">
                              {supplier.sector || 'Non renseigné'}
                            </p>
                          </div>
                        </div>

                        {/* Mode de paiement préféré */}
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-full bg-primary/10">
                            <CreditCard className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Mode de paiement préféré</p>
                            <p className="text-sm text-muted-foreground">
                              {supplier.preferredPaymentMethod || 'Non renseigné'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Section adresse */}
                      <div className="border-t pt-6 mt-6">
                        <h4 className="text-sm font-semibold mb-4">Adresse</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Adresse */}
                          <div className="flex items-center space-x-3">
                            <div className="p-2 rounded-full bg-primary/10">
                              <MapPin className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">Rue</p>
                              <p className="text-sm text-muted-foreground">
                                {supplier.address || 'Non renseignée'}
                              </p>
                            </div>
                          </div>

                          {/* Ville */}
                          <div className="flex items-center space-x-3">
                            <div className="p-2 rounded-full bg-primary/10">
                              <Building className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">Ville</p>
                              <p className="text-sm text-muted-foreground">
                                {supplier.city || 'Non renseignée'}
                              </p>
                            </div>
                          </div>

                          {/* Pays */}
                          <div className="flex items-center space-x-3">
                            <div className="p-2 rounded-full bg-primary/10">
                              <Globe className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">Pays</p>
                              <p className="text-sm text-muted-foreground">
                                {supplier.country || 'Non renseigné'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Section entreprise */}
                      <div className="border-t pt-6 mt-6">
                        <h4 className="text-sm font-semibold mb-4">Informations entreprise</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Nom de l'entreprise */}
                          <div className="flex items-center space-x-3">
                            <div className="p-2 rounded-full bg-primary/10">
                              <Building2 className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">Nom de l'entreprise</p>
                              <p className="text-sm text-muted-foreground">
                                {supplier.companyName || supplier.name}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}