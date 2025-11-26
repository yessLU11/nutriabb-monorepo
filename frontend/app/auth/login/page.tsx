"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic client validation
    if (!form.email || !form.password) {
      setError("Por favor completa email y contraseña.");
      return;
    }

    if (!API_URL) {
      setError("API_URL no configurada. Revisa .env.local");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      const json = await res.json().catch(() => null);

      if (!res.ok) {
        // backend devuelve json con error.message o message
        const msg = json?.error?.message || json?.message || `Error ${res.status}`;
        setError(String(msg));
        setLoading(false);
        return;
      }

      // backend: { message: 'Login successful', data: { user: {...}, token: '...' } }
      const token = json?.data?.token;
      if (!token) {
        setError("No se recibió token desde el servidor.");
        setLoading(false);
        return;
      }

      // Guardar token en localStorage con la key que usa healthCheck
      localStorage.setItem("token", token);

      // También podrías guardar datos del usuario si lo deseas:
      try {
        const user = json?.data?.user ?? null;
        if (user) localStorage.setItem("user", JSON.stringify(user));
      } catch {}

      // redirigir a onboarding o perfil
      router.push("/onboarding");
    } catch (err) {
      console.error("Login error:", err);
      setError("Error conectando con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-8 pt-10">
      <div className="flex flex-col items-center">
        <Image src="/nutridiabb-logo.png" alt="NutriDiabb Logo" width={195} height={180} />
      </div>

      <h1 className="text-4xl font-bold text-[#191970] mt-2">NutriDiabb</h1>
      <h2 className="text-xl font-semibold text-gray-700 mt-2">Inicia sesión</h2>

      <form onSubmit={handleSubmit} className="w-full max-w-md mt-6 space-y-4">
        <label className="block">
          <span className="text-sm font-medium">Correo electrónico</span>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            type="email"
            className="mt-1 p-3 w-full border rounded-xl"
            placeholder="tucorreo@ejemplo.com"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Contraseña</span>
          <input
            name="password"
            value={form.password}
            onChange={handleChange}
            type="password"
            className="mt-1 p-3 w-full border rounded-xl"
            placeholder="********"
          />
        </label>

        {error && <div className="text-sm text-red-600">{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#00B6FF] text-white py-3 rounded-xl text-lg font-medium hover:bg-[#191970] transition"
        >
          {loading ? "Iniciando..." : "Continuar"}
        </button>
      </form>
    </div>
  );
}
