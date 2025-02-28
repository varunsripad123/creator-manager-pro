
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  channelUrl: z.string().url("Please enter a valid YouTube channel URL"),
  youtubeApiKey: z.string().min(10, "API key must be at least 10 characters"),
  geminiApiKey: z.string().min(10, "API key must be at least 10 characters"),
});

interface ConfigFormProps {
  onSuccess: (data: any) => void;
}

const ConfigForm = ({ onSuccess }: ConfigFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      channelUrl: "",
      youtubeApiKey: "",
      geminiApiKey: "",
    },
  });

  const extractChannelId = (url: string): string | null => {
    let channelId = null;
    
    // Handle multiple URL formats
    // Format: youtube.com/channel/UC...
    const channelRegex = /youtube\.com\/channel\/(UC[\w-]+)/;
    const channelMatch = url.match(channelRegex);
    
    if (channelMatch && channelMatch[1]) {
      return channelMatch[1];
    }
    
    // Format: youtube.com/c/ChannelName or youtube.com/@username
    const usernameRegex = /youtube\.com\/(c\/|@)([\w-]+)/;
    const usernameMatch = url.match(usernameRegex);
    
    if (usernameMatch && usernameMatch[2]) {
      return usernameMatch[2]; // We'll resolve this to a channel ID in the API call
    }
    
    return null;
  };

  const fetchChannelData = async (channelIdentifier: string, apiKey: string) => {
    try {
      // First determine if we have a channel ID (UC...) or a username
      let endpoint = '';
      
      if (channelIdentifier.startsWith('UC')) {
        // Direct channel ID
        endpoint = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelIdentifier}&key=${apiKey}`;
      } else {
        // Username or custom URL
        endpoint = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&forUsername=${channelIdentifier}&key=${apiKey}`;
      }
      
      const response = await fetch(endpoint);
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message || "YouTube API error");
      }
      
      if (!data.items || data.items.length === 0) {
        // If forUsername doesn't work, try search as a fallback
        if (!channelIdentifier.startsWith('UC')) {
          const searchEndpoint = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${channelIdentifier}&type=channel&key=${apiKey}`;
          const searchResponse = await fetch(searchEndpoint);
          const searchData = await searchResponse.json();
          
          if (searchData.error) {
            throw new Error(searchData.error.message || "YouTube API error");
          }
          
          if (!searchData.items || searchData.items.length === 0) {
            throw new Error("Channel not found");
          }
          
          // Get the first channel from search results
          const channelId = searchData.items[0].id.channelId;
          const detailsEndpoint = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${apiKey}`;
          const detailsResponse = await fetch(detailsEndpoint);
          const detailsData = await detailsResponse.json();
          
          if (!detailsData.items || detailsData.items.length === 0) {
            throw new Error("Could not retrieve channel details");
          }
          
          return formatChannelData(detailsData.items[0]);
        }
        
        throw new Error("Channel not found");
      }
      
      return formatChannelData(data.items[0]);
    } catch (error) {
      console.error("Error fetching channel data:", error);
      throw error;
    }
  };
  
  const formatChannelData = (channelData: any) => {
    return {
      id: channelData.id,
      title: channelData.snippet.title,
      description: channelData.snippet.description,
      customUrl: channelData.snippet.customUrl,
      thumbnail: channelData.snippet.thumbnails.default.url,
      statistics: {
        subscriberCount: formatNumber(channelData.statistics.subscriberCount),
        rawSubscriberCount: channelData.statistics.subscriberCount,
        viewCount: formatNumber(channelData.statistics.viewCount),
        rawViewCount: channelData.statistics.viewCount,
        videoCount: formatNumber(channelData.statistics.videoCount),
        rawVideoCount: channelData.statistics.videoCount
      },
      publishedAt: new Date(channelData.snippet.publishedAt).toLocaleDateString()
    };
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

  const validateGeminiApiKey = async (apiKey: string) => {
    try {
      // Use the correct Gemini models endpoint
      const response = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`);
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message || "Invalid Gemini API key");
      }
      
      return true;
    } catch (error) {
      console.error("Error validating Gemini API key:", error);
      throw error;
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    
    try {
      // Extract channel ID from URL
      const channelIdentifier = extractChannelId(values.channelUrl);
      
      if (!channelIdentifier) {
        throw new Error("Could not extract channel ID from URL");
      }
      
      // Validate YouTube API key by fetching channel data
      const channelData = await fetchChannelData(channelIdentifier, values.youtubeApiKey);
      
      // Validate Gemini API key
      await validateGeminiApiKey(values.geminiApiKey);
      
      // Save API keys to localStorage
      localStorage.setItem("youtubeApiKey", values.youtubeApiKey);
      localStorage.setItem("geminiApiKey", values.geminiApiKey);
      localStorage.setItem("channelUrl", values.channelUrl);
      localStorage.setItem("channelId", channelData.id);
      
      onSuccess(channelData);
      
      toast({
        title: "Connection successful",
        description: "Your YouTube channel has been connected successfully!",
      });
    } catch (error) {
      console.error("Configuration error:", error);
      toast({
        title: "Configuration failed",
        description: error instanceof Error ? error.message : "Could not verify API keys. Please check and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="channelUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>YouTube Channel URL</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://www.youtube.com/channel/UCxxxxxxxx"
                  {...field}
                  className="bg-white/50 dark:bg-black/50"
                />
              </FormControl>
              <FormDescription>
                Enter the full URL to your YouTube channel
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="youtubeApiKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>YouTube API Key</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your YouTube API key"
                  type="password"
                  {...field}
                  className="bg-white/50 dark:bg-black/50"
                />
              </FormControl>
              <FormDescription>
                Get this from the Google Developer Console
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="geminiApiKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gemini API Key</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your Gemini API key"
                  type="password"
                  {...field}
                  className="bg-white/50 dark:bg-black/50"
                />
              </FormControl>
              <FormDescription>
                Get this from Google AI Studio
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Connecting...
            </span>
          ) : "Connect Channel"}
        </Button>
      </form>
    </Form>
  );
};

export default ConfigForm;
