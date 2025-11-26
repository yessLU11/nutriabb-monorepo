import Link from "next/link";
import { breakfastData } from "../_data/breakfastData";

export default function BreakfastPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">🥞 Desayunos Saludables</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {breakfastData.map((recipe) => (
          <Link
            key={recipe.id}
            href={`/recipes/breakfast/${recipe.id}`}
            className="bg-white shadow-md p-4 rounded-xl hover:scale-105 transition transform"
          >
            <div className="text-6xl">{recipe.image}</div>

            <h2 className="text-xl font-semibold mt-3">{recipe.title}</h2>

            <p className="text-gray-600 mt-1">
              Proteínas: {recipe.macros.protein}g • Carbs: {recipe.macros.carbs}g
            </p>

            <p className="text-gray-500 text-sm mt-1">
              Calorías: {recipe.macros.calories} kcal
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
