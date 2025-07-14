"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { LotusSymbol, HandSymbol, BroomSymbol, ElephantSymbol, StarSymbol } from "@/components/party-symbols";
import { useRouter } from 'next/navigation';
import { Loader2, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

const partyDetails = [
  { id: 'bjp', name: 'Bharatiya Janata Party', symbol: <LotusSymbol />, color: 'hsl(var(--primary))' },
  { id: 'inc', name: 'Indian National Congress', symbol: <HandSymbol />, color: 'hsl(217, 91%, 60%)' },
  { id: 'aap', name: 'Aam Aadmi Party', symbol: <BroomSymbol />, color: 'hsl(220, 9%, 65%)' },
  { id: 'bsp', name: 'Bahujan Samaj Party', symbol: <ElephantSymbol />, color: 'hsl(262, 80%, 70%)' },
  { id: 'cpi', name: 'Communist Party of India', symbol: <StarSymbol />, color: 'hsl(0, 84%, 60%)' },
];

interface VoteData {
    name: string;
    votes: number;
    fill: string;
}

export default function ResultsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [voteData, setVoteData] = useState<VoteData[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalVotes, setTotalVotes] = useState(0);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // Ensure this runs only on the client
    const accessGranted = sessionStorage.getItem('results_access_granted');
    if (accessGranted !== 'true') {
        router.replace('/auth');
        return;
    }
    setAuthorized(true);

    const voteCounts = JSON.parse(localStorage.getItem('voteCounts') || '{}');
    const data = partyDetails.map(party => ({
      name: party.name,
      votes: voteCounts[party.id] || 0,
      fill: party.color,
    }));
    
    setVoteData(data);
    setTotalVotes(data.reduce((acc, item) => acc + item.votes, 0));
    setLoading(false);
  }, [router]);

  const handleClearRecords = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('voteCounts');
        localStorage.removeItem('votedAadhars');
    }

    const clearedData = partyDetails.map(party => ({
      name: party.name,
      votes: 0,
      fill: party.color,
    }));
    
    setVoteData(clearedData);
    setTotalVotes(0);

    toast({
        title: "Records Cleared",
        description: "All voting data has been reset successfully.",
    });
  };

  if (!authorized) {
      return (
        <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
            <div className="flex flex-col items-center gap-4 text-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <p className="text-muted-foreground">Verifying access...</p>
            </div>
        </div>
      );
  }

  if (loading) {
      return (
          <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
              <Card className="w-full max-w-4xl">
                  <CardHeader>
                      <Skeleton className="h-8 w-1/2 mx-auto" />
                      <Skeleton className="h-4 w-1/3 mx-auto mt-2" />
                  </CardHeader>
                  <CardContent>
                      <Skeleton className="h-96 w-full" />
                      <div className="mt-8 space-y-4">
                          {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
                      </div>
                  </CardContent>
              </Card>
          </div>
      )
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <Card className="w-full max-w-4xl animate-in fade-in-50 duration-500">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline">Live Election Results</CardTitle>
          <CardDescription>
            Total votes cast: {totalVotes}
          </CardDescription>
        </CardHeader>
        <CardContent>
            {totalVotes > 0 ? (
                <>
                    <div className="h-96 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={voteData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} angle={-15} textAnchor="end" height={80} interval={0} />
                                <YAxis allowDecals={false} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                                <Tooltip
                                    cursor={{ fill: 'hsl(var(--muted) / 0.5)' }}
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--card))',
                                        borderColor: 'hsl(var(--border))',
                                        color: 'hsl(var(--card-foreground))'
                                    }}
                                />
                                <Bar dataKey="votes" name="Votes" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                     <div className="mt-8 space-y-2">
                        <h3 className="text-xl font-semibold text-center mb-4">Vote Summary</h3>
                        {partyDetails.map(party => (
                            <div key={party.id} className="flex items-center justify-between rounded-lg border p-4">
                               <div className="flex items-center gap-4">
                                   {party.symbol}
                                   <span className="font-medium">{party.name}</span>
                               </div>
                               <span className="font-bold text-lg">{voteData.find(d => d.name === party.name)?.votes || 0}</span>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <div className="text-center py-16">
                    <p className="text-muted-foreground">No votes have been cast yet.</p>
                </div>
            )}
           
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Clear Records
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete all
                        voting data and reset the results.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleClearRecords}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <Button asChild>
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
