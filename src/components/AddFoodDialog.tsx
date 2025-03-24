
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
import ImageUpload from "@/components/ImageUpload";
import { recognizeFood } from "@/utils/foodRecognition";
import { format } from 'date-fns';

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

interface AddFoodDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddFood: (food: FoodItem) => void;
}

const AddFoodDialog: React.FC<AddFoodDialogProps> = ({ isOpen, onClose, onAddFood }) => {
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [recognizedFood, setRecognizedFood] = useState<any | null>(null);
  const [foodName, setFoodName] = useState('');
  const [mealType, setMealType] = useState('Breakfast');
  const [processingImage, setProcessingImage] = useState(false);
  
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
      fat: 12,
      fiber: 3,
      sugar: 5
    };
    
    const currentTime = format(new Date(), 'h:mm a');
    
    const newFood: FoodItem = {
      id: Date.now().toString(),
      name: foodName,
      imageUrl,
      calories: nutritionInfo.calories,
      protein: nutritionInfo.protein,
      carbs: nutritionInfo.carbs,
      fat: nutritionInfo.fat,
      fiber: nutritionInfo.fiber,
      sugar: nutritionInfo.sugar,
      timestamp: `${currentTime} - ${mealType}`
    };
    
    onAddFood(newFood);
    resetForm();
  };
  
  const resetForm = () => {
    setSelectedImage(null);
    setRecognizedFood(null);
    setFoodName('');
    setMealType('Breakfast');
  };
  
  const handleClose = () => {
    resetForm();
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
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
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleAddFood}>
            Add to Journal
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddFoodDialog;
