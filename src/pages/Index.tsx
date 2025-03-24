
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import FoodCard from "@/components/FoodCard";
import ControlPanel from "@/components/ControlPanel";
import AddFoodDialog from '@/components/AddFoodDialog';
import NutritionSummaryPanel from '@/components/NutritionSummaryPanel';
import { calculateDailyTotals } from "@/utils/nutritionCalculator";

// Updated food data to include fiber and sugar
const INITIAL_FOOD_DATA = [
  {
    id: '1',
    name: 'Avocado Toast',
    imageUrl: 'https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    calories: 320,
    protein: 12,
    carbs: 30,
    fat: 18,
    fiber: 5,
    sugar: 2,
    timestamp: '8:30 AM - Breakfast'
  },
  {
    id: '2',
    name: 'Chicken Salad',
    imageUrl: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    calories: 450,
    protein: 35,
    carbs: 20,
    fat: 22,
    fiber: 4,
    sugar: 3,
    timestamp: '12:45 PM - Lunch'
  },
  {
    id: '3',
    name: 'Salmon with Vegetables',
    imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    calories: 520,
    protein: 42,
    carbs: 18,
    fat: 28,
    fiber: 6,
    sugar: 2,
    timestamp: '7:15 PM - Dinner'
  }
];

// Update the food item interface to include fiber and sugar
interface FoodItem {
  id: string;
  name: string;
  imageUrl: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  timestamp: string;
}

const Index = () => {
  const { toast } = useToast();
  const [foodData, setFoodData] = useState<FoodItem[]>(INITIAL_FOOD_DATA);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  // Calculate daily nutrition totals
  const dailyTotals = calculateDailyTotals(
    foodData.map(food => ({
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat,
      fiber: food.fiber,
      sugar: food.sugar
    }))
  );
  
  // Filter food data based on activeFilter
  const filteredFoodData = foodData.filter(food => {
    if (activeFilter === 'All') return true;
    return food.timestamp.includes(activeFilter);
  });
  
  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
    // In a real app, we would fetch food data for this date
  };
  
  const handleAddClick = () => {
    setIsAddModalOpen(true);
  };
  
  const handleAddFood = (newFood: FoodItem) => {
    setFoodData([newFood, ...foodData]);
    setIsAddModalOpen(false);
    
    toast({
      title: "Food added",
      description: `${newFood.name} has been added to your journal.`,
    });
  };
  
  const handleDeleteFood = (id: string) => {
    setFoodData(foodData.filter(food => food.id !== id));
    toast({
      title: "Food removed",
      description: "The food entry has been removed from your journal.",
    });
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container max-w-screen-xl mx-auto px-4 pt-24 pb-12">
        <ControlPanel 
          onAddClick={handleAddClick} 
          onFilterChange={handleFilterChange}
          onDateChange={handleDateChange}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredFoodData.map(food => (
              <FoodCard 
                key={food.id}
                {...food}
                onDelete={handleDeleteFood}
              />
            ))}
          </div>
          
          <div className="lg:col-span-1 space-y-6">
            <NutritionSummaryPanel
              calories={dailyTotals.calories}
              protein={dailyTotals.protein}
              carbs={dailyTotals.carbs}
              fat={dailyTotals.fat}
            />
          </div>
        </div>
      </main>
      
      <AddFoodDialog 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddFood={handleAddFood}
      />
    </div>
  );
};

export default Index;
