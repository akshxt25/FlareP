import React, { useState } from 'react';
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
} from 'lucide-react';
import FormPage from './FormPage';

function CreatorHome() {
  const [isLoading, setIsLoading] = useState(true);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const userState = useSelector((state) => state.user);

  const stats = [
    { label: 'Total Views', value: '2.4M', icon: Eye, change: '+12.5%', color: 'text-blue-400' },
    { label: 'Subscribers', value: '48.2K', icon: Users, change: '+8.2%', color: 'text-emerald-400' },
    { label: 'Avg. Watch Time', value: '6:42', icon: PlayCircle, change: '+3.1%', color: 'text-purple-400' },
    { label: 'Engagement Rate', value: '8.9%', icon: Star, change: '+5.7%', color: 'text-amber-400' }
  ];

  const StatCard = ({ label, value, icon: Icon, change, color }) => (
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
  );

  const recentVideos = [
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
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {showUploadForm ? (
        <FormPage onClose={() => setShowUploadForm(false)} />
      ) : (
        <ScrollArea className="h-[calc(100vh-5rem)]">
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24">
            {/* Header with Avatar */}
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-2 border-zinc-800">
                  <AvatarImage src="/api/placeholder/64/64" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-4xl font-bold text-zinc-100">
                    Welcome back
                  </h1>
                  <p className="text-zinc-400">Your creator dashboard</p>
                </div>
              </div>
              <Button variant="outline" className="gap-2 bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-zinc-100">
                <Bell className="h-4 w-4" />
                Notifications
              </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {stats.map((stat, index) => (
                <StatCard key={index} {...stat} />
              ))}
            </div>

            <Tabs defaultValue="overview" className="mb-12">
              <TabsList className="mb-8 bg-zinc-900 border border-zinc-800">
                <TabsTrigger value="overview" className="data-[state=active]:bg-zinc-800">Overview</TabsTrigger>
                <TabsTrigger value="analytics" className="data-[state=active]:bg-zinc-800">Analytics</TabsTrigger>
                <TabsTrigger value="content" className="data-[state=active]:bg-zinc-800">Content</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Performance Chart */}
                  <Card className="lg:col-span-2 bg-zinc-900/50 border-zinc-800">
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
                  <Card className="bg-zinc-900/50 border-zinc-800">
                    <CardHeader>
                      <CardTitle className="text-xl font-semibold flex items-center text-zinc-100">
                        <PlayCircle className="h-5 w-5 mr-2 text-zinc-400" />
                        Recent Videos
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {recentVideos.map((video, index) => (
                          <div key={index} className="group space-y-3">
                            <div className="relative aspect-video rounded-lg overflow-hidden bg-zinc-900">
                              <img
                                src={video.thumbnail}
                                alt={video.title}
                                className="object-cover w-full h-full transition-transform group-hover:scale-105"
                              />
                              <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs">
                                {video.duration}
                              </div>
                            </div>
                            <div>
                              <h3 className="font-medium text-zinc-200 group-hover:text-white">
                                {video.title}
                              </h3>
                              <p className="text-sm text-zinc-400 mt-1">
                                {video.description}
                              </p>
                              <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center gap-2">
                                  <Badge variant="secondary" className="bg-zinc-800 text-zinc-200">{video.views} views</Badge>
                                  <Badge variant="outline" className="border-zinc-700 text-zinc-300">{video.engagement}</Badge>
                                </div>
                                <span className="text-xs text-zinc-400">{video.publishedAt}</span>
                              </div>
                              <div className="mt-3">
                                <Progress value={video.progress} className="h-1 bg-zinc-800" />
                                <p className="text-xs text-zinc-400 mt-1">Processing: {video.progress}%</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="ghost" className="w-full text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800">
                        View All Videos
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </main>
        </ScrollArea>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 flex justify-center">
        <div className="bg-zinc-900/80 backdrop-blur-sm border-t border-zinc-800 px-4 py-2">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 gap-2"
              onClick={() => setShowUploadForm(false)}
            >
              <Home className="h-4 w-4" />
              Home
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 gap-2"
              onClick={() => setShowUploadForm(true)}
            >
              <Upload className="h-4 w-4" />
              Upload
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 gap-2"
            >
              <History className="h-4 w-4" />
              History
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreatorHome;