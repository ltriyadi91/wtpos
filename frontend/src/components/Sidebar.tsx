"use client";
import { NavLink, Burger } from '@mantine/core';
import { IconLayoutDashboard, IconFileInvoice, IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';

export function Sidebar() {
  const pathname = usePathname();
  const [opened, { toggle }] = useDisclosure();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [collapsed, setCollapsed] = useDisclosure(isMobile);

  const navItems = [
    { icon: <IconLayoutDashboard size="1.1rem" />, label: 'Dashboard', href: '/' },
    { icon: <IconFileInvoice size="1.1rem" />, label: 'New Invoice', href: '/invoices/new' },
    { icon: <IconFileInvoice size="1.1rem" />, label: 'Invoices', href: '/invoices' },
  ];

  const toggleSidebar = () => {
    if (isMobile) {
      toggle();
    } else {
      setCollapsed.toggle();
    }
  };

  return (
    <div 
      className={`
        h-screen bg-white shadow-lg transition-all duration-300 ease-in-out
        ${isMobile || collapsed ? 'w-[80px]' : 'w-64'}
      `}
    >
      <div className="flex flex-col h-full">
        <div className={`p-4 border-b flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
          {!collapsed && !isMobile && <h1 className="text-xl font-bold">WTPOS</h1>}
          {!isMobile && (
            <button 
              onClick={toggleSidebar}
              className="hidden md:flex items-center justify-center w-6 h-6 rounded-full hover:bg-gray-100"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <IconChevronRight size={16} /> : <IconChevronLeft size={16} />}
            </button>
          )}
        </div>
        
        <div className="flex-1 overflow-y-auto p-2">
          <div className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                component={Link}
                href={item.href}
                label={collapsed || isMobile ? undefined : item.label}
                leftSection={item.icon}
                active={pathname === item.href}
                className={`rounded-md ${collapsed || isMobile ? 'justify-center' : ''}`}
                onClick={() => isMobile && toggle()}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
