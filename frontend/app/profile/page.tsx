"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "@/config";

type FormShape = {
  nombre: string;
  edad: string;
  sexo: string;
  peso: string;
  altura: string;
  objetivo: string;
  actividad: string;
  glucosa: string;
  intoleranciaLactosa: string;
  celiaco: string;
  alergias: string;
  condiciones: string;
  estadoFisiologico: string;
  comidas: string;
  evitarAlimentos: string;
};

const initialForm: FormShape = {
  nombre: "",
  edad: "",
  sexo: "",
  peso: "",
  altura: "",
  objetivo: "",
  actividad: "",
  glucosa: "",
  intoleranciaLactosa: "",
  celiaco: "",
  alergias: "",
  condiciones: "",
  estadoFisiologico: "",
  comidas: "",
  evitarAlimentos: "",
};

const Card = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="bg-card border-card p-5 rounded-xl shadow-card mb-6">
    <h2 className="text-lg font-semibold mb-3 text-accent">{title}</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
  </section>
);

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<FormShape>(initialForm);

  useEffect(() => {
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

async function loadProfile() {
  try {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/auth/login");

    const res = await fetch(`${API_URL}/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // 🔥 Si el token expiró → ir al login
    if (res.status === 401) {
      alert("Tu sesión expiró. Inicia sesión nuevamente.");
      localStorage.removeItem("token");
      return router.push("/auth/login");
    }

    if (!res.ok) {
      console.error("Error cargando perfil:", res.status);
      return;
    }

    const json = await res.json();

    // Asegura que data exista
    const profile = json?.data || json || {};
    setForm((prev) => ({ ...prev, ...profile }));
    setEditing(Boolean(json?.data));

  } catch (err) {
    console.error("Error cargando perfil", err);
  } finally {
    setLoading(false);
  }
}

async function saveProfile(method: "POST" | "PUT" = "POST") {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Tu sesión expiró. Inicia sesión nuevamente.");
      return router.push("/auth/login");
    }

    const res = await fetch(`${API_URL}/profile`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    // Verifica si la respuesta tiene JSON
    let json = null;
    try { json = await res.json(); } catch (e) { json = {}; }

    // 🔥 TOKEN EXPIRADO
    if (res.status === 401) {
      alert("Tu sesión expiró. Debes iniciar sesión nuevamente.");
      localStorage.removeItem("token");
      return router.push("/auth/login");
    }

    if (!res.ok) {
      console.error("Error al guardar:", json);
      alert(json.message || "Error al guardar el perfil");
      return;
    }

    alert("Perfil guardado correctamente 🎉");

  } catch (error) {
    console.error("Error:", error);
    alert("Error de conexión con el servidor");
  }
}



  async function deleteProfile() {
    if (!confirm("¿Seguro que deseas eliminar tu perfil? Esta acción no se puede deshacer.")) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/profile`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        alert("Perfil eliminado");
        setForm(initialForm);
        setEditing(false);
        router.refresh();
      } else {
        const err = await res.json().catch(() => null);
        alert(err?.error?.message || "No se pudo eliminar el perfil");
      }
    } catch (err) {
      console.error(err);
      alert("Error del servidor");
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <p className="text-lg" style={{ color: "#3BAFDA" }}>
          Cargando perfil...
        </p>
      </div>
    );

  return (
    <div className="p-6 max-w-4xl mx-auto text-default">
      <header className="mb-6">
        <h1 className="text-4xl font-bold" style={{ color: "#0A1A2F" }}>
          Mi Perfil Nutricional
        </h1>
        <p className="mt-1 text-sm" style={{ color: "#475569" }}>
          Completa tus datos para obtener recomendaciones personalizadas.
        </p>
      </header>

      <main>
        <Card title="Datos personales">
          <div>
            <label className="block text-sm mb-1">Nombre completo</label>
            <input
              name="nombre"
              placeholder="Nombre completo"
              value={form.nombre}
              onChange={handleChange}
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Edad (años)</label>
            <input name="edad" type="number" placeholder="Edad" value={form.edad} onChange={handleChange} className="input" />
          </div>

          <div>
            <label className="block text-sm mb-1">Sexo / Género</label>
            <select name="sexo" value={form.sexo} onChange={handleChange} className="input">
              <option value="">Seleccione</option>
              <option value="masculino">Masculino</option>
              <option value="femenino">Femenino</option>
              <option value="otro">Otro</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Número de comidas al día</label>
            <select name="comidas" value={form.comidas} onChange={handleChange} className="input">
              <option value="">Seleccione</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
            </select>
          </div>
        </Card>

        <Card title="Datos antropométricos">
          <div>
            <label className="block text-sm mb-1">Peso actual (kg)</label>
            <input name="peso" type="number" step="0.1" placeholder="Peso (kg)" value={form.peso} onChange={handleChange} className="input" />
          </div>

          <div>
            <label className="block text-sm mb-1">Altura / Talla (cm)</label>
            <input name="altura" type="number" step="0.1" placeholder="Altura (cm)" value={form.altura} onChange={handleChange} className="input" />
          </div>

          <div>
            <label className="block text-sm mb-1">Objetivo</label>
            <select name="objetivo" value={form.objetivo} onChange={handleChange} className="input">
              <option value="">Seleccione</option>
              <option value="subir">Subir de peso</option>
              <option value="bajar">Bajar de peso</option>
              <option value="mantener">Mantener peso</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Nivel de actividad fisica</label>
            <select name="actividad" value={form.actividad} onChange={handleChange} className="input">
              <option value="">Seleccione</option>
              <option value="sedentario">Sedentario</option>
              <option value="ligero">Ligero</option>
              <option value="moderado">Moderado</option>
              <option value="pesado">Pesado</option>
            </select>
          </div>
        </Card>

        <Card title="Datos clínicos y alergias">
          <div>
            <label className="block text-sm mb-1">Diagnóstico de glucosa</label>
            <select name="glucosa" value={form.glucosa} onChange={handleChange} className="input">
              <option value="">Seleccione</option>
              <option value="normal">Normal</option>
              <option value="prediabetes">Prediabetes</option>
              <option value="diabetes1">Diabetes Tipo 1</option>
              <option value="diabetes2">Diabetes Tipo 2</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Intolerancia a la lactosa</label>
            <select name="intoleranciaLactosa" value={form.intoleranciaLactosa} onChange={handleChange} className="input">
              <option value="">Seleccione</option>
              <option value="no">No</option>
              <option value="si">Sí</option>
              <option value="leve">Sensibilidad leve</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Enfermedad celíaca / sensibilidad al gluten</label>
            <select name="celiaco" value={form.celiaco} onChange={handleChange} className="input">
              <option value="">Seleccione</option>
              <option value="no">No</option>
              <option value="si">Sí</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Otras alergias / intolerancias</label>
            <input name="alergias" placeholder="Ej. mariscos, cacahuetes" value={form.alergias} onChange={handleChange} className="input" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm mb-1">Condiciones crónicas (ej. hipertensión, renal, colesterol)</label>
            <input name="condiciones" placeholder="Describe condiciones crónicas" value={form.condiciones} onChange={handleChange} className="input" />
          </div>
        </Card>

        <Card title="Estado fisiológico (solo mujeres)">
          <div>
            <label className="block text-sm mb-1">Selecciona estado</label>
            <select name="estadoFisiologico" value={form.estadoFisiologico} onChange={handleChange} className="input">
              <option value="">Seleccione</option>
              <option value="embarazo1">Embarazo - 1er trimestre</option>
              <option value="embarazo2">Embarazo - 2do trimestre</option>
              <option value="embarazo3">Embarazo - 3er trimestre</option>
              <option value="lactancia">Lactancia</option>
              <option value="menopausia">Menopausia</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Alimentos que deseas evitar</label>
            <input name="evitarAlimentos" placeholder="Lista separada por comas" value={form.evitarAlimentos} onChange={handleChange} className="input" />
          </div>
        </Card>

        {/* Botones */}
        <div className="flex gap-4 mt-6">
          <button type="button" onClick={() => saveProfile("POST")} className="btn-primary">
            Guardar
          </button>

          <button type="button" onClick={() => saveProfile("PUT")} className="btn-secondary">
            Actualizar
          </button>

          <button type="button" onClick={deleteProfile} className="btn-danger">
            Eliminar
          </button>
        </div>
      </main>

      {/* Estilos (puedes pasarlos a tu CSS/Tailwind config) */}
      <style jsx>{`
        :root {
          --azul-noche: #0A1A2F;
          --celeste: #3BAFDA;
          --plomo: #D1D5DB;
          --negro: #000000;
          --texto: #0b1f2e;
        }

        .text-default {
          color: var(--texto);
        }

        .bg-card {
          background: linear-gradient(180deg, rgba(0, 16, 239, 0.66), rgba(0, 16, 235, 0.39));
        }

        .border-card {
          border: 1px solid rgba(17, 2, 113, 0.12);
        }

        .shadow-card {
          box-shadow: 0 6px 18px rgba(10, 26, 47, 0.35);
        }

        .input {
          width: 100%;
          background: transparent;
          border: 1px solid rgba(9, 7, 111, 0.96);
          padding: 10px 12px;
          border-radius: 10px;
          color: #a5a0a0bd;
          outline: none;
        }

        .input::placeholder {
          color: rgba(183,197,209,0.7);
        }

        .input:focus {
          box-shadow: 0 4px 14px rgba(59,175,218,0.12);
          border-color: var(--celeste);
        }

        .text-accent {
          color: var(--celeste);
        }

        .btn-primary {
          background: #00fa15ff;
          color: #f3f3f3fc;
          padding: 10px 18px;
          border-radius: 10px;
          font-weight: 700;
          transition: transform 160ms ease, box-shadow 160ms ease;
          border: none;
        }

        .btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.95);
        }

        .btn-secondary {
          background: #32b4f5ff;
          color: #f3f3f3fc;
          padding: 10px 18px;
          border-radius: 10px;
          font-weight: 700;
          transition: transform 160ms ease, box-shadow 160ms ease;
          border: none;
        }

        .btn-secondary:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 18px rgba(0, 17, 246, 0.61);
        }

        .btn-danger {
          background: #e03b3b;
          color: white;
          padding: 10px 18px;
          border-radius: 10px;
          font-weight: 700;
          transition: transform 160ms ease, box-shadow 160ms ease;
          border: none;
        }

        .btn-danger:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 18px rgba(224,59,59,0.25);
        }

        @media (max-width: 768px) {
          .shadow-card {
            box-shadow: none;
          }
        }
      `}</style>
    </div>
  );
}
