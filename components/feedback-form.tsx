"use client"

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Rating } from "react-simple-star-rating";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  freelancerName: z.string().min(1, { message: "Freelancer name is required" }),
  profileUrl: z.string().url({ message: "Please enter a valid URL" }),
  communicationRating: z.number().min(1, { message: "Please rate communication" }),
  qualityRating: z.number().min(1, { message: "Please rate quality of work" }),
  valueRating: z.number().min(1, { message: "Please rate value for money" }),
  timelinessRating: z.number().min(1, { message: "Please rate timeliness" }),
  expertiseRating: z.number().min(1, { message: "Please rate expertise" }),
  overallRating: z.number().min(1, { message: "Please provide an overall rating" }),
  comments: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function FeedbackForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      freelancerName: "",
      profileUrl: "",
      communicationRating: 0,
      qualityRating: 0,
      valueRating: 0,
      timelinessRating: 0,
      expertiseRating: 0,
      overallRating: 0,
      comments: "",
    },
  });

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to submit feedback");
      }

      setIsSuccess(true);
      toast({
        title: "Feedback submitted",
        description: "Thank you for your feedback!",
      });
      form.reset();
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit feedback",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  const handleRating = (field: keyof FormValues, value: number) => {
    form.setValue(field, value);
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center min-h-[60vh] p-4"
      >
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Thank You!</CardTitle>
            <CardDescription className="text-center">
              Your feedback has been submitted successfully.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="text-green-500 text-6xl mb-4"
            >
              ✓
            </motion.div>
            <p className="mb-4">We appreciate your time and valuable feedback!</p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={() => setIsSuccess(false)}>Submit Another Response</Button>
          </CardFooter>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-3xl mx-auto p-4"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Freelancer Feedback Form</CardTitle>
          <CardDescription>
            Please rate your experience with the freelancer and provide feedback.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <motion.div variants={itemVariants} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Email</FormLabel>
                      <FormControl>
                        <Input placeholder="email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="freelancerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Freelancer Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="profileUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Freelancer Profile URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://www.upwork.com/freelancers/~..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-6">
                <h3 className="text-lg font-medium">Ratings</h3>
                
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="communicationRating"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex flex-row items-center justify-between gap-4">
                          <FormLabel className="mb-0 shrink-0">Communication</FormLabel>
                          <FormControl>
                            <div className="flex flex-row items-center">
                              <Rating
                                onClick={(value) => handleRating("communicationRating", value)}
                                initialValue={field.value}
                                size={24}
                                transition
                                fillColorArray={['#f17a45', '#f19745', '#f1a545', '#f1b345', '#f1d045']}
                                emptyColor="#cbd5e1"
                                className="flex flex-row"
                                SVGstyle={{ display: 'inline-block' }}
                                style={{ 
                                  display: 'flex',
                                  flexDirection: 'row',
                                  gap: '4px'
                                }}
                              />
                            </div>
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="qualityRating"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex flex-row items-center justify-between gap-4">
                          <FormLabel className="mb-0 shrink-0">Quality of Work</FormLabel>
                          <FormControl>
                            <div className="flex flex-row items-center">
                              <Rating
                                onClick={(value) => handleRating("qualityRating", value)}
                                initialValue={field.value}
                                size={24}
                                transition
                                fillColorArray={['#f17a45', '#f19745', '#f1a545', '#f1b345', '#f1d045']}
                                emptyColor="#cbd5e1"
                                className="flex flex-row"
                                SVGstyle={{ display: 'inline-block' }}
                                style={{ 
                                  display: 'flex',
                                  flexDirection: 'row',
                                  gap: '4px'
                                }}
                              />
                            </div>
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="valueRating"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex flex-row items-center justify-between gap-4">
                          <FormLabel className="mb-0 shrink-0">Value for Money</FormLabel>
                          <FormControl>
                            <div className="flex flex-row items-center">
                              <Rating
                                onClick={(value) => handleRating("valueRating", value)}
                                initialValue={field.value}
                                size={24}
                                transition
                                fillColorArray={['#f17a45', '#f19745', '#f1a545', '#f1b345', '#f1d045']}
                                emptyColor="#cbd5e1"
                                className="flex flex-row"
                                SVGstyle={{ display: 'inline-block' }}
                                style={{ 
                                  display: 'flex',
                                  flexDirection: 'row',
                                  gap: '4px'
                                }}
                              />
                            </div>
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="timelinessRating"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex flex-row items-center justify-between gap-4">
                          <FormLabel className="mb-0 shrink-0">Timeliness</FormLabel>
                          <FormControl>
                            <div className="flex flex-row items-center">
                              <Rating
                                onClick={(value) => handleRating("timelinessRating", value)}
                                initialValue={field.value}
                                size={24}
                                transition
                                fillColorArray={['#f17a45', '#f19745', '#f1a545', '#f1b345', '#f1d045']}
                                emptyColor="#cbd5e1"
                                className="flex flex-row"
                                SVGstyle={{ display: 'inline-block' }}
                                style={{ 
                                  display: 'flex',
                                  flexDirection: 'row',
                                  gap: '4px'
                                }}
                              />
                            </div>
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="expertiseRating"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex flex-row items-center justify-between gap-4">
                          <FormLabel className="mb-0 shrink-0">Expertise in Field</FormLabel>
                          <FormControl>
                            <div className="flex flex-row items-center">
                              <Rating
                                onClick={(value) => handleRating("expertiseRating", value)}
                                initialValue={field.value}
                                size={24}
                                transition
                                fillColorArray={['#f17a45', '#f19745', '#f1a545', '#f1b345', '#f1d045']}
                                emptyColor="#cbd5e1"
                                className="flex flex-row"
                                SVGstyle={{ display: 'inline-block' }}
                                style={{ 
                                  display: 'flex',
                                  flexDirection: 'row',
                                  gap: '4px'
                                }}
                              />
                            </div>
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="overallRating"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex flex-row items-center justify-between gap-4">
                          <FormLabel className="mb-0 shrink-0">Overall Experience</FormLabel>
                          <FormControl>
                            <div className="flex flex-row items-center">
                              <Rating
                                onClick={(value) => handleRating("overallRating", value)}
                                initialValue={field.value}
                                size={24}
                                transition
                                fillColorArray={['#f17a45', '#f19745', '#f1a545', '#f1b345', '#f1d045']}
                                emptyColor="#cbd5e1"
                                className="flex flex-row"
                                SVGstyle={{ display: 'inline-block' }}
                                style={{ 
                                  display: 'flex',
                                  flexDirection: 'row',
                                  gap: '4px'
                                }}
                              />
                            </div>
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <FormField
                  control={form.control}
                  name="comments"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Comments</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Please share any additional feedback about your experience..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Optional: Share any specific feedback or suggestions.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="pt-4"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Feedback"}
                </Button>
              </motion.div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
}