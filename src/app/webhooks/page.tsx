'use client';

import { useState } from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from '@nextui-org/react';
import { useWebhooks } from '../../hooks/useWebhooks';

interface Webhook {
  id: string;
  name: string;
  url: string;
}

export default function WebhooksPage() {
  const {
    webhooks,
    isLoading,
    isError,
    addWebhook,
    updateWebhook,
    deleteWebhook,
  } = useWebhooks();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentWebhook, setCurrentWebhook] = useState<Webhook | null>(null);
  const [formValues, setFormValues] = useState({
    name: '',
    url: '',
  });

  const handleOpenModal = (webhook?: Webhook) => {
    if (webhook) {
      setCurrentWebhook(webhook);
      setFormValues({
        name: webhook.name,
        url: webhook.url,
      });
    } else {
      setCurrentWebhook(null);
      setFormValues({
        name: '',
        url: '',
      });
    }
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setCurrentWebhook(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    if (currentWebhook) {
      await updateWebhook.mutateAsync({
        ...currentWebhook,
        ...formValues,
      });
    } else {
      await addWebhook.mutateAsync(formValues);
    }
    handleCloseModal();
  };

  const handleDelete = async (id: string) => {
    await deleteWebhook.mutateAsync(id);
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'url', label: 'URL' },
    { key: 'actions', label: 'Actions' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-2xl font-semibold">Webhooks</p>
        <Button onPress={() => handleOpenModal()}>Add Webhook</Button>
      </div>
      {isLoading ? (
        <p>Loading...</p>
      ) : isError ? (
        <p className="text-red-500">Error loading webhooks.</p>
      ) : (
        <Table aria-label="Webhooks Table" className="w-full">
          <TableHeader>
            {columns.map((column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            ))}
          </TableHeader>
          <TableBody>
            {webhooks.map((webhook: Webhook) => (
              <TableRow key={webhook.id}>
                <TableCell>{webhook.name}</TableCell>
                <TableCell>{webhook.url}</TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    onPress={() => handleOpenModal(webhook)}
                    className="mr-2"
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    color="danger"
                    onPress={() => handleDelete(webhook.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Modal isOpen={isModalVisible} onOpenChange={setIsModalVisible}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <p className="text-xl font-semibold">
                  {currentWebhook ? 'Edit Webhook' : 'Add Webhook'}
                </p>
              </ModalHeader>
              <ModalBody>
                <Input
                  fullWidth
                  label="Name"
                  name="name"
                  value={formValues.name}
                  onChange={handleChange}
                />
                <Input
                  fullWidth
                  label="URL"
                  name="url"
                  value={formValues.url}
                  onChange={handleChange}
                />
              </ModalBody>
              <ModalFooter>
                <Button  variant="light" color="danger" onPress={onClose}>
                  Cancel
                </Button>
                <Button  onPress={handleSubmit}>
                  {currentWebhook ? 'Update' : 'Add'}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
