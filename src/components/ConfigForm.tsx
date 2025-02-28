
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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    
    try {
      // In a real application, we would validate the API keys here
      // For demo purposes, we'll simulate a successful API connection
      
      // Save API keys to localStorage (not recommended for production)
      localStorage.setItem("youtubeApiKey", values.youtubeApiKey);
      localStorage.setItem("geminiApiKey", values.geminiApiKey);
      localStorage.setItem("channelUrl", values.channelUrl);
      
      // Extract channel ID from URL (simple mock extraction)
      const channelId = values.channelUrl.includes("channel/") 
        ? values.channelUrl.split("channel/")[1].split("?")[0]
        : "UC_example12345";
      
      // Simulate fetching channel data
      const mockChannelData = {
        id: channelId,
        title: "Tech Explorer",
        statistics: {
          subscriberCount: "1.2M",
          viewCount: "25M",
          videoCount: "150"
        }
      };
      
      // Wait 1.5 seconds to simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      onSuccess(mockChannelData);
      
      toast({
        title: "Connection successful",
        description: "Your YouTube channel has been connected successfully!",
      });
    } catch (error) {
      console.error("Configuration error:", error);
      toast({
        title: "Configuration failed",
        description: "Could not verify API keys. Please check and try again.",
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
                  placeholder="https://www.youtube.com/c/yourchannel"
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
