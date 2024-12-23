import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../utils/api';

export const useUsers = () => {
  const queryClient = useQueryClient();

  const fetchUsers = async () => {
    const response = await api.get('/api/users');
    return response.data;
  };

  const {
    data: users,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  const addUser = useMutation({
    mutationFn: async (newUser: any) => {
      const response = await api.post('/api/users', newUser);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const updateUser = useMutation({
    mutationFn: async (updatedUser: any) => {
      const response = await api.put(`/api/users/${updatedUser.id}`, updatedUser);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const deleteUser = useMutation({
    mutationFn: async (userId: string) => {
      await api.delete(`/api/users/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  return {
    users,
    isLoading,
    isError,
    addUser,
    updateUser,
    deleteUser,
  };
};
