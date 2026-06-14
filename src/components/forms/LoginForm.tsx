"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import { getSupabaseClient } from "@/lib/supabaseClient";
import { ensureUserProfile, saveCurrentUser } from "@/lib/storage";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("demo@lexmonitor.ec");
  const [password, setPassword] = useState("demo12345");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!email.includes("@") || password.length < 6) {
      setError("Ingrese un email válido y una contraseña de al menos 6 caracteres.");
      return;
    }

    setLoading(true);
    const supabase = getSupabaseClient();

    if (supabase) {
      const { error: authError, data } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);

      if (authError) {
        setError(authError.message);
        return;
      }

      if (data.user) {
        await ensureUserProfile(data.user);
      }

      saveCurrentUser({
        id: data.user?.id ?? "supabase-user",
        name: data.user?.user_metadata?.name ?? "Usuario Legal",
        email,
        role: "lawyer",
        createdAt: data.user?.created_at ?? new Date().toISOString()
      });
      router.push("/dashboard");
      return;
    }

    saveCurrentUser({
      id: "demo-user-ecuador",
      name: "Equipo Legal Demo",
      email,
      role: "lawyer",
      createdAt: new Date().toISOString()
    });
    setLoading(false);
    router.push("/dashboard");
  };

  return (
    <Card className="w-full max-w-md">
      <CardContent className="space-y-5">
        <div>
          <h1 className="text-2xl font-black text-ink">Iniciar sesión</h1>
          <p className="mt-2 text-sm leading-6 text-muted">
            Acceda a LexMonitor Ecuador. Si Supabase no está configurado, se usará el modo
            simulado del MVP.
          </p>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="abogado@estudio.ec"
            autoComplete="email"
          />
          <Input
            label="Contraseña"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Mínimo 6 caracteres"
            autoComplete="current-password"
          />
          {error ? <p className="rounded-md bg-red-50 p-3 text-sm text-danger">{error}</p> : null}
          <Button type="submit" className="w-full" isLoading={loading}>
            <LogIn className="h-4 w-4" aria-hidden="true" />
            Iniciar sesión
          </Button>
        </form>
        <p className="text-center text-sm text-muted">
          ¿No tiene cuenta?{" "}
          <Link href="/register" className="font-bold text-navy">
            Registrarse
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
