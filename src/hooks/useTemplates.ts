import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../utils/api';

export const useTemplates = () => {
  const queryClient = useQueryClient();

  const fetchTemplates = async () => {
    const response = await api.get('/api/templates');
    return response.data;
  };

  const {
    data: templates,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['templates'],
    queryFn: fetchTemplates,
  });

  const addTemplate = useMutation({
    mutationFn: async (newTemplate: any) => {
      const response = await api.post('/api/templates', newTemplate);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    },
  });

  const updateTemplate = useMutation({
    mutationFn: async (updatedTemplate: any) => {
      const response = await api.put(`/api/templates/${updatedTemplate.id}`, updatedTemplate);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    },
  });

  const deleteTemplate = useMutation({
    mutationFn: async (templateId: string) => {
      await api.delete(`/api/templates/${templateId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    },
  });

  return {
    templates,
    isLoading,
    isError,
    addTemplate,
    updateTemplate,
    deleteTemplate,
  };
};
