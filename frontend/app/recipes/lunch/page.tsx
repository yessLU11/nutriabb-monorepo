import Link from "next/link";
import { lunchData } from "../_data/lunchData";

export default function LunchPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">🍽️ Almuerzos</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {lunchData.map((recipe) => (
          <Link
            key={recipe.id}
            href={`/recipes/lunch/${recipe.id}`}
            className="bg-white shadow-md rounded-xl p-4 hover:scale-[1.02] transition"
          >
            <p className="text-4xl">{recipe.image}</p>
            <h2 className="font-semibold text-xl">{recipe.title}</h2>
            <p className="text-gray-600 text-sm">
              {recipe.macros.calories} kcal · {recipe.macros.protein}g proteína
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
