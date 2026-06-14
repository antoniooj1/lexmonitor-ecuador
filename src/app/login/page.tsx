import { Scale } from "lucide-react";
import { LoginForm } from "@/components/forms/LoginForm";
import { APP_NAME, SATJE_COMPLIANCE_NOTICE } from "@/lib/constants";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen bg-surface lg:grid-cols-[0.9fr_1.1fr]">
      <section className="flex flex-col justify-between bg-ink p-8 text-white">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white text-navy">
            <Scale className="h-7 w-7" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xl font-black">{APP_NAME}</p>
            <p className="text-sm text-slate-300">LegalTech Ecuador</p>
          </div>
        </div>
        <div className="py-14">
          <h2 className="max-w-xl text-4xl font-black leading-tight">
            Control operativo de procesos judiciales con monitoreo inteligente.
          </h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-300">
            MVP profesional con datos simulados, preparado para una futura integración legal y
            autorizada con SATJE.
          </p>
        </div>
        <p className="text-xs leading-5 text-slate-300">{SATJE_COMPLIANCE_NOTICE}</p>
      </section>
      <section className="flex items-center justify-center p-6">
        <LoginForm />
      </section>
    </main>
  );
}
