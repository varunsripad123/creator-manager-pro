
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
      
      // Wait 1 second to simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSuccess(values);
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
          className="w-full bg-gray-900 hover:bg-gray-800 text-white transition-all duration-200"
          disabled={isLoading}
        >
          {isLoading ? "Configuring..." : "Configure"}
        </Button>
      </form>
    </Form>
  );
};

export default ConfigForm;
