'use client';

import { useState } from 'react';
import { Tabs, Tab, Button } from '@nextui-org/react';
import Table from '../../components/Table';
import { useTweets } from '../../hooks/useTweets';
import FormModal from '../../components/FormModal';
import { api } from '../../utils/api';

interface Tweet {
  id: string;
  status: string;
  createdAt: string;
}

export default function TweetsPage() {
  const [activeTab, setActiveTab] = useState('successful');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const {
    successfulTweets,
    failedTweets,
    loadMoreSuccessful,
    loadMoreFailed,
    hasMoreSuccessful,
    hasMoreFailed,
    reloadTweets,
  } = useTweets();

  const handleRetryAllFailed = async () => {
    try {
      await api.post('/api/twitter/retry-failed-tweets');
      reloadTweets();
    } catch (error) {
      console.error('Error retrying failed tweets:', error);
    }
  };

  const handleResendTweet = async (tweetId: string) => {
    try {
      await api.post(`/api/twitter/resend-successful-tweet/${tweetId}`);
      reloadTweets();
    } catch (error) {
      console.error('Error resending tweet:', error);
    }
  };

  const handleRetryFailedTweet = async (tweetId: string) => {
    try {
      await api.post(`/api/twitter/retry-failed-tweet/${tweetId}`);
      reloadTweets();
    } catch (error) {
      console.error('Error retrying tweet:', error);
    }
  };

  const handleCreateTweet = async (data: Record<string, any>) => {
    try {
      await api.post('/api/twitter/tweet', data);
      reloadTweets();
      setIsModalVisible(false);
    } catch (error) {
      console.error('Error creating tweet:', error);
    }
  };

  const columns: { header: string; accessor: keyof Tweet }[] = [
    { header: 'Tweet ID', accessor: 'id' },
    { header: 'Status', accessor: 'status' },
    { header: 'Created At', accessor: 'createdAt' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <Tabs
          selectedKey={activeTab}
          onSelectionChange={(key) => setActiveTab(key.toString())}
        >
          <Tab key="successful" title="Successful Tweets" />
          <Tab key="failed" title="Failed Tweets" />
        </Tabs>
        <div className="flex space-x-2">
          {activeTab === 'failed' && (
            <Button color="primary" onClick={handleRetryAllFailed}>
              Retry All Failed Tweets
            </Button>
          )}
          <Button onClick={() => setIsModalVisible(true)}>Post a Tweet</Button>
        </div>
      </div>
      {activeTab === 'successful' ? (
        <Table
          columns={columns}
          data={successfulTweets}
          loadMore={loadMoreSuccessful}
          hasMore={hasMoreSuccessful}
          actions={(item: Tweet) => (
            <Button size="sm" onClick={() => handleResendTweet(item.id)}>
              Resend
            </Button>
          )}
        />
      ) : (
        <Table
          columns={columns}
          data={failedTweets}
          loadMore={loadMoreFailed}
          hasMore={hasMoreFailed}
          actions={(item: Tweet) => (
            <Button size="sm" onClick={() => handleRetryFailedTweet(item.id)}>
              Retry
            </Button>
          )}
        />
      )}
      <FormModal
        visible={isModalVisible}
        closeHandler={() => setIsModalVisible(false)}
        title="Post a Tweet"
        fields={[
          {
            label: 'Status',
            name: 'status',
            type: 'text',
            placeholder: 'What’s happening?',
          },
        ]}
        onSubmit={handleCreateTweet}
      />
    </div>
  );
}
