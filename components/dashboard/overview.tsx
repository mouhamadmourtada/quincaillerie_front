'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement,
} from 'chart.js';
import { DashboardStats, getDashboardStats } from '@/lib/services/dashboard';
import { Skeleton } from '@/components/ui/skeleton';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export function Overview() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Erreur lors du chargement des statistiques:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading || !stats) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <Skeleton className="h-4 w-[150px]" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[150px]" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const salesChartData = {
    labels: stats.salesByMonth.map((item) => item.month),
    datasets: [
      {
        label: 'Ventes mensuelles',
        data: stats.salesByMonth.map((item) => item.total),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const stockChartData = {
    labels: stats.stockStatus.map((item) => item.status),
    datasets: [
      {
        data: stats.stockStatus.map((item) => item.count),
        backgroundColor: [
          'rgb(54, 162, 235)',
          'rgb(255, 206, 86)',
          'rgb(255, 99, 132)',
        ],
      },
    ],
  };

  const categoryChartData = {
    labels: stats.categoryDistribution.map((item) => item.category),
    datasets: [
      {
        label: 'Produits par catégorie',
        data: stats.categoryDistribution.map((item) => item.count),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
    ],
  };

  const profitMarginChartData = {
    labels: stats.profitMargin.map((item) => item.month),
    datasets: [
      {
        label: 'Marge bénéficiaire (%)',
        data: stats.profitMargin.map((item) => item.margin),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const customerSegmentationChartData = {
    labels: stats.customerSegmentation.map((item) => item.segment),
    datasets: [
      {
        data: stats.customerSegmentation.map((item) => item.revenue),
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)',
        ],
      },
    ],
  };

  const paymentMethodsChartData = {
    labels: stats.paymentMethods.map((item) => item.method),
    datasets: [
      {
        label: 'Montant total',
        data: stats.paymentMethods.map((item) => item.total),
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
      },
    ],
  };

  const stockRotationChartData = {
    labels: stats.stockRotation.map((item) => item.product),
    datasets: [
      {
        label: 'Taux de rotation',
        data: stats.stockRotation.map((item) => item.rotationRate),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
    ],
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Chiffre d'affaires total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalRevenue.toLocaleString()} FCFA
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Nombre de ventes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalSales.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Panier moyen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.averageOrderValue.toLocaleString()} FCFA
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Produits en rupture
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {stats.stockStatus.find((s) => s.status === 'Rupture')?.count || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Évolution des ventes</CardTitle>
          </CardHeader>
          <CardContent>
            <Line
              data={salesChartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top' as const,
                  },
                },
              }}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>État des stocks</CardTitle>
          </CardHeader>
          <CardContent>
            <Pie
              data={stockChartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'bottom' as const,
                  },
                },
              }}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Marge bénéficiaire</CardTitle>
          </CardHeader>
          <CardContent>
            <Line
              data={profitMarginChartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
              }}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Segmentation clients</CardTitle>
          </CardHeader>
          <CardContent>
            <Pie
              data={customerSegmentationChartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'bottom' as const,
                  },
                },
              }}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Moyens de paiement</CardTitle>
          </CardHeader>
          <CardContent>
            <Bar
              data={paymentMethodsChartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
              }}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Rotation des stocks</CardTitle>
          </CardHeader>
          <CardContent>
            <Bar
              data={stockRotationChartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Meilleures ventes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.topSellingProducts.map((product) => (
                <div
                  key={product.product.id}
                  className="flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium">{product.product.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {product.quantity} vendus
                    </div>
                  </div>
                  <div className="font-medium">
                    {product.revenue.toLocaleString()} FCFA
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Fournisseurs principaux</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.supplierDistribution.map((supplier) => (
                <div
                  key={supplier.supplier}
                  className="flex items-center justify-between"
                >
                  <div className="font-medium">{supplier.supplier}</div>
                  <div className="text-sm text-muted-foreground">
                    {supplier.count} produits
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
