"use client";

import { useEffect, useState } from "react";
import { Menu, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getCurrentUserAsync } from "@/lib/storage";
import type { User } from "@/types";

interface HeaderProps {
  title: string;
  subtitle?: string;
  onMenuClick: () => void;
}

export function Header({ title, subtitle, onMenuClick }: HeaderProps) {
  const [user, setUser] = useState<User>({
    id: "demo-user-ecuador",
    name: "Equipo Legal Demo",
    email: "demo@lexmonitor.ec",
    role: "lawyer",
    createdAt: "2026-06-01T08:00:00.000Z"
  });

  useEffect(() => {
    void getCurrentUserAsync().then(setUser);
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-surface/95 px-4 py-4 backdrop-blur lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            className="lg:hidden"
            onClick={onMenuClick}
            aria-label="Abrir navegación"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </Button>
          <div className="min-w-0">
            <h1 className="text-xl font-black leading-tight text-ink lg:text-2xl">{title}</h1>
            {subtitle ? <p className="mt-1 line-clamp-2 text-sm leading-5 text-muted">{subtitle}</p> : null}
          </div>
        </div>

        <div className="hidden items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 md:flex">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-green-50 text-success">
            <ShieldCheck className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-bold text-ink">{user.name}</p>
            <p className="text-xs text-muted">Acceso MVP seguro</p>
          </div>
        </div>
      </div>
    </header>
  );
}
