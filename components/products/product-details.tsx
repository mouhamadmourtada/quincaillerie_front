'use client';

import { Product } from '@/types/product';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface ProductDetailsProps {
  product: Product;
  category: { id: string; name: string };
}

export function ProductDetails({ product, category }: ProductDetailsProps) {
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
            <p>{category.name}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Prix</p>
            <p>{product.price.toFixed(2)} €</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Stock</p>
            <p>{product.stock}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">ID</p>
            <p className="text-sm font-mono">{product.id}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
