export default function LunchPage() {
  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-6">Recetas de Almuerzo</h1>

      <div className="space-y-4">
        <div className="p-4 bg-white shadow rounded-xl">
          <h2 className="text-xl font-semibold">Pollo a la plancha</h2>
          <p className="text-gray-600 mt-2">
            Pechuga de pollo acompañada de ensalada fresca.
          </p>
        </div>

        <div className="p-4 bg-white shadow rounded-xl">
          <h2 className="text-xl font-semibold">Arroz con verduras</h2>
          <p className="text-gray-600 mt-2">
            Arroz integral con brócoli, zanahoria y pimiento.
          </p>
        </div>

        <div className="p-4 bg-white shadow rounded-xl">
          <h2 className="text-xl font-semibold">Ensalada de atún</h2>
          <p className="text-gray-600 mt-2">
            Mezcla de atún con verduras frescas y limón.
          </p>
        </div>
      </div>
    </div>
  );
}
