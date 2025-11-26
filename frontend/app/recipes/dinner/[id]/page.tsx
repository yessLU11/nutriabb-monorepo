import { dinnerData } from "../../_data/dinnerData";


export default function DinnerDetail({ params }: { params: { id: string } }) {
  const recipe = dinnerData.find((r) => r.id === params.id);

  if (!recipe) return <p>Receta no encontrada</p>;

  return (
    <div className="p-6">
      <div className="text-7xl">{recipe.image}</div>
      <h1 className="text-3xl font-bold mt-4">{recipe.title}</h1>

      <h2 className="text-xl font-semibold mt-6">🥑 Macros</h2>
      <ul className="list-disc ml-6 text-gray-700">
        <li>Proteína: {recipe.macros.protein}g</li>
        <li>Carbohidratos: {recipe.macros.carbs}g</li>
        <li>Grasas: {recipe.macros.fats}g</li>
        <li>Calorías: {recipe.macros.calories} kcal</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6">📝 Ingredientes</h2>
      <ul className="list-disc ml-6 text-gray-700">
        {recipe.ingredients.map((ing, i) => (
          <li key={i}>{ing}</li>
        ))}
      </ul>

      <h2 className="text-xl font-semibold mt-6">👨‍🍳 Preparación</h2>
      <ol className="list-decimal ml-6 text-gray-700">
        {recipe.steps.map((step, i) => (
          <li key={i}>{step}</li>
        ))}
      </ol>
    </div>
  );
}
