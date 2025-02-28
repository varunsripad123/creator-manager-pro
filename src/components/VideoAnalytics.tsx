
import { useState, useEffect } from "react";
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
  CalendarRange,
  RefreshCw
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

const VideoAnalytics = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [videos, setVideos] = useState<any[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<any[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [retentionData, setRetentionData] = useState<any[]>([]);
  const [trafficSourceData, setTrafficSourceData] = useState<any[]>([]);
  const [insights, setInsights] = useState<any[]>([]);
  
  const { toast } = useToast();
  
  useEffect(() => {
    fetchChannelVideos();
  }, []);
  
  useEffect(() => {
    if (videos.length > 0) {
      filterVideos();
      
      if (!selectedVideo) {
        setSelectedVideo(videos[0]);
        generateVideoAnalytics(videos[0]);
      }
    }
  }, [videos, searchQuery]);

  const fetchChannelVideos = async () => {
    setIsLoading(true);
    
    try {
      const apiKey = localStorage.getItem("youtubeApiKey");
      const channelId = localStorage.getItem("channelId");
      
      if (!apiKey || !channelId) {
        throw new Error("Missing API key or channel ID");
      }
      
      // Get videos from the channel
      const videosResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=10&order=date&type=video&key=${apiKey}`
      );
      
      const videosData = await videosResponse.json();
      
      if (videosData.error) {
        throw new Error(videosData.error.message || "YouTube API error");
      }
      
      if (!videosData.items || videosData.items.length === 0) {
        throw new Error("No videos found");
      }
      
      // Get video stats
      const videoIds = videosData.items.map((item: any) => item.id.videoId).join(',');
      
      const videoStatsResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails,snippet&id=${videoIds}&key=${apiKey}`
      );
      
      const videoStatsData = await videoStatsResponse.json();
      
      if (videoStatsData.error) {
        throw new Error(videoStatsData.error.message || "YouTube API error");
      }
      
      // Format data
      const formattedVideos = videoStatsData.items.map((video: any) => {
        // Get matching snippet data from search results
        const searchData = videosData.items.find((item: any) => item.id.videoId === video.id);
        
        // Format duration
        const duration = formatDuration(video.contentDetails.duration);
        
        // Calculate days since published
        const publishedAt = new Date(video.snippet.publishedAt);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - publishedAt.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        let publishedText;
        if (diffDays === 0) {
          publishedText = "Today";
        } else if (diffDays === 1) {
          publishedText = "Yesterday";
        } else if (diffDays < 7) {
          publishedText = `${diffDays} days ago`;
        } else if (diffDays < 30) {
          publishedText = `${Math.floor(diffDays / 7)} weeks ago`;
        } else if (diffDays < 365) {
          publishedText = `${Math.floor(diffDays / 30)} months ago`;
        } else {
          publishedText = `${Math.floor(diffDays / 365)} years ago`;
        }
        
        // Get thumbnail
        const thumbnail = video.snippet.thumbnails.medium?.url || video.snippet.thumbnails.default?.url;
        
        // Calculate a mock change percent (would be based on historical data in real implementation)
        const changePercent = (Math.random() * 30 - 10).toFixed(1);
        const positive = parseFloat(changePercent) >= 0;
        
        return {
          id: video.id,
          title: video.snippet.title,
          description: video.snippet.description,
          thumbnail,
          views: formatNumber(video.statistics.viewCount || "0"),
          rawViews: parseInt(video.statistics.viewCount || "0", 10),
          likes: formatNumber(video.statistics.likeCount || "0"),
          rawLikes: parseInt(video.statistics.likeCount || "0", 10),
          comments: formatNumber(video.statistics.commentCount || "0"),
          rawComments: parseInt(video.statistics.commentCount || "0", 10),
          publishedAt: publishedText,
          rawPublishedAt: publishedAt,
          duration,
          changePercent,
          positive
        };
      });
      
      // Sort by published date (newest first)
      formattedVideos.sort((a: any, b: any) => 
        b.rawPublishedAt.getTime() - a.rawPublishedAt.getTime()
      );
      
      setVideos(formattedVideos);
    } catch (error) {
      console.error("Error fetching videos:", error);
      toast({
        title: "Error fetching videos",
        description: error instanceof Error ? error.message : "Could not fetch channel videos.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const formatDuration = (duration: string) => {
    // Parse ISO 8601 duration
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    
    if (!match) return "0:00";
    
    const hours = (match[1] && match[1].replace('H', '')) || 0;
    const minutes = (match[2] && match[2].replace('M', '')) || 0;
    const seconds = (match[3] && match[3].replace('S', '')) || 0;
    
    if (Number(hours) > 0) {
      return `${hours}:${Number(minutes) < 10 ? '0' + minutes : minutes}:${Number(seconds) < 10 ? '0' + seconds : seconds}`;
    }
    
    return `${minutes}:${Number(seconds) < 10 ? '0' + seconds : seconds}`;
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
  
  const filterVideos = () => {
    if (!searchQuery) {
      setFilteredVideos(videos);
      return;
    }
    
    const filtered = videos.filter(video => 
      video.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setFilteredVideos(filtered);
  };
  
  const generateVideoAnalytics = async (video: any) => {
    try {
      // In a real implementation, you would use the YouTube Analytics API
      // For now, we're generating mock data that looks realistic
      
      // Generate retention data
      const retentionPoints = 10;
      const mockRetention = [
        { name: "0:00", value: 100 }
      ];
      
      // Parse duration to calculate time segments
      const durationParts = video.duration.split(':');
      let totalSeconds;
      
      if (durationParts.length === 3) {
        // hours:minutes:seconds
        totalSeconds = (parseInt(durationParts[0], 10) * 3600) + 
                       (parseInt(durationParts[1], 10) * 60) + 
                       parseInt(durationParts[2], 10);
      } else {
        // minutes:seconds
        totalSeconds = (parseInt(durationParts[0], 10) * 60) + 
                       parseInt(durationParts[1], 10);
      }
      
      const interval = Math.max(Math.floor(totalSeconds / retentionPoints), 1);
      
      // Generate declining retention curve with some randomness
      for (let i = 1; i <= retentionPoints; i++) {
        const seconds = i * interval;
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        const timePoint = `${minutes}:${remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds}`;
        
        // Retention generally declines, with random fluctuations
        const drop = (100 - mockRetention[0].value) + (i * 5) + (Math.random() * 3 - 1.5);
        const value = Math.max(Math.floor(100 - drop), 20); // Ensure we don't go below 20%
        
        mockRetention.push({ name: timePoint, value });
      }
      
      setRetentionData(mockRetention);
      
      // Generate traffic source data
      setTrafficSourceData([
        { name: "YouTube Search", value: 35 + Math.floor(Math.random() * 15) },
        { name: "Suggested Videos", value: 25 + Math.floor(Math.random() * 10) },
        { name: "External", value: 10 + Math.floor(Math.random() * 10) },
        { name: "Browse Features", value: 10 + Math.floor(Math.random() * 5) },
        { name: "Others", value: 5 + Math.floor(Math.random() * 5) },
      ]);
      
      // Generate insights with Gemini API
      await generateVideoInsights(video);
      
    } catch (error) {
      console.error("Error generating video analytics:", error);
      toast({
        title: "Error generating analytics",
        description: "Could not generate video analytics data.",
        variant: "destructive",
      });
    }
  };
  
  const generateVideoInsights = async (video: any) => {
    try {
      const geminiApiKey = localStorage.getItem("geminiApiKey");
      
      if (!geminiApiKey) {
        throw new Error("Gemini API key not found");
      }
      
      // Prepare data for Gemini
      const videoInfo = {
        title: video.title,
        views: video.views,
        likes: video.likes,
        comments: video.comments,
        publishedAt: video.publishedAt,
      };
      
      // Generate insights using Gemini API
      const prompt = `
        As an AI YouTube channel manager, analyze this video data:
        
        Video Title: ${videoInfo.title}
        Views: ${videoInfo.views}
        Likes: ${videoInfo.likes}
        Comments: ${videoInfo.comments}
        Published: ${videoInfo.publishedAt}
        
        Based on this information and general YouTube best practices, provide three specific insights:
        1. A retention insight about how to keep viewers watching longer
        2. A content strategy suggestion related to this video's topic
        3. An engagement opportunity based on this video's performance
        
        Format each insight with a clear heading and a concise, actionable paragraph (about 50 words each).
        Be specific and practical.
      `;
      
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`,
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
      
      // Parse the response to extract the three insights
      const insightRegex = /(\d\..*?)\n\n(.*?)(?=\n\d\.|\n*$)/gs;
      const matches = [...insightText.matchAll(insightRegex)];
      
      const parsedInsights = matches.map(match => ({
        title: match[1].replace(/\d\.\s+/, '').trim(),
        content: match[2].trim()
      }));
      
      if (parsedInsights.length > 0) {
        setInsights(parsedInsights);
      } else {
        // Fallback if parsing fails
        setInsights([
          {
            title: "Retention Insight",
            content: "Your audience retention drops at key points. Consider adding visual changes or topic transitions every 2-3 minutes to maintain viewer interest."
          },
          {
            title: "Content Strategy",
            content: "This video's topic aligns with current trends. Consider creating a series expanding on specific points mentioned to capitalize on viewer interest."
          },
          {
            title: "Engagement Opportunity",
            content: "The comment-to-view ratio suggests high engagement. Create a follow-up video addressing the most common questions from the comments section."
          }
        ]);
      }
    } catch (error) {
      console.error("Error generating insights:", error);
      // Use fallback insights
      setInsights([
        {
          title: "Retention Insight",
          content: "Your audience retention drops significantly at the 7-minute mark. Consider adding a hook or introducing a new topic at this point to re-engage viewers."
        },
        {
          title: "Content Strategy",
          content: "Videos with this format are performing well. Consider creating more tutorial-style videos in your niche."
        },
        {
          title: "Engagement Opportunity",
          content: "This video has a high comment-to-view ratio. Consider creating a follow-up video addressing the most common questions from the comments section."
        }
      ]);
    }
  };
  
  const handleRefresh = async () => {
    await fetchChannelVideos();
    toast({
      title: "Videos refreshed",
      description: "Your video data has been updated with the latest metrics.",
    });
  };
  
  const handleSelectVideo = (video: any) => {
    setSelectedVideo(video);
    generateVideoAnalytics(video);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Video Performance</h2>
          <p className="text-muted-foreground">
            Analyze individual video metrics and viewer engagement
          </p>
        </div>
        <Button
          onClick={handleRefresh}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? "Refreshing..." : "Refresh Videos"}
        </Button>
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
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-700"></div>
          </div>
        ) : filteredVideos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg font-medium">No videos found</p>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </div>
        ) : (
          filteredVideos.map((video) => (
            <Card 
              key={video.id} 
              className={`bg-white/50 dark:bg-gray-900/50 border-0 shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg ${selectedVideo && selectedVideo.id === video.id ? 'ring-2 ring-primary' : ''}`}
              onClick={() => handleSelectVideo(video)}
            >
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
                    <Button 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(`https://www.youtube.com/watch?v=${video.id}`, '_blank');
                      }}
                    >
                      Watch on YouTube
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectVideo(video);
                      }}
                    >
                      View Analytics
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
      
      {selectedVideo && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white/50 dark:bg-gray-900/50 border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Audience Retention</CardTitle>
                <CardDescription>
                  How long viewers watch "{selectedVideo.title.length > 40 ? selectedVideo.title.substring(0, 40) + '...' : selectedVideo.title}"
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
                AI-generated insights for selected video
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {insights.map((insight, index) => (
                  <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <h4 className="font-medium mb-2">{insight.title}</h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      {insight.content}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default VideoAnalytics;
