import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../utils/api';

export const useConfigurations = () => {
  const queryClient = useQueryClient();

  const fetchConfigurations = async () => {
    const response = await api.get('/api/configurations');
    return response.data;
  };

  const {
    data: configurations,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['configurations'],
    queryFn: fetchConfigurations,
  });

  const addConfiguration = useMutation({
    mutationFn: async (newConfig: any) => {
      const response = await api.post('/api/configurations', newConfig);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['configurations'] });
    },
  });

  const updateConfiguration = useMutation({
    mutationFn: async (updatedConfig: any) => {
      const response = await api.put(`/api/configurations/${updatedConfig.id}`, updatedConfig);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['configurations'] });
    },
  });

  const deleteConfiguration = useMutation({
    mutationFn: async (configId: string) => {
      await api.delete(`/api/configurations/${configId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['configurations'] });
    },
  });

  return {
    configurations,
    isLoading,
    isError,
    addConfiguration,
    updateConfiguration,
    deleteConfiguration,
  };
};