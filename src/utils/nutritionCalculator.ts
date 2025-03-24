
// Types for nutritional data
export interface NutritionData {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  sugar?: number;
  fiber?: number;
  sodium?: number;
}

export interface DailyTotals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  mealCount: number;
}

// Calculate daily totals from an array of nutrition data
export const calculateDailyTotals = (
  nutritionItems: NutritionData[]
): DailyTotals => {
  return nutritionItems.reduce(
    (totals, item) => {
      return {
        calories: totals.calories + item.calories,
        protein: totals.protein + item.protein,
        carbs: totals.carbs + item.carbs,
        fat: totals.fat + item.fat,
        mealCount: totals.mealCount + 1,
      };
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0, mealCount: 0 }
  );
};

// Calculate macronutrient percentages
export const calculateMacroPercentages = (
  protein: number,
  carbs: number,
  fat: number
) => {
  const total = protein + carbs + fat;
  if (total === 0) return { proteinPercentage: 0, carbsPercentage: 0, fatPercentage: 0 };
  
  return {
    proteinPercentage: Math.round((protein / total) * 100),
    carbsPercentage: Math.round((carbs / total) * 100),
    fatPercentage: Math.round((fat / total) * 100),
  };
};

// Check if nutrition values meet daily recommended values
export const evaluateNutrition = (dailyTotals: DailyTotals) => {
  // These are general guidelines and should be personalized in a real app
  const recommendations = {
    calories: { min: 1800, max: 2500 },
    protein: { min: 50, max: 100 }, // in grams
    carbs: { min: 225, max: 325 }, // in grams
    fat: { min: 44, max: 78 }, // in grams
  };
  
  return {
    calories: isInRange(dailyTotals.calories, recommendations.calories.min, recommendations.calories.max),
    protein: isInRange(dailyTotals.protein, recommendations.protein.min, recommendations.protein.max),
    carbs: isInRange(dailyTotals.carbs, recommendations.carbs.min, recommendations.carbs.max),
    fat: isInRange(dailyTotals.fat, recommendations.fat.min, recommendations.fat.max),
  };
};

// Helper function to check if a value is within range
const isInRange = (value: number, min: number, max: number) => {
  if (value < min) return 'low';
  if (value > max) return 'high';
  return 'good';
};

export default {
  calculateDailyTotals,
  calculateMacroPercentages,
  evaluateNutrition
};
