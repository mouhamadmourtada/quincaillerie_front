'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ProductDrawer } from './product-drawer';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { ProductService } from '@/services/product-service';
import { useToast } from '@/hooks/use-toast';
import type { Product } from '@/types/product';

export function ProductTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchProducts = async () => {
    try {
      const data = await ProductService.getProducts();
      // Ensure data is correctly typed
      const typedData: Product[] = data.map(product => ({
        ...product,
        id: String(product.id), // Ensure id is a string
        categoryId: String(product.categoryId), // Ensure categoryId is a string
      }));
      setProducts(typedData);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de charger les produits',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
  };

  const handleDelete = (product: Product) => {
    setDeletingProduct(product);
  };

  const confirmDelete = async () => {
    if (!deletingProduct) return;

    try {
      await ProductService.deleteProduct(deletingProduct.id);
      await fetchProducts();
      toast({
        title: 'Produit supprimé avec succès',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de supprimer le produit',
      });
    } finally {
      setDeletingProduct(null);
    }
  };

  const handleProductSaved = () => {
    fetchProducts();
    setEditingProduct(null);
  };

  if (isLoading) {
    return <div className="text-center py-4">Chargement...</div>;
  }

  return (
    <div className="table-container">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Catégorie</TableHead>
            <TableHead>Prix</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>
                <Badge variant="outline">
                  {product.category?.name || 'Non catégorisé'}
                </Badge>
              </TableCell>
              <TableCell>{(product.price || 0).toFixed(2)} €</TableCell>
              <TableCell>
                <Badge variant={product.stock > 10 ? 'secondary' : 'destructive'}>
                  {product.stock}
                </Badge>
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEdit(product)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(product)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {editingProduct && (
        <ProductDrawer
          product={editingProduct}
          open={true}
          onClose={() => setEditingProduct(null)}
          mode="edit"
          onSuccess={handleProductSaved}
          categories={[
            { id: "1", name: 'Category 1' },
            { id: "2", name: 'Category 2' },
          ]}
        />
      )}

      <AlertDialog open={!!deletingProduct} onOpenChange={() => setDeletingProduct(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce produit ? Cette action ne peut pas être annulée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
