import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { api } from '../utils/api';

export interface Tweet {
  id: string;
  status: string;
  createdAt: string;
}

interface FetchTweetsResponse {
  tweets: Tweet[];
  hasMore: boolean;
}

export const useTweets = () => {
  const queryClient = useQueryClient();
  const PAGE_SIZE = 10;

  const [successfulPage, setSuccessfulPage] = useState(1);
  const [failedPage, setFailedPage] = useState(1);

  const fetchSuccessfulTweets = async (page: number): Promise<FetchTweetsResponse> => {
    const response = await api.get('/api/twitter/successful-tweets', {
      params: { page, limit: PAGE_SIZE },
    });
    return response.data;
  };

  const fetchFailedTweets = async (page: number): Promise<FetchTweetsResponse> => {
    const response = await api.get('/api/twitter/failed-tweets', {
      params: { page, limit: PAGE_SIZE },
    });
    return response.data;
  };

  const {
    data: successfulData,
    isLoading: isLoadingSuccessful,
    isError: isErrorSuccessful,
    refetch: refetchSuccessful,
  } = useQuery({
    queryKey: ['successfulTweets', successfulPage],
    queryFn: () => fetchSuccessfulTweets(successfulPage),
    staleTime: 5000,
  });

  const {
    data: failedData,
    isLoading: isLoadingFailed,
    isError: isErrorFailed,
    refetch: refetchFailed,
  } = useQuery({
    queryKey: ['failedTweets', failedPage],
    queryFn: () => fetchFailedTweets(failedPage),
    staleTime: 5000,
  });

  const loadMoreSuccessful = () => {
    if (successfulData?.hasMore) {
      setSuccessfulPage((prev) => prev + 1);
    }
  };

  const loadMoreFailed = () => {
    if (failedData?.hasMore) {
      setFailedPage((prev) => prev + 1);
    }
  };

  const reloadTweets = () => {
    queryClient.invalidateQueries({ queryKey: ['successfulTweets'] });
    queryClient.invalidateQueries({ queryKey: ['failedTweets'] });
  };

  const successfulTweets = successfulData?.tweets || [];
  const failedTweets = failedData?.tweets || [];

  const hasMoreSuccessful = successfulData?.hasMore || false;
  const hasMoreFailed = failedData?.hasMore || false;

  return {
    successfulTweets,
    failedTweets,
    loadMoreSuccessful,
    loadMoreFailed,
    hasMoreSuccessful,
    hasMoreFailed,
    reloadTweets,
    isLoadingSuccessful,
    isLoadingFailed,
    isErrorSuccessful,
    isErrorFailed,
  };
};
