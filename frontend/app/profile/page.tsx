"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { runHealthCheck, autoFixHealth } from "@/utils/healthCheck";





/**
 * Perfil (FASE 3) - Single file
 * - All UI in one file (accordion, validation visual, autosave local every 1s)
 * - Sends only original fields to backend on submit
 * - Persists extras to localStorage
 * - Defensive: handles SSR (checks typeof window)
 */

/* ---------------- helpers ---------------- */
const safeJSONParse = (str: string | null, fallback: any) => {
  try {
    return str ? JSON.parse(str) : fallback;
  } catch {
    return fallback;
  }
};
const normalize = (v: any) => (v === null || v === undefined ? "" : v);
const normalizeBool = (v: any) => (v === null || v === undefined ? false : Boolean(v));

/* ---------------- initial keys --------------- */
const LOCAL_KEY = "profile_local_v3";

/* ---------------- component ---------------- */
export default function ProfilePage() {
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

  // loading + messages
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);

  // saving indicator (autosave)
  const [syncing, setSyncing] = useState(false);
  const isMounted = useRef(false);

  // accordion state
  const [openSection, setOpenSection] = useState<string | null>(null);

  // validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  // form state (includes originals + extras + health)
  const [form, setForm] = useState({
    // original (backend)
    age: "",
    gender: "",
    height: "",
    weight: "",
    activity_level: "",

    // extras (local)
    weight_goal: "",
    body_fat: "",
    lean_mass: "",
    meals_per_day: "",
    allergies: "",
    dislikes: "",
    diet_type: "",

    // health toggles
    diabetes: "none",
    hypertension: false,
    cholesterol: false,
    renal: false,
    celiac: false,
    lactose: false,
  });

  // dirty flag for autosave
  const dirtyRef = useRef(false);

  // read token (reactive)
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token"));
    }
  }, []);



  useEffect(() => {
    async function verify() {
      const check = await runHealthCheck(API_URL);

      console.log("HealthCheck:", check);

      const fixed = autoFixHealth(check);

      if (fixed || !check.token) {
        router.push("/auth/login");
        return;
      }

      if (check.backendOK && !check.profileOK) {
        console.warn("⚠ No existe perfil en backend");
      }
    }

    verify();
  }, [API_URL]);








  // protect route (after token load)
  useEffect(() => {
    if (token === null) return; // wait for token read
    if (!token) router.push("/auth/login");
  }, [token, router]);

  // load localStorage + backend merge safely
  useEffect(() => {
    function loadLocal() {
      if (typeof window === "undefined") return {};
      return safeJSONParse(localStorage.getItem(LOCAL_KEY), {});
    }

    async function fetchProfile() {
      const localData = loadLocal();

      if (!API_URL || !token) {
        // if no backend, just load local values (merge with defaults)
        setForm((prev) => ({ ...prev, ...localData }));
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/profile`, {
          headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        });

        const text = await res.text();
        let data: any = null;
        try {
          data = text ? JSON.parse(text) : null;
        } catch {
          data = null;
        }

        if (res.ok) {
          const backend = data?.data ?? {};
          // merge carefully: backend originals + local extras
          setForm((prev) => ({
            ...prev,
            age: normalize(backend.age ?? localData.age ?? prev.age),
            gender: normalize(backend.gender ?? localData.gender ?? prev.gender),
            height: normalize(backend.height ?? localData.height ?? prev.height),
            weight: normalize(backend.weight ?? localData.weight ?? prev.weight),
            activity_level: normalize(backend.activity_level ?? localData.activity_level ?? prev.activity_level),

            weight_goal: normalize(localData.weight_goal ?? prev.weight_goal),
            body_fat: normalize(localData.body_fat ?? prev.body_fat),
            lean_mass: normalize(localData.lean_mass ?? prev.lean_mass),
            meals_per_day: normalize(localData.meals_per_day ?? prev.meals_per_day),
            allergies: normalize(localData.allergies ?? prev.allergies),
            dislikes: normalize(localData.dislikes ?? prev.dislikes),
            diet_type: normalize(localData.diet_type ?? prev.diet_type),

            diabetes: normalize(localData.diabetes ?? prev.diabetes ?? "none"),
            hypertension: normalizeBool(localData.hypertension ?? prev.hypertension),
            cholesterol: normalizeBool(localData.cholesterol ?? prev.cholesterol),
            renal: normalizeBool(localData.renal ?? prev.renal),
            celiac: normalizeBool(localData.celiac ?? prev.celiac),
            lactose: normalizeBool(localData.lactose ?? prev.lactose),
          }));
        } else {
          // backend error -> fallback to local
          setForm((prev) => ({ ...prev, ...localData }));
        }
      } catch (err) {
        console.warn("fetchProfile error:", err);
        setForm((prev) => ({ ...prev, ...loadLocal() }));
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, API_URL]);

  // handle input changes (unified)
  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, type, value, checked } = e.target as any;
    const next = type === "checkbox" ? checked : value;
    setForm((prev) => ({ ...prev, [name]: next }));
    dirtyRef.current = true;

    // live validation for required original fields
    if (["age", "gender", "height", "weight", "activity_level"].includes(name)) {
      setErrors((prev) => {
        const copy = { ...prev };
        if (!next) copy[name] = "Campo obligatorio";
        else delete copy[name];
        return copy;
      });
    }
  }

  // autosave to localStorage every 1s when dirty
  useEffect(() => {
    isMounted.current = true;
    const interval = setInterval(() => {
      if (dirtyRef.current) {
        setSyncing(true);
        try {
          // persist to single local object
          const toSave = { ...form };
          // ensure safe primitives (avoid functions)
          const safe = JSON.parse(JSON.stringify(toSave));
          localStorage.setItem(LOCAL_KEY, JSON.stringify(safe));
        } catch (e) {
          console.warn("autosave failed", e);
        } finally {
          dirtyRef.current = false;
          // small delay to show syncing state
          setTimeout(() => setSyncing(false), 350);
        }
      }
    }, 1000);

    // save on unload
    function handleBeforeUnload() {
      try {
        localStorage.setItem(LOCAL_KEY, JSON.stringify(form));
      } catch {}
    }
    if (typeof window !== "undefined") {
      window.addEventListener("beforeunload", handleBeforeUnload);
    }

    return () => {
      clearInterval(interval);
      if (typeof window !== "undefined") {
        window.removeEventListener("beforeunload", handleBeforeUnload);
      }
      // final save
      try {
        localStorage.setItem(LOCAL_KEY, JSON.stringify(form));
      } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  // manual save to backend (only original fields)
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null as any);

    // quick validation
    const newErrors: Record<string, string> = {};
    if (!form.age) newErrors.age = "Edad requerida";
    if (!form.gender) newErrors.gender = "Género requerido";
    if (!form.height) newErrors.height = "Altura requerida";
    if (!form.weight) newErrors.weight = "Peso requerido";
    if (!form.activity_level) newErrors.activity_level = "Nivel requerido";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setMessage({ type: "error", text: "Corrige los campos marcados" });
      // open first section containing error
      setOpenSection("antropometricos");
      return;
    }

    if (!API_URL || !token) {
      setMessage({ type: "info", text: "Guardado localmente (sin backend)." });
      return;
    }

    setMessage({ type: "info", text: "Enviando al servidor..." });

    try {
      const res = await fetch(`${API_URL}/profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          age: form.age,
          gender: form.gender,
          height: form.height,
          weight: form.weight,
          activity_level: form.activity_level,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const errMsg = data?.error?.message || data?.message || `Error ${res.status}`;
        setMessage({ type: "error", text: errMsg });
        return;
      }

      setMessage({ type: "success", text: "✔️ Perfil guardado con éxito" });
      // mark saved: clear dirty and persist to local
      try {
        localStorage.setItem(LOCAL_KEY, JSON.stringify(form));
        dirtyRef.current = false;
      } catch {}
    } catch (err) {
      setMessage({ type: "error", text: "Error conectando con el servidor" });
    }
  }

  // small utility to toggle accordion
  const toggleSection = (key: string) => setOpenSection((prev) => (prev === key ? null : key));

  // reset local data (optional)
  function clearLocalData() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(LOCAL_KEY);
    setMessage({ type: "info", text: "Datos locales eliminados" });
    setForm((prev) => ({
      ...prev,
      weight_goal: "",
      body_fat: "",
      lean_mass: "",
      meals_per_day: "",
      allergies: "",
      dislikes: "",
      diet_type: "",
      diabetes: "none",
      hypertension: false,
      cholesterol: false,
      renal: false,
      celiac: false,
      lactose: false,
    }));
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-lg">
        Cargando perfil...
      </div>
    );
  }

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-dark,#0A1A2F)]">
              Mi Perfil Nutricional
            </h1>
            <p className="text-sm text-[var(--color-gray,#6B7280)] mt-1">
              Completa tus datos para obtener recomendaciones personalizadas.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {syncing && (
              <div className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full shadow-sm">
                Sincronizando…
              </div>
            )}
            <button
              onClick={clearLocalData}
              type="button"
              className="text-sm px-3 py-1 border rounded-md text-gray-700 bg-white hover:bg-gray-100"
            >
              Borrar locales
            </button>
          </div>
        </div>

        {/* message */}
        {message && (
          <div
            className={`mb-4 p-3 rounded-md font-medium ${
              message.type === "success"
                ? "bg-green-50 text-green-700"
                : message.type === "error"
                ? "bg-red-50 text-red-700"
                : "bg-blue-50 text-blue-700"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ANTHROPOMETRICS */}
          <CardSection
            title="Datos antropométricos"
            open={openSection === "antropometricos"}
            onToggle={() => toggleSection("antropometricos")}
            hint="Información básica necesaria para el cálculo"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Edad (años)"
                name="age"
                type="number"
                value={form.age ?? ""}
                onChange={handleChange}
                error={errors.age}
                required
              />
              <Select
                label="Género"
                name="gender"
                value={form.gender ?? ""}
                onChange={handleChange}
                options={[
                  { value: "", label: "Seleccionar..." },
                  { value: "female", label: "Femenino" },
                  { value: "male", label: "Masculino" },
                  { value: "non-binary", label: "No binario" },
                ]}
                error={errors.gender}
                required
              />
              <Input
                label="Altura (cm)"
                name="height"
                type="number"
                value={form.height ?? ""}
                onChange={handleChange}
                error={errors.height}
                required
              />
              <Input
                label="Peso (kg)"
                name="weight"
                type="number"
                value={form.weight ?? ""}
                onChange={handleChange}
                error={errors.weight}
                required
              />
              <Select
                label="Nivel de actividad"
                name="activity_level"
                value={form.activity_level ?? ""}
                onChange={handleChange}
                options={[
                  { value: "", label: "Seleccionar..." },
                  { value: "sedentary", label: "Sedentario" },
                  { value: "light", label: "Leve" },
                  { value: "moderate", label: "Moderado" },
                  { value: "active", label: "Activo" },
                  { value: "very_active", label: "Muy activo" },
                ]}
                error={errors.activity_level}
                required
              />
            </div>
          </CardSection>

          {/* OBJECTIVES */}
          <CardSection
            title="Objetivos y composición"
            open={openSection === "objetivos"}
            onToggle={() => toggleSection("objetivos")}
            hint="Peso objetivo y composición corporal"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input label="Peso objetivo (kg)" name="weight_goal" type="number" value={form.weight_goal ?? ""} onChange={handleChange} />
              <Input label="% Grasa corporal" name="body_fat" type="number" value={form.body_fat ?? ""} onChange={handleChange} />
              <Input label="Masa magra (kg)" name="lean_mass" type="number" value={form.lean_mass ?? ""} onChange={handleChange} />
              <Input label="Comidas al día" name="meals_per_day" type="number" value={form.meals_per_day ?? ""} onChange={handleChange} />
            </div>
          </CardSection>

          {/* HEALTH */}
          <CardSection
            title="Indicadores de salud"
            open={openSection === "salud"}
            onToggle={() => toggleSection("salud")}
            hint="Condiciones que afectan recomendaciones"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Select label="Diabetes" name="diabetes" value={form.diabetes ?? "none"} onChange={handleChange} options={[
                {value:"none", label:"Sin diabetes"},
                {value:"prediabetes", label:"Prediabetes"},
                {value:"type1", label:"Tipo 1"},
                {value:"type2", label:"Tipo 2"},
              ]} />
              <Checkbox label="Hipertensión" name="hypertension" checked={!!form.hypertension} onChange={handleChange} />
              <Checkbox label="Colesterol alto" name="cholesterol" checked={!!form.cholesterol} onChange={handleChange} />
              <Checkbox label="Enfermedad renal" name="renal" checked={!!form.renal} onChange={handleChange} />
              <Checkbox label="Celiaquía" name="celiac" checked={!!form.celiac} onChange={handleChange} />
              <Checkbox label="Intolerancia a la lactosa" name="lactose" checked={!!form.lactose} onChange={handleChange} />
            </div>
          </CardSection>

          {/* PREFERENCES */}
          <CardSection title="Preferencias alimentarias" open={openSection === "preferencias"} onToggle={() => toggleSection("preferencias")} hint="Alergias, dietas y gustos">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input label="Alergias (coma)" name="allergies" value={form.allergies ?? ""} onChange={handleChange} />
              <Input label="Alimentos que no te gustan" name="dislikes" value={form.dislikes ?? ""} onChange={handleChange} />
              <Input label="Tipo de dieta (vegana, keto…)" name="diet_type" value={form.diet_type ?? ""} onChange={handleChange} />
            </div>
          </CardSection>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              className="flex-1 w-full bg-[var(--color-primary,#00B6FF)] text-white py-3 rounded-xl font-semibold shadow hover:opacity-95 transition"
            >
              Guardar Cambios
            </button>
            <button
              type="button"
              onClick={() => { setOpenSection(null); setMessage({ type: "info", text: "Secciones cerradas" }); }}
              className="px-4 py-3 border rounded-xl bg-white"
            >
              Cerrar secciones
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ---------------- UI Subcomponents ---------------- */

function CardSection({ title, children, open, onToggle, hint }: any) {
  return (
    <section className="bg-white p-4 rounded-2xl shadow-sm border">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-3"
        aria-expanded={open ? "true" : "false"}
      >
        <div>
          <h3 className="text-lg font-semibold text-[var(--color-dark,#0A1A2F)]">{title}</h3>
          {hint && <p className="text-xs text-[var(--color-gray,#6B7280)] mt-1">{hint}</p>}
        </div>
        <div className="text-sm text-[var(--color-gray,#6B7280)]">{open ? "Ocultar" : "Mostrar"}</div>
      </button>

      <div className={`mt-3 transition-all ${open ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}>
        {children}
      </div>
    </section>
  );
}

function Input({ label, error, ...props }: any) {
  const hasError = !!error;
  return (
    <label className="block">
      <div className="flex justify-between items-center mb-1">
        <span className={`text-sm font-medium ${hasError ? "text-red-600" : "text-[var(--color-dark,#0A1A2F)]"}`}>{label}</span>
        {hasError && <span className="text-xs text-red-600">{error}</span>}
      </div>

      <input
        {...props}
        value={props.value ?? ""}
        onChange={props.onChange}
        className={`mt-1 p-3 w-full border rounded-xl shadow-sm bg-white focus:ring-2 ${
          hasError ? "border-red-300 focus:ring-red-200" : "border-gray-200 focus:ring-[var(--color-primary,#00B6FF)]"
        }`}
      />
    </label>
  );
}

function Select({ label, options = [], error, ...props }: any) {
  const hasError = !!error;
  return (
    <label className="block">
      <div className="flex justify-between items-center mb-1">
        <span className={`text-sm font-medium ${hasError ? "text-red-600" : "text-[var(--color-dark,#0A1A2F)]"}`}>{label}</span>
        {hasError && <span className="text-xs text-red-600">{error}</span>}
      </div>

      <select
        {...props}
        value={props.value ?? ""}
        onChange={props.onChange}
        className={`mt-1 p-3 w-full border rounded-xl shadow-sm bg-white focus:ring-2 ${
          hasError ? "border-red-300 focus:ring-red-200" : "border-gray-200 focus:ring-[var(--color-primary,#00B6FF)]"
        }`}
      >
        {Array.isArray(options) &&
          options.map((o: any) => (
            <option key={String(o.value)} value={o.value}>
              {o.label}
            </option>
          ))}
      </select>
    </label>
  );
}

function Checkbox({ label, checked, ...props }: any) {
  return (
    <label className="flex items-center gap-3">
      <input
        {...props}
        type="checkbox"
        checked={!!checked}
        onChange={props.onChange}
        className="w-5 h-5"
      />
      <span className="text-[var(--color-dark,#0A1A2F)]">{label}</span>
    </label>
  );
}
