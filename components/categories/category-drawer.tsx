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

const categorySchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  description: z.string().min(5, 'La description doit contenir au moins 5 caractères'),
});

interface CategoryDrawerProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  category?: Category;
  mode: 'create' | 'edit' | 'view';
}

export function CategoryDrawer({ 
  open, 
  onClose, 
  onSuccess, 
  category,
  mode 
}: CategoryDrawerProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name || '',
      description: category?.description || '',
    },
  });

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

  async function onSubmit(values: z.infer<typeof categorySchema>) {
    try {
      setIsLoading(true);
      // TODO: Implement category creation/update
      if (mode === 'create') {
        await CategoryService.createCategory(values);
      } else if (mode === 'edit') {
        await CategoryService.updateCategory(category!.id, values);
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to save category:', error);
    } finally {
      setIsLoading(false);
    }
  }

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
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                  Modifier
                </Button>
              </form>
            </Form>
          )}
          {mode === 'view' && category && (
            <div className="space-y-6">
              <div>
                <h3 className="font-medium">Nom</h3>
                <p>{category.name}</p>
              </div>
              <div>
                <h3 className="font-medium">Description</h3>
                <p>{category.description || '-'}</p>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}