import { lunchData } from "../../_data/lunchData";

export default function LunchDetail({ params }: { params: { id: string } }) {
  const recipe = lunchData.find((r) => r.id === params.id);

  if (!recipe) return <p>Receta no encontrada.</p>;

  return (
    <div className="p-6">
      <p className="text-6xl">{recipe.image}</p>
      <h1 className="text-3xl font-bold">{recipe.title}</h1>

      <div className="mt-4 bg-white p-4 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-2">🍽️ Macros</h2>
        <p>🔥 {recipe.macros.calories} kcal</p>
        <p>🥩 Proteína: {recipe.macros.protein}g</p>
        <p>🍚 Carbohidratos: {recipe.macros.carbs}g</p>
        <p>🥑 Grasas: {recipe.macros.fats}g</p>
      </div>

      <div className="mt-4 bg-white p-4 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-2">📝 Ingredientes</h2>
        <ul className="list-disc ml-4">
          {recipe.ingredients.map((i, idx) => (
            <li key={idx}>{i}</li>
          ))}
        </ul>
      </div>

      <div className="mt-4 bg-white p-4 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-2">👩‍🍳 Preparación</h2>
        <ol className="list-decimal ml-4">
          {recipe.steps.map((s, idx) => (
            <li key={idx}>{s}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}
