"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import { ShieldAlert } from "lucide-react";
import Image from "next/image";
import { voterDatabase } from "@/lib/voter-db";

function VoterDetailsContent() {
  const searchParams = useSearchParams();
  const aadhar = searchParams.get("aadhar");
  const [voter, setVoter] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (aadhar) {
      setTimeout(() => { // Simulate API call
        const foundVoter = voterDatabase[aadhar] || Object.values(voterDatabase)[Math.floor(Math.random() * Object.keys(voterDatabase).length)];
        setVoter(foundVoter);
        setLoading(false);
      }, 1000);
    } else {
        setLoading(false);
    }
  }, [aadhar]);

  if (loading) {
    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <div className="flex items-center gap-4">
                    <Skeleton className="h-16 w-16 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-4 w-48" />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-6 w-3/4" />
                </div>
                <Separator />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-6 w-1/2" />
                </div>
                 <Separator />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-6 w-full" />
                </div>
            </CardContent>
            <CardFooter>
                 <Skeleton className="h-10 w-full" />
            </CardFooter>
        </Card>
    );
  }

  if (!aadhar || !voter) {
    return (
      <Card className="w-full max-w-md text-center p-4">
        <CardHeader>
            <div className="mx-auto bg-destructive/10 p-3 rounded-full w-fit">
                <ShieldAlert className="h-10 w-10 text-destructive" />
            </div>
          <CardTitle className="font-headline mt-4">Invalid Request</CardTitle>
          <CardDescription>Aadhar number is missing or invalid. Please start the process again.</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button asChild className="w-full">
            <Link href="/verify">Go Back</Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md animate-in fade-in-50 duration-500">
      <CardHeader>
        <div className="flex items-center gap-4">
            <Image
                src={voter.imageUrl}
                alt="Voter photo"
                width={64}
                height={64}
                className="rounded-full"
                data-ai-hint={voter.sex === 'Male' ? 'man portrait' : 'woman portrait'}
            />
            <div>
                <CardTitle className="font-headline">Voter Details</CardTitle>
                <CardDescription>Please confirm your details before proceeding.</CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-semibold">{voter.name}</p>
            </div>
             <div>
                <p className="text-sm text-muted-foreground">Age</p>
                <p className="font-semibold">{voter.age}</p>
            </div>
        </div>
        <Separator/>
         <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <div>
                <p className="text-sm text-muted-foreground">S/O, W/O</p>
                <p className="font-semibold">{voter.fatherName}</p>
            </div>
             <div>
                <p className="text-sm text-muted-foreground">Sex</p>
                <p className="font-semibold">{voter.sex}</p>
            </div>
        </div>
        <Separator/>
        <div>
             <p className="text-sm text-muted-foreground">Address</p>
             <p className="font-semibold">{voter.address}</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full" size="lg">
          <Link href={`/face-verify?aadhar=${aadhar}`}>OK, Proceed to Vote</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function DetailsPage() {
    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
            <Suspense fallback={<Skeleton className="h-[480px] w-full max-w-md" />}>
                <VoterDetailsContent />
            </Suspense>
        </div>
    )
}
