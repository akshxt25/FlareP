import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { 
  Home, Upload, MessageCircle, LogOut, 
  Clock, Settings, Users, Film,
  Plus, ChevronRight, FileVideo,
  Sparkles, Bell, Search
} from 'lucide-react';

function EditorHome() {
  const dispatch = useDispatch();
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const prevLoadingState = useRef(isLoading);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });
  const [formErrors, setFormErrors] = useState({
    title: '',
    description: '',
  });
  
  const userState = useSelector((state) => state.user);
  
  useEffect(() => {
    if (prevLoadingState.current !== isLoading) {
      prevLoadingState.current = isLoading;
    }
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [isLoading]);
  
  const displayName = useMemo(() => {
    if (userState?.user) {
      return userState.user.name || userState.user.displayName || userState.user.email || 'Editor';
    }
    return 'Editor';
  }, [userState?.user]);
  
  const videos = []; // Empty array to simulate no videos

  const getInitials = useCallback((name) => {
    return name.split(' ').map(part => part[0]).join('').toUpperCase().slice(0, 2);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Simple validation
    if (name === 'title') {
      if (value.length < 3) {
        setFormErrors(prev => ({
          ...prev,
          title: 'Title must be at least 3 characters',
        }));
      } else if (value.length > 100) {
        setFormErrors(prev => ({
          ...prev,
          title: 'Title must not exceed 100 characters',
        }));
      } else {
        setFormErrors(prev => ({
          ...prev,
          title: '',
        }));
      }
    } else if (name === 'description') {
      if (value.length > 500) {
        setFormErrors(prev => ({
          ...prev,
          description: 'Description must not exceed 500 characters',
        }));
      } else {
        setFormErrors(prev => ({
          ...prev,
          description: '',
        }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Form validation
    let isValid = true;
    const newErrors = { title: '', description: '' };
    
    if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
      isValid = false;
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must not exceed 100 characters';
      isValid = false;
    }
    
    if (formData.description.length > 500) {
      newErrors.description = 'Description must not exceed 500 characters';
      isValid = false;
    }
    
    setFormErrors(newErrors);
    
    if (isValid) {
      console.log('Submitting form data:', formData);
      setUploadModalOpen(false);
      // Reset form
      setFormData({ title: '', description: '' });
    }
  };

  const VideoCardSkeleton = () => (
    <Card className="bg-black/40 border-zinc-800/60 overflow-hidden hover:border-zinc-700/60 transition-all duration-300">
      <CardContent className="p-0">
        <div className="relative aspect-video group">
          <Skeleton className="w-full h-full absolute inset-0" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <div className="p-6 space-y-4">
          <Skeleton className="h-6 w-3/4" />
          <div className="flex justify-between">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Aceternity UI inspired animated gradient border
  const GradientBorderCard = ({ children, className = "" }) => {
    return (
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-zinc-600 to-zinc-800 rounded-2xl opacity-75 blur-sm group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-gradient-x"></div>
        <div className={`relative bg-zinc-900 rounded-xl ${className}`}>
          {children}
        </div>
      </div>
    );
  };

  const renderContent = useCallback(() => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, index) => (
            <VideoCardSkeleton key={index} />
          ))}
        </div>
      );
    }

    if (!videos.length) {
      return (
        <GradientBorderCard>
          <Card className="border-none bg-gradient-to-b from-zinc-900 to-black hover:from-zinc-800 hover:to-black transition-all duration-500">
            <CardHeader className="text-center pb-2">
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 bg-gradient-to-tr from-zinc-600 to-zinc-800 rounded-2xl" />
                <div className="absolute inset-0 bg-gradient-to-tr from-zinc-500 to-zinc-700 rounded-2xl blur-xl opacity-50" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <FileVideo className="h-10 w-10 text-zinc-300" />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500">
                Your Creative Canvas Awaits
              </CardTitle>
              <CardDescription className="text-zinc-400 max-w-md mx-auto text-lg mt-4">
                Begin your journey by uploading your first masterpiece to your collection.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center pb-12">
              <Button 
                size="lg"
                onClick={() => setUploadModalOpen(true)}
                className="bg-gradient-to-r from-zinc-200 to-white text-black hover:from-white hover:to-zinc-300 transition-all duration-300 px-8 py-6 rounded-xl shadow-lg hover:shadow-zinc-500/20"
              >
                <Upload className="mr-3 h-6 w-6" /> Start Creating
              </Button>
            </CardContent>
          </Card>
        </GradientBorderCard>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Video cards would go here */}
      </div>
    );
  }, [isLoading, videos, setUploadModalOpen]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-zinc-950 text-zinc-100">
      {/* Navigation */}
      <nav className="bg-black/50 backdrop-blur-xl border-b border-zinc-800/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-8">
              <div className="text-xl font-bold flex items-center group">
                <div className="relative w-10 h-10">
                  <div className="absolute inset-0 bg-gradient-to-tr from-zinc-600 to-zinc-800 rounded-xl group-hover:from-zinc-500 group-hover:to-zinc-700 transition-all duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-zinc-500 to-zinc-700 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Film className="h-6 w-6 text-white" />
                  </div>
                </div>
                <span className="ml-3 bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400 font-extrabold text-2xl">
                  Flare Studio
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search Bar - Aceternity Inspired */}
              <div className="hidden md:flex relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-zinc-500" />
                </div>
                <Input 
                  placeholder="Search videos..." 
                  className="pl-10 pr-16 py-2 h-10 bg-zinc-900/50 border-zinc-800 focus:border-zinc-500 text-zinc-300 w-64"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <div className="text-xs text-zinc-500 bg-zinc-800/70 px-2 py-0.5 rounded-md">⌘K</div>
                </div>
              </div>

              {/* Aceternity inspired notification button */}
              <Button variant="ghost" className="relative text-zinc-400 hover:text-white bg-zinc-900/30 hover:bg-zinc-800/50 rounded-full p-2 h-10 w-10">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-zinc-300 rounded-full ring-2 ring-black"></span>
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="group flex items-center space-x-3 hover:bg-white/5 h-12 px-4">
                    <Avatar className="h-9 w-9 border border-zinc-700/50 group-hover:border-zinc-600 transition-colors overflow-hidden">
                      <AvatarImage src={userState?.user?.photoURL} />
                      <AvatarFallback className="bg-gradient-to-tr from-zinc-600 to-zinc-800">
                        {getInitials(displayName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden sm:block text-left">
                      <div className="text-zinc-200 font-medium">{displayName}</div>
                      <div className="text-zinc-500 text-sm">Creator</div>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 bg-zinc-900/95 backdrop-blur-xl border-zinc-800 overflow-hidden">
                  <div className="px-1 py-3 bg-gradient-to-r from-zinc-900/20 to-zinc-800/20 rounded-t-md border-b border-zinc-800/50">
                    <div className="flex items-center px-2">
                      <Avatar className="h-10 w-10 mr-3 border-2 border-white/10">
                        <AvatarImage src={userState?.user?.photoURL} />
                        <AvatarFallback className="bg-gradient-to-tr from-zinc-600 to-zinc-800">
                          {getInitials(displayName)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-zinc-200 font-medium">{displayName}</div>
                        <div className="text-zinc-500 text-sm">Pro Account</div>
                      </div>
                    </div>
                  </div>
                  
                  <DropdownMenuLabel className="text-zinc-400 mt-2">My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-zinc-800" />
                  <DropdownMenuItem className="text-zinc-200 hover:bg-white/5 focus:bg-white/5 cursor-pointer group">
                    <div className="flex items-center">
                      <Settings className="mr-2 h-4 w-4 group-hover:text-zinc-100 transition-colors" /> 
                      <span className="group-hover:text-zinc-100 transition-colors">Profile Settings</span>
                    </div>
                    <ChevronRight className="ml-auto h-4 w-4 text-zinc-600 group-hover:text-zinc-100 transition-colors" />
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-zinc-200 hover:bg-white/5 focus:bg-white/5 cursor-pointer group">
                    <div className="flex items-center">
                      <Users className="mr-2 h-4 w-4 group-hover:text-zinc-100 transition-colors" /> 
                      <span className="group-hover:text-zinc-100 transition-colors">Manage Team</span>
                    </div>
                    <ChevronRight className="ml-auto h-4 w-4 text-zinc-600 group-hover:text-zinc-100 transition-colors" />
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-zinc-800" />
                  <DropdownMenuItem 
                    className="text-red-400 hover:bg-white/5 focus:bg-white/5 cursor-pointer group"
                    onClick={() => dispatch({ type: 'user/logout' })}
                  >
                    <LogOut className="mr-2 h-4 w-4 group-hover:text-red-300 transition-colors" /> 
                    <span className="group-hover:text-red-300 transition-colors">Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <ScrollArea className="flex-1 h-[calc(100vh-5rem)]">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-12">
            <div>
              <h1 className="text-4xl font-bold text-white mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">Your Videos</h1>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center text-zinc-400 text-sm">
                  <Clock className="h-4 w-4 mr-2" />
                  Updated 2m ago
                </div>
              </div>
            </div>
            <Button 
              size="lg"
              onClick={() => setUploadModalOpen(true)}
              className="bg-gradient-to-r from-zinc-200 to-white text-black hover:from-white hover:to-zinc-300 transition-all duration-300 px-8 h-12 rounded-xl shadow-lg hover:shadow-zinc-500/20"
            >
              <Plus className="mr-2 h-5 w-5" /> New Video
            </Button>
          </div>
          
          {renderContent()}
        </main>
      </ScrollArea>

      {/* Upload Modal with simple form validation */}
      <Dialog open={uploadModalOpen} onOpenChange={setUploadModalOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800/50 max-w-xl">
          <DialogHeader className="text-left space-y-4">
            <div className="flex items-center space-x-4">
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 bg-gradient-to-tr from-zinc-600 to-zinc-800 rounded-xl" />
                <div className="absolute inset-0 bg-gradient-to-tr from-zinc-500 to-zinc-700 rounded-xl blur-lg opacity-50" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-zinc-300" />
                </div>
              </div>
              <div>
                <DialogTitle className="text-2xl">Create New Video</DialogTitle>
                <DialogDescription className="text-zinc-400 text-base mt-1">
                  Share your vision with the world
                </DialogDescription>
              </div>
            </div>
            <Separator className="bg-zinc-800" />
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title" className="text-zinc-300">Video Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter a compelling title..."
                className="bg-zinc-800/50 border-zinc-700 focus:border-zinc-500 text-zinc-100"
              />
              {formErrors.title && (
                <p className="text-red-400 text-sm mt-1">{formErrors.title}</p>
              )}
              <p className="text-zinc-500 text-sm mt-1">
                Give your video a catchy title that will grab attention.
              </p>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description" className="text-zinc-300">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your video..."
                className="min-h-24 bg-zinc-800/50 border-zinc-700 focus:border-zinc-500 text-zinc-100"
              />
              {formErrors.description && (
                <p className="text-red-400 text-sm mt-1">{formErrors.description}</p>
              )}
              <p className="text-zinc-500 text-sm mt-1">
                A great description helps viewers understand your content.
              </p>
            </div>
            
            <div className="border-2 border-dashed border-zinc-700 rounded-lg p-10 text-center hover:border-white transition-colors cursor-pointer">
              <div className="flex flex-col items-center gap-4">
                <div className="relative w-16 h-16 group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-zinc-700 to-zinc-600 rounded-full group-hover:from-zinc-500 group-hover:to-zinc-400 transition-all duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-zinc-600 to-zinc-500 rounded-full blur-lg opacity-0 group-hover:opacity-70 transition-opacity duration-500" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Upload className="h-6 w-6 text-zinc-300 group-hover:text-white transition-colors duration-500" />
                  </div>
                </div>
                <div>
                  <p className="text-zinc-300 font-medium mb-1">Drag and drop or click to upload</p>
                  <p className="text-zinc-500 text-sm">Support for MP4, MOV, AVI up to 2GB</p>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setUploadModalOpen(false)}
                className="border-zinc-700 hover:bg-zinc-800 text-zinc-300"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="bg-gradient-to-r from-zinc-200 to-white text-black hover:from-white hover:to-zinc-300 transition-all"
              >
                Create Video
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default EditorHome;