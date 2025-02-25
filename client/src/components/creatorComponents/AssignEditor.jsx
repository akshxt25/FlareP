import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown, Loader2, Mail, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const AssignEditor = ({ selectedEditor, setSelectedEditor }) => {
  const [open, setOpen] = useState(false);
  const [editors, setEditors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchEditors();
  }, []);

  const fetchEditors = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get('https://flarep.onrender.com/api/creator/getEditors');
      
      const validEditors = (response.data.editors || []).filter(editor => 
        editor && editor._id && editor.name
      );
      
      setEditors(validEditors);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch editors');
      console.error('Error fetching editors:', err);
      setEditors([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredEditors = editors.filter(editor => {
    if (!searchQuery) return true;
    
    const search = searchQuery.toLowerCase();
    return (
      editor.name.toLowerCase().includes(search) ||
      (editor.email || '').toLowerCase().includes(search) ||
      (editor.speciality || '').toLowerCase().includes(search)
    );
  });

  const selectedEditorName = React.useMemo(() => {
    const found = editors.find((editor) => editor._id === selectedEditor);
    return found?.name || "Select an editor...";
  }, [editors, selectedEditor]);

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (error) {
    return (
      <div className="space-y-4">
        <Label className="text-zinc-400">Select Editor</Label>
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchEditors}
            className="mt-2 text-xs"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Label className="text-zinc-400">Select Editor</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={isLoading}
            className="w-full justify-between bg-zinc-900 border-zinc-700 hover:bg-zinc-800"
          >
            {isLoading ? (
              <span className="flex items-center">
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Loading editors...
              </span>
            ) : (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-zinc-400" />
                <span>{selectedEditorName}</span>
              </div>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-[300px] p-0 bg-zinc-900 border-zinc-700" 
          side="bottom"
          align="start"
          sideOffset={8}
          avoidCollisions={false}
        >
          <Command className="bg-zinc-900">
            <CommandInput 
              placeholder="Search editors..."
              className="bg-zinc-900 border-zinc-700"
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandList>
              <CommandEmpty>
                {isLoading ? (
                  <div className="flex items-center justify-center p-6">
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Loading...
                  </div>
                ) : (
                  <div className="py-6 text-center text-sm text-zinc-400">
                    No editor found.
                  </div>
                )}
              </CommandEmpty>
              <ScrollArea className="h-[300px] overflow-auto">
                <CommandGroup>
                  {filteredEditors.map((editor, index) => (
                    <React.Fragment key={editor._id}>
                      <CommandItem
                        onSelect={() => {
                          setSelectedEditor(editor._id);
                          setOpen(false);
                        }}
                        className="px-4 py-3 cursor-pointer transition-colors duration-200 data-[highlighted]:bg-black data-[highlighted]:text-white"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <Avatar className="h-8 w-8 bg-zinc-700 border border-zinc-600">
                            <AvatarFallback className="text-xs font-medium">
                              {getInitials(editor.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col flex-1 overflow-hidden">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-zinc-200 truncate">
                                {editor.name}
                              </p>
                              <Check
                                className={cn(
                                  "h-4 w-4",
                                  selectedEditor === editor._id
                                    ? "opacity-100 text-green-500"
                                    : "opacity-0"
                                )}
                              />
                            </div>
                            <div className="flex items-center gap-2 text-xs text-zinc-400">
                              <Mail className="h-3 w-3" />
                              <span className="truncate">{editor.email}</span>
                            </div>
                            {editor.speciality && (
                              <span className="mt-1 text-xs text-zinc-500 truncate">
                                {editor.speciality}
                              </span>
                            )}
                          </div>
                        </div>
                      </CommandItem>
                      {index < filteredEditors.length - 1 && (
                        <Separator className="bg-zinc-800" />
                      )}
                    </React.Fragment>
                  ))}
                </CommandGroup>
              </ScrollArea>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default AssignEditor;