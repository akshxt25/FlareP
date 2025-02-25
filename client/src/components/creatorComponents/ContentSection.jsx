import React,{useState, useEffect} from "react";
import {
    Card,
    CardHeader,
    CardContent,
    CardDescription,
    CardTitle,
    CardFooter,
  } from "@/components/ui/card";

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

  import {
    Alert,
    AlertDescription,
    AlertTitle,
  } from "@/components/ui/alert";
  import { ScrollArea } from "@/components/ui/scroll-area";
  import { Progress } from "@/components/ui/progress";
  import axios from "axios";


const ContentSection = () => {
    const [videos, setVideos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
  
    const fetchVideos = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/creator/creator-get-videos', {
          withCredentials: true
        });
        // Make sure we're handling the response data correctly
        const videoData = response.data.videos || [];
        // Transform the video data to ensure we're handling nested objects properly
        const processedVideos = videoData.map(video => ({
          id: video._id || video.id,
          title: video.title || 'Untitled',
          description: video.description || '',
          shortDescription: video.shortDescription || video.description || '',
          thumbnail: video.thumbnail || "/api/placeholder/320/180",
          duration: video.duration || '0:00',
          
          processingProgress: video.processingProgress || 0
        }));
        setVideos(processedVideos);
        setError(null);
      } catch (error) {
        console.error('Failed to fetch videos:', error);
        setError('Failed to load videos. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
  
    useEffect(() => {
      fetchVideos();
    }, []);
  
    return (
      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center text-zinc-100">
            <PlayCircle className="h-5 w-5 mr-2 text-zinc-400" />
            Your Content
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <p>Loading...</p>
            </div>
          ) : error ? (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <ScrollArea className="h-[600px] pr-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.length === 0 ? (
                  <div className="col-span-full flex justify-center items-center py-12">
                    <Alert className="w-full max-w-md">
                      <AlertTitle>No videos found</AlertTitle>
                      <AlertDescription>
                        Upload your first video to get started!
                      </AlertDescription>
                    </Alert>
                  </div>
                ) : (
                  videos.map((video) => (
                    <div key={video.id} className="group space-y-3 transition-all duration-300 hover:transform hover:translate-y-[-4px]">
                      <div className="relative aspect-video rounded-lg overflow-hidden bg-zinc-900 shadow-lg">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                        />
                        {video.duration && (
                          <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs">
                            {video.duration}
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-medium text-zinc-200 group-hover:text-white transition-colors duration-200 line-clamp-2">
                          {video.title}
                        </h3>
                        <p className="text-sm text-zinc-400 line-clamp-2">
                          {video.shortDescription}
                        </p>
                        
                        {video.processingProgress !== undefined && (
                          <div className="space-y-1">
                            <Progress 
                              value={video.processingProgress} 
                              className="h-1 bg-zinc-800" 
                            />
                            <p className="text-xs text-zinc-400">
                              Processing: {video.processingProgress}%
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    );
  };

export default ContentSection