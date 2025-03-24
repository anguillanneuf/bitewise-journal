
import React from 'react';
import { Menu, PlusCircle, UserCircle, Moon, Sun } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useTheme } from '@/contexts/ThemeProvider';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border py-3">
      <div className="container max-w-screen-xl mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <span className="text-xl font-medium bg-gradient-to-r from-primary to-primary/70 text-transparent bg-clip-text">Bitewise</span>
        </div>
        
        <div className="flex items-center space-x-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleTheme}
                aria-label={theme === 'light' ? "Switch to dark mode" : "Switch to light mode"}
              >
                {theme === 'light' ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Sun className="h-5 w-5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{theme === 'light' ? "Switch to dark mode" : "Switch to light mode"}</p>
            </TooltipContent>
          </Tooltip>
          
          <Button variant="ghost" size="sm" className="hidden md:flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            <span>Add Entry</span>
          </Button>
          
          <Button variant="ghost" size="icon" className="md:hidden">
            <PlusCircle className="h-5 w-5" />
          </Button>
          
          <Avatar className="h-9 w-9 transition-transform hover:scale-105">
            <AvatarFallback className="bg-primary/10 text-primary">
              <UserCircle className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};

export default Header;
