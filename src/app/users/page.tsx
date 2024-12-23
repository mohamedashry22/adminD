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
import { useUsers } from '../../hooks/useUsers';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function UsersPage() {
  const { users, isLoading, isError, addUser, updateUser, deleteUser } = useUsers();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    role: '',
  });

  const handleOpenModal = (user?: User) => {
    if (user) {
      setCurrentUser(user);
      setFormValues({
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      setCurrentUser(null);
      setFormValues({
        name: '',
        email: '',
        role: '',
      });
    }
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setCurrentUser(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    if (currentUser) {
      await updateUser.mutateAsync({
        ...currentUser,
        ...formValues,
      });
    } else {
      await addUser.mutateAsync(formValues);
    }
    handleCloseModal();
  };

  const handleDelete = async (id: string) => {
    await deleteUser.mutateAsync(id);
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
    { key: 'actions', label: 'Actions' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-2xl font-semibold">Users</p>
        <Button onPress={() => handleOpenModal()}>Add User</Button>
      </div>
      {isLoading ? (
        <p>Loading...</p>
      ) : isError ? (
        <p className="text-red-500">Error loading users.</p>
      ) : (
        <Table aria-label="Users Table" className="w-full">
          <TableHeader>
            {columns.map((column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            ))}
          </TableHeader>
          <TableBody>
            {users.map((user: User) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    onPress={() => handleOpenModal(user)}
                    className="mr-2"
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    color="danger"
                    onPress={() => handleDelete(user.id)}
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
                  {currentUser ? 'Edit User' : 'Add User'}
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
                  label="Email"
                  name="email"
                  value={formValues.email}
                  onChange={handleChange}
                />
                <Input
                  fullWidth
                  label="Role"
                  name="role"
                  value={formValues.role}
                  onChange={handleChange}
                />
              </ModalBody>
              <ModalFooter>
                <Button  variant="light" color="danger" onPress={onClose}>
                  Cancel
                </Button>
                <Button  onPress={handleSubmit}>
                  {currentUser ? 'Update' : 'Add'}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
