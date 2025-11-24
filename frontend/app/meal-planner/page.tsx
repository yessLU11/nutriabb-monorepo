"use client";

import { useEffect, useState } from "react";

export default function MealPlannerPage() {
  const daysOfWeek = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
  ];

  const STORAGE_KEY = "weekly_meal_plan";

  const [plans, setPlans] = useState<any>({});

  // 🔹 Cargar datos desde LocalStorage al iniciar
  useEffect(() => {
    const savedPlans = localStorage.getItem(STORAGE_KEY);

    if (savedPlans) {
      setPlans(JSON.parse(savedPlans));
    } else {
      // Si no existe, crear estructura vacía
      const empty = daysOfWeek.reduce((acc: any, day) => {
        acc[day] = "";
        return acc;
      }, {});

      setPlans(empty);
    }
  }, []);

  // 🔹 Guardar en LocalStorage cada vez que cambia
  useEffect(() => {
    if (Object.keys(plans).length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
    }
  }, [plans]);

  const handleChange = (day: string, value: string) => {
    setPlans((prev: any) => ({
      ...prev,
      [day]: value,
    }));
  };

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-6">Planificación Semanal</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className="p-4 bg-white shadow rounded-xl flex flex-col"
          >
            <h2 className="text-xl font-semibold mb-2">{day}</h2>

            <textarea
              className="border rounded-lg p-3 w-full h-32 text-sm"
              placeholder={`Planifica tu comida del ${day}`}
              value={plans[day] || ""}
              onChange={(e) => handleChange(day, e.target.value)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
