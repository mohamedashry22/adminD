import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../utils/api';

export const useMappings = () => {
  const queryClient = useQueryClient();

  const fetchMappings = async () => {
    const response = await api.get('/api/mappings');
    return response.data;
  };

  const {
    data: mappings,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['mappings'],
    queryFn: fetchMappings,
  });

  const addMapping = useMutation({
    mutationFn: async (newMapping: any) => {
      const response = await api.post('/api/mappings', newMapping);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mappings'] });
    },
  });

  const updateMapping = useMutation({
    mutationFn: async (updatedMapping: any) => {
      const response = await api.put(`/api/mappings/${updatedMapping.id}`, updatedMapping);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mappings'] });
    },
  });

  const deleteMapping = useMutation({
    mutationFn: async (mappingId: string) => {
      await api.delete(`/api/mappings/${mappingId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mappings'] });
    },
  });

  return {
    mappings,
    isLoading,
    isError,
    addMapping,
    updateMapping,
    deleteMapping,
  };
};
