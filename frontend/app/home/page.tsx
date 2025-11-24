export default function HomePage() {
  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">Bienvenida, Yess 👋</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <a
          href="/profile"
          className="p-4 bg-white shadow rounded-xl hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold">Mi Perfil</h2>
          <p className="text-gray-600 text-sm mt-1">
            Actualiza tus datos personales y nutricionales.
          </p>
        </a>

        <a
          href="/results"
          className="p-4 bg-white shadow rounded-xl hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold">Mis Resultados</h2>
          <p className="text-gray-600 text-sm mt-1">
            Ver calorías, macros y análisis nutricional.
          </p>
        </a>

        <a
          href="/recipes"
          className="p-4 bg-white shadow rounded-xl hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold">Recetas Sencillas</h2>
          <p className="text-gray-600 text-sm mt-1">
            Ideas rápidas para desayuno, almuerzo y cena.
          </p>
        </a>

        <a
          href="/meal-plan"
          className="p-4 bg-white shadow rounded-xl hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold">Plan Semanal</h2>
          <p className="text-gray-600 text-sm mt-1">
            Organiza tus comidas de la semana.
          </p>
        </a>

        <a
          href="/calculator"
          className="p-4 bg-white shadow rounded-xl hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold">Calculadora</h2>
          <p className="text-gray-600 text-sm mt-1">
            Calcula tu gasto energético.
          </p>
        </a>

        <a
          href="/progress"
          className="p-4 bg-white shadow rounded-xl hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold">Mi Progreso</h2>
          <p className="text-gray-600 text-sm mt-1">
            Visualiza tu evolución.
          </p>
        </a>
      </div>
    </div>
  );
}
