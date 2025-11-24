"use client";

import { useEffect, useState } from "react";
import { dailyTips } from "../data/tips";


export default function RecommendationsPage() {
  const [dailyTip, setDailyTip] = useState("");

  useEffect(() => {
    const today = new Date().getDate(); // Día del mes (1–31)
    const index = (today - 1) % dailyTips.length; // Index seguro
    setDailyTip(dailyTips[index]);
  }, []);

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">Recomendaciones Diarias</h1>

      {/* Recomendación del día */}
      <div className="p-4 bg-white shadow rounded-xl mb-6">
        <h2 className="text-lg font-semibold text-blue-600">
          Recomendación del día
        </h2>
        <p className="text-gray-700 mt-2 text-lg">{dailyTip}</p>
      </div>

      <h2 className="text-xl font-bold mb-3">Más consejos</h2>

      <ul className="space-y-3 text-gray-700">
        <li>✔ Mantén un horario regular de comidas.</li>
        <li>✔ Elige alimentos frescos y naturales.</li>
        <li>✔ Evita el consumo excesivo de azúcar.</li>
        <li>✔ Prioriza alimentos con fibra.</li>
        <li>✔ Haz actividad física moderada todos los días.</li>
        <li>✔ Controla tus niveles de estrés.</li>
      </ul>
    </div>
  );
}
