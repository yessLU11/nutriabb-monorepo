"use client";

import Link from "next/link";

export default function RecipesPage() {
  const categories = [
    { name: "🍳 Desayunos", href: "/recipes/breakfast", color: "#FEE440" },
    { name: "🍛 Almuerzos", href: "/recipes/lunch", color: "#00BBF9" },
    { name: "🍽️ Cenas", href: "/recipes/dinner", color: "#F15BB5" },
    { name: "🍎 Snacks", href: "/recipes/snacks", color: "#9B5DE5" },
  ];

  return (
    <div className="min-h-screen p-6 bg-[#FCFCFC]">
      <h1 className="text-6xl font-bold text-center mb-8 text-[#9B5DE5]">
        🍽️ Recetas Recomendadas
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.name}
            href={cat.href}
            className="p-6 rounded-xl shadow-lg text-center text-4xl font-semibold hover:scale-[1.02] transition cursor-pointer"
            style={{ backgroundColor: cat.color }}
          >
            {cat.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
