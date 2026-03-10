import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../../lib/axios';

const fetchDashboardStats = async () => {
    const response = await axiosInstance.get('/admin/stats');
    return response.data.data;
};

export const useDashboardStats = () => {
    return useQuery({
        queryKey: ['dashboardStats'],
        queryFn: fetchDashboardStats,
        staleTime: 5 * 60 * 1000, // 5 minutes cache
    });
};
