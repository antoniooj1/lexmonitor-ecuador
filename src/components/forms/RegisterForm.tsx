"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { getSupabaseClient } from "@/lib/supabaseClient";
import { ensureUserProfile, saveCurrentUser } from "@/lib/storage";

export function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Ingrese el nombre del usuario o estudio jurídico.");
      return;
    }

    if (!email.includes("@")) {
      setError("Ingrese un email válido.");
      return;
    }

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    const supabase = getSupabaseClient();

    if (supabase) {
      const { error: authError, data } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } }
      });
      setLoading(false);

      if (authError) {
        setError(authError.message);
        return;
      }

      if (data.user) {
        await ensureUserProfile(data.user, name);
      }

      if (!data.session) {
        setSuccess(
          "Cuenta creada. Si Supabase tiene confirmación por correo activa, revise su email antes de iniciar sesión."
        );
        return;
      }

      saveCurrentUser({
        id: data.user?.id ?? "supabase-user",
        name,
        email,
        role: "lawyer",
        createdAt: data.user?.created_at ?? new Date().toISOString()
      });
      router.push("/dashboard");
      return;
    }

    saveCurrentUser({
      id: `demo-user-${Date.now()}`,
      name,
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
          <h1 className="text-2xl font-black text-ink">Crear cuenta</h1>
          <p className="mt-2 text-sm leading-6 text-muted">
            Registro del MVP con Supabase Auth opcional y respaldo simulado local.
          </p>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <Input
            label="Nombre"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Estudio Jurídico Andino"
            autoComplete="name"
          />
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="contacto@estudio.ec"
            autoComplete="email"
          />
          <Input
            label="Contraseña"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Mínimo 8 caracteres"
            autoComplete="new-password"
          />
          <Input
            label="Confirmar contraseña"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Repita la contraseña"
            autoComplete="new-password"
          />
          {error ? <p className="rounded-md bg-red-50 p-3 text-sm text-danger">{error}</p> : null}
          {success ? (
            <p className="rounded-md bg-green-50 p-3 text-sm font-semibold text-success">{success}</p>
          ) : null}
          <Button type="submit" className="w-full" isLoading={loading}>
            <UserPlus className="h-4 w-4" aria-hidden="true" />
            Crear cuenta
          </Button>
        </form>
        <p className="text-center text-sm text-muted">
          ¿Ya tiene cuenta?{" "}
          <Link href="/login" className="font-bold text-navy">
            Iniciar sesión
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
