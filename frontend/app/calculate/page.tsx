"use client";
import { useState } from "react";

export default function CalculatePage() {
  const [form, setForm] = useState({
    peso: "",
    altura: "",
    edad: "",
    sexo: "",
    actividad: "",
    objetivo: "",
  });

  const [result, setResult] = useState<any | null>(null);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const calcular = () => {
    const peso = Number(form.peso);
    const altura = Number(form.altura);
    const edad = Number(form.edad);

    if (!peso || !altura || !edad || !form.sexo) {
      alert("Por favor completa todos los campos obligatorios.");
      return;
    }

    // Fórmula Mifflin‑St Jeor
    const bmr =
      form.sexo === "masculino"
        ? 10 * peso + 6.25 * altura - 5 * edad + 5
        : 10 * peso + 6.25 * altura - 5 * edad - 161;

    const factores: any = {
      sedentario: 1.2,
      ligero: 1.375,
      moderado: 1.55,
      pesado: 1.725,
    };

    const tdee = bmr * (factores[form.actividad] || 1.2);

    const ajuste =
      form.objetivo === "subir"
        ? 300
        : form.objetivo === "bajar"
        ? -300
        : 0;

    const caloriasFinales = tdee + ajuste;

    setResult({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      calorias: Math.round(caloriasFinales),
      proteina: Math.round(peso * 2),
      grasa: Math.round((caloriasFinales * 0.25) / 9),
      carbohidratos: Math.round(
        (caloriasFinales -
          (peso * 2 * 4 + (caloriasFinales * 0.25))) /
          4
      ),
    });
  };

  return (
    <div className="max-w-xl mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-6 text-green-700">
        🥑 Calculadora Nutricional
      </h1>

      <p className="text-center text-gray-600 mb-8">
        Completa tus datos para conocer tus calorías diarias y distribución de
        macronutrientes.  
        <span className="font-semibold">Diseño centrado en el usuario ✔</span>
      </p>

      <div className="space-y-4 bg-white p-6 rounded-lg shadow-lg border border-gray-200">
        {/* PESO */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Peso (kg)
          </label>
          <input
            name="peso"
            type="number"
            value={form.peso}
            onChange={handleChange}
            className="input"
            placeholder="Ej: 60"
          />
        </div>

        {/* ALTURA */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Altura (cm)
          </label>
          <input
            name="altura"
            type="number"
            value={form.altura}
            onChange={handleChange}
            className="input"
            placeholder="Ej: 165"
          />
        </div>

        {/* EDAD */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Edad
          </label>
          <input
            name="edad"
            type="number"
            value={form.edad}
            onChange={handleChange}
            className="input"
            placeholder="Ej: 25"
          />
        </div>

        {/* SEXO */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Sexo
          </label>
          <select
            name="sexo"
            value={form.sexo}
            onChange={handleChange}
            className="input"
          >
            <option value="">Selecciona una opción</option>
            <option value="masculino">Masculino ♂</option>
            <option value="femenino">Femenino ♀</option>
          </select>
        </div>

        {/* ACTIVIDAD */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Nivel de actividad
          </label>
          <select
            name="actividad"
            value={form.actividad}
            onChange={handleChange}
            className="input"
          >
            <option value="">Selecciona una opción</option>
            <option value="sedentario">Sedentario 🛋️</option>
            <option value="ligero">Ligero 🚶</option>
            <option value="moderado">Moderado 🏃‍♀️</option>
            <option value="pesado">Pesado 💪</option>
          </select>
        </div>

        {/* OBJETIVO */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Objetivo
          </label>
          <select
            name="objetivo"
            value={form.objetivo}
            onChange={handleChange}
            className="input"
          >
            <option value="">Selecciona</option>
            <option value="subir">Subir peso ⬆</option>
            <option value="bajar">Bajar peso ⬇</option>
            <option value="mantener">Mantener ⚖</option>
          </select>
        </div>

        <button
          onClick={calcular}
          className="w-full py-3 mt-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transform active:scale-95 transition"
        >
          Calcular resultados ✨
        </button>
      </div>

      {/* RESULTADOS */}
      {result && (
        <div className="mt-8 bg-green-50 border border-green-200 shadow-md p-6 rounded-lg">
          <h2 className="text-xl font-bold text-green-700 mb-4">
            🧾 Tus resultados nutricionales
          </h2>

          <div className="space-y-2 text-gray-800">
            <p><strong>Calorías diarias:</strong> {result.calorias} kcal</p>
            <p><strong>Proteína:</strong> {result.proteina} g</p>
            <p><strong>Grasas:</strong> {result.grasa} g</p>
            <p><strong>Carbohidratos:</strong> {result.carbohidratos} g</p>
          </div>
        </div>
      )}

      <style jsx>{`
        .input {
          width: 100%;
          padding: 10px 12px;
          border-radius: 8px;
          border: 1px solid #d1d5db;
          background: #f9fafb;
          transition: 0.2s;
        }
        .input:focus {
          outline: none;
          border-color: #34d399;
          background: white;
          box-shadow: 0 0 0 2px #bbf7d0;
        }
      `}</style>
    </div>
  );
}
