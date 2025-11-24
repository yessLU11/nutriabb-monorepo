"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    phone: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // Aquí iría tu lógica real de login con backend…
  // ejemplo: const res = await apiFetch("/auth/login", { ... });

  // Luego de login exitoso:
  router.push("/onboarding");
  };


  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-8 pt-10">
      {/* LOGO */}
      <div className="flex flex-col items-center">
        <Image
          src="/nutridiabb-logo.png" // coloca el nombre de tu archivo real
          alt="NutriDiabb Logo"
          width={195}
          height={180}
        />
      </div>

      {/* NUTRIDIABB TEXT */}
      <h1 className="text-4xl font-bold text-[#191970] mt-2">
        NutriDiabb
      </h1>

      {/* TITULO */}
      <h2 className="text-xl font-semibold text-[#0A1A2F] mt-10">
        Inicio de Sesión
      </h2>
      <p className="text-gray-500 text-sm mt-1">
        Ingresa tus datos para retomar tu progreso
      </p>

      {/* FORMULARIO */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-full max-w-sm mt-8 gap-4"
      >
        <input
          name="phone"
          placeholder="Número de celular"
          value={form.phone}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0EA5A4]"
        />

        <input
          name="password"
          type="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0EA5A4]"
        />

        <p className="text-center text-gray-600 text-sm underline cursor-pointer">
          ¿Olvidaste tu contraseña?
        </p>

        {/* BOTÓN CONTINUAR */}
        <button
          type="submit"
          className="w-full bg-[#00B6FF] text-white py-3 rounded-xl text-lg font-medium hover:bg-[#191970] transition"
        >
          Continuar
        </button>
      </form>
    </div>
  );
}
