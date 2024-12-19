'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Package,
  Tags,
  Users,
  ShoppingCart,
  Settings,
} from 'lucide-react';

const navigation = [
  {
    name: 'Tableau de bord',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Produits',
    href: '/dashboard/products',
    icon: Package,
  },
  {
    name: 'Catégories',
    href: '/dashboard/categories',
    icon: Tags,
  },
  {
    name: 'Fournisseurs',
    href: '/dashboard/suppliers',
    icon: Users,
  },
  {
    name: 'Ventes',
    href: '/dashboard/sales',
    icon: ShoppingCart,
  },
];

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className, ...props }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className={cn('py-4', className)} {...props}>
      <div className="px-3 py-2">
      <div className="flex justify-center items-center p-2">
        <div className='bg-gray-200 rounded-full p-6'>
          <img
            className="max-w-full max-h-20"
            src="https://www.zarla.com/images/zarla-outils-cie-1x1-2400x2400-20220315-3jvq3jcww379jpt6rkpw.png?crop=1:1,smart&width=250&dpr=2"
            alt=""
          />

        </div>
      </div>

        <h2 className="mb-2 px-4 text-center text-lg font-semibold tracking-tight">
          Gestion Stock
        </h2>

        <hr />
        <div className="space-y-1 mt-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                  isActive ? 'bg-accent text-accent-foreground' : 'transparent'
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}