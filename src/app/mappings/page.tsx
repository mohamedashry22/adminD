'use client';

import { useState } from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
  useDisclosure,
} from '@nextui-org/react';
import { useMappings } from '../../hooks/useMappings';

interface Mapping {
  id: string;
  sourceField: string;
  targetField: string;
}

export default function MappingsPage() {
  const {
    mappings,
    isLoading,
    isError,
    addMapping,
    updateMapping,
    deleteMapping,
  } = useMappings();

  const { isOpen: isModalVisible, onOpen: handleOpenModal, onOpenChange: handleModalChange } = useDisclosure();
  const [currentMapping, setCurrentMapping] = useState<Mapping | null>(null);
  const [formValues, setFormValues] = useState({
    sourceField: '',
    targetField: '',
  });

  const handleEditOrAdd = (mapping?: Mapping) => {
    if (mapping) {
      setCurrentMapping(mapping);
      setFormValues({
        sourceField: mapping.sourceField,
        targetField: mapping.targetField,
      });
    } else {
      setCurrentMapping(null);
      setFormValues({
        sourceField: '',
        targetField: '',
      });
    }
    handleOpenModal();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    if (currentMapping) {
      await updateMapping.mutateAsync({
        ...currentMapping,
        ...formValues,
      });
    } else {
      await addMapping.mutateAsync(formValues);
    }
    handleModalChange();
  };

  const handleDelete = async (id: string) => {
    await deleteMapping.mutateAsync(id);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Mappings</h2>
        <Button onPress={() => handleEditOrAdd()}>Add Mapping</Button>
      </div>
      {isLoading ? (
        <div className="flex justify-center">
          <Spinner size="lg" />
        </div>
      ) : isError ? (
        <p className="text-red-600">Error loading mappings.</p>
      ) : (
        <Table
          aria-label="Mappings Table"
        >
          <TableHeader>
            <TableColumn>Source Field</TableColumn>
            <TableColumn>Target Field</TableColumn>
            <TableColumn>Actions</TableColumn>
          </TableHeader>
          <TableBody>
            {mappings.map((mapping: Mapping) => (
              <TableRow key={mapping.id}>
                <TableCell>{mapping.sourceField}</TableCell>
                <TableCell>{mapping.targetField}</TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    onPress={() => handleEditOrAdd(mapping)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    color="danger"
                    onPress={() => handleDelete(mapping.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Modal isOpen={isModalVisible} onOpenChange={handleModalChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {currentMapping ? 'Edit Mapping' : 'Add Mapping'}
              </ModalHeader>
              <ModalBody>
                <Input
                  fullWidth
                  label="Source Field"
                  name="sourceField"
                  value={formValues.sourceField}
                  onChange={handleChange}
                />
                <Input
                  fullWidth
                  label="Target Field"
                  name="targetField"
                  value={formValues.targetField}
                  onChange={handleChange}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={handleSubmit}>
                  {currentMapping ? 'Update' : 'Add'}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
