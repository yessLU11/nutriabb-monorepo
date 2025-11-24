"use client";

import { useEffect, useState } from "react";

export default function ResultsPage() {
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    async function fetchResults() {
      try {
        const res = await fetch("http://localhost:4000/calculate", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error?.message || "No se pudieron obtener resultados");
          return;
        }

        setResult(data.data);
      } catch (err) {
        setError("Error conectando al servidor");
      }
    }

    if (token) fetchResults();
  }, [token]);

  if (error) {
    return (
      <div className="min-h-screen p-6 flex justify-center items-center">
        <p className="text-red-600 font-semibold">{error}</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen p-6 flex justify-center items-center">
        <p className="text-gray-500">Cargando resultados...</p>
      </div>
    );
  }

  const { profile, nutrition } = result;

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">Resultados Nutricionales</h1>

      {/* Datos del perfil */}
      <div className="p-4 bg-white shadow rounded-xl mb-6">
        <h2 className="text-xl font-semibold">Perfil</h2>
        <p className="text-gray-600 mt-2">Edad: {profile.age}</p>
        <p className="text-gray-600 mt-1">Género: {profile.gender}</p>
        <p className="text-gray-600 mt-1">Altura: {profile.height} cm</p>
        <p className="text-gray-600 mt-1">Peso: {profile.weight} kg</p>
        <p className="text-gray-600 mt-1">
          Actividad: {profile.activity_level}
        </p>
      </div>

      {/* Resultados nutricionales */}
      <div className="p-4 bg-white shadow rounded-xl mb-6">
        <h2 className="text-xl font-semibold">Calorías</h2>
        <p className="text-gray-800 text-3xl font-bold mt-2">
          {nutrition.calories} kcal
        </p>
        <p className="text-gray-600 mt-2">TMB: {nutrition.bmr} kcal</p>
      </div>

      {/* Macronutrientes */}
      <div className="p-4 bg-white shadow rounded-xl mb-6">
        <h2 className="text-xl font-semibold">Macronutrientes</h2>

        <div className="mt-3 space-y-2">
          <p>
            <strong>Carbohidratos:</strong> {nutrition.macros.carbohydrates} g (
            {nutrition.percentages.carbohydrates}%)
          </p>
          <p>
            <strong>Proteínas:</strong> {nutrition.macros.proteins} g (
            {nutrition.percentages.proteins}%)
          </p>
          <p>
            <strong>Grasas:</strong> {nutrition.macros.fats} g (
            {nutrition.percentages.fats}%)
          </p>
          <p>
            <strong>Fibra:</strong> {nutrition.macros.fiber} g
          </p>
        </div>
      </div>
    </div>
  );
}
