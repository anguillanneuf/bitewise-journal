
import React from 'react';
import { Clock, Edit2, MoreVertical, Trash } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface FoodCardProps {
  id: string;
  name: string;
  imageUrl: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  timestamp: string;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
}

const FoodCard: React.FC<FoodCardProps> = ({
  id,
  name,
  imageUrl,
  calories,
  protein,
  carbs,
  fat,
  timestamp,
  onDelete,
  onEdit
}) => {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md animate-scale-in">
      <div className="relative">
        <div className="h-36 overflow-hidden bg-muted">
          <img 
            src={imageUrl} 
            alt={name} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
            loading="lazy"
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-2 right-2 bg-background/50 backdrop-blur-md hover:bg-background/70 rounded-full h-8 w-8"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => onEdit && onEdit(id)}>
              <Edit2 className="mr-2 h-4 w-4" />
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete && onDelete(id)}
              className="text-destructive focus:text-destructive"
            >
              <Trash className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-medium text-lg mb-2 line-clamp-1">{name}</h3>
        
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="bg-muted/50 p-2 rounded-md text-center">
            <p className="text-xs text-muted-foreground">Calories</p>
            <p className="font-medium">{calories}</p>
          </div>
          <div className="bg-muted/50 p-2 rounded-md text-center">
            <p className="text-xs text-muted-foreground">Protein</p>
            <p className="font-medium">{protein}g</p>
          </div>
          <div className="bg-muted/50 p-2 rounded-md text-center">
            <p className="text-xs text-muted-foreground">Carbs</p>
            <p className="font-medium">{carbs}g</p>
          </div>
        </div>
        
        <div className="flex items-center text-xs text-muted-foreground">
          <Clock className="h-3 w-3 mr-1" />
          <span>{timestamp}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default FoodCard;
