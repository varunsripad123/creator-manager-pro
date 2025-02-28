
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
    viewsGrowth: "0%",
    subscribersGrowth: "0%",
    engagementRate: "0%",
    topVideoViews: "0",
    averageWatchTime: "0:00",
    commentSentiment: "0% Positive"
  });

  const [viewsData, setViewsData] = useState([
    { name: "Jan", value: 0 },
    { name: "Feb", value: 0 },
    { name: "Mar", value: 0 },
    { name: "Apr", value: 0 },
    { name: "May", value: 0 },
    { name: "Jun", value: 0 },
  ]);

  const [subscribersData, setSubscribersData] = useState([
    { name: "Jan", value: 0 },
    { name: "Feb", value: 0 },
    { name: "Mar", value: 0 },
    { name: "Apr", value: 0 },
    { name: "May", value: 0 },
    { name: "Jun", value: 0 },
  ]);

  const [engagementData, setEngagementData] = useState([
    { name: "Likes", value: 60 },
    { name: "Comments", value: 20 },
    { name: "Shares", value: 15 },
    { name: "Saves", value: 5 },
  ]);
  
  const [insights, setInsights] = useState([
    {
      title: "Loading insights...",
      content: "Please wait while we analyze your channel data."
    }
  ]);

  useEffect(() => {
    if (channelData) {
      fetchChannelMetrics();
    }
  }, [channelData]);
  
  useEffect(() => {
    if (channelData) {
      fetchTimeframeData();
    }
  }, [channelData, timeframe]);

  const fetchChannelMetrics = async () => {
    if (!channelData) return;
    
    setIsLoading(true);
    
    try {
      const apiKey = localStorage.getItem("youtubeApiKey");
      
      if (!apiKey) {
        throw new Error("YouTube API key not found");
      }
      
      // Get recent videos to calculate engagement
      const videosResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelData.id}&maxResults=10&order=date&type=video&key=${apiKey}`
      );
      
      const videosData = await videosResponse.json();
      
      if (videosData.error) {
        throw new Error(videosData.error.message || "YouTube API error");
      }
      
      if (!videosData.items || videosData.items.length === 0) {
        throw new Error("No videos found");
      }
      
      // Get video stats for engagement calculation
      const videoIds = videosData.items.map((item: any) => item.id.videoId).join(',');
      
      const videoStatsResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails&id=${videoIds}&key=${apiKey}`
      );
      
      const videoStatsData = await videoStatsResponse.json();
      
      if (videoStatsData.error) {
        throw new Error(videoStatsData.error.message || "YouTube API error");
      }
      
      // Calculate engagement metrics
      const totalViews = videoStatsData.items.reduce((acc: number, video: any) => 
        acc + parseInt(video.statistics.viewCount || 0, 10), 0);
      
      const totalLikes = videoStatsData.items.reduce((acc: number, video: any) => 
        acc + parseInt(video.statistics.likeCount || 0, 10), 0);
      
      const totalComments = videoStatsData.items.reduce((acc: number, video: any) => 
        acc + parseInt(video.statistics.commentCount || 0, 10), 0);
      
      const engagementRate = ((totalLikes + totalComments) / totalViews * 100).toFixed(1);
      
      // Find top video
      const topVideo = videoStatsData.items.reduce((prev: any, current: any) => {
        return (parseInt(prev.statistics.viewCount, 10) > parseInt(current.statistics.viewCount, 10)) 
          ? prev 
          : current;
      });
      
      const topVideoViews = formatNumber(topVideo.statistics.viewCount);
      
      // Calculate average watch time (this is mock since real watch time requires more complex API calls)
      // In a real implementation, this would use the YouTube Analytics API
      const averageWatchTime = "4:32"; // Placeholder
      
      // Get subscriber growth
      // Using a fixed percentage for demo - would require historical data in real implementation
      const subscribersGrowth = "+8.3%";
      const viewsGrowth = "+12.5%";
      
      // Update metrics
      setMetrics({
        viewsGrowth,
        subscribersGrowth,
        engagementRate: engagementRate + "%",
        topVideoViews,
        averageWatchTime,
        commentSentiment: "85% Positive" // Placeholder - would require sentiment analysis
      });
      
      // Update engagement data
      const totalEngagements = totalLikes + totalComments;
      setEngagementData([
        { name: "Likes", value: Math.round(totalLikes / totalEngagements * 100) },
        { name: "Comments", value: Math.round(totalComments / totalEngagements * 100) },
        { name: "Shares", value: 15 }, // Placeholder - share data isn't directly available via the API
        { name: "Saves", value: 5 }    // Placeholder - save data isn't directly available via the API
      ]);
      
      // Generate insights
      generateInsights();
      
    } catch (error) {
      console.error("Error fetching channel metrics:", error);
      toast({
        title: "Error fetching metrics",
        description: error instanceof Error ? error.message : "Could not fetch channel metrics.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const formatNumber = (num: string) => {
    const n = parseInt(num, 10);
    if (n >= 1000000) {
      return (n / 1000000).toFixed(1) + 'M';
    } else if (n >= 1000) {
      return (n / 1000).toFixed(1) + 'K';
    }
    return n.toString();
  };

  const fetchTimeframeData = async () => {
    setIsLoading(true);
    
    try {
      const apiKey = localStorage.getItem("youtubeApiKey");
      
      if (!apiKey) {
        throw new Error("YouTube API key not found");
      }
      
      // In a real implementation, this would use the YouTube Analytics API
      // Since Analytics API requires OAuth and is more complex, we'll use publicly available data
      // Get historical videos to simulate growth data
      let maxResults = 10;
      let timeframes: Record<string, { publishedAfter: string, intervals: string[] }> = {
        "6m": { 
          publishedAfter: new Date(new Date().setMonth(new Date().getMonth() - 6)).toISOString(),
          intervals: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
        },
        "1y": { 
          publishedAfter: new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString(),
          intervals: ["Q1", "Q2", "Q3", "Q4"]
        },
        "all": { 
          publishedAfter: new Date(new Date().setFullYear(new Date().getFullYear() - 5)).toISOString(),
          intervals: ["2020", "2021", "2022", "2023", "2024"]
        }
      };
      
      // Use a local variable for the timeframe value, rather than modifying the state directly
      let currentTimeframe = timeframe;
      
      if (!timeframes[currentTimeframe]) {
        currentTimeframe = "6m"; // Default fallback
        setTimeframe(currentTimeframe); // Update the state properly
      }
      
      const publishedAfter = timeframes[currentTimeframe].publishedAfter;
      
      // Get videos from the timeframe
      const videosResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelData.id}&maxResults=${maxResults}&order=date&type=video&publishedAfter=${publishedAfter}&key=${apiKey}`
      );
      
      const videosData = await videosResponse.json();
      
      if (videosData.error) {
        throw new Error(videosData.error.message || "YouTube API error");
      }
      
      // We'll use this data to create a simulated growth chart
      // In a real app, you'd use the Analytics API
      const intervals = timeframes[currentTimeframe].intervals;
      
      // Generate simulated view data based on publish dates
      // This is an approximation since we don't have access to historical analytics
      const viewsData = intervals.map((interval, index) => {
        // Create a weighted distribution based on recency
        const weight = (index + 1) / intervals.length;
        const baseValue = channelData.statistics.rawViewCount / (intervals.length * 2);
        const variance = Math.random() * 0.3 + 0.85; // 0.85 to 1.15 variance
        
        return {
          name: interval,
          value: Math.round(baseValue * weight * variance)
        };
      });
      
      setViewsData(viewsData);
      
      // Generate subscriber data with similar pattern but different values
      const subscribersData = intervals.map((interval, index) => {
        const weight = (index + 1) / intervals.length;
        const baseValue = channelData.statistics.rawSubscriberCount / (intervals.length * 3);
        const variance = Math.random() * 0.3 + 0.85;
        
        return {
          name: interval,
          value: Math.round(baseValue * weight * variance)
        };
      });
      
      setSubscribersData(subscribersData);
      
    } catch (error) {
      console.error("Error generating timeframe data:", error);
      toast({
        title: "Error fetching timeframe data",
        description: error instanceof Error ? error.message : "Could not fetch timeframe data.",
        variant: "destructive",
      });
      
      // Fallback to simulated data
      const intervals = timeframe === "6m" 
        ? ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
        : timeframe === "1y" 
          ? ["Q1", "Q2", "Q3", "Q4"]
          : ["2020", "2021", "2022", "2023", "2024"];
          
      setViewsData(intervals.map((interval, i) => ({
        name: interval,
        value: Math.round(1000 * (i + 1) * (Math.random() * 0.5 + 0.75))
      })));
      
      setSubscribersData(intervals.map((interval, i) => ({
        name: interval,
        value: Math.round(100 * (i + 1) * (Math.random() * 0.5 + 0.75))
      })));
    } finally {
      setIsLoading(false);
    }
  };

  // Function to refresh data
  const refreshData = async () => {
    setIsLoading(true);
    
    try {
      await fetchChannelMetrics();
      await fetchTimeframeData();
      
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
  
  // Function to generate insights with Google Gemini API
  const generateInsights = async () => {
    setInsightsLoading(true);
    
    try {
      const geminiApiKey = localStorage.getItem("geminiApiKey");
      
      if (!geminiApiKey) {
        throw new Error("Gemini API key not found");
      }
      
      // Prepare data for Gemini
      const channelInfo = {
        title: channelData.title,
        subscribers: channelData.statistics.subscriberCount,
        views: channelData.statistics.viewCount,
        videos: channelData.statistics.videoCount,
        engagementRate: metrics.engagementRate,
      };
      
      // Generate insights using Gemini API - using the correct model name for v1 API
      const prompt = `
        As an AI YouTube channel manager, analyze this YouTube channel:
        
        Channel Name: ${channelInfo.title}
        Subscribers: ${channelInfo.subscribers}
        Views: ${channelInfo.views}
        Videos: ${channelInfo.videos}
        Engagement Rate: ${metrics.engagementRate}
        
        Given this information, provide three specific, actionable insights for channel growth that include:
        1. A content strategy suggestion based on current performance
        2. An audience engagement insight
        3. A growth opportunity with specific metrics if possible
        
        Format each insight with a title and a detailed paragraph (about 50 words each).
        Keep advice specific and data-driven where possible.
      `;
      
      // Using the correct Gemini API endpoint with the proper model name for v1 API
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${geminiApiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: prompt
              }]
            }]
          })
        }
      );
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message || "Gemini API error");
      }
      
      let insightText = "";
      try {
        insightText = data.candidates[0].content.parts[0].text;
      } catch (e) {
        throw new Error("Invalid response format from Gemini API");
      }
      
      // Parse the response
      const insightRegex = /\d\.\s+(.*?)\n\n(.*?)(?=\n\d\.|\n*$)/gs;
      const matches = [...insightText.matchAll(insightRegex)];
      
      const parsedInsights = matches.map(match => ({
        title: match[1].trim(),
        content: match[2].trim()
      }));
      
      if (parsedInsights.length > 0) {
        setInsights(parsedInsights);
      } else {
        // Fallback if parsing fails
        setInsights([{
          title: "Content Strategy Suggestion",
          content: insightText.substring(0, 200) + "..."
        }]);
      }
      
      toast({
        title: "New insights generated",
        description: "AI has analyzed your channel data and provided fresh insights.",
      });
    } catch (error) {
      console.error("AI analysis error:", error);
      toast({
        title: "Analysis failed",
        description: error instanceof Error ? error.message : "Could not generate new insights. Please try again.",
        variant: "destructive",
      });
      
      // Fallback insights
      setInsights([
        {
          title: "Content Strategy Suggestion",
          content: "Based on your recent performance, consider creating more tutorial-style videos. Your \"How To\" content typically performs better in terms of engagement and watch time."
        },
        {
          title: "Audience Insight",
          content: "Your viewer retention appears to drop after the midpoint of videos. Consider front-loading key information or breaking longer videos into more digestible segments."
        },
        {
          title: "Growth Opportunity",
          content: "Based on platform trends, videos published midweek receive more initial views. Consider adjusting your publishing schedule to capitalize on this trend."
        }
      ]);
    } finally {
      setInsightsLoading(false);
    }
  };

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
            onClick={generateInsights}
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
