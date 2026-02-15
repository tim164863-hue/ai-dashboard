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
  Menu,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";

interface NavItem {
  href: string;
  icon: React.ReactNode;
  label: string;
}

const navItems: NavItem[] = [
  { href: "/", icon: <LayoutDashboard size={18} />, label: "Dashboard" },
  { href: "/agents", icon: <Users size={18} />, label: "Agents" },
  { href: "/tasks", icon: <ListTodo size={18} />, label: "Tasks" },
  { href: "/settings", icon: <Settings size={18} />, label: "Settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const handler = (e: MediaQueryListEvent) => {
      if (e.matches) setMobileOpen(false);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 bg-surface border border-border
          text-text-secondary hover:text-primary transition-colors duration-200"
        aria-label="Open navigation"
      >
        <Menu size={20} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen z-50 flex flex-col
          bg-surface border-r border-border transition-all duration-200
          ${collapsed ? "lg:w-16" : "lg:w-56"}
          ${mobileOpen ? "w-56 translate-x-0" : "-translate-x-full lg:translate-x-0 w-56"}`}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Logo row */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-border">
          <div className="flex items-center gap-3">
            <Activity size={22} className="text-primary shrink-0" />
            {!collapsed && (
              <span className="text-sm font-display font-bold text-primary tracking-wider uppercase text-glow whitespace-nowrap">
                AI HQ
              </span>
            )}
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1 text-text-muted hover:text-primary transition-colors duration-200"
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        </div>

        {/* System status line */}
        <div className="px-4 py-2 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-success animate-pulse" style={{ boxShadow: "0 0 6px #00E676" }} />
            <span className="text-[8px] font-mono text-text-muted uppercase tracking-[0.2em]">
              SYS_ONLINE
            </span>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5
                  transition-all duration-200 group
                  ${
                    isActive
                      ? "bg-primary/10 text-primary border-l-2 border-primary"
                      : "text-text-secondary hover:bg-surface-elevated hover:text-text-primary border-l-2 border-transparent"
                  }`}
                aria-current={isActive ? "page" : undefined}
              >
                <span className={`shrink-0 ${isActive ? "text-primary" : "text-text-muted group-hover:text-text-primary"}`}>
                  {item.icon}
                </span>
                {!collapsed && (
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex items-center justify-center h-12 border-t border-border
            text-text-muted hover:text-primary transition-colors duration-200"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </aside>
    </>
  );
}

export const sidebarMargin = "ml-0 lg:ml-56";
export const sidebarMarginCollapsed = "ml-0 lg:ml-16";
