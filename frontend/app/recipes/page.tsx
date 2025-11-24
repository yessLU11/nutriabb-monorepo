export default function RecipesPage() {
  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-6">Recetas</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <a
          href="/recipes/breakfast"
          className="p-4 bg-white shadow rounded-xl hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold">Desayuno</h2>
        </a>

        <a
          href="/recipes/lunch"
          className="p-4 bg-white shadow rounded-xl hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold">Almuerzo</h2>
        </a>

        <a
          href="/recipes/dinner"
          className="p-4 bg-white shadow rounded-xl hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold">Cena</h2>
        </a>
      </div>
    </div>
  );
}
