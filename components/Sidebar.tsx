"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ListTodo,
  Settings,
  Activity,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

interface NavItem {
  href: string;
  icon: React.ReactNode;
  label: string;
}

const navItems: NavItem[] = [
  { href: "/", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
  { href: "/agents", icon: <Users size={20} />, label: "Agents" },
  { href: "/tasks", icon: <ListTodo size={20} />, label: "Tasks" },
  { href: "/settings", icon: <Settings size={20} />, label: "Settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`fixed top-0 left-0 h-screen z-40 flex flex-col
        bg-surface border-r border-border transition-all duration-200
        ${collapsed ? "w-16" : "w-56"}`}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-border">
        <Activity size={24} className="text-primary shrink-0" />
        {!collapsed && (
          <span className="text-lg font-semibold text-text-primary whitespace-nowrap">
            AI Dashboard
          </span>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-4 space-y-1 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg
                transition-all duration-200 group
                ${
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-text-secondary hover:bg-surface-elevated hover:text-text-primary border border-transparent"
                }`}
              aria-current={isActive ? "page" : undefined}
            >
              <span className={`shrink-0 ${isActive ? "text-primary" : "text-text-muted group-hover:text-text-primary"}`}>
                {item.icon}
              </span>
              {!collapsed && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center h-12 border-t border-border
          text-text-muted hover:text-text-primary transition-colors duration-200"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>
    </aside>
  );
}
