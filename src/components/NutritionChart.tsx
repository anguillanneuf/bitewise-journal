
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface NutritionChartProps {
  protein: number;
  carbs: number;
  fat: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const NutritionChart: React.FC<NutritionChartProps> = ({ protein, carbs, fat }) => {
  const data = [
    { name: 'Protein', value: protein },
    { name: 'Carbs', value: carbs },
    { name: 'Fat', value: fat },
  ];

  const totalGrams = protein + carbs + fat;
  
  // Custom tooltip to show percentage and grams
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      const percentage = ((item.value / totalGrams) * 100).toFixed(1);
      
      return (
        <div className="bg-background p-2 border border-border rounded-md shadow-md text-sm">
          <p className="font-medium">{`${item.name}: ${item.value}g`}</p>
          <p className="text-muted-foreground">{`${percentage}% of total`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full min-h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
            animationDuration={800}
            animationBegin={0}
            animationEasing="ease-out"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom" 
            height={36} 
            iconType="circle"
            formatter={(value) => <span className="text-sm font-medium">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default NutritionChart;
