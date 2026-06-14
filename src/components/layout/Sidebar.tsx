"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  CalendarDays,
  FileText,
  FolderOpen,
  LayoutDashboard,
  Scale,
  Search,
  Settings
} from "lucide-react";
import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Buscar procesos", href: "/search", icon: Search },
  { label: "Portafolio", href: "/portfolio", icon: FolderOpen },
  { label: "Alertas", href: "/alerts", icon: Bell },
  { label: "Calendario", href: "/calendar", icon: CalendarDays },
  { label: "Notas y documentos", href: "/documents", icon: FileText },
  { label: "Configuración", href: "/settings", icon: Settings }
];

interface SidebarProps {
  open?: boolean;
  onNavigate?: () => void;
}

export function Sidebar({ open = true, onNavigate }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex w-72 max-w-[86vw] flex-col border-r border-slate-200 bg-ink text-white transition-transform lg:sticky lg:top-0 lg:h-screen lg:max-w-none lg:translate-x-0",
        open ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex h-20 items-center gap-3 border-b border-white/10 px-5">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white text-navy">
          <Scale className="h-6 w-6" aria-hidden="true" />
        </div>
        <div>
          <p className="text-lg font-black">{APP_NAME}</p>
          <p className="text-xs font-medium text-slate-300">Monitoreo judicial inteligente</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex min-h-11 items-center gap-3 rounded-md px-3 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white",
                active && "bg-white text-ink hover:bg-white hover:text-ink"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-5 text-xs leading-5 text-slate-300">
        Modo SATJE: <span className="font-semibold text-white">mock autorizado</span>
      </div>
    </aside>
  );
}
