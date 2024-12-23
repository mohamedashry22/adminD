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
  Textarea,
} from '@nextui-org/react';
import { useTemplates } from '../../hooks/useTemplates';

interface Template {
  id: string;
  name: string;
  content: string;
}

export default function TemplatesPage() {
  const {
    templates,
    isLoading,
    isError,
    addTemplate,
    updateTemplate,
    deleteTemplate,
  } = useTemplates();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<Template | null>(null);
  const [formValues, setFormValues] = useState({
    name: '',
    content: '',
  });

  const handleOpenModal = (template?: Template) => {
    if (template) {
      setCurrentTemplate(template);
      setFormValues({
        name: template.name,
        content: template.content,
      });
    } else {
      setCurrentTemplate(null);
      setFormValues({
        name: '',
        content: '',
      });
    }
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setCurrentTemplate(null);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    if (currentTemplate) {
      await updateTemplate.mutateAsync({
        ...currentTemplate,
        ...formValues,
      });
    } else {
      await addTemplate.mutateAsync(formValues);
    }
    handleCloseModal();
  };

  const handleDelete = async (id: string) => {
    await deleteTemplate.mutateAsync(id);
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'content', label: 'Content' },
    { key: 'actions', label: 'Actions' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-2xl font-semibold">Templates</p>
        <Button onPress={() => handleOpenModal()}>Add Template</Button>
      </div>
      {isLoading ? (
        <p>Loading...</p>
      ) : isError ? (
        <p className="text-red-500">Error loading templates.</p>
      ) : (
        <Table aria-label="Templates Table" className="w-full">
          <TableHeader>
            {columns.map((column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            ))}
          </TableHeader>
          <TableBody>
            {templates.map((template: Template) => (
              <TableRow key={template.id}>
                <TableCell>{template.name}</TableCell>
                <TableCell>{template.content}</TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    onPress={() => handleOpenModal(template)}
                    className="mr-2"
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    color="danger"
                    onPress={() => handleDelete(template.id)}
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
                  {currentTemplate ? 'Edit Template' : 'Add Template'}
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
                <Textarea
                  fullWidth
                  label="Content"
                  name="content"
                  value={formValues.content}
                  onChange={handleChange}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="light"
                  color="danger"
                  onPress={onClose}
                >
                  Cancel
                </Button>
                <Button  onPress={handleSubmit}>
                  {currentTemplate ? 'Update' : 'Add'}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
