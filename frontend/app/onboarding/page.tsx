"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

const slides = [
  {
    title: "Recetas con alimentos de tu mercado",
    subtitle: "Plan semanal con medidas caseras",
    image: "/onboarding1.png", // <-- pon tu imagen aquí
  },
  {
    title: "Un asistente siempre contigo",
    subtitle: "Toma una foto de tu comida",
    image: "/onboarding2.png",
  },
  {
    title: "Calculadora nutricional",
    subtitle: "Únete a la comunidad, gana logros e insignias",
    image: "/onboarding3.png",
  },
  {
    title: "¡Bienvenido!",
    subtitle: "La comunidad te recibe con mucha felicidad",
    image: "/onboarding4.png", // robot
  },
];

export default function OnboardingPage() {
  const [index, setIndex] = useState(0);
  const router = useRouter();

  const next = () => {
    if (index < slides.length - 1) {
      setIndex(index + 1);
    } else {
      router.push("/dashboard"); // al terminar onboarding
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-white px-8 pt-10 text-center">
      {/* IMAGEN */}
      <div className="w-full flex justify-center">
        <Image
          src={slides[index].image}
          alt="Onboarding"
          width={260}
          height={260}
          className="rounded-xl"
        />
      </div>

      {/* TITULO */}
      <h1 className="text-2xl font-semibold text-black mt-6">
        “{slides[index].title}”
      </h1>

      {/* SUBTITULO */}
      <p className="text-gray-500 mt-2 mb-10">
        “{slides[index].subtitle}”
      </p>

      {/* INDICADORES */}
      <div className="flex gap-2 mb-10">
        {slides.map((_, i) => (
          <div
            key={i}
            className={`h-2 w-2 rounded-full ${
              index === i ? "bg-black" : "bg-gray-400"
            }`}
          />
        ))}
      </div>

      {/* BOTON SIGUIENTE */}
      <button
        onClick={next}
        className="w-full bg-[#00B6FF] text-white py-3 rounded-xl text-lg font-medium hover:bg-[#191970] transition"
      >
        {index === slides.length - 1 ? "Finalizar" : "Siguiente"}
      </button>
    </div>
  );
}
