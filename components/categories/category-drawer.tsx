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
import { Category } from '@/types/category';
import { CategoryService } from '@/services/category-service';
import { useToast } from '@/hooks/use-toast';
import { showToast } from '@/lib/toast';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Tag,
  Calendar,
  Package,
  FileText,
  BarChart,
  Hash,
  Layers,
  CircleDot
} from 'lucide-react';

const categorySchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  description: z.string().optional(),
});

interface CategoryDrawerProps {
  open: boolean;
  onClose: () => void;
  category?: Category;
  mode: 'create' | 'edit' | 'view';
  onSuccess: () => void;
}

export function CategoryDrawer({ 
  open, 
  onClose, 
  category,
  mode,
  onSuccess 
}: CategoryDrawerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name || '',
      description: category?.description || '',
    },
  });

  const formatDate = (date: string) => {
    return format(new Date(date), 'dd MMMM yyyy', { locale: fr });
  };

  // Mettre à jour les valeurs du formulaire lorsque la catégorie change
  useEffect(() => {
    if (category && (mode === 'edit' || mode === 'view')) {
      form.reset({
        name: category.name,
        description: category.description,
      });
    } else {
      form.reset({
        name: '',
        description: '',
      });
    }
  }, [category, mode, form]);

  const handleSubmit = async (values: z.infer<typeof categorySchema>) => {
    try {
      setIsLoading(true);
      if (mode === 'create') {
        await CategoryService.createCategory(values);
        toast(showToast.success({
          title: 'Catégorie créée avec succès',
          description: 'La nouvelle catégorie a été ajoutée'
        }));
      } else if (mode === 'edit') {
        await CategoryService.updateCategory(category!.id, values);
        toast(showToast.success({
          title: 'Catégorie modifiée avec succès',
          description: 'Les modifications ont été enregistrées'
        }));
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to save category:', error);
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
      ? 'Nouvelle Catégorie'
      : mode === 'edit'
      ? 'Modifier la Catégorie'
      : 'Détails de la Catégorie';

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
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
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
          {mode === 'edit' && category && (
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
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea disabled={isLoading} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button disabled={isLoading} type="submit">
                  Enregistrer
                </Button>
              </form>
            </Form>
          )}
          {mode === 'view' && category && (
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Informations de la catégorie</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Colonne de gauche avec icône et infos principales */}
                    <div className="flex flex-col items-center space-y-4 md:w-1/3">
                      <div className="h-32 w-32 rounded-full bg-primary/10 flex items-center justify-center">
                        <Tag className="h-16 w-16 text-primary" />
                      </div>
                      <div className="text-center">
                        <h3 className="text-2xl font-semibold">{category.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {category.description || 'Aucune description'}
                        </p>
                      </div>
                      <Badge variant="outline" className="mt-2">
                        {category.status || 'Active'}
                      </Badge>
                    </div>

                    {/* Colonne de droite avec les détails */}
                    <div className="flex-1 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* ID */}
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-full bg-primary/10">
                            <Hash className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Identifiant</p>
                            <p className="text-sm text-muted-foreground">
                              {category.id}
                            </p>
                          </div>
                        </div>

                        {/* Date de création */}
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-full bg-primary/10">
                            <Calendar className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Date de création</p>
                            <p className="text-sm text-muted-foreground">
                              {category.createdAt ? formatDate(category.createdAt) : 'Non renseignée'}
                            </p>
                          </div>
                        </div>

                        {/* Nombre de produits */}
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-full bg-primary/10">
                            <Package className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Nombre de produits</p>
                            <p className="text-sm text-muted-foreground">
                              {category.productsCount || 0} produits
                            </p>
                          </div>
                        </div>

                        {/* Statut */}
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-full bg-primary/10">
                            <CircleDot className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Statut</p>
                            <p className="text-sm text-muted-foreground">
                              {category.status || 'Active'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Section statistiques */}
                      <div className="border-t pt-6 mt-6">
                        <h4 className="text-sm font-semibold mb-4">Statistiques</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Valeur totale des produits */}
                          <div className="flex items-center space-x-3">
                            <div className="p-2 rounded-full bg-primary/10">
                              <BarChart className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">Valeur totale des produits</p>
                              <p className="text-sm text-muted-foreground">
                                {category.totalValue ? `${category.totalValue} €` : 'Non calculée'}
                              </p>
                            </div>
                          </div>

                          {/* Niveau de hiérarchie */}
                          <div className="flex items-center space-x-3">
                            <div className="p-2 rounded-full bg-primary/10">
                              <Layers className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">Niveau de hiérarchie</p>
                              <p className="text-sm text-muted-foreground">
                                {category.level || 'Catégorie principale'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Section description */}
                      {category.description && (
                        <div className="border-t pt-6 mt-6">
                          <div className="flex items-start space-x-3">
                            <div className="p-2 rounded-full bg-primary/10">
                              <FileText className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold mb-2">Description détaillée</h4>
                              <p className="text-sm text-muted-foreground">
                                {category.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
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