import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, ShoppingCart, Users, TrendingUp } from 'lucide-react';
import { Overview } from '@/components/dashboard/overview';
import { PageHeader } from '@/components/page-header';

const stats = [
  {
    title: 'Ventes du jour',
    value: '2,345 €',
    icon: ShoppingCart,
    trend: '+12.5%',
  },
  {
    title: 'Produits en stock',
    value: '1,234',
    icon: Package,
    trend: '-2.3%',
  },
  {
    title: 'Clients actifs',
    value: '321',
    icon: Users,
    trend: '+5.7%',
  },
  {
    title: 'Chiffre d\'affaires',
    value: '45,678 €',
    icon: TrendingUp,
    trend: '+8.4%',
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Tableau de bord"
        description="Vue d'ensemble de votre quincaillerie"
      />
      <Overview />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.trend} par rapport au mois dernier
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}