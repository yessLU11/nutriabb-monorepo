import { snacksData } from "../../_data/snacksData";
import Link from "next/link";

export default function SnackDetail({ params }: { params: { id: string } }) {
  const recipe = snacksData.find((r) => r.id === params.id);

  if (!recipe) {
    return <p>Snack no encontrado</p>;
  }

  return (
    <div className="p-6">
      <Link href="/recipes/snacks" className="text-purple-600 underline">
        ← Volver
      </Link>

      <div className="text-center mt-4">
        <div className="text-7xl">{recipe.image}</div>
        <h1 className="text-3xl font-bold mt-2">{recipe.title}</h1>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-purple-100 p-4 rounded-xl shadow">
          <h2 className="text-xl font-semibold">Ingredientes 🧂</h2>
          <ul className="list-disc ml-6">
            {recipe.ingredients.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="bg-purple-200 p-4 rounded-xl shadow">
          <h2 className="text-xl font-semibold">Preparación 👩‍🍳</h2>
          <ol className="list-decimal ml-6">
            {recipe.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
      </div>

      <div className="mt-6 bg-purple-300 p-4 rounded-xl shadow text-center">
        <h2 className="text-xl font-semibold">Macronutrientes 🍽️</h2>
        <p>
          <strong>Proteínas:</strong> {recipe.macros.protein}g ·{" "}
          <strong>Carbohidratos:</strong> {recipe.macros.carbs}g ·{" "}
          <strong>Grasas:</strong> {recipe.macros.fats}g
        </p>
        <p className="mt-1">
          <strong>Calorías:</strong> {recipe.macros.calories} kcal
        </p>
      </div>
    </div>
  );
}
