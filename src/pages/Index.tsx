
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import Dashboard from "@/components/Dashboard";
import { useToast } from "@/hooks/use-toast";
import ConfigForm from "@/components/ConfigForm";
import VideoAnalytics from "@/components/VideoAnalytics";
import AudienceAnalysis from "@/components/AudienceAnalysis";
import StrategyAnalysis from "@/components/StrategyAnalysis";

const Index = () => {
  const [isConfigured, setIsConfigured] = useState(false);
  const [channelData, setChannelData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const { toast } = useToast();

  // Check for existing configuration on component mount
  useEffect(() => {
    const checkConfiguration = async () => {
      const savedChannelUrl = localStorage.getItem("channelUrl");
      const savedYoutubeApiKey = localStorage.getItem("youtubeApiKey");
      const savedGeminiApiKey = localStorage.getItem("geminiApiKey");
      const savedChannelId = localStorage.getItem("channelId");
      
      if (savedChannelUrl && savedYoutubeApiKey && savedGeminiApiKey && savedChannelId) {
        // We have saved configuration, let's use it
        setIsConfigured(true);
        setIsLoading(true);
        
        try {
          // Fetch the latest channel data
          const response = await fetch(
            `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${savedChannelId}&key=${savedYoutubeApiKey}`
          );
          
          const data = await response.json();
          
          if (data.error) {
            throw new Error(data.error.message || "YouTube API error");
          }
          
          if (!data.items || data.items.length === 0) {
            throw new Error("Channel not found");
          }
          
          const channelInfo = data.items[0];
          setChannelData({
            id: channelInfo.id,
            title: channelInfo.snippet.title,
            description: channelInfo.snippet.description,
            customUrl: channelInfo.snippet.customUrl,
            thumbnail: channelInfo.snippet.thumbnails.default.url,
            statistics: {
              subscriberCount: formatNumber(channelInfo.statistics.subscriberCount),
              rawSubscriberCount: channelInfo.statistics.subscriberCount,
              viewCount: formatNumber(channelInfo.statistics.viewCount),
              rawViewCount: channelInfo.statistics.viewCount,
              videoCount: formatNumber(channelInfo.statistics.videoCount),
              rawVideoCount: channelInfo.statistics.videoCount
            },
            publishedAt: new Date(channelInfo.snippet.publishedAt).toLocaleDateString()
          });
        } catch (error) {
          console.error("Error fetching channel data:", error);
          toast({
            title: "Error loading channel data",
            description: error instanceof Error ? error.message : "Could not load channel data with saved credentials.",
            variant: "destructive",
          });
          // Clear invalid configuration
          handleReset();
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    checkConfiguration();
  }, [toast]);

  const formatNumber = (num: string) => {
    const n = parseInt(num, 10);
    if (n >= 1000000) {
      return (n / 1000000).toFixed(1) + 'M';
    } else if (n >= 1000) {
      return (n / 1000).toFixed(1) + 'K';
    }
    return n.toString();
  };

  const handleConfigSuccess = (data: any) => {
    toast({
      title: "Configuration successful",
      description: "Your API keys and channel have been configured.",
    });
    
    setIsConfigured(true);
    setChannelData(data);
  };
  
  const handleRefreshData = async () => {
    setIsLoading(true);
    
    try {
      const savedYoutubeApiKey = localStorage.getItem("youtubeApiKey");
      const savedChannelId = localStorage.getItem("channelId");
      
      if (!savedYoutubeApiKey || !savedChannelId) {
        throw new Error("Missing configuration");
      }
      
      // Fetch the latest channel data
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${savedChannelId}&key=${savedYoutubeApiKey}`
      );
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message || "YouTube API error");
      }
      
      if (!data.items || data.items.length === 0) {
        throw new Error("Channel not found");
      }
      
      const channelInfo = data.items[0];
      setChannelData({
        id: channelInfo.id,
        title: channelInfo.snippet.title,
        description: channelInfo.snippet.description,
        customUrl: channelInfo.snippet.customUrl,
        thumbnail: channelInfo.snippet.thumbnails.default.url,
        statistics: {
          subscriberCount: formatNumber(channelInfo.statistics.subscriberCount),
          rawSubscriberCount: channelInfo.statistics.subscriberCount,
          viewCount: formatNumber(channelInfo.statistics.viewCount),
          rawViewCount: channelInfo.statistics.viewCount,
          videoCount: formatNumber(channelInfo.statistics.videoCount),
          rawVideoCount: channelInfo.statistics.videoCount
        },
        publishedAt: new Date(channelInfo.snippet.publishedAt).toLocaleDateString()
      });
      
      toast({
        title: "Data refreshed",
        description: "Your channel data has been updated.",
      });
    } catch (error) {
      console.error("Refresh error:", error);
      toast({
        title: "Refresh failed",
        description: error instanceof Error ? error.message : "Could not refresh channel data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleReset = () => {
    // Clear localStorage
    localStorage.removeItem("channelUrl");
    localStorage.removeItem("youtubeApiKey");
    localStorage.removeItem("geminiApiKey");
    localStorage.removeItem("channelId");
    
    setIsConfigured(false);
    setChannelData(null);
    
    toast({
      title: "Configuration reset",
      description: "Your API keys and channel configuration have been cleared.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-12 text-center">
          <div className="inline-block mb-2 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs font-medium text-gray-800 dark:text-gray-200 animate-fade-in">
            CREATOR MANAGER PRO
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight animate-fade-in">
            YouTube Analytics & Manager
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto animate-fade-in">
            Monitor your channel performance, analyze audience sentiment, and get strategic recommendations to grow your YouTube presence.
          </p>
        </header>

        {!isConfigured ? (
          <Card className="max-w-md mx-auto backdrop-blur-sm bg-white/30 dark:bg-black/30 border border-gray-200 dark:border-gray-800 shadow-lg transition-all duration-300 hover:shadow-xl animate-fade-in">
            <CardHeader>
              <CardTitle>Let's set up your account</CardTitle>
              <CardDescription>
                Provide your API keys and channel URL to get started
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ConfigForm onSuccess={handleConfigSuccess} />
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 gap-8">
              <Card className="backdrop-blur-sm bg-white/30 dark:bg-black/30 border border-gray-200 dark:border-gray-800 shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {channelData?.thumbnail && (
                        <img 
                          src={channelData.thumbnail} 
                          alt={channelData.title} 
                          className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-800"
                        />
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          CHANNEL
                        </div>
                        <h2 className="text-2xl font-bold">{channelData?.title}</h2>
                        {channelData?.publishedAt && (
                          <div className="text-sm text-gray-500">Since {channelData.publishedAt}</div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        className="ml-auto"
                        onClick={handleRefreshData}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Refreshing...
                          </span>
                        ) : "Refresh Data"}
                      </Button>
                      <Button 
                        variant="outline" 
                        className="ml-auto"
                        onClick={handleReset}
                      >
                        Reset Config
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs 
                    defaultValue="dashboard" 
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full"
                  >
                    <TabsList className="grid grid-cols-4 w-full mb-8">
                      <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                      <TabsTrigger value="videos">Videos</TabsTrigger>
                      <TabsTrigger value="audience">Audience</TabsTrigger>
                      <TabsTrigger value="strategy">Strategy</TabsTrigger>
                    </TabsList>
                    <TabsContent value="dashboard">
                      <Dashboard channelData={channelData} />
                    </TabsContent>
                    <TabsContent value="videos">
                      <VideoAnalytics />
                    </TabsContent>
                    <TabsContent value="audience">
                      <AudienceAnalysis />
                    </TabsContent>
                    <TabsContent value="strategy">
                      <StrategyAnalysis />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
        
        <footer className="mt-16 py-8 text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>Creator Manager Pro &copy; {new Date().getFullYear()} | All Rights Reserved</p>
          <p className="mt-2">Powered by YouTube API & Google Gemini AI</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
