"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { LEGAL_DISCLAIMER, SATJE_COMPLIANCE_NOTICE } from "@/lib/constants";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabaseClient";
import { LoadingState } from "@/components/ui/LoadingState";

interface AppShellProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function AppShell({ title, subtitle, children }: AppShellProps) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [checkingSession, setCheckingSession] = useState(isSupabaseConfigured());

  useEffect(() => {
    const client = getSupabaseClient();
    if (!client) {
      setCheckingSession(false);
      return;
    }

    void client.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.replace("/login");
        return;
      }
      setCheckingSession(false);
    });
  }, [router]);

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-surface p-6">
        <LoadingState
          label="Validando sesión"
          description="Estamos verificando su acceso antes de abrir el expediente de trabajo."
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="lg:flex">
        <Sidebar open={sidebarOpen} onNavigate={() => setSidebarOpen(false)} />
        {sidebarOpen ? (
          <button
            className="fixed inset-0 z-30 bg-slate-950/50 backdrop-blur-sm lg:hidden"
            aria-label="Cerrar navegación"
            onClick={() => setSidebarOpen(false)}
          />
        ) : null}
        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <Header title={title} subtitle={subtitle} onMenuClick={() => setSidebarOpen(true)} />
          <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-5 sm:py-6 lg:px-8">
            {children}
          </main>
          <footer className="border-t border-slate-200 bg-white px-4 py-5 lg:px-8">
            <div className="mx-auto max-w-7xl space-y-2 text-xs leading-5 text-muted">
              <p>{LEGAL_DISCLAIMER}</p>
              <p>{SATJE_COMPLIANCE_NOTICE}</p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
