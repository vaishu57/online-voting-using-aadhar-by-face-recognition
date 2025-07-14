import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md animate-in fade-in-50 duration-500">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline text-primary">e-Vote Swadesh</CardTitle>
          <CardDescription className="pt-2">Welcome to the Indian Online Voting System</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-6 pt-0 space-y-4">
          <p className="text-center text-muted-foreground">
            Your vote is your voice. Make it count.
          </p>
          <Button asChild className="w-full" size="lg">
            <Link href="/verify">Cast Your Vote</Link>
          </Button>
          <Button asChild className="w-full" size="lg" variant="outline">
            <Link href="/auth">View Results</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
