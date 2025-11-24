"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validaciones completas
    if (!email || !password || !confirmPassword) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    if (!email.includes("@")) {
      setError("Ingresa un email válido.");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener mínimo 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    if (!API_URL) {
      setError("Error: falta NEXT_PUBLIC_API_URL.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error?.message || "Error al registrarse.");
        setLoading(false);
        return;
      }

      setSuccess("Cuenta creada correctamente 🎉 Te estamos redirigiendo...");
      setLoading(false);

      // Redirigir después de 1.5 segundos
      setTimeout(() => {
        router.push("/auth/login");
      }, 1500);

    } catch (err) {
      setError("Error de conexión con el servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleRegister}
        className="bg-white shadow-xl rounded-xl p-8 w-96 space-y-6"
      >
        <h1 className="text-2xl font-bold text-center">Crear Cuenta</h1>

        {error && <p className="text-red-500 text-center">{error}</p>}
        {success && <p className="text-green-600 text-center">{success}</p>}

        <div>
          <label className="block mb-1">Correo electrónico</label>
          <input
            type="email"
            className="w-full p-3 border rounded-lg"
            placeholder="usuario@mail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1">Contraseña</label>
          <input
            type="password"
            className="w-full p-3 border rounded-lg"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1">Confirmar contraseña</label>
          <input
            type="password"
            className="w-full p-3 border rounded-lg"
            placeholder="Repite tu contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition disabled:bg-blue-400"
        >
          {loading ? "Registrando..." : "Registrar"}
        </button>

        <p className="text-sm text-center mt-2">
          ¿Ya tienes cuenta?{" "}
          <a href="/auth/login" className="text-blue-600 hover:underline">
            Inicia sesión
          </a>
        </p>
      </form>
    </div>
  );
}
