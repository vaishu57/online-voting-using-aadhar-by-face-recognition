"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect } from "react";
import { LotusSymbol, HandSymbol, BroomSymbol, ElephantSymbol, StarSymbol } from "@/components/party-symbols";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const parties = [
  { id: 'bjp', name: 'Bharatiya Janata Party', symbol: <LotusSymbol /> },
  { id: 'inc', name: 'Indian National Congress', symbol: <HandSymbol /> },
  { id: 'aap', name: 'Aam Aadmi Party', symbol: <BroomSymbol /> },
  { id: 'bsp', name: 'Bahujan Samaj Party', symbol: <ElephantSymbol /> },
  { id: 'cpi', name: 'Communist Party of India', symbol: <StarSymbol /> },
];

const recordVote = (aadhar: string) => {
    if (typeof window !== 'undefined') {
        const votedList = JSON.parse(localStorage.getItem('votedAadhars') || '[]');
        if (!votedList.includes(aadhar)) {
            localStorage.setItem('votedAadhars', JSON.stringify([...votedList, aadhar]));
        }
    }
}

const incrementVoteCount = (partyId: string) => {
    if (typeof window !== 'undefined') {
        const voteCounts = JSON.parse(localStorage.getItem('voteCounts') || '{}');
        voteCounts[partyId] = (voteCounts[partyId] || 0) + 1;
        localStorage.setItem('voteCounts', JSON.stringify(voteCounts));
    }
};

function VoteContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const aadhar = searchParams.get("aadhar");
    const { toast } = useToast();
    const [votingFor, setVotingFor] = React.useState<string | null>(null);

    useEffect(() => {
        if (!aadhar) {
            router.replace('/verify');
            toast({ variant: 'destructive', title: 'Session Invalid', description: 'Please start over.'});
        }
    }, [aadhar, router, toast]);

    const handleVote = (party: typeof parties[0]) => {
        if (!aadhar) {
            router.push('/verify');
            return;
        }

        setVotingFor(party.id);

        setTimeout(() => {
            recordVote(aadhar);
            incrementVoteCount(party.id);
            router.push(`/confirmation?party=${encodeURIComponent(party.name)}`);
        }, 1500);
    };

    if (!aadhar) {
        return (
            <Card className="w-full max-w-lg">
                <CardHeader>
                    <Skeleton className="h-8 w-3/4 mx-auto" />
                    <Skeleton className="h-4 w-1/2 mx-auto" />
                </CardHeader>
                <CardContent className="space-y-4">
                    {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-lg animate-in fade-in-50 duration-500">
            <CardHeader>
                <CardTitle className="font-headline text-center text-2xl">Cast Your Vote</CardTitle>
                <CardDescription className="text-center">Select your party of choice. Click on the party to vote.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {parties.map((party) => (
                        <Button
                            key={party.id}
                            variant="outline"
                            className="h-auto w-full justify-start p-4 text-left transition-all hover:border-primary"
                            onClick={() => handleVote(party)}
                            disabled={!!votingFor}
                        >
                            {party.symbol}
                            <span className="ml-4 flex-1 text-lg font-medium">{party.name}</span>
                            {votingFor === party.id && <Loader2 className="h-5 w-5 animate-spin" />}
                        </Button>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

export default function VotePage() {
    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
            <Suspense fallback={<Skeleton className="h-[550px] w-full max-w-lg" />}>
                <VoteContent />
            </Suspense>
        </div>
    );
}
