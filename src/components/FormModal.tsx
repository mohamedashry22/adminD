'use client';

import { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Button } from '@nextui-org/react';

interface FormField {
  label: string;
  name: string;
  type: string;
  placeholder?: string;
}

interface FormModalProps {
  visible: boolean;
  closeHandler: () => void;
  title: string;
  fields: FormField[];
  onSubmit: (data: Record<string, any>) => void;
  initialValues?: Record<string, any>;
}

export default function FormModal({
  visible,
  closeHandler,
  title,
  fields,
  onSubmit,
  initialValues,
}: FormModalProps) {
  const [formData, setFormData] = useState<Record<string, any>>(initialValues || {});

  useEffect(() => {
    setFormData(initialValues || {});
  }, [initialValues]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
    closeHandler();
  };

  return (
    <Modal isOpen={visible} onClose={closeHandler}>
      <ModalContent>
        <ModalHeader>
          <h3>{title}</h3>
        </ModalHeader>
        <ModalBody>
          {fields.map((field) => (
            <Input
              key={field.name}
              label={field.label}
              placeholder={field.placeholder}
              name={field.name}
              type={field.type}
              onChange={handleChange}
              fullWidth
              value={formData[field.name] || ''}
            />
          ))}
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={closeHandler}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
