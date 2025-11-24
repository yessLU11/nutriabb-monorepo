"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { dailyTips } from "../data/tips";

export default function DashboardPage() {
  const [userEmail, setUserEmail] = useState("");
  const [dailyTip, setDailyTip] = useState("");

  useEffect(() => {
    // Obtener usuario desde localStorage
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUserEmail(parsed.email || "");
    }

    // Recomendación del día
    const day = new Date().getDate();
    const index = (day - 1) % dailyTips.length;
    setDailyTip(dailyTips[index]);
  }, []);

  return (
    <div className="min-h-screen bg-white px-6 pb-24">

      {/* HEADER */}
      <header className="pt-10 mb-4">
        <h1 className="text-2xl font-bold text-[var(--color-dark)]">
          Hola :D ¿Cómo estas hoy? 👋
        </h1>
        <p className="text-[var(--color-gray)] text-sm mt-1">
          {userEmail}
        </p>
      </header>

      {/* RECOMENDACIÓN DEL DÍA */}
      <section
        className="relative p-5 rounded-4xl shadow-sm mb-6 overflow-hidden border bg-cover bg-center"
        style={{ backgroundImage: "url('/fondoVerduras.png')" }}
      >
        
        <div className="relative z-10">
          {/* Título estilo “hueco/delineado” */}
          <h2 className="text-xl font-extrabold text-black tracking-wide drop-shadow-[1px_2px_0px_white]">
            ⭐ Recomendación del Día
          </h2>

          {/* Texto del tip — más grande, negro y con comillas */}
          <p className="mt-3 text-black text-lg font-semibold italic">
            “{dailyTip}”
          </p>
        </div>
      </section>



      {/* ACCIONES RÁPIDAS */}
      <h3 className="mb-6 text-lg font-semibold text-[var(--color-dark)]">
        🔥 Acciones Rápidas 
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <Link
          href="/profile"
          className="p-4 bg-white border rounded-xl shadow-sm hover:bg-[#FF8C00] hover:text-white transition-all text-center text-sm font-medium"
        >
          Mi Perfil
        </Link>

        <Link
          href="/calculate"
          className="p-4 bg-white border rounded-xl shadow-sm hover:bg-[#00FF00] hover:text-white transition-all text-center text-sm font-medium"
        >
          Calculadora Nutricional
        </Link>

        <Link
          href="/results"
          className="p-4 bg-white border rounded-xl shadow-sm hover:bg-[#FF0000] hover:text-white transition-all text-center text-sm font-medium"
        >
          Resultados
        </Link>

        <Link
          href="/recipes"
          className="p-4 bg-white border rounded-xl shadow-sm hover:bg-[#00008B] hover:text-white transition-all text-center text-sm font-medium"
        >
          Recetas
        </Link>

        <Link
          href="/recommendations"
          className="p-4 bg-white border rounded-xl shadow-sm hover:bg-[#FF00FF] hover:text-white transition-all text-center text-sm font-medium"
        >
          Recomendaciones
        </Link>

        <Link
          href="/meal-planner"
          className="p-4 bg-white border rounded-xl shadow-sm hover:bg-[#800000] hover:text-white transition-all text-center text-sm font-medium"
        >
          Planificación Semanal
        </Link>

        <Link
          href="/progress"
          className="p-4 bg-white border rounded-xl shadow-sm hover:bg-[#FFD700] hover:text-white transition-all text-center text-sm font-medium"
        >
          Progreso
        </Link>
      </div>
    </div>
  );
}
