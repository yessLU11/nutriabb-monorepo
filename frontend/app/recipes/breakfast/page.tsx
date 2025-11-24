export default function BreakfastPage() {
  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-6">Recetas de Desayuno</h1>

      <div className="space-y-4">
        <div className="p-4 bg-white shadow rounded-xl">
          <h2 className="text-xl font-semibold">Avena con frutas</h2>
          <p className="text-gray-600 mt-2">
            Avena cocida con plátano, fresas y un toque de miel.
          </p>
        </div>

        <div className="p-4 bg-white shadow rounded-xl">
          <h2 className="text-xl font-semibold">Tostadas con huevo</h2>
          <p className="text-gray-600 mt-2">
            Pan integral tostado acompañado de huevo revuelto.
          </p>
        </div>

        <div className="p-4 bg-white shadow rounded-xl">
          <h2 className="text-xl font-semibold">Yogurt con granola</h2>
          <p className="text-gray-600 mt-2">
            Yogurt natural bajo en grasa con granola y semillas.
          </p>
        </div>
      </div>
    </div>
  );
}
