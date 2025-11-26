import Link from "next/link";
import { dinnerData } from "../_data/dinnerData";


export default function DinnerPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">🍽️ Cenas</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {dinnerData.map((recipe) => (
          <Link
            key={recipe.id}
            href={`/recipes/dinner/${recipe.id}`}
            className="p-5 bg-white rounded-xl shadow hover:scale-[1.02] transition"
          >
            <div className="text-6xl">{recipe.image}</div>
            <h2 className="text-xl font-semibold mt-2">{recipe.title}</h2>
            <p className="text-gray-500 text-sm">
              {recipe.macros.calories} kcal · {recipe.macros.protein}g proteína
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
