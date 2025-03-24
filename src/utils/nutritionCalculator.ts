
export interface NutritionData {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
}

export interface DailyTotals extends NutritionData {
  mealCount: number;
}

export const calculateNutrition = (foodName: string): NutritionData => {
  // Mock data for demo purposes
  const mockNutrition: Record<string, NutritionData> = {
    apple: { calories: 95, protein: 0.5, carbs: 25, fat: 0.3, fiber: 4, sugar: 19 },
    banana: { calories: 105, protein: 1.3, carbs: 27, fat: 0.4, fiber: 3.1, sugar: 14 },
    "chicken breast": { calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, sugar: 0 },
    rice: { calories: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4, sugar: 0.1 },
    broccoli: { calories: 55, protein: 3.7, carbs: 11, fat: 0.6, fiber: 5.2, sugar: 2.6 },
    salmon: { calories: 208, protein: 20, carbs: 0, fat: 13, fiber: 0, sugar: 0 },
    // Add more foods as needed
  };

  // Default nutritional values if food not found
  const defaultNutrition: NutritionData = { calories: 100, protein: 2, carbs: 15, fat: 2, fiber: 1, sugar: 5 };

  // Return the nutrition data for the food or the default if not found
  return mockNutrition[foodName.toLowerCase()] || defaultNutrition;
};

export const aggregateNutritionData = (entries: NutritionData[]): DailyTotals => {
  if (entries.length === 0) {
    return { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, mealCount: 0 };
  }

  const result = entries.reduce(
    (acc, curr) => ({
      calories: acc.calories + curr.calories,
      protein: acc.protein + curr.protein,
      carbs: acc.carbs + curr.carbs,
      fat: acc.fat + curr.fat,
      fiber: acc.fiber + curr.fiber,
      sugar: acc.sugar + curr.sugar,
      mealCount: acc.mealCount + 1
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, mealCount: 0 } as DailyTotals
  );

  return result;
};

// Adding the missing functions that are imported in Index.tsx
export const calculateDailyTotals = (nutritionData: NutritionData[]): DailyTotals => {
  return aggregateNutritionData(nutritionData);
};

export const calculateMacroPercentages = (dailyTotals: DailyTotals) => {
  const { protein, carbs, fat } = dailyTotals;
  const total = protein + carbs + fat;
  
  if (total === 0) {
    return { protein: 0, carbs: 0, fat: 0 };
  }
  
  return {
    protein: Math.round((protein / total) * 100),
    carbs: Math.round((carbs / total) * 100), 
    fat: Math.round((fat / total) * 100)
  };
};
