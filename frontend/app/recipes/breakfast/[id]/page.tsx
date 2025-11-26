import { breakfastData } from "../../_data/breakfastData";

export default function BreakfastDetail({ params }: any) {
  const recipe = breakfastData.find((r) => r.id === params.id);

  if (!recipe) return <p>Receta no encontrada</p>;

  return (
    <div className="p-6">
      <div className="text-7xl">{recipe.image}</div>

      <h1 className="text-4xl font-bold mt-4">{recipe.title}</h1>

      <div className="mt-4 bg-gray-100 p-4 rounded-xl">
        <h2 className="text-xl font-semibold mb-2">🍽️ Valores Nutricionales</h2>
        <p>Proteína: {recipe.macros.protein}g</p>
        <p>Carbohidratos: {recipe.macros.carbs}g</p>
        <p>Grasas: {recipe.macros.fats}g</p>
        <p>Calorías: {recipe.macros.calories} kcal</p>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">🧾 Ingredientes</h2>
        <ul className="list-disc ml-6">
          {recipe.ingredients.map((i, idx) => (
            <li key={idx}>{i}</li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">👩‍🍳 Preparación</h2>
        <ol className="list-decimal ml-6">
          {recipe.steps.map((s, idx) => (
            <li key={idx} className="mb-2">
              {s}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
