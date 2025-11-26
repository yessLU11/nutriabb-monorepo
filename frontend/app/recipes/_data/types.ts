export interface Macros {
  protein: number;
  carbs: number;
  fats: number;
  calories: number;
}

export interface Recipe {
  id: string;
  title: string;
  image: string;      // emoji o URL
  ingredients: string[];
  steps: string[];
  macros: Macros;
  type: "breakfast" | "lunch" | "dinner" | "snack";
}
