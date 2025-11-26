import { Recipe } from "./types";

export const lunchData: Recipe[] = [
  {
    id: "l1",
    title: "Pollo a la plancha con ensalada",
    image: "🍗",
    type: "lunch",
    ingredients: [
      "150g de pechuga de pollo",
      "1 taza de lechuga",
      "½ tomate",
      "1 cda de aceite de oliva",
      "Sal y pimienta"
    ],
    steps: [
      "Sazonar el pollo.",
      "Cocinar a la plancha por 6–8 minutos.",
      "Preparar la ensalada.",
      "Servir todo junto."
    ],
    macros: { protein: 38, carbs: 6, fats: 10, calories: 280 }
  },
  {
    id: "l2",
    title: "Arroz con atún fit",
    image: "🐟",
    type: "lunch",
    ingredients: [
      "1 lata de atún en agua",
      "½ taza de arroz",
      "1 huevo",
      "1 cda salsa de soya"
    ],
    steps: [
      "Cocinar el arroz.",
      "Saltear el arroz con el huevo.",
      "Añadir atún y salsa de soya.",
      "Mezclar y servir."
    ],
    macros: { protein: 32, carbs: 42, fats: 6, calories: 380 }
  },
  {
    id: "l3",
    title: "Pasta integral con pollo",
    image: "🍝",
    type: "lunch",
    ingredients: [
      "80g pasta integral",
      "120g pechuga de pollo",
      "1 cda aceite de oliva",
      "Sal y especias"
    ],
    steps: [
      "Cocinar la pasta.",
      "Saltear el pollo.",
      "Mezclar y sazonar."
    ],
    macros: { protein: 35, carbs: 60, fats: 10, calories: 480 }
  },
  {
    id: "l4",
    title: "Tacos saludables",
    image: "🌮",
    type: "lunch",
    ingredients: [
      "2 tortillas integrales",
      "100g carne molida magra",
      "Lechuga",
      "Tomate picado"
    ],
    steps: [
      "Cocinar la carne.",
      "Armar los tacos con verduras.",
      "Servir caliente."
    ],
    macros: { protein: 28, carbs: 35, fats: 9, calories: 360 }
  },
  {
    id: "l5",
    title: "Tilapia con arroz y verduras",
    image: "🐠",
    type: "lunch",
    ingredients: [
      "150g filete de tilapia",
      "½ taza arroz",
      "Verduras al vapor"
    ],
    steps: [
      "Sazonar y cocinar la tilapia.",
      "Cocinar el arroz.",
      "Servir con verduras."
    ],
    macros: { protein: 34, carbs: 45, fats: 6, calories: 390 }
  },
  {
    id: "l6",
    title: "Ensalada de atún alta en proteína",
    image: "🥗",
    type: "lunch",
    ingredients: [
      "1 lata de atún",
      "Lechuga",
      "Cebolla morada",
      "2 cdas yogurt light"
    ],
    steps: [
      "Mezclar todos los ingredientes.",
      "Ajustar condimentos.",
      "Servir fría."
    ],
    macros: { protein: 30, carbs: 8, fats: 4, calories: 220 }
  },
  {
    id: "l7",
    title: "Bowl de arroz con huevo y pollo",
    image: "🍛",
    type: "lunch",
    ingredients: [
      "½ taza arroz",
      "1 huevo",
      "120g pollo",
      "Salsa soya"
    ],
    steps: [
      "Cocinar el arroz.",
      "Freír o cocer el huevo.",
      "Saltear pollo.",
      "Servir todo en un bowl."
    ],
    macros: { protein: 36, carbs: 48, fats: 10, calories: 420 }
  },
  {
    id: "l8",
    title: "Wrap de pollo integral",
    image: "🌯",
    type: "lunch",
    ingredients: [
      "1 tortilla integral",
      "100g pollo",
      "Lechuga y tomate",
      "1 cda mayonesa light"
    ],
    steps: [
      "Cocinar el pollo.",
      "Armar el wrap.",
      "Servir fresco."
    ],
    macros: { protein: 30, carbs: 33, fats: 7, calories: 330 }
  }
];
