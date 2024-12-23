'use client';

import { useState } from 'react';
import { FaHome, FaUsers, FaCog, FaTwitter, FaBars } from 'react-icons/fa';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: <FaHome /> },
    { name: 'Users', href: '/users', icon: <FaUsers /> },
    { name: 'Configurations', href: '/configurations', icon: <FaCog /> },
    { name: 'Tweets', href: '/tweets', icon: <FaTwitter /> },
  ];

  return (
    <>
      {/* Hamburger Menu for Mobile */}
      <div className="fixed top-0 left-0 z-50 flex items-center p-4 bg-white border-b md:hidden">
        <button onClick={toggleSidebar} className="text-2xl">
          <FaBars />
        </button>
        <h1 className="ml-4 text-xl font-semibold">My App</h1>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 overflow-y-auto transition-transform bg-white border-r md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-center h-20 border-b">
          <h1 className="text-2xl font-bold">My App</h1>
        </div>
        <nav className="p-4">
          {menuItems.map((item) => (
            <Link 
            key={item.name} 
            href={item.href} 
            className={`flex items-center p-2 mt-4 text-gray-700 rounded hover:bg-gray-200 ${
              pathname === item.href ? 'bg-gray-200' : ''
            }`}
            onClick={() => setIsOpen(false)}
          >
            {item.icon}
            <span className="ml-3">{item.name}</span>
          </Link>   
          ))}
        </nav>
      </aside>

      {/* Overlay for Mobile Menu */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black opacity-50 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
}