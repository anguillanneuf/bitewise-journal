
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import Header from "@/components/Header";
import FoodCard from "@/components/FoodCard";
import ImageUpload from "@/components/ImageUpload";
import NutritionChart from "@/components/NutritionChart";
import ControlPanel from "@/components/ControlPanel";
import { recognizeFood } from "@/utils/foodRecognition";
import { calculateDailyTotals, calculateMacroPercentages } from "@/utils/nutritionCalculator";
import { format } from 'date-fns';

// Sample data for demonstration
const INITIAL_FOOD_DATA = [
  {
    id: '1',
    name: 'Avocado Toast',
    imageUrl: 'https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    calories: 320,
    protein: 12,
    carbs: 30,
    fat: 18,
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
    timestamp: '7:15 PM - Dinner'
  }
];

const Index = () => {
  const { toast } = useToast();
  const [foodData, setFoodData] = useState(INITIAL_FOOD_DATA);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [recognizedFood, setRecognizedFood] = useState<any | null>(null);
  const [foodName, setFoodName] = useState('');
  const [mealType, setMealType] = useState('Breakfast');
  const [processingImage, setProcessingImage] = useState(false);
  
  // Calculate daily nutrition totals
  const dailyTotals = calculateDailyTotals(
    foodData.map(food => ({
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat
    }))
  );
  
  const totalProtein = dailyTotals.protein;
  const totalCarbs = dailyTotals.carbs;
  const totalFat = dailyTotals.fat;
  
  const handleAddClick = () => {
    setIsAddModalOpen(true);
    setSelectedImage(null);
    setRecognizedFood(null);
    setFoodName('');
  };
  
  const handleImageSelect = async (file: File | null) => {
    setSelectedImage(file);
    if (file) {
      setProcessingImage(true);
      try {
        const result = await recognizeFood(file);
        setRecognizedFood(result);
        setFoodName(result.name);
        toast({
          title: "Food recognized!",
          description: `We identified this as ${result.name}.`,
        });
      } catch (error) {
        toast({
          title: "Recognition failed",
          description: "We couldn't identify the food. Please try again or enter details manually.",
          variant: "destructive",
        });
      } finally {
        setProcessingImage(false);
      }
    } else {
      setRecognizedFood(null);
      setFoodName('');
    }
  };
  
  const handleAddFood = () => {
    if (!foodName.trim()) {
      toast({
        title: "Food name required",
        description: "Please enter a name for this food item.",
        variant: "destructive",
      });
      return;
    }
    
    // Create a URL for the selected image or use a placeholder
    const imageUrl = selectedImage 
      ? URL.createObjectURL(selectedImage)
      : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3';
    
    const nutritionInfo = recognizedFood?.nutritionInfo || {
      calories: 350,
      protein: 15,
      carbs: 40,
      fat: 12
    };
    
    const currentTime = format(new Date(), 'h:mm a');
    
    const newFood = {
      id: Date.now().toString(),
      name: foodName,
      imageUrl,
      calories: nutritionInfo.calories,
      protein: nutritionInfo.protein,
      carbs: nutritionInfo.carbs,
      fat: nutritionInfo.fat,
      timestamp: `${currentTime} - ${mealType}`
    };
    
    setFoodData([newFood, ...foodData]);
    setIsAddModalOpen(false);
    
    toast({
      title: "Food added",
      description: `${foodName} has been added to your journal.`,
    });
  };
  
  const handleDeleteFood = (id: string) => {
    setFoodData(foodData.filter(food => food.id !== id));
    toast({
      title: "Food removed",
      description: "The food entry has been removed from your journal.",
    });
  };
  
  // Calorie data for the progress chart
  const calorieData = [
    { name: 'Consumed', value: dailyTotals.calories, color: '#0088FE' },
    { name: 'Remaining', value: Math.max(0, 2000 - dailyTotals.calories), color: '#EEEEEE' }
  ];
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container max-w-screen-xl mx-auto px-4 pt-24 pb-12">
        <ControlPanel onAddClick={handleAddClick} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {foodData.map(food => (
              <FoodCard 
                key={food.id}
                {...food}
                onDelete={handleDeleteFood}
              />
            ))}
          </div>
          
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-card rounded-xl shadow-sm p-6 border border-border/50 animate-fade-in">
              <h2 className="text-lg font-medium mb-4">Today's Summary</h2>
              
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Calories</span>
                  <span className="text-sm font-medium">{dailyTotals.calories} / 2000 kcal</span>
                </div>
                <div className="h-24">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={calorieData}
                        cx="50%"
                        cy="50%"
                        startAngle={90}
                        endAngle={-270}
                        innerRadius={40}
                        outerRadius={60}
                        paddingAngle={0}
                        dataKey="value"
                      >
                        {calorieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-muted/50 p-3 rounded-lg text-center">
                  <p className="text-xs text-muted-foreground mb-1">Protein</p>
                  <p className="font-medium">{totalProtein}g</p>
                </div>
                <div className="bg-muted/50 p-3 rounded-lg text-center">
                  <p className="text-xs text-muted-foreground mb-1">Carbs</p>
                  <p className="font-medium">{totalCarbs}g</p>
                </div>
                <div className="bg-muted/50 p-3 rounded-lg text-center">
                  <p className="text-xs text-muted-foreground mb-1">Fat</p>
                  <p className="font-medium">{totalFat}g</p>
                </div>
              </div>
              
              <div className="h-48">
                <NutritionChart 
                  protein={totalProtein} 
                  carbs={totalCarbs} 
                  fat={totalFat} 
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Add Food Dialog */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Food to Journal</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <div className="md:col-span-2">
                <ImageUpload 
                  onImageSelect={handleImageSelect} 
                  className="h-full min-h-[200px]"
                  processing={processingImage}
                />
              </div>
              
              <div className="md:col-span-3 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="foodName">Food Name</Label>
                  <Input 
                    id="foodName" 
                    value={foodName} 
                    onChange={(e) => setFoodName(e.target.value)} 
                    placeholder="Enter food name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="mealType">Meal Type</Label>
                  <select 
                    id="mealType"
                    value={mealType}
                    onChange={(e) => setMealType(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Snack">Snack</option>
                  </select>
                </div>
                
                {recognizedFood && (
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h3 className="text-sm font-medium mb-2">Nutritional Information</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>Calories: {recognizedFood.nutritionInfo.calories} kcal</div>
                      <div>Protein: {recognizedFood.nutritionInfo.protein}g</div>
                      <div>Carbs: {recognizedFood.nutritionInfo.carbs}g</div>
                      <div>Fat: {recognizedFood.nutritionInfo.fat}g</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddFood}>
              Add to Journal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
