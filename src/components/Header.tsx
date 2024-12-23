'use client';

import { useAuth } from '../hooks/useAuth';
import { Menu } from '@headlessui/react';
import { FaBars } from 'react-icons/fa';

export default function Header() {
  const { user, logout } = useAuth();
  const firstChar = user?.email?.charAt(0).toUpperCase() || 'U';

  return (
    <header className="flex items-center justify-between p-4 bg-white border-b md:ml-64">
      <div className="flex items-center">
        <h1 className="text-xl font-semibold">Dashboard</h1>
      </div>
      <div className="relative">
        <Menu as="div" className="relative inline-block text-left">
          <Menu.Button className="flex items-center space-x-2 focus:outline-none">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-500 rounded-full">
              <span className="text-lg font-semibold text-white">{firstChar}</span>
            </div>
            <span className="hidden font-medium md:block">{user?.email}</span>
          </Menu.Button>
          <Menu.Items className="absolute right-0 w-48 mt-2 origin-top-right bg-white border rounded-md shadow-lg focus:outline-none">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={logout}
                  className={`${
                    active ? 'bg-gray-100' : ''
                  } flex w-full px-4 py-2 text-sm text-left text-gray-700`}
                >
                  Logout
                </button>
              )}
            </Menu.Item>
          </Menu.Items>
        </Menu>
      </div>
    </header>
  );
}