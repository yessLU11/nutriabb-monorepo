import { Recipe } from "./types";

export const snacksData: Recipe[] = [
  {
    id: "snack-1",
    title: "Yogur Griego con Miel y Nueces",
    image: "🍯",
    type: "snack",
    ingredients: [
      "1 taza yogur griego",
      "1 cucharadita de miel",
      "10g de nueces picadas"
    ],
    steps: [
      "Mezcla el yogur con la miel.",
      "Agrega las nueces encima.",
      "Sirve frío."
    ],
    macros: {
      protein: 15,
      carbs: 20,
      fats: 10,
      calories: 230
    }
  },

  {
    id: "snack-2",
    title: "Barrita Energética Casera",
    image: "🥜",
    type: "snack",
    ingredients: [
      "20g avena",
      "1 cucharadita mantequilla de maní",
      "1 cucharadita miel"
    ],
    steps: [
      "Mezcla todo en un bowl.",
      "Forma una barrita compacta.",
      "Refrigera 20 minutos."
    ],
    macros: {
      protein: 6,
      carbs: 22,
      fats: 9,
      calories: 190
    }
  },

  {
    id: "snack-3",
    title: "Manzana con Mantequilla de Maní",
    image: "🍎",
    type: "snack",
    ingredients: ["1 manzana", "1 cucharada mantequilla de maní"],
    steps: [
      "Corta la manzana en rodajas.",
      "Unta un poco de mantequilla de maní en cada rodaja."
    ],
    macros: {
      protein: 4,
      carbs: 25,
      fats: 8,
      calories: 210
    }
  },

  {
    id: "snack-4",
    title: "Smoothie Verde Express",
    image: "🥤",
    type: "snack",
    ingredients: ["1 taza espinaca", "½ banana", "½ taza agua", "Hielo"],
    steps: [
      "Agrega todos los ingredientes en una licuadora.",
      "Licúa por 20 segundos.",
      "Sirve bien frío."
    ],
    macros: {
      protein: 3,
      carbs: 18,
      fats: 1,
      calories: 95
    }
  },

  {
    id: "snack-5",
    title: "Huevo Cocido con Sal",
    image: "🥚",
    type: "snack",
    ingredients: ["1 huevo", "Pizca de sal"],
    steps: [
      "Cocer el huevo por 10 minutos.",
      "Pelar y agregar una pizca de sal."
    ],
    macros: {
      protein: 6,
      carbs: 1,
      fats: 5,
      calories: 75
    }
  },

  {
    id: "snack-6",
    title: "Mini Sandwich de Pavo",
    image: "🥪",
    type: "snack",
    ingredients: ["1 mini pan integral", "1 rebanada de pavo", "Lechuga"],
    steps: [
      "Arma el mini sandwich.",
      "Servir fresco."
    ],
    macros: {
      protein: 10,
      carbs: 18,
      fats: 3,
      calories: 150
    }
  },

  {
    id: "snack-7",
    title: "Gelatina Proteica",
    image: "🍮",
    type: "snack",
    ingredients: ["1 taza gelatina light", "½ scoop proteína vainilla"],
    steps: [
      "Mezclar la proteína con 2 cucharadas de agua.",
      "Agregar encima de la gelatina.",
      "Refrigerar."
    ],
    macros: {
      protein: 12,
      carbs: 6,
      fats: 1,
      calories: 90
    }
  },

  {
    id: "snack-8",
    title: "Frutos Secos Mixtos",
    image: "🥜",
    type: "snack",
    ingredients: ["15g almendras", "10g pasas", "10g maní"],
    steps: [
      "Mezcla en un bowl.",
      "Sirve."
    ],
    macros: {
      protein: 6,
      carbs: 12,
      fats: 13,
      calories: 190
    }
  }
];
