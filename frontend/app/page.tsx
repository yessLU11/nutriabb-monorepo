"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-[var(--color-light)] px-6">

      {/* Logo */}
      <div className="mb-10">
        <Image
          src="/nutridiabb-logo.png"
          alt="Nutriabb Logo"
          width={195}
          height={140}
          priority
        />

      </div>
      {/* Título */}
      <h1 className="text-4xl font-bold text-center text-[#191970]
 mb-2">
        NutriDiabb
      </h1>
      <p className="text-center text-gray-600 mb-10">
        Cuida tu salud, comer sano es un Acto de Amor Propio.
      </p>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        {/* Botón Iniciar Sesión */}
        <button
          onClick={() => router.push("/auth/login")}
          className="w-full bg-[#00B6FF] text-white py-3 rounded-xl text-lg font-medium hover:bg-[#191970] transition"
        >
          Iniciar sesión
        </button>

        {/* Botón Registrarse */}
        <button
          onClick={() => router.push("/auth/register")}
          className="w-full border border-[#00B6FF] text-[#00B6FF] py-3 rounded-xl text-lg font-medium hover:bg-[#191970] transition"
        >
          Registrarse
        </button>
      </div>
    </div>
  );
}
