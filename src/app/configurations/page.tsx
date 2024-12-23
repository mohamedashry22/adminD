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
import { useConfigurations } from '../../hooks/useConfigurations';

interface Configuration {
  id: string;
  key: string;
  value: string;
}

export default function ConfigurationsPage() {
  const {
    configurations,
    isLoading,
    isError,
    addConfiguration,
    updateConfiguration,
    deleteConfiguration,
  } = useConfigurations();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentConfiguration, setCurrentConfiguration] = useState<Configuration | null>(null);
  const [formValues, setFormValues] = useState({
    key: '',
    value: '',
  });

  const handleOpenModal = (config?: Configuration) => {
    if (config) {
      setCurrentConfiguration(config);
      setFormValues({
        key: config.key,
        value: config.value,
      });
    } else {
      setCurrentConfiguration(null);
      setFormValues({
        key: '',
        value: '',
      });
    }
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setCurrentConfiguration(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    if (currentConfiguration) {
      await updateConfiguration.mutateAsync({
        ...currentConfiguration,
        ...formValues,
      });
    } else {
      await addConfiguration.mutateAsync(formValues);
    }
    handleCloseModal();
  };

  const handleDelete = async (id: string) => {
    await deleteConfiguration.mutateAsync(id);
  };

  const columns = [
    { key: 'key', label: 'Key' },
    { key: 'value', label: 'Value' },
    { key: 'actions', label: 'Actions' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-2xl font-semibold">Configurations</p>
        <Button onPress={() => handleOpenModal()}>Add Configuration</Button>
      </div>
      {isLoading ? (
        <p>Loading...</p>
      ) : isError ? (
        <p className="text-red-500">Error loading configurations.</p>
      ) : (
        <Table aria-label="Configurations Table" className="w-full">
          <TableHeader>
            {columns.map((column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            ))}
          </TableHeader>
          <TableBody>
            {configurations.map((config: Configuration) => (
              <TableRow key={config.id}>
                <TableCell>{config.key}</TableCell>
                <TableCell>{config.value}</TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    onPress={() => handleOpenModal(config)}
                    className="mr-2"
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    color="danger"
                    onPress={() => handleDelete(config.id)}
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
                  {currentConfiguration ? 'Edit Configuration' : 'Add Configuration'}
                </p>
              </ModalHeader>
              <ModalBody>
                <Input
                  fullWidth
                  label="Key"
                  name="key"
                  value={formValues.key}
                  onChange={handleChange}
                />
                <Input
                  fullWidth
                  label="Value"
                  name="value"
                  value={formValues.value}
                  onChange={handleChange}
                />
              </ModalBody>
              <ModalFooter>
                <Button variant="light" color="danger" onPress={onClose}>
                  Cancel
                </Button>
                <Button onPress={handleSubmit}>
                  {currentConfiguration ? 'Update' : 'Add'}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
