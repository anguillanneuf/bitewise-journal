
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import NutritionChart from "@/components/NutritionChart";

interface NutritionSummaryPanelProps {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

const NutritionSummaryPanel: React.FC<NutritionSummaryPanelProps> = ({ 
  calories, 
  protein, 
  carbs, 
  fat 
}) => {
  // Calorie data for the progress chart
  const calorieData = [
    { name: 'Consumed', value: calories, color: '#0088FE' },
    { name: 'Remaining', value: Math.max(0, 2000 - calories), color: '#EEEEEE' }
  ];
  
  return (
    <div className="bg-card rounded-xl shadow-sm p-6 border border-border/50 animate-fade-in">
      <h2 className="text-lg font-medium mb-4">Today's Summary</h2>
      
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-sm">Calories</span>
          <span className="text-sm font-medium">{calories} / 2000 kcal</span>
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
          <p className="font-medium">{protein}g</p>
        </div>
        <div className="bg-muted/50 p-3 rounded-lg text-center">
          <p className="text-xs text-muted-foreground mb-1">Carbs</p>
          <p className="font-medium">{carbs}g</p>
        </div>
        <div className="bg-muted/50 p-3 rounded-lg text-center">
          <p className="text-xs text-muted-foreground mb-1">Fat</p>
          <p className="font-medium">{fat}g</p>
        </div>
      </div>
      
      <div className="h-48">
        <NutritionChart 
          protein={protein} 
          carbs={carbs} 
          fat={fat} 
        />
      </div>
    </div>
  );
};

export default NutritionSummaryPanel;
