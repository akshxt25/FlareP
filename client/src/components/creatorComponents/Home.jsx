import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  BarChart,
  TrendingUp,
  Users,
  Calendar,
  Award,
  Upload,
  ArrowUpRight,
  PlayCircle,
  Eye,
  Star,
  ChevronRight,
  Home,
  History,
  Bell,
  LogOut,
  Settings,
  Menu
} from 'lucide-react';
import axios from 'axios';
import FormPage from './FormPage';
import Dock from './Dock';
import ContentSection from './ContentSection';


function CreatorHome() {
  const [isLoading, setIsLoading] = useState(true);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const scrollRef = useRef(null);
  const userState = useSelector((state) => state.user);

  const stats = useMemo(() => [
    { label: 'Total Views', value: '2.4M', icon: Eye, change: '+12.5%', color: 'text-blue-400' },
    { label: 'Subscribers', value: '48.2K', icon: Users, change: '+8.2%', color: 'text-emerald-400' },
    { label: 'Avg. Watch Time', value: '6:42', icon: PlayCircle, change: '+3.1%', color: 'text-purple-400' },
    { label: 'Engagement Rate', value: '8.9%', icon: Star, change: '+5.7%', color: 'text-amber-400' }
  ], []);

  const recentVideos = useMemo(() => [
    { 
      title: 'Advanced Photography Tips',
      description: 'Learn pro techniques for better photos',
      views: '12.4K',
      duration: '15:24',
      thumbnail: '/api/placeholder/320/180',
      engagement: '92%',
      publishedAt: '2 days ago',
      progress: 85
    },
    { 
      title: 'Lightroom Editing Masterclass',
      description: 'Complete guide to photo editing',
      views: '8.7K',
      duration: '22:15',
      thumbnail: '/api/placeholder/320/180',
      engagement: '88%',
      publishedAt: '4 days ago',
      progress: 92
    }
  ], []);

  const handleLogout = useCallback(async () => {
    try {
      await axios.get('http://localhost:3000/api/auth/logout');
      
      window.location.href = '/login'; 
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, []);

  const StatCard = useCallback(({ label, value, icon: Icon, change, color }) => (
    <Card className="relative overflow-hidden bg-zinc-900/50 border-zinc-800">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-zinc-400 mb-1">{label}</p>
            <h3 className="text-2xl font-bold text-zinc-100">{value}</h3>
            <div className="flex items-center mt-2 text-sm">
              <ArrowUpRight className={`h-4 w-4 mr-1 ${color}`} />
              <span className={color}>{change}</span>
            </div>
          </div>
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-800">
          <div className={`h-full ${color.replace('text', 'bg')} w-[70%] opacity-50`}></div>
        </div>
      </CardContent>
    </Card>
  ), []);

  const handleVideoSubmit = (newVideo) => {
    console.log('New video submitted:', newVideo); // Add this log

    const contentSection = document.querySelector('[value="content"]');
    if (contentSection) {
      setCurrentPage('content');
      setTimeout(() => {
        window.location.reload(); 
      }, 1000);
    }
  };


  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="relative">
        {showUploadForm ? (
          <div className="animate-in slide-in-from-right duration-300">
            <FormPage onClose={() => {
              setShowUploadForm(false);
              setCurrentPage('home');
            }} 
            onVideoSubmit={handleVideoSubmit}
            />
          </div>
        ) : (
          <ScrollArea ref={scrollRef} className="h-[calc(100vh-5rem)]">
            <div className="animate-in fade-in-50 duration-500">
              <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24">
                {/* Header with Avatar and Actions */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12 animate-in slide-in-from-top duration-500">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 border-2 border-zinc-800 ring-2 ring-zinc-700/50 transition-all duration-300 hover:ring-zinc-600">
                      <AvatarImage src="/api/placeholder/64/64" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div>
                      <h1 className="text-3xl sm:text-4xl font-bold text-zinc-100 animate-in slide-in-from-left duration-500 delay-200">
                        Welcome back
                      </h1>
                      <p className="text-zinc-400 animate-in slide-in-from-left duration-500 delay-300">Your creator dashboard</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 w-full sm:w-auto animate-in slide-in-from-right duration-500 delay-200">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="outline" 
                            className="gap-2 bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-zinc-100 transition-all duration-200 hover:scale-105"
                          >
                            <Bell className="h-4 w-4" />
                            <span className="hidden sm:inline">Notifications</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>View notifications</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
  
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="outline" 
                          className="gap-2 bg-zinc-900 border-zinc-800 hover:bg-zinc-800 transition-all duration-200 hover:scale-105"
                        >
                          <Menu className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 bg-zinc-900 border-zinc-800 animate-in zoom-in-95 duration-200">
                        <DropdownMenuItem className="text-zinc-100 focus:bg-zinc-800 focus:text-zinc-100 cursor-pointer">
                          <Settings className="mr-2 h-4 w-4" />
                          Settings
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-400 focus:bg-red-950 focus:text-red-400 cursor-pointer"
                          onClick={handleLogout}
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Logout
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
  
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 animate-in slide-in-from-bottom duration-700 delay-200">
                  {stats.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                  ))}
                </div>
  
                <Tabs defaultValue="overview" className="mb-12 animate-in slide-in-from-bottom duration-700 delay-300">
                  <TabsList className="mb-8 bg-zinc-900 border border-zinc-800">
                    <TabsTrigger 
                      value="overview" 
                      className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white transition-all duration-200"
                    >
                      Overview
                    </TabsTrigger>
                    <TabsTrigger 
                      value="analytics" 
                      className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white transition-all duration-200"
                    >
                      Analytics
                    </TabsTrigger>
                    <TabsTrigger 
                      value="content" 
                      className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white transition-all duration-200"
                    >
                      Content
                    </TabsTrigger>
                  </TabsList>
  
                  <TabsContent value="overview" className="animate-in slide-in-from-bottom duration-500">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                      {/* Performance Chart */}
                      <Card className="lg:col-span-2 bg-zinc-900/50 border-zinc-800 transition-all duration-300 hover:bg-zinc-900/70">
                        <CardHeader>
                          <CardTitle className="text-xl font-semibold flex items-center text-zinc-100">
                            <BarChart className="h-5 w-5 mr-2 text-zinc-400" />
                            Performance Overview
                          </CardTitle>
                          <CardDescription className="text-zinc-400">Last 30 days analytics</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="h-[300px] flex items-center justify-center border border-dashed border-zinc-800 rounded-lg bg-zinc-900/30">
                            <p className="text-zinc-500">Analytics Chart Placeholder</p>
                          </div>
                        </CardContent>
                      </Card>
  
                      {/* Recent Videos */}
                      <Card className="bg-zinc-900/50 border-zinc-800 transition-all duration-300 hover:bg-zinc-900/70">
                        <CardHeader>
                          <CardTitle className="text-xl font-semibold flex items-center text-zinc-100">
                            <PlayCircle className="h-5 w-5 mr-2 text-zinc-400" />
                            Recent Videos
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-6">
                            {recentVideos.map((video, index) => (
                              <div key={index} className="group space-y-3 cursor-pointer">
                                <div className="relative aspect-video rounded-lg overflow-hidden bg-zinc-900">
                                  <img
                                    src={video.thumbnail}
                                    alt={video.title}
                                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                                  />
                                  <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs">
                                    {video.duration}
                                  </div>
                                </div>
                                <div>
                                  <h3 className="font-medium text-zinc-200 group-hover:text-white transition-colors duration-200">
                                    {video.title}
                                  </h3>
                                  <p className="text-sm text-zinc-400 mt-1">
                                    {video.description}
                                  </p>
                                  <div className="flex flex-wrap items-center justify-between gap-2 mt-2">
                                    <div className="flex flex-wrap items-center gap-2">
                                      <Badge variant="secondary" className="bg-zinc-800 text-zinc-200 transition-colors duration-200 group-hover:bg-zinc-700">
                                        {video.views} views
                                      </Badge>
                                      <Badge variant="outline" className="border-zinc-700 text-zinc-300 transition-colors duration-200 group-hover:border-zinc-600">
                                        {video.engagement}
                                      </Badge>
                                    </div>
                                    <span className="text-xs text-zinc-400">{video.publishedAt}</span>
                                  </div>
                                  <div className="mt-3">
                                    <Progress 
                                      value={video.progress} 
                                      className="h-1 bg-zinc-800 transition-all duration-300 group-hover:bg-zinc-700" 
                                    />
                                    <p className="text-xs text-zinc-400 mt-1">Processing: {video.progress}%</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button 
                            variant="ghost" 
                            className="w-full text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-all duration-200"
                          >
                            View All Videos
                            <ChevronRight className="h-4 w-4 ml-2" />
                          </Button>
                        </CardFooter>
                      </Card>
                    </div>
                  </TabsContent>

                  
<TabsContent value="content" className="animate-in slide-in-from-bottom duration-500">
  <ContentSection />
</TabsContent>
                </Tabs>
              </main>
            </div>
          </ScrollArea>
        )}
  
        {/* Dock Component */}
        <Dock 
          onUploadClick={(show) => {
            setShowUploadForm(show);
            setCurrentPage(show ? 'upload' : 'home');
          }}
          currentPage={currentPage}
        />
      </div>
    </div>
  );
}

export default CreatorHome;