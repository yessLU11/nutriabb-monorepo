import { Recipe } from "./types";

export const breakfastData: Recipe[] = [
  {
    id: "b1",
    title: "Avena Energética con Frutas",
    image: "🥣",
    type: "breakfast",
    ingredients: [
      "1/2 taza de avena",
      "1 taza de leche o agua",
      "1 plátano picado",
      "1 cda de miel",
      "Canela al gusto",
    ],
    steps: [
      "Calentar la avena con la leche.",
      "Agregar frutas y miel.",
      "Servir con canela."
    ],
    macros: {
      protein: 12,
      carbs: 55,
      fats: 5,
      calories: 350
    }
  },
  {
    id: "b2",
    title: "Tostadas Integrales con Huevo",
    image: "🍳",
    type: "breakfast",
    ingredients: [
      "2 rebanadas de pan integral",
      "2 huevos",
      "1 cda de aceite",
      "Sal y pimienta"
    ],
    steps: [
      "Tostar el pan.",
      "Freír los huevos.",
      "Armar las tostadas y servir."
    ],
    macros: {
      protein: 20,
      carbs: 30,
      fats: 10,
      calories: 380
    }
  }
];
