import { breakfastData } from "../../recipes/_data/breakfastData";
import { lunchData } from "../../recipes/_data/lunchData";
import { dinnerData } from "../../recipes/_data/dinnerData";
import { snacksData } from "../../recipes/_data/snacksData";

export interface MealPlanDay {
  day: string;
  breakfast: any;
  lunch: any;
  dinner: any;
  snacks: any[];
}

const DAYS = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];

function pickRecipe(recipes: any[]) {
  return recipes[Math.floor(Math.random() * recipes.length)];
}

export function generateWeeklyPlan(macros: {
  protein: number;
  carbs: number;
  fats: number;
  calories: number;
}): MealPlanDay[] {
  return DAYS.map((day) => ({
    day,
    breakfast: pickRecipe(breakfastData),
    lunch: pickRecipe(lunchData),
    dinner: pickRecipe(dinnerData),
    snacks: [pickRecipe(snacksData), pickRecipe(snacksData)],
  }));
}
