"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, KeyRound } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const authSchema = z.object({
  password: z.string().min(1, "Password is required."),
});

const CORRECT_PASSWORD = "vaishu@2005";

export default function AuthPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof authSchema>>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof authSchema>) {
    setIsLoading(true);
    
    setTimeout(() => {
      if (values.password === CORRECT_PASSWORD) {
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('results_access_granted', 'true');
        }
        router.push(`/results`);
      } else {
        toast({
          variant: "destructive",
          title: "Authentication Failed",
          description: "The password you entered is incorrect.",
        });
        setIsLoading(false);
      }
    }, 1000);
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md animate-in fade-in-50 duration-500">
        <CardHeader className="items-center text-center p-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                <KeyRound className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="font-headline text-2xl">Authorization Required</CardTitle>
            <CardDescription>You need to enter the password to view the results.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="••••••••" 
                        {...field}
                        type="password"
                        suppressHydrationWarning
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" size="lg" disabled={isLoading} suppressHydrationWarning>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Access Results
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex-col gap-4 pt-4">
            <Button asChild variant="outline" className="w-full">
                <Link href="/">Back to Home</Link>
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
