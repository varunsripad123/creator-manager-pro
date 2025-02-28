
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Lightbulb, 
  TrendingUp, 
  Calendar, 
  MessageSquare, 
  PenTool, 
  RefreshCw,
  ArrowRight,
  Clock,
  Tag
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const StrategyAnalysis = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock recommended video ideas
  const [videoIdeas, setVideoIdeas] = useState([
    {
      title: "10 Essential TypeScript Features You Might Not Know About",
      description: "Cover advanced TypeScript features that intermediate developers might have missed, with practical examples.",
      estimatedViews: "250K-350K",
      confidence: "High",
      tags: ["typescript", "javascript", "webdev", "programming"]
    },
    {
      title: "Building a Full-Stack App with React, Node.js and MongoDB - Step by Step",
      description: "A comprehensive tutorial showing how to build a complete application from scratch using popular technologies.",
      estimatedViews: "180K-280K",
      confidence: "Medium",
      tags: ["react", "nodejs", "mongodb", "tutorial"]
    },
    {
      title: "Why Rust is Becoming the Most Loved Programming Language",
      description: "Explore the features of Rust that make it increasingly popular among developers and its real-world applications.",
      estimatedViews: "150K-200K",
      confidence: "Medium",
      tags: ["rust", "programming", "coding", "development"]
    }
  ]);
  
  // Mock trending topics
  const [trendingTopics, setTrendingTopics] = useState([
    { topic: "AI code assistants", growth: "+215%", relevance: "High" },
    { topic: "Web Assembly", growth: "+124%", relevance: "Medium" },
    { topic: "Svelte vs React", growth: "+86%", relevance: "High" },
    { topic: "Edge computing", growth: "+72%", relevance: "Medium" },
    { topic: "State management in 2024", growth: "+65%", relevance: "High" }
  ]);
  
  // Mock optimal posting schedule
  const [postingSchedule, setPostingSchedule] = useState([
    { day: "Wednesday", time: "4:00 PM EST", engagement: "High" },
    { day: "Saturday", time: "11:00 AM EST", engagement: "Medium-High" },
    { day: "Monday", time: "7:30 PM EST", engagement: "Medium" }
  ]);
  
  const generateNewRecommendations = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call to Gemini
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Updated video ideas
      const newVideoIdeas = [
        {
          title: "The Future of Frontend Development: Beyond React and Vue",
          description: "Explore emerging frontend technologies and methodologies that are positioned to shape the developer landscape in the next few years.",
          estimatedViews: "280K-380K",
          confidence: "High",
          tags: ["frontend", "webdev", "programming", "future"]
        },
        {
          title: "Building AI-Powered Features in Your Web Applications - A Practical Guide",
          description: "A hands-on tutorial showing how to integrate modern AI capabilities into your web applications without being an AI expert.",
          estimatedViews: "220K-320K",
          confidence: "High",
          tags: ["ai", "webdev", "tutorial", "programming"]
        },
        {
          title: "Optimizing React Performance: Advanced Techniques for Complex Apps",
          description: "Deep dive into performance optimization techniques for large-scale React applications with real-world examples.",
          estimatedViews: "190K-240K",
          confidence: "Medium",
          tags: ["react", "performance", "webdev", "optimization"]
        }
      ];
      
      setVideoIdeas(newVideoIdeas);
      
      // Update trending topics
      const newTrendingTopics = [
        { topic: "AI pair programming", growth: "+278%", relevance: "High" },
        { topic: "Micro-frontends", growth: "+165%", relevance: "Medium" },
        { topic: "Server components", growth: "+143%", relevance: "High" },
        { topic: "End-to-end type safety", growth: "+98%", relevance: "Medium" },
        { topic: "CSS-in-JS alternatives", growth: "+76%", relevance: "High" }
      ];
      
      setTrendingTopics(newTrendingTopics);
      
      toast({
        title: "New recommendations generated",
        description: "AI has analyzed recent trends and provided fresh content strategy recommendations.",
      });
    } catch (error) {
      console.error("AI analysis error:", error);
      toast({
        title: "Analysis failed",
        description: "Could not generate new recommendations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Content Strategy</h2>
          <p className="text-muted-foreground">
            AI-powered recommendations to grow your channel
          </p>
        </div>
        <Button
          onClick={generateNewRecommendations}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? "Generating..." : "Generate New Recommendations"}
        </Button>
      </div>
      
      <Card className="bg-white/50 dark:bg-gray-900/50 border-0 shadow-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            <CardTitle className="text-lg">Recommended Video Ideas</CardTitle>
          </div>
          <CardDescription>
            AI-generated video concepts based on your audience and trending topics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {videoIdeas.map((idea, index) => (
              <div key={index} className="p-5 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:shadow-md transition-all duration-300">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
                  <h3 className="text-lg font-semibold">{idea.title}</h3>
                  <div className="flex items-center gap-2">
                    <span className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-xs">
                      Est. Views: {idea.estimatedViews}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      idea.confidence === "High" 
                        ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300" 
                        : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300"
                    }`}>
                      {idea.confidence} Confidence
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {idea.description}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <Tag className="h-4 w-4 text-gray-500" />
                  {idea.tags.map((tag, i) => (
                    <span key={i} className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded-full text-xs">
                      #{tag}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex justify-end">
                  <Button size="sm" variant="outline" className="flex items-center gap-1">
                    Save Idea <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white/50 dark:bg-gray-900/50 border-0 shadow-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              <CardTitle className="text-lg">Trending Topics</CardTitle>
            </div>
            <CardDescription>
              Topics gaining popularity in your niche
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trendingTopics.map((topic, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div>
                    <p className="font-medium">{topic.topic}</p>
                    <p className="text-xs text-gray-500">Relevance to your channel: {topic.relevance}</p>
                  </div>
                  <span className="text-green-600 font-medium">{topic.growth}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/50 dark:bg-gray-900/50 border-0 shadow-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-500" />
              <CardTitle className="text-lg">Optimal Posting Schedule</CardTitle>
            </div>
            <CardDescription>
              Recommended times to publish for maximum engagement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {postingSchedule.map((schedule, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <Clock className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                    </div>
                    <div>
                      <p className="font-medium">{schedule.day}</p>
                      <p className="text-xs text-gray-500">{schedule.time}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${
                    schedule.engagement === "High" 
                      ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300" 
                      : "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                  }`}>
                    {schedule.engagement} Engagement
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="bg-white/50 dark:bg-gray-900/50 border-0 shadow-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <PenTool className="h-5 w-5 text-indigo-500" />
            <CardTitle className="text-lg">Content Enhancement Tips</CardTitle>
          </div>
          <CardDescription>
            AI-powered suggestions to improve your content quality
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="thumbnails" className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="thumbnails">Thumbnails</TabsTrigger>
              <TabsTrigger value="titles">Titles & Descriptions</TabsTrigger>
              <TabsTrigger value="engagement">Viewer Engagement</TabsTrigger>
            </TabsList>
            <TabsContent value="thumbnails">
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <h4 className="font-medium mb-2">Use Consistent Branding</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    Your most successful thumbnails all feature your logo in the bottom-right corner and use a consistent color scheme. Continue this pattern for better brand recognition.
                  </p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <h4 className="font-medium mb-2">Text Optimization</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    Thumbnails with 3-5 words have 42% higher CTR than those with more text. Keep text large, high-contrast, and limited to the essential message.
                  </p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <h4 className="font-medium mb-2">Emotional Triggers</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    Thumbnails showing facial expressions of surprise or excitement have 35% higher click-through rates. Consider incorporating more human elements.
                  </p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="titles">
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <h4 className="font-medium mb-2">Title Length Optimization</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    Your videos with titles between 40-60 characters perform best. This length is optimal for both search and recommendation algorithms.
                  </p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <h4 className="font-medium mb-2">Front-load Keywords</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    Place your most important keywords at the beginning of your titles. Videos that do this receive 23% more views from search.
                  </p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <h4 className="font-medium mb-2">Description Optimization</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    Include timestamps in your descriptions for videos longer than 10 minutes. Videos with timestamps have 15% better retention rates.
                  </p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="engagement">
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <h4 className="font-medium mb-2">Comment Engagement</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    Videos where you respond to at least 10 comments in the first 24 hours show 28% higher engagement rates. Prioritize responding to thoughtful questions.
                  </p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <h4 className="font-medium mb-2">Call to Action Placement</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    Including a specific call to action between the 70-80% mark of your video increases engagement by 43%. This is when viewers are most receptive.
                  </p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <h4 className="font-medium mb-2">Community Polls</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    Channels that post a community poll before related video releases see 37% higher initial view counts. Use polls to gauge interest and create anticipation.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <Card className="bg-white/50 dark:bg-gray-900/50 border-0 shadow-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-emerald-500" />
            <CardTitle className="text-lg">Audience Feedback Analysis</CardTitle>
          </div>
          <CardDescription>
            Insights from comments and engagement patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <h4 className="font-medium mb-2">Common Requests</h4>
              <p className="text-gray-600 dark:text-gray-400 mb-3">
                Analysis of your recent comments shows these top requested topics:
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>Advanced TypeScript tutorials</span>
                  <span className="text-sm font-medium">32% of requests</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span>Real-world project walkthroughs</span>
                  <span className="text-sm font-medium">24% of requests</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span>Performance optimization techniques</span>
                  <span className="text-sm font-medium">18% of requests</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <h4 className="font-medium mb-2">Sentiment Analysis</h4>
              <p className="text-gray-600 dark:text-gray-400 mb-3">
                Overall sentiment across your channel:
              </p>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-3">
                <div className="bg-green-500 h-4 rounded-full" style={{ width: "85%" }}></div>
              </div>
              <div className="flex justify-between text-sm">
                <span>Positive: 85%</span>
                <span>Neutral: 12%</span>
                <span>Negative: 3%</span>
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <h4 className="font-medium mb-2">Strategic Recommendation</h4>
              <p className="text-gray-600 dark:text-gray-400">
                Based on audience feedback and engagement patterns, we recommend creating a multi-part series on "Building a Production-Ready Application" that incorporates TypeScript, performance optimization, and real-world scenarios. This would address 74% of viewer requests while aligning with your channel's strengths.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StrategyAnalysis;
