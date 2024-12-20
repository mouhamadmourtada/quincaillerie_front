'use client';

import { Product } from '@/types/product';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { formatCurrency } from '@/lib/formatters';

interface ProductDetailsProps {
  product: Product;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{product.name}</CardTitle>
        <CardDescription>Détails du produit</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Catégorie</p>
            <p>{product.category?.name || 'Non catégorisé'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Prix</p>
            <p>{formatCurrency(Number(product.price || 0))}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Stock</p>
            <p>{product.stock || 0}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">ID</p>
            <p className="text-sm font-mono">{product.id}</p>
          </div>
          {product.supplier && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">Fournisseur</p>
              <p>{product.supplier.name}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
