"use client";

import { useEffect, useMemo, useState } from "react";

/* ------------------------- Tipos ------------------------- */

type DayData = {
  date: string;
  proteins: number;
  carbs: number;
  fats: number;
  calories: number;
  habitCompleted: boolean;
};

/* ---------------------- Fetch Backend --------------------- */
/**
 * Obtiene los datos de nutrición del día desde el backend /calculate
 */
async function fetchCalculate(token?: string): Promise<DayData | null> {
  if (!token) return null;

  try {
    const res = await fetch("http://localhost:4000/calculate", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      console.warn("Respuesta NO OK desde /calculate", res.status);
      return null;
    }

    const json = await res.json();
    const n = json.data?.nutrition;
    if (!n) return null;

    const today = new Date().toISOString().split("T")[0];

    return {
      date: today,
      proteins: n.macros.proteins,
      carbs: n.macros.carbohydrates,
      fats: n.macros.fats,
      calories: n.calories,
      habitCompleted: n.macros.proteins >= 50, // regla modificable
    };
  } catch (err) {
    console.error("Error en fetchCalculate:", err);
    return null;
  }
}

/* ---------------------- Helpers UI --------------------- */

function formatShortDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("es-PE", {
    weekday: "short",
    day: "numeric",
  });
}

function getMotivation(streak: number) {
  if (streak >= 7) return "¡Impresionante! Mantén esa consistencia 💪";
  if (streak >= 4) return "¡Buen trabajo! Estás construyendo hábitos ✨";
  if (streak >= 1) return "Vas por buen camino 🌱";
  return "Comienza hoy: un pequeño hábito cambia tu semana 😊";
}

/* --------------------------- Component --------------------------- */

export default function ProgressPage() {
  const [weekData, setWeekData] = useState<DayData[]>([]);

  /* ---------------- Cargar datos desde backend + historial local ---------------- */
  useEffect(() => {
    const token = localStorage.getItem("token");

    async function loadData() {
      // Cargar historial desde localStorage
      let history: DayData[] = [];

      try {
        const raw = localStorage.getItem("nutrition_history");
        if (raw) history = JSON.parse(raw);
      } catch (err) {
        console.warn("Error leyendo nutrition_history:", err);
      }

      // Si no hay token → solo mostrar historial y salir
      if (!token) {
        setWeekData(history);
        return;
      }

      // Obtener datos del backend
      const todayData = await fetchCalculate(token);

      if (todayData) {
        // evitar duplicado
        history = history.filter((h) => h.date !== todayData.date);
        history.push(todayData);

        // mantener 7 días
        if (history.length > 7) {
          history = history.slice(history.length - 7);
        }

        // guardar historial
        try {
          localStorage.setItem("nutrition_history", JSON.stringify(history));
        } catch (err) {
          console.warn("Error guardando nutrition_history:", err);
        }
      }

      setWeekData(history);
    }

    loadData();
  }, []);

  /* --------------------- Cálculos --------------------- */

  const totals = useMemo(() => {
    return weekData.reduce(
      (acc, d) => {
        acc.proteins += d.proteins;
        acc.carbs += d.carbs;
        acc.fats += d.fats;
        acc.calories += d.calories;
        if (d.habitCompleted) acc.habitDays++;
        return acc;
      },
      { proteins: 0, carbs: 0, fats: 0, calories: 0, habitDays: 0 }
    );
  }, [weekData]);

  const streak = useMemo(() => {
    let s = 0;
    for (let i = weekData.length - 1; i >= 0; i--) {
      if (weekData[i].habitCompleted) s++;
      else break;
    }
    return s;
  }, [weekData]);

  const maxMacro = useMemo(() => {
    let maxVal = 0;
    weekData.forEach((d) => {
      maxVal = Math.max(maxVal, d.proteins, d.carbs, d.fats);
    });
    return maxVal || 100;
  }, [weekData]);

  const motivMsg = useMemo(() => getMotivation(streak), [streak]);

  /* ----------------------------- UI ----------------------------- */

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-3">Mi Progreso</h1>

      {/* ---------------------- TARJETAS ---------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">

        {/* Resumen semanal */}
        <div className="bg-white p-4 rounded-2xl shadow">
          <h2 className="font-semibold">Resumen semanal</h2>
          <p className="text-sm text-gray-600 mt-2">
            Días completados: <strong>{totals.habitDays} / {weekData.length || 7}</strong>
          </p>

          <div className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between"><span>Proteínas</span><strong>{totals.proteins}</strong></div>
            <div className="flex justify-between"><span>Carbohidratos</span><strong>{totals.carbs}</strong></div>
            <div className="flex justify-between"><span>Grasas</span><strong>{totals.fats}</strong></div>
            <div className="flex justify-between"><span>Calorías</span><strong>{totals.calories}</strong></div>
          </div>

          <div className="mt-4">
            <p className="text-sm text-gray-600">Racha</p>
            <div className="flex items-center gap-3 mt-2">
              <div className="text-xl font-bold">{streak}</div>
              <span className="text-sm">{streak === 0 ? "Sin racha aún" : `${streak} día(s)`}</span>
            </div>
          </div>
        </div>

        {/* Metas */}
        <div className="bg-white p-4 rounded-2xl shadow">
          <h2 className="font-semibold">Metas diarias</h2>

          <div className="mt-3 space-y-3">
            <div className="p-3 bg-gray-50 rounded-lg flex justify-between text-sm">
              <span>Proteínas (meta 60g)</span>
              <strong>{Math.min(100, Math.round((totals.proteins / 7) * 100 / 60))}%</strong>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg flex justify-between text-sm">
              <span>Verduras</span>
              <span>2 porciones/día</span>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg flex justify-between text-sm">
              <span>Registro</span>
              <span>{totals.habitDays} días</span>
            </div>
          </div>
        </div>

        {/* Motivación */}
        <div className="bg-white p-4 rounded-2xl shadow">
          <h2 className="font-semibold">Motivación</h2>
          <p className="mt-3 text-gray-700">{motivMsg}</p>
        </div>
      </div>

      {/* ---------------------- GRAFICA ---------------------- */}
      <div className="bg-white p-4 rounded-2xl shadow mb-6">
        <h2 className="text-lg font-semibold mb-3">Macronutrientes (7 días)</h2>

        <div className="overflow-x-auto w-full">
          <svg viewBox={`0 0 ${weekData.length * 60} 200`} width="100%" height="200">
            {/* Líneas guía */}
            {[0, 50, 100, 150, 200].map((val, idx) => {
              const y = 180 - (val / maxMacro) * 160;
              return <line key={idx} x1={0} x2={weekData.length * 60} y1={y} y2={y} stroke="#eee" />;
            })}

            {/* Barras */}
            {weekData.map((d, i) => {
              const baseX = i * 60 + 10;
              const band = 12;
              const scale = (v: number) => (v / maxMacro) * 160;

              return (
                <g key={d.date} transform={`translate(${baseX},0)`}>
                  <rect x={0} y={180 - scale(d.proteins)} width={band} height={scale(d.proteins)} fill="#4F46E5" />
                  <rect x={band + 4} y={180 - scale(d.carbs)} width={band} height={scale(d.carbs)} fill="#10B981" />
                  <rect x={2 * (band + 4)} y={180 - scale(d.fats)} width={band} height={scale(d.fats)} fill="#F59E0B" />

                  <text x={band} y={195} fontSize={10} textAnchor="middle">
                    {formatShortDate(d.date)}
                  </text>

                  {d.habitCompleted && <circle cx={band} cy={165} r={4} fill="#06b6d4" />}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* ---------------------- CALENDARIO ---------------------- */}
      <div className="bg-white p-4 rounded-2xl shadow">
        <h2 className="font-semibold mb-3">Calendario (7 días)</h2>

        <div className="flex gap-3">
          {weekData.map((d) => {
            const dayShort = new Date(d.date).toLocaleDateString("es-PE", {
              weekday: "short",
            });

            return (
              <div key={d.date} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    d.habitCompleted ? "bg-green-500 text-white" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {dayShort.slice(0, 2)}
                </div>
                <span className="text-xs">{new Date(d.date).getDate()}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
