"use client";

import { useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { BellRing, Mail, MessageCircle, Smartphone } from "lucide-react";
import type { NotificationSettings } from "@/types";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { LEGAL_DISCLAIMER, SATJE_COMPLIANCE_NOTICE } from "@/lib/constants";
import { getNotificationSettingsAsync, saveNotificationSettingsAsync } from "@/lib/storage";

const alertTypes = ["Todas", "Audiencia", "Citación", "Providencia", "Sentencia", "Plazo judicial"];

export default function SettingsPage() {
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    void getNotificationSettingsAsync().then(setSettings);
  }, []);

  if (!settings) {
    return (
      <AppShell title="Configuración" subtitle="Preferencias de notificaciones">
        <p className="text-sm text-muted">Cargando configuración...</p>
      </AppShell>
    );
  }

  const update = (patch: Partial<NotificationSettings>) => {
    setSettings({ ...settings, ...patch });
    setMessage("");
  };

  const toggleAlertType = (type: string) => {
    const exists = settings.alertTypes.includes(type);
    update({
      alertTypes: exists
        ? settings.alertTypes.filter((item) => item !== type)
        : [...settings.alertTypes, type]
    });
  };

  const onSave = () => {
    void saveNotificationSettingsAsync(settings).then(() => {
      setMessage("Configuración guardada.");
    });
  };

  return (
    <AppShell title="Configuración" subtitle="Canales, horarios y avisos de cumplimiento">
      <div className="space-y-6">
        {message ? (
          <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm font-semibold text-success">
            {message}
          </div>
        ) : null}

        <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
          <Card>
            <CardHeader>
              <h2 className="text-base font-bold text-ink">Notificaciones</h2>
            </CardHeader>
            <CardContent className="space-y-5">
              <Toggle
                icon={BellRing}
                label="Notificaciones internas"
                description="Alertas visibles dentro de la plataforma."
                checked
                disabled
              />
              <Toggle
                icon={Mail}
                label="Email"
                description="Envío de alertas y resumen diario por correo."
                checked={settings.emailEnabled}
                onChange={(checked) => update({ emailEnabled: checked })}
              />
              <Toggle
                icon={MessageCircle}
                label="WhatsApp"
                description="Canal futuro para alertas urgentes."
                checked={settings.whatsappEnabled}
                disabled
                badge="Próximamente"
              />
              <Toggle
                icon={Smartphone}
                label="Push notifications"
                description="Notificaciones móviles futuras."
                checked={settings.pushEnabled}
                disabled
                badge="Próximamente"
              />
              <Toggle
                icon={BellRing}
                label="Alertas urgentes inmediatas"
                description="Prioriza alertas de alta urgencia."
                checked={settings.urgentAlertsEnabled}
                onChange={(checked) => update({ urgentAlertsEnabled: checked })}
              />
              <Toggle
                icon={Mail}
                label="Resumen diario"
                description="Consolida alertas y actuaciones en un reporte diario."
                checked={settings.dailySummaryEnabled}
                onChange={(checked) => update({ dailySummaryEnabled: checked })}
              />

              <Input
                label="Horario preferido"
                type="time"
                value={settings.preferredHour}
                onChange={(event) => update({ preferredHour: event.target.value })}
              />

              <div>
                <p className="mb-2 text-sm font-semibold text-slate-700">Tipos de alerta</p>
                <div className="flex flex-wrap gap-2">
                  {alertTypes.map((type) => (
                    <button
                      key={type}
                      type="button"
                      className={`rounded-full border px-3 py-1.5 text-sm font-semibold ${
                        settings.alertTypes.includes(type)
                          ? "border-navy bg-blue-50 text-navy"
                          : "border-slate-200 bg-white text-muted"
                      }`}
                      onClick={() => toggleAlertType(type)}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <Button onClick={onSave}>Guardar configuración</Button>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card className="border-blue-200">
              <CardHeader>
                <h2 className="text-base font-bold text-ink">Cumplimiento y alcance del MVP</h2>
              </CardHeader>
              <CardContent className="space-y-3 text-sm leading-6 text-muted">
                <p>{LEGAL_DISCLAIMER}</p>
                <p>{SATJE_COMPLIANCE_NOTICE}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="space-y-2">
                <Badge variant="blue">SATJE_INTEGRATION_MODE=mock</Badge>
                <p className="text-sm leading-6 text-muted">
                  La integración real queda preparada a nivel de arquitectura, pero debe activarse
                  solo con autorización, API oficial, convenio o mecanismo permitido.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function Toggle({
  icon: Icon,
  label,
  description,
  checked,
  disabled = false,
  badge,
  onChange
}: {
  icon: LucideIcon;
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  badge?: string;
  onChange?: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-md border border-slate-200 p-4">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-slate-100 text-navy">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-bold text-ink">{label}</p>
            {badge ? <Badge variant="slate">{badge}</Badge> : null}
          </div>
          <p className="text-sm text-muted">{description}</p>
        </div>
      </div>
      <input
        type="checkbox"
        className="h-5 w-5 rounded border-slate-300 text-navy"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange?.(event.target.checked)}
      />
    </label>
  );
}
