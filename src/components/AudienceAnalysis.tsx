
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, BarChart } from "@/components/Charts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RefreshCw, Globe, Users, Clock, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AudienceAnalysis = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock demographic data
  const [ageData, setAgeData] = useState([
    { name: "18-24", value: 15 },
    { name: "25-34", value: 38 },
    { name: "35-44", value: 27 },
    { name: "45-54", value: 12 },
    { name: "55+", value: 8 },
  ]);
  
  const [genderData, setGenderData] = useState([
    { name: "Male", value: 62 },
    { name: "Female", value: 35 },
    { name: "Non-binary", value: 3 },
  ]);
  
  const [deviceData, setDeviceData] = useState([
    { name: "Mobile", value: 58 },
    { name: "Desktop", value: 32 },
    { name: "Tablet", value: 7 },
    { name: "TV", value: 3 },
  ]);
  
  const [geographyData, setGeographyData] = useState([
    { name: "United States", value: 42 },
    { name: "India", value: 15 },
    { name: "UK", value: 8 },
    { name: "Canada", value: 7 },
    { name: "Germany", value: 5 },
    { name: "Others", value: 23 },
  ]);
  
  const [viewTimeData, setViewTimeData] = useState([
    { name: "Mon", value: 75 },
    { name: "Tue", value: 82 },
    { name: "Wed", value: 96 },
    { name: "Thu", value: 88 },
    { name: "Fri", value: 67 },
    { name: "Sat", value: 53 },
    { name: "Sun", value: 48 },
  ]);
  
  const refreshData = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update with slightly different data to simulate refresh
      setAgeData(prev => 
        prev.map(item => ({ 
          name: item.name, 
          value: Math.max(5, Math.floor(item.value * (0.9 + Math.random() * 0.2)))
        }))
      );
      
      setGenderData(prev => 
        prev.map(item => ({ 
          name: item.name, 
          value: Math.max(3, Math.floor(item.value * (0.9 + Math.random() * 0.2)))
        }))
      );
      
      toast({
        title: "Data refreshed",
        description: "Audience data has been updated with the latest metrics.",
      });
    } catch (error) {
      console.error("Refresh error:", error);
      toast({
        title: "Refresh failed",
        description: "Could not refresh audience data. Please try again.",
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
          <h2 className="text-2xl font-bold tracking-tight">Audience Insights</h2>
          <p className="text-muted-foreground">
            Understand who's watching your content and when
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
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white/50 dark:bg-gray-900/50 border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex flex-col items-center">
              <div className="h-12 w-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-3">
                <Users className="h-6 w-6 text-gray-700 dark:text-gray-300" />
              </div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Unique Viewers
              </p>
              <h3 className="text-2xl font-bold mt-1">845K</h3>
              <p className="text-xs text-green-600 mt-1">
                +12.5% this month
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/50 dark:bg-gray-900/50 border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex flex-col items-center">
              <div className="h-12 w-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-3">
                <Clock className="h-6 w-6 text-gray-700 dark:text-gray-300" />
              </div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Avg. View Duration
              </p>
              <h3 className="text-2xl font-bold mt-1">5:42</h3>
              <p className="text-xs text-green-600 mt-1">
                +0:22 this month
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/50 dark:bg-gray-900/50 border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex flex-col items-center">
              <div className="h-12 w-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-3">
                <Calendar className="h-6 w-6 text-gray-700 dark:text-gray-300" />
              </div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Returning Viewers
              </p>
              <h3 className="text-2xl font-bold mt-1">48.3%</h3>
              <p className="text-xs text-green-600 mt-1">
                +3.7% this month
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/50 dark:bg-gray-900/50 border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex flex-col items-center">
              <div className="h-12 w-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-3">
                <Globe className="h-6 w-6 text-gray-700 dark:text-gray-300" />
              </div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Top Country
              </p>
              <h3 className="text-2xl font-bold mt-1">US</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                42% of viewers
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="bg-white/50 dark:bg-gray-900/50 border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">Demographics</CardTitle>
          <CardDescription>
            Breakdown of your audience by demographics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="age" className="w-full">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="age">Age</TabsTrigger>
              <TabsTrigger value="gender">Gender</TabsTrigger>
              <TabsTrigger value="device">Device</TabsTrigger>
              <TabsTrigger value="geography">Geography</TabsTrigger>
            </TabsList>
            <TabsContent value="age">
              <div className="h-80">
                <BarChart data={ageData} />
              </div>
            </TabsContent>
            <TabsContent value="gender">
              <div className="h-80">
                <PieChart data={genderData} />
              </div>
            </TabsContent>
            <TabsContent value="device">
              <div className="h-80">
                <PieChart data={deviceData} />
              </div>
            </TabsContent>
            <TabsContent value="geography">
              <div className="h-80">
                <BarChart data={geographyData} />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <Card className="bg-white/50 dark:bg-gray-900/50 border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">When Your Audience Watches</CardTitle>
          <CardDescription>
            View time by day of week (hours)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <BarChart data={viewTimeData} />
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-white/50 dark:bg-gray-900/50 border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">Audience Insights</CardTitle>
          <CardDescription>
            AI-powered analysis of your audience behavior
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <h4 className="font-medium mb-2">Demographic Insight</h4>
              <p className="text-gray-600 dark:text-gray-400">
                Your channel has a strong appeal to the 25-34 age group, particularly in the technology and professional development segments. Consider creating more content that addresses career advancement for this demographic.
              </p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <h4 className="font-medium mb-2">Viewing Patterns</h4>
              <p className="text-gray-600 dark:text-gray-400">
                Viewers are most active on Wednesdays, with peak viewing times between 7-9 PM EST. Consider scheduling your video releases to align with these peak times for maximum initial exposure.
              </p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <h4 className="font-medium mb-2">Growth Opportunity</h4>
              <p className="text-gray-600 dark:text-gray-400">
                Your audience in India has grown by 32% in the past 3 months, representing a significant opportunity. Consider creating content that acknowledges this audience or addresses specific interests from this region.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AudienceAnalysis;
