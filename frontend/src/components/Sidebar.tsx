"use client";
import { NavLink } from '@mantine/core';
import { IconLayoutDashboard, IconFileInvoice, IconChartLine } from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { icon: <IconLayoutDashboard size="1.1rem" />, label: 'Dashboard', href: '/' },
    { icon: <IconFileInvoice size="1.1rem" />, label: 'New Invoice', href: '/invoices/new' },
    { icon: <IconFileInvoice size="1.1rem" />, label: 'Invoices', href: '/invoices' },
  ];

  return (
    <nav className="w-64 p-4">
      <div className="mb-8">
        <h1 className="text-xl font-bold">WTPOS</h1>
      </div>
      
      <div className="space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            component={Link}
            href={item.href}
            label={item.label}
            leftSection={item.icon}
            active={pathname === item.href}
            className="rounded-md"
          />
        ))}
      </div>
    </nav>
  );
}
