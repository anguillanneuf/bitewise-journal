
import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronDown, Filter, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface ControlPanelProps {
  onAddClick: () => void;
  onFilterChange?: (filter: string) => void;
  onDateChange?: (date: Date | undefined) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ 
  onAddClick,
  onFilterChange,
  onDateChange
}) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedFilter, setSelectedFilter] = useState<string>('All');

  const handleDateSelect = (date: Date | undefined) => {
    setDate(date);
    if (onDateChange) onDateChange(date);
  };

  const handleFilterSelect = (filter: string) => {
    setSelectedFilter(filter);
    if (onFilterChange) onFilterChange(filter);
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex flex-col">
        <h1 className="text-2xl font-semibold mb-1">Food Journal</h1>
        <p className="text-muted-foreground text-sm">Track your meals and get nutritional insights</p>
      </div>
      
      <div className="flex items-center space-x-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              {selectedFilter}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleFilterSelect('All')}>
              All
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFilterSelect('Breakfast')}>
              Breakfast
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFilterSelect('Lunch')}>
              Lunch
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFilterSelect('Dinner')}>
              Dinner
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFilterSelect('Snack')}>
              Snacks
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button size="sm" onClick={onAddClick}>
          <Plus className="mr-2 h-4 w-4" />
          Add Meal
        </Button>
      </div>
    </div>
  );
};

export default ControlPanel;
