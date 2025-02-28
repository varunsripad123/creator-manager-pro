
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, LineChart, PieChart } from "@/components/Charts";
import { Separator } from "@/components/ui/separator";
import { TrendingUp, Users, Video, ThumbsUp, MessageCircle, Award } from "lucide-react";

interface DashboardProps {
  channelData: any;
}

const Dashboard = ({ channelData }: DashboardProps) => {
  const [metrics, setMetrics] = useState({
    viewsGrowth: "+12.5%",
    subscribersGrowth: "+8.3%",
    engagementRate: "6.7%",
    topVideoViews: "1.2M",
    averageWatchTime: "4:32",
    commentSentiment: "85% Positive"
  });
  
  // Simulated chart data
  const viewsData = [
    { name: "Jan", value: 4000 },
    { name: "Feb", value: 3000 },
    { name: "Mar", value: 5000 },
    { name: "Apr", value: 7000 },
    { name: "May", value: 6000 },
    { name: "Jun", value: 8000 },
  ];

  const subscribersData = [
    { name: "Jan", value: 400 },
    { name: "Feb", value: 600 },
    { name: "Mar", value: 800 },
    { name: "Apr", value: 1200 },
    { name: "May", value: 1600 },
    { name: "Jun", value: 2000 },
  ];

  const engagementData = [
    { name: "Likes", value: 65 },
    { name: "Comments", value: 15 },
    { name: "Shares", value: 10 },
    { name: "Saves", value: 10 },
  ];

  return (
    <div className="space-y-8">
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
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Views Growth</CardTitle>
            <CardDescription>
              Channel views over the last 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <LineChart data={viewsData} />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/50 dark:bg-gray-900/50 border-0 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Subscribers Growth</CardTitle>
            <CardDescription>
              New subscribers over the last 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
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
        <CardHeader>
          <CardTitle className="text-lg">AI Insights & Recommendations</CardTitle>
          <CardDescription>
            Gemini-powered analysis for your channel growth
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <h4 className="font-medium mb-2">Content Strategy Suggestion</h4>
              <p className="text-gray-600 dark:text-gray-400">
                Based on your recent performance, consider creating more tutorial-style videos. 
                Your "How To" content performs 37% better than other formats in terms of engagement and watch time.
              </p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <h4 className="font-medium mb-2">Audience Insight</h4>
              <p className="text-gray-600 dark:text-gray-400">
                Your viewer retention drops significantly after the 5-minute mark. Consider front-loading key information 
                or breaking longer videos into more digestible segments.
              </p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <h4 className="font-medium mb-2">Growth Opportunity</h4>
              <p className="text-gray-600 dark:text-gray-400">
                Videos published on Wednesdays at 4PM EST receive 28% more initial views. Consider adjusting your 
                publishing schedule to capitalize on this trend.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
