
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import Dashboard from "@/components/Dashboard";
import { useToast } from "@/hooks/use-toast";
import ConfigForm from "@/components/ConfigForm";

const Index = () => {
  const [isConfigured, setIsConfigured] = useState(false);
  const [channelData, setChannelData] = useState(null);
  const { toast } = useToast();

  const handleConfigSuccess = (data: any) => {
    // In a real app, this would fetch actual data from YouTube API
    // For now, we'll simulate successful configuration
    toast({
      title: "Configuration successful",
      description: "Your API keys and channel have been configured.",
    });
    
    setIsConfigured(true);
    setChannelData({
      id: "UC_example12345",
      title: "Your Channel Name",
      statistics: {
        subscriberCount: "1.2M",
        viewCount: "25M",
        videoCount: "150"
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-12 text-center">
          <div className="inline-block mb-2 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs font-medium text-gray-800 dark:text-gray-200">
            CREATOR MANAGER PRO
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">
            YouTube Analytics & Manager
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Monitor your channel performance, analyze audience sentiment, and get strategic recommendations to grow your YouTube presence.
          </p>
        </header>

        {!isConfigured ? (
          <Card className="max-w-md mx-auto backdrop-blur-sm bg-white/30 dark:bg-black/30 border border-gray-200 dark:border-gray-800 shadow-lg transition-all duration-300 hover:shadow-xl">
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
          <div className="space-y-8">
            <div className="grid grid-cols-1 gap-8">
              <Card className="backdrop-blur-sm bg-white/30 dark:bg-black/30 border border-gray-200 dark:border-gray-800 shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        CHANNEL
                      </div>
                      <h2 className="text-2xl font-bold">{channelData?.title}</h2>
                    </div>
                    <Button variant="outline" className="ml-auto">
                      Refresh Data
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="dashboard" className="w-full">
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
                      <div className="text-center py-12">
                        <h3 className="text-lg font-medium mb-2">Video Analytics</h3>
                        <p className="text-gray-500 dark:text-gray-400">
                          Video performance metrics will appear here once you've connected your YouTube account.
                        </p>
                      </div>
                    </TabsContent>
                    <TabsContent value="audience">
                      <div className="text-center py-12">
                        <h3 className="text-lg font-medium mb-2">Audience Insights</h3>
                        <p className="text-gray-500 dark:text-gray-400">
                          Demographic information and audience behavior will appear here once you've connected your YouTube account.
                        </p>
                      </div>
                    </TabsContent>
                    <TabsContent value="strategy">
                      <div className="text-center py-12">
                        <h3 className="text-lg font-medium mb-2">Content Strategy</h3>
                        <p className="text-gray-500 dark:text-gray-400">
                          AI-powered content recommendations will appear here once you've connected your YouTube account and Gemini API.
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
