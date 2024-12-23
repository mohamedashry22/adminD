import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../utils/api';

interface Webhook {
  id: string;
  name: string;
  url: string;
}

export const useWebhooks = () => {
  const queryClient = useQueryClient();

  const fetchWebhooks = async (): Promise<Webhook[]> => {
    const response = await api.get('/api/webhooks');
    return response.data;
  };

  const {
    data: webhooks = [],
    isLoading,
    isError,
  } = useQuery<Webhook[]>({
    queryKey: ['webhooks'],
    queryFn: fetchWebhooks,
  });

  const addWebhook = useMutation({
    mutationFn: async (newWebhook: Partial<Webhook>) => {
      const response = await api.post('/api/webhooks', newWebhook);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhooks'] });
    },
  });

  const updateWebhook = useMutation({
    mutationFn: async (updatedWebhook: Webhook) => {
      const response = await api.put(`/api/webhooks/${updatedWebhook.id}`, updatedWebhook);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhooks'] });
    },
  });

  const deleteWebhook = useMutation({
    mutationFn: async (webhookId: string) => {
      await api.delete(`/api/webhooks/${webhookId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhooks'] });
    },
  });

  return {
    webhooks,
    isLoading,
    isError,
    addWebhook,
    updateWebhook,
    deleteWebhook,
  };
};