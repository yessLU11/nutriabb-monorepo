import Link from "next/link";
import { snacksData } from "../_data/snacksData";

export default function SnacksPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-purple-600 mb-6">
        🥜 Snacks Saludables
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {snacksData.map((recipe) => (
          <Link
            key={recipe.id}
            href={`/recipes/snacks/${recipe.id}`}
            className="p-4 bg-purple-100 shadow hover:scale-105 transition rounded-xl"
          >
            <div className="text-5xl">{recipe.image}</div>
            <h2 className="text-xl font-semibold mt-2">{recipe.title}</h2>
            <p className="text-sm text-gray-600">
              Proteínas: {recipe.macros.protein}g · Carbs: {recipe.macros.carbs}g
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
