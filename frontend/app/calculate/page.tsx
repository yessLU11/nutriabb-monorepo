"use client";

import { useEffect, useState } from "react";

export default function CalculatePage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch(`${API_URL}/calculate`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const json = await res.json();

        if (res.ok) {
          setData(json.data);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    if (token) loadData();
  }, [token, API_URL]);

  if (loading) return <p className="p-6">Cargando...</p>;

  if (!data) return <p className="p-6">No hay datos, completa tu perfil.</p>;

  const n = data.nutrition;

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">Tu nutrición diaria</h1>

      <p><b>Calorías:</b> {n.calories} kcal</p>
      <p><b>BMR:</b> {n.bmr}</p>

      <h2 className="font-semibold mt-4">Macronutrientes</h2>
      <p>Carbohidratos: {n.macros.carbohydrates} g</p>
      <p>Proteínas: {n.macros.proteins} g</p>
      <p>Grasas: {n.macros.fats} g</p>
      <p>Fibra: {n.macros.fiber} g</p>

      <a href="/home" className="block w-full bg-black text-white p-3 rounded-lg mt-6 text-center">
        Volver
      </a>
    </div>
  );
}
