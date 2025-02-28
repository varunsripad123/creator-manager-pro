
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, LineChart } from "@/components/Charts";
import { Button } from "@/components/ui/button";
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock, 
  Eye, 
  ThumbsUp, 
  MessageCircle,
  Search,
  SlidersHorizontal,
  CalendarRange
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const VideoAnalytics = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  
  // Mock video data
  const videos = [
    {
      id: "vid1",
      title: "How to Build a React App in 10 Minutes",
      thumbnail: "https://i.imgur.com/XyU3H8f.png",
      views: "358K",
      likes: "24.5K",
      comments: "1.2K",
      publishedAt: "2 weeks ago",
      duration: "10:28",
      changePercent: 12.6,
      positive: true
    },
    {
      id: "vid2",
      title: "The Ultimate Guide to TypeScript in 2024",
      thumbnail: "https://i.imgur.com/7D8wF5q.png",
      views: "215K",
      likes: "18.7K",
      comments: "982",
      publishedAt: "1 month ago",
      duration: "15:42",
      changePercent: 8.3,
      positive: true
    },
    {
      id: "vid3",
      title: "Why Your Code is Slow (And How to Fix It)",
      thumbnail: "https://i.imgur.com/XcqHPDk.png",
      views: "183K",
      likes: "15.2K",
      comments: "758",
      publishedAt: "2 months ago",
      duration: "12:15",
      changePercent: -3.4,
      positive: false
    },
    {
      id: "vid4",
      title: "5 CSS Tricks You Should Know in 2024",
      thumbnail: "https://i.imgur.com/BXfTKgj.png",
      views: "142K",
      likes: "12.1K",
      comments: "532",
      publishedAt: "3 months ago",
      duration: "8:45",
      changePercent: 5.7,
      positive: true
    }
  ];
  
  // Filter videos based on search query
  const filteredVideos = videos.filter(video => 
    video.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Mock retention data for the first video
  const retentionData = [
    { name: "0:00", value: 100 },
    { name: "1:00", value: 92 },
    { name: "2:00", value: 87 },
    { name: "3:00", value: 82 },
    { name: "4:00", value: 78 },
    { name: "5:00", value: 75 },
    { name: "6:00", value: 70 },
    { name: "7:00", value: 64 },
    { name: "8:00", value: 58 },
    { name: "9:00", value: 51 },
    { name: "10:00", value: 45 },
  ];
  
  // Mock traffic source data
  const trafficSourceData = [
    { name: "YouTube Search", value: 42 },
    { name: "Suggested Videos", value: 28 },
    { name: "External", value: 15 },
    { name: "Browse Features", value: 10 },
    { name: "Others", value: 5 },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Video Performance</h2>
          <p className="text-muted-foreground">
            Analyze individual video metrics and viewer engagement
          </p>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search videos..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={() => setFilterOpen(!filterOpen)}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filter
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <CalendarRange className="h-4 w-4" />
          Last 30 Days
        </Button>
      </div>
      
      {filterOpen && (
        <Card className="bg-white/50 dark:bg-gray-900/50 border-0 shadow-md p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium mb-2">Video Length</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">Any</Button>
                <Button variant="outline" size="sm" className="flex-1">Short</Button>
                <Button variant="outline" size="sm" className="flex-1">Long</Button>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Publish Date</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">Any</Button>
                <Button variant="outline" size="sm" className="flex-1">This Year</Button>
                <Button variant="outline" size="sm" className="flex-1">This Month</Button>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Performance</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">Any</Button>
                <Button variant="outline" size="sm" className="flex-1">Growing</Button>
                <Button variant="outline" size="sm" className="flex-1">Declining</Button>
              </div>
            </div>
          </div>
        </Card>
      )}
      
      <div className="grid grid-cols-1 gap-6">
        {filteredVideos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg font-medium">No videos found</p>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </div>
        ) : (
          filteredVideos.map((video) => (
            <Card key={video.id} className="bg-white/50 dark:bg-gray-900/50 border-0 shadow-md overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 lg:w-1/4 bg-gray-100 dark:bg-gray-800">
                  <div className="relative h-48 md:h-full">
                    <div 
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${video.thumbnail})` }}
                    />
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1 py-0.5 rounded">
                      {video.duration}
                    </div>
                  </div>
                </div>
                <div className="p-6 flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{video.title}</h3>
                      <p className="text-sm text-gray-500">Published {video.publishedAt}</p>
                    </div>
                    <div className={`flex items-center ${video.positive ? 'text-green-500' : 'text-red-500'}`}>
                      {video.positive ? <ArrowUpRight className="h-4 w-4 mr-1" /> : <ArrowDownRight className="h-4 w-4 mr-1" />}
                      <span className="text-sm font-medium">{video.positive ? '+' : ''}{video.changePercent}%</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mt-6">
                    <div className="flex items-center">
                      <Eye className="h-5 w-5 mr-2 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Views</p>
                        <p className="font-medium">{video.views}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <ThumbsUp className="h-5 w-5 mr-2 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Likes</p>
                        <p className="font-medium">{video.likes}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <MessageCircle className="h-5 w-5 mr-2 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Comments</p>
                        <p className="font-medium">{video.comments}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex space-x-2">
                    <Button size="sm">View Details</Button>
                    <Button variant="outline" size="sm">Compare</Button>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
      
      {filteredVideos.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white/50 dark:bg-gray-900/50 border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Audience Retention</CardTitle>
                <CardDescription>
                  How long viewers watch your top video
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <LineChart data={retentionData} />
              </CardContent>
            </Card>
            
            <Card className="bg-white/50 dark:bg-gray-900/50 border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Traffic Sources</CardTitle>
                <CardDescription>
                  Where your viewers are coming from
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <BarChart data={trafficSourceData} />
              </CardContent>
            </Card>
          </div>
          
          <Card className="bg-white/50 dark:bg-gray-900/50 border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">Performance Insights</CardTitle>
              <CardDescription>
                AI-generated insights for your top video
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <h4 className="font-medium mb-2">Retention Insight</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    Your audience retention drops significantly at the 7-minute mark. Consider adding a hook or introducing a new topic at this point to re-engage viewers.
                  </p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <h4 className="font-medium mb-2">Content Strategy</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    "How to" videos like this one are performing 37% better than your other content. Consider creating more tutorial-style videos in your niche.
                  </p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <h4 className="font-medium mb-2">Engagement Opportunity</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    This video has a high comment-to-view ratio. Consider creating a follow-up video addressing the most common questions from the comments section.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default VideoAnalytics;
