"use client";

import { breakfastData } from "../recipes/_data/breakfastData";
import { lunchData } from "../recipes/_data/lunchData";
import { dinnerData } from "../recipes/_data/dinnerData";
import { snacksData } from "../recipes/_data/snacksData";

import { useState } from "react";
import { generateWeeklyPlan, MealPlanDay } from "./_utils/generateWeek";

export default function MealPlannerPage() {
  const [plan, setPlan] = useState<MealPlanDay[] | null>(null);

  const macrosEjemplo = {
    protein: 100,
    carbs: 200,
    fats: 60,
    calories: 1800,
  };

  const generarPlan = () => {
    const newPlan = generateWeeklyPlan(macrosEjemplo);
    setPlan(newPlan);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-4">
        🗓️ Planificador Semanal Nutriabb
      </h1>

      <button
        onClick={generarPlan}
        className="bg-green-500 text-white px-4 py-2 rounded-lg mb-6 hover:bg-green-600"
      >
        Generar nuevo plan semanal
      </button>

      {!plan && (
        <p className="text-center text-gray-600">
          Haz clic para generar tu plan 🍏
        </p>
      )}

      {plan && (
        <div className="space-y-6">
          {plan.map((day) => (
            <div key={day.day} className="bg-white p-4 shadow rounded-lg">
              <h2 className="text-xl font-bold mb-3">{day.day}</h2>

              <p>
                <strong>Desayuno:</strong> {day.breakfast.title}
              </p>
              <p>
                <strong>Almuerzo:</strong> {day.lunch.title}
              </p>
              <p>
                <strong>Cena:</strong> {day.dinner.title}
              </p>

              <p className="mt-2">
                <strong>Snacks:</strong>
              </p>
              <ul className="list-disc ml-6">
                {day.snacks.map((snack, i) => (
                  <li key={i}>{snack.title}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
