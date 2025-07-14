"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useState } from "react";

const aadharSchema = z.object({
  aadhar: z.string().regex(/^[0-9]{12}$/, "Aadhar number must be 12 digits."),
});

const hasVoted = (aadhar: string): boolean => {
  if (typeof window !== 'undefined') {
    const votedList = JSON.parse(localStorage.getItem('votedAadhars') || '[]');
    return votedList.includes(aadhar);
  }
  return false;
};

export default function VerifyPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof aadharSchema>>({
    resolver: zodResolver(aadharSchema),
    defaultValues: {
      aadhar: "",
    },
  });

  function onSubmit(values: z.infer<typeof aadharSchema>) {
    setIsLoading(true);
    
    setTimeout(() => {
      if (hasVoted(values.aadhar)) {
        toast({
          variant: "destructive",
          title: "Already Voted",
          description: "This Aadhar number has already been used to cast a vote.",
        });
        setIsLoading(false);
      } else {
        router.push(`/details?aadhar=${values.aadhar}`);
      }
    }, 1000);
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md animate-in fade-in-50 duration-500">
        <CardHeader>
          <CardTitle className="font-headline">Voter Verification</CardTitle>
          <CardDescription>Enter your 12-digit Aadhar Number to proceed.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="aadhar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Aadhar Number</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="•••• •••• ••••" 
                        {...field}
                        type="text"
                        maxLength={12}
                        pattern="\d*"
                        inputMode="numeric"
                        autoComplete="off"
                        suppressHydrationWarning
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading} suppressHydrationWarning>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Next
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
