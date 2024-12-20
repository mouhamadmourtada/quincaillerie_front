import { API_URL, getAuthHeader } from '@/lib/config';

interface DashboardStats {
    currentMonthStats: {
        totalSales: number;
        totalRevenue: number;
    };
    todayStats: {
        totalSales: number;
        totalRevenue: number;
    };
    inventory: {
        totalProducts: number;
        totalCategories: number;
        lowStockProducts: Array<{
            id: string;
            name: string;
            stock: number;
            category: string;
        }>;
    };
    paymentStats: Array<{
        type: string;
        count: number;
        total: number;
    }>;
}

interface SaleStats {
    date: string;
    totalSales: number;
    totalRevenue: number;
}

interface InventoryStats {
    categoryName: string;
    totalProducts: number;
    totalStock: number;
    lowStockProducts: number;
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
    const response = await fetch(`${API_URL}/dashboard/stats`, {
        headers: getAuthHeader(),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
    }

    return response.json();
};

export const getSalesStats = async (startDate: string, endDate: string): Promise<SaleStats[]> => {
    const url = new URL(`${API_URL}/dashboard/sales`);
    url.searchParams.append('startDate', startDate);
    url.searchParams.append('endDate', endDate);

    const response = await fetch(url.toString(), {
        headers: getAuthHeader(),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
    }

    return response.json();
};

export const getInventoryStats = async (): Promise<InventoryStats[]> => {
    const response = await fetch(`${API_URL}/dashboard/inventory`, {
        headers: getAuthHeader(),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
    }

    return response.json();
};
