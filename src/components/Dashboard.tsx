
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, LineChart, PieChart } from "@/components/Charts";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { TrendingUp, Users, Video, ThumbsUp, MessageCircle, Award, ChevronRight, Calendar, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DashboardProps {
  channelData: any;
}

const Dashboard = ({ channelData }: DashboardProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [timeframe, setTimeframe] = useState("6m"); // 6m, 1y, all
  const [insightsLoading, setInsightsLoading] = useState(false);
  
  const [metrics, setMetrics] = useState({
    viewsGrowth: "+12.5%",
    subscribersGrowth: "+8.3%",
    engagementRate: "6.7%",
    topVideoViews: "1.2M",
    averageWatchTime: "4:32",
    commentSentiment: "85% Positive"
  });
  
  // Simulated chart data
  const [viewsData, setViewsData] = useState([
    { name: "Jan", value: 4000 },
    { name: "Feb", value: 3000 },
    { name: "Mar", value: 5000 },
    { name: "Apr", value: 7000 },
    { name: "May", value: 6000 },
    { name: "Jun", value: 8000 },
  ]);

  const [subscribersData, setSubscribersData] = useState([
    { name: "Jan", value: 400 },
    { name: "Feb", value: 600 },
    { name: "Mar", value: 800 },
    { name: "Apr", value: 1200 },
    { name: "May", value: 1600 },
    { name: "Jun", value: 2000 },
  ]);

  const [engagementData, setEngagementData] = useState([
    { name: "Likes", value: 65 },
    { name: "Comments", value: 15 },
    { name: "Shares", value: 10 },
    { name: "Saves", value: 10 },
  ]);
  
  const [insights, setInsights] = useState([
    {
      title: "Content Strategy Suggestion",
      content: "Based on your recent performance, consider creating more tutorial-style videos. Your \"How To\" content performs 37% better than other formats in terms of engagement and watch time."
    },
    {
      title: "Audience Insight",
      content: "Your viewer retention drops significantly after the 5-minute mark. Consider front-loading key information or breaking longer videos into more digestible segments."
    },
    {
      title: "Growth Opportunity",
      content: "Videos published on Wednesdays at 4PM EST receive 28% more initial views. Consider adjusting your publishing schedule to capitalize on this trend."
    }
  ]);

  // Function to refresh data
  const refreshData = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update with new random data
      setViewsData(prev => 
        prev.map(item => ({ 
          name: item.name, 
          value: Math.floor(Math.random() * 5000) + 3000 
        }))
      );
      
      setSubscribersData(prev => 
        prev.map(item => ({ 
          name: item.name, 
          value: Math.floor(Math.random() * 1000) + 400 
        }))
      );
      
      toast({
        title: "Data refreshed",
        description: "Dashboard data has been updated with the latest metrics.",
      });
    } catch (error) {
      console.error("Refresh error:", error);
      toast({
        title: "Refresh failed",
        description: "Could not refresh data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to generate new AI insights
  const generateNewInsights = async () => {
    setInsightsLoading(true);
    
    try {
      // Simulate API call to Gemini
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Updated insights
      const newInsights = [
        {
          title: "Trending Topic Opportunity",
          content: "Our analysis shows a growing interest in \"AI productivity tools\" among your audience. Creating content on this topic in the next 2 weeks could capitalize on this trend before it peaks."
        },
        {
          title: "Comment Sentiment Analysis",
          content: "Recent videos have shown a 12% increase in positive sentiment. Comments mentioning your explanations and visual demonstrations were particularly favorable. Consider enhancing these aspects."
        },
        {
          title: "Competitor Analysis",
          content: "Channels in your niche are seeing success with shorter, more frequent uploads (7-10 minutes). Consider testing this format alongside your longer content to diversify your strategy."
        }
      ];
      
      setInsights(newInsights);
      
      toast({
        title: "New insights generated",
        description: "AI has analyzed your channel data and provided fresh insights.",
      });
    } catch (error) {
      console.error("AI analysis error:", error);
      toast({
        title: "Analysis failed",
        description: "Could not generate new insights. Please try again.",
        variant: "destructive",
      });
    } finally {
      setInsightsLoading(false);
    }
  };
  
  // Update data when timeframe changes
  useEffect(() => {
    const updateDataForTimeframe = async () => {
      setIsLoading(true);
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (timeframe === "6m") {
          setViewsData([
            { name: "Jan", value: 4000 },
            { name: "Feb", value: 3000 },
            { name: "Mar", value: 5000 },
            { name: "Apr", value: 7000 },
            { name: "May", value: 6000 },
            { name: "Jun", value: 8000 },
          ]);
          
          setSubscribersData([
            { name: "Jan", value: 400 },
            { name: "Feb", value: 600 },
            { name: "Mar", value: 800 },
            { name: "Apr", value: 1200 },
            { name: "May", value: 1600 },
            { name: "Jun", value: 2000 },
          ]);
        } else if (timeframe === "1y") {
          setViewsData([
            { name: "Q1", value: 12000 },
            { name: "Q2", value: 19000 },
            { name: "Q3", value: 15000 },
            { name: "Q4", value: 21000 },
          ]);
          
          setSubscribersData([
            { name: "Q1", value: 1800 },
            { name: "Q2", value: 3600 },
            { name: "Q3", value: 5400 },
            { name: "Q4", value: 8000 },
          ]);
        } else if (timeframe === "all") {
          setViewsData([
            { name: "2020", value: 40000 },
            { name: "2021", value: 65000 },
            { name: "2022", value: 85000 },
            { name: "2023", value: 120000 },
            { name: "2024", value: 67000 },
          ]);
          
          setSubscribersData([
            { name: "2020", value: 5000 },
            { name: "2021", value: 12000 },
            { name: "2022", value: 28000 },
            { name: "2023", value: 45000 },
            { name: "2024", value: 65000 },
          ]);
        }
      } catch (error) {
        console.error("Timeframe update error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    updateDataForTimeframe();
  }, [timeframe]);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Overview of your channel's performance and analytics
          </p>
        </div>
        <Button
          onClick={refreshData}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? "Refreshing..." : "Refresh Data"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white/50 dark:bg-gray-900/50 border-0 shadow-md transition-all duration-300 hover:shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Subscribers
                </p>
                <h3 className="text-3xl font-bold mt-1">{channelData?.statistics?.subscriberCount}</h3>
                <p className="text-sm font-medium text-green-600 mt-1">
                  {metrics.subscribersGrowth} this month
                </p>
              </div>
              <div className="h-12 w-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-gray-700 dark:text-gray-300" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/50 dark:bg-gray-900/50 border-0 shadow-md transition-all duration-300 hover:shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total Views
                </p>
                <h3 className="text-3xl font-bold mt-1">{channelData?.statistics?.viewCount}</h3>
                <p className="text-sm font-medium text-green-600 mt-1">
                  {metrics.viewsGrowth} this month
                </p>
              </div>
              <div className="h-12 w-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-gray-700 dark:text-gray-300" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/50 dark:bg-gray-900/50 border-0 shadow-md transition-all duration-300 hover:shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Videos Published
                </p>
                <h3 className="text-3xl font-bold mt-1">{channelData?.statistics?.videoCount}</h3>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-1">
                  Lifetime total
                </p>
              </div>
              <div className="h-12 w-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                <Video className="h-6 w-6 text-gray-700 dark:text-gray-300" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white/50 dark:bg-gray-900/50 border-0 shadow-md">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Views Growth</CardTitle>
              <CardDescription>
                Channel views over time
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                className={timeframe === "6m" ? "bg-gray-100 dark:bg-gray-800" : ""}
                onClick={() => setTimeframe("6m")}
              >
                6M
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className={timeframe === "1y" ? "bg-gray-100 dark:bg-gray-800" : ""}
                onClick={() => setTimeframe("1y")}
              >
                1Y
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className={timeframe === "all" ? "bg-gray-100 dark:bg-gray-800" : ""}
                onClick={() => setTimeframe("all")}
              >
                All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className={`h-80 ${isLoading ? 'opacity-50' : ''}`}>
              <LineChart data={viewsData} />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/50 dark:bg-gray-900/50 border-0 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Subscribers Growth</CardTitle>
            <CardDescription>
              New subscribers over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className={`h-80 ${isLoading ? 'opacity-50' : ''}`}>
              <BarChart data={subscribersData} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 bg-white/50 dark:bg-gray-900/50 border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Performance Summary</CardTitle>
            <CardDescription>
              Key performance metrics for your channel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <ThumbsUp className="h-5 w-5 mr-2 text-gray-700 dark:text-gray-300" />
                  <span>Engagement Rate</span>
                </div>
                <span className="font-medium">{metrics.engagementRate}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Video className="h-5 w-5 mr-2 text-gray-700 dark:text-gray-300" />
                  <span>Top Video Views</span>
                </div>
                <span className="font-medium">{metrics.topVideoViews}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Award className="h-5 w-5 mr-2 text-gray-700 dark:text-gray-300" />
                  <span>Average Watch Time</span>
                </div>
                <span className="font-medium">{metrics.averageWatchTime}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <MessageCircle className="h-5 w-5 mr-2 text-gray-700 dark:text-gray-300" />
                  <span>Comment Sentiment</span>
                </div>
                <span className="font-medium">{metrics.commentSentiment}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/50 dark:bg-gray-900/50 border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Engagement Breakdown</CardTitle>
            <CardDescription>
              How viewers interact with your content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <PieChart data={engagementData} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white/50 dark:bg-gray-900/50 border-0 shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">AI Insights & Recommendations</CardTitle>
            <CardDescription>
              Gemini-powered analysis for your channel growth
            </CardDescription>
          </div>
          <Button 
            variant="outline"
            onClick={generateNewInsights}
            disabled={insightsLoading}
            className="flex items-center gap-2"
          >
            {insightsLoading ? (
              <>
                <svg className="animate-spin h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                Generate New Insights
              </>
            )}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg transition-all duration-300 hover:shadow-md">
                <h4 className="font-medium mb-2 flex items-center">
                  {insight.title}
                  <ChevronRight className="h-4 w-4 ml-1 text-gray-400" />
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  {insight.content}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
