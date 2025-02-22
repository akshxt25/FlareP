import React from 'react';
import { Button } from "@/components/ui/button";
import { Home, Upload, History, MessageSquare } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Dock = ({ onUploadClick, currentPage }) => {
  const dockItems = [
    { icon: Home, label: 'Home', action: () => onUploadClick(false) },
    { icon: Upload, label: 'Upload', action: () => onUploadClick(true) },
    { icon: History, label: 'History', action: () => {} },
    { icon: MessageSquare, label: 'Chat', action: () => {} }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center p-4">
      <div className="bg-zinc-900/80 backdrop-blur-lg border border-zinc-800/50 rounded-full px-6 py-3 shadow-lg transition-all duration-300 hover:bg-zinc-900">
        <TooltipProvider>
          <div className="flex items-center justify-center gap-2 sm:gap-4">
            {dockItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = (item.label === 'Home' && currentPage === 'home') ||
                             (item.label === 'Upload' && currentPage === 'upload');
              
              return (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className={`
                        relative px-4 transition-all duration-200
                        ${isActive ? 'text-white bg-zinc-800' : 'text-zinc-400'}
                        hover:text-white hover:bg-zinc-800
                        group
                      `}
                      onClick={item.action}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 scale-0 transition-all duration-200 opacity-0 group-hover:scale-100 group-hover:opacity-100 text-xs bg-zinc-800 text-white px-2 py-1 rounded whitespace-nowrap">
                        {item.label}
                      </span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{item.label}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default Dock;