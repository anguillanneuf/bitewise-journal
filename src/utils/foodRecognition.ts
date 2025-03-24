
// This is a simulated AI food recognition service
// In a real application, this would connect to a machine learning API

interface RecognizedFood {
  name: string;
  confidence: number;
  nutritionInfo: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    sugar: number;
    fiber: number;
  };
}

// Demo data for simulation purposes
const foodDatabase: RecognizedFood[] = [
  {
    name: "Apple",
    confidence: 0.92,
    nutritionInfo: {
      calories: 95,
      protein: 0.5,
      carbs: 25,
      fat: 0.3,
      sugar: 19,
      fiber: 4
    }
  },
  {
    name: "Banana",
    confidence: 0.95,
    nutritionInfo: {
      calories: 105,
      protein: 1.3,
      carbs: 27,
      fat: 0.4,
      sugar: 14,
      fiber: 3.1
    }
  },
  {
    name: "Chicken Salad",
    confidence: 0.87,
    nutritionInfo: {
      calories: 320,
      protein: 32,
      carbs: 12,
      fat: 15,
      sugar: 3,
      fiber: 4
    }
  },
  {
    name: "Pasta with Tomato Sauce",
    confidence: 0.88,
    nutritionInfo: {
      calories: 380,
      protein: 12,
      carbs: 68,
      fat: 8,
      sugar: 10,
      fiber: 6
    }
  },
  {
    name: "Chocolate Cake",
    confidence: 0.91,
    nutritionInfo: {
      calories: 450,
      protein: 6,
      carbs: 55,
      fat: 23,
      sugar: 32,
      fiber: 2
    }
  }
];

// Simulates the AI recognition process with a delay
export const recognizeFood = async (imageFile: File): Promise<RecognizedFood> => {
  // Simulating API call delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // In a real app, we would send the image to an AI API
      // For demo purposes, just return a random food from our database
      const randomIndex = Math.floor(Math.random() * foodDatabase.length);
      resolve(foodDatabase[randomIndex]);
    }, 2000); // 2 second delay to simulate processing
  });
};

// Additional function to get multiple food suggestions
export const getFoodSuggestions = async (imageFile: File): Promise<RecognizedFood[]> => {
  // Simulating multiple results
  return new Promise((resolve) => {
    setTimeout(() => {
      // Shuffle the database and return 3 items
      const shuffled = [...foodDatabase].sort(() => 0.5 - Math.random());
      resolve(shuffled.slice(0, 3));
    }, 2000);
  });
};

export default {
  recognizeFood,
  getFoodSuggestions
};
