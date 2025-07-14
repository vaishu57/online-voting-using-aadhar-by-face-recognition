"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

function ConfirmationContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const partyName = searchParams.get("party");
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (!partyName) {
            router.replace('/');
            return;
        }

        const timer = setTimeout(() => {
            router.replace('/');
        }, 5000);

        const interval = setInterval(() => {
            setProgress(prev => Math.min(prev + 2, 100));
        }, 100);

        return () => {
            clearTimeout(timer);
            clearInterval(interval);
        };
    }, [router, partyName]);

    if (!partyName) {
        return <Skeleton className="w-full max-w-md h-64" />;
    }
    
    return (
        <Card className="w-full max-w-md animate-in fade-in-50 duration-500">
            <CardHeader className="items-center text-center p-8">
                <CheckCircle2 className="h-16 w-16 text-green-500" />
            </CardHeader>
            <CardContent className="text-center pb-8">
                <h1 className="text-2xl font-bold font-headline">Vote Cast Successfully!</h1>
                <p className="mt-2 text-muted-foreground">
                    You have successfully voted for <span className="font-semibold text-primary">{partyName}</span>.
                </p>
                <div className="mt-8">
                    <Progress value={progress} className="w-full" />
                    <p className="mt-2 text-sm text-muted-foreground">Redirecting to homepage...</p>
                </div>
            </CardContent>
        </Card>
    );
}

export default function ConfirmationPage() {
    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
            <Suspense fallback={<Skeleton className="h-64 w-full max-w-md" />}>
                <ConfirmationContent />
            </Suspense>
        </div>
    );
}
