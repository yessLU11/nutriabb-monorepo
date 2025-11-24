export default function DinnerPage() {
  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-6">Recetas de Cena</h1>

      <div className="space-y-4">
        <div className="p-4 bg-white shadow rounded-xl">
          <h2 className="text-xl font-semibold">Sopa de verduras</h2>
          <p className="text-gray-600 mt-2">
            Caldo ligero con verduras variadas.
          </p>
        </div>

        <div className="p-4 bg-white shadow rounded-xl">
          <h2 className="text-xl font-semibold">Tortilla de espinaca</h2>
          <p className="text-gray-600 mt-2">
            Huevos y espinacas salteadas en tortilla ligera.
          </p>
        </div>

        <div className="p-4 bg-white shadow rounded-xl">
          <h2 className="text-xl font-semibold">Pescado al vapor</h2>
          <p className="text-gray-600 mt-2">
            Filete de pescado acompañado de verduras cocidas.
          </p>
        </div>
      </div>
    </div>
  );
}
