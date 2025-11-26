import { Recipe } from "./types";

export const dinnerData: Recipe[] = [
  {
    id: "d1",
    title: "Salmón al Horno con Verduras",
    image: "🐟",
    type: "dinner",
    ingredients: [
      "1 filete de salmón",
      "Brócoli",
      "Zanahoria",
      "1 cda de aceite de oliva",
      "Sal y limón"
    ],
    steps: [
      "Precalentar el horno a 180°.",
      "Colocar el salmón con verduras.",
      "Hornear 20 minutos y servir."
    ],
    macros: {
      protein: 32,
      carbs: 10,
      fats: 14,
      calories: 320
    }
  },
  {
    id: "d2",
    title: "Pechuga de Pollo con Ensalada",
    image: "🥗",
    type: "dinner",
    ingredients: [
      "1 pechuga de pollo",
      "Lechuga",
      "Tomate",
      "Aceite de oliva",
      "Sal y pimienta"
    ],
    steps: [
      "Sazonar y cocinar el pollo.",
      "Armar la ensalada.",
      "Servir todo junto."
    ],
    macros: {
      protein: 28,
      carbs: 12,
      fats: 8,
      calories: 290
    }
  }
];
