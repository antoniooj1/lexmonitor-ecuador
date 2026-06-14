import { AlertTriangle } from "lucide-react";
import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/Card";

interface ErrorStateProps {
  title?: string;
  message?: string;
  action?: ReactNode;
}

export function ErrorState({
  title = "No fue posible consultar SATJE",
  message = "No fue posible consultar SATJE en la última revisión. El sistema intentará nuevamente en la siguiente actualización.",
  action
}: ErrorStateProps) {
  return (
    <Card className="border-red-200 bg-red-50">
      <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-3">
          <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-white text-danger">
            <AlertTriangle className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h3 className="font-bold text-danger">{title}</h3>
            <p className="mt-1 text-sm leading-6 text-red-700">{message}</p>
          </div>
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </CardContent>
    </Card>
  );
}
