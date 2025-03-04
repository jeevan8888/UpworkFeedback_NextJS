"use client"

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from "next/navigation";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLinkIcon, RefreshCwIcon } from "lucide-react";

type FeedbackSummary = {
  freelancer_name: string;
  profile_url: string;
  avg_rating: number;
  highest_rating: number;
  lowest_rating: number;
  feedback_count: number;
};

type FeedbackDetail = {
  id: number;
  email: string;
  freelancer_name: string;
  profile_url: string;
  communication_rating: number;
  quality_rating: number;
  value_rating: number;
  timeliness_rating: number;
  expertise_rating: number;
  overall_rating: number;
  comments: string;
  created_at: string;
};

export function FeedbackTable() {
  const [summaryData, setSummaryData] = useState<FeedbackSummary[]>([]);
  const [detailedData, setDetailedData] = useState<FeedbackDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("summary");
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const password = searchParams.get("password");

  const fetchData = async (detailed = false) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin?password=${password}&detailed=${detailed}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      
      const result = await response.json();
      
      if (detailed) {
        setDetailedData(result.data);
      } else {
        setSummaryData(result.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load feedback data",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (password) {
      fetchData(activeTab === "detailed");
    }
  }, [password, activeTab, fetchData]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    fetchData(value === "detailed");
  };

  const handleRefresh = () => {
    fetchData(activeTab === "detailed");
  };

  const formatRating = (rating: number | null | undefined) => {
    return rating;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl">Feedback Dashboard</CardTitle>
              <CardDescription>
                View and analyze freelancer feedback data
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCwIcon className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="summary" value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="mb-4">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="detailed">Detailed</TabsTrigger>
            </TabsList>
            
            <TabsContent value="summary">
              {isLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : summaryData.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No feedback data available</p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Freelancer Name</TableHead>
                        <TableHead>Profile</TableHead>
                        <TableHead className="text-right">Avg Rating</TableHead>
                        <TableHead className="text-right">Highest Rating</TableHead>
                        <TableHead className="text-right">Lowest Rating</TableHead>
                        <TableHead className="text-right">Feedback Count</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {summaryData.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{item.freelancer_name}</TableCell>
                          <TableCell>
                            <a 
                              href={item.profile_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center text-blue-600 hover:underline"
                            >
                              View Profile
                              <ExternalLinkIcon className="h-3 w-3 ml-1" />
                            </a>
                          </TableCell>
                          <TableCell className="text-right">{formatRating(item.avg_rating)}</TableCell>
                          <TableCell className="text-right">{item.highest_rating}</TableCell>
                          <TableCell className="text-right">{item.lowest_rating}</TableCell>
                          <TableCell className="text-right">{item.feedback_count}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="detailed">
              {isLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : detailedData.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No detailed feedback data available</p>
                </div>
              ) : (
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Freelancer</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead className="text-right">Communication</TableHead>
                        <TableHead className="text-right">Quality</TableHead>
                        <TableHead className="text-right">Value</TableHead>
                        <TableHead className="text-right">Timeliness</TableHead>
                        <TableHead className="text-right">Expertise</TableHead>
                        <TableHead className="text-right">Overall</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {detailedData.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.freelancer_name}</TableCell>
                          <TableCell>{item.email}</TableCell>
                          <TableCell className="text-right">{item.communication_rating}</TableCell>
                          <TableCell className="text-right">{item.quality_rating}</TableCell>
                          <TableCell className="text-right">{item.value_rating}</TableCell>
                          <TableCell className="text-right">{item.timeliness_rating}</TableCell>
                          <TableCell className="text-right">{item.expertise_rating}</TableCell>
                          <TableCell className="text-right">{item.overall_rating}</TableCell>
                          <TableCell>{new Date(item.created_at).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
}