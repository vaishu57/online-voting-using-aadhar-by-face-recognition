"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState, useRef } from "react";
import { ShieldAlert, Camera, CheckCircle, ArrowRight, Loader2 } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { voterDatabase } from "@/lib/voter-db";
import { verifyFace } from "@/ai/flows/verify-face-flow";

function FaceVerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const aadhar = searchParams.get("aadhar");
  
  const [voter, setVoter] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!aadhar) {
      router.replace('/verify');
      return;
    }
    // Simulate fetching voter data
    setTimeout(() => {
        const foundVoter = voterDatabase[aadhar] || Object.values(voterDatabase)[Math.floor(Math.random() * Object.keys(voterDatabase).length)];
        setVoter(foundVoter);
        setLoading(false);
    }, 500);
  }, [aadhar, router]);
  
  useEffect(() => {
    const getCameraPermission = async () => {
      if (typeof window !== 'undefined' && navigator.mediaDevices) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          setHasCameraPermission(true);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error('Error accessing camera:', error);
          setHasCameraPermission(false);
          toast({
            variant: "destructive",
            title: "Camera Access Denied",
            description: "Please enable camera permissions in your browser settings to use this feature.",
          });
        }
      } else {
        setHasCameraPermission(false);
        toast({
            variant: "destructive",
            title: "Camera Not Supported",
            description: "Your browser does not support camera access or a camera was not found.",
        });
      }
    };
    getCameraPermission();

    return () => {
        // Stop camera stream when component unmounts
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
    }
  }, [toast]);

  const captureFrameAsDataUri = (): string | null => {
    if (videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const context = canvas.getContext('2d');
        if (context) {
            context.translate(canvas.width, 0);
            context.scale(-1, 1);
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            return canvas.toDataURL('image/jpeg');
        }
    }
    return null;
  };

  const handleVerification = async () => {
    setIsVerifying(true);
    
    const liveImageDatUri = captureFrameAsDataUri();

    if (!liveImageDatUri || !voter?.imageUrl) {
        toast({
            variant: "destructive",
            title: "Verification Error",
            description: "Could not capture image from camera or find profile picture.",
        });
        setIsVerifying(false);
        return;
    }

    try {
        const result = await verifyFace({
            profileImageUrl: voter.imageUrl,
            liveImageDatUri: liveImageDatUri,
        });

        if (result.isMatch) {
            setIsVerified(true);
            toast({
                title: "Verification Successful",
                description: "Face matched successfully. Proceeding to vote.",
            });
            setTimeout(() => {
                if (aadhar) {
                    router.push(`/vote?aadhar=${aadhar}`);
                }
            }, 1500);
        } else {
            toast({
                variant: "destructive",
                title: "Verification Failed",
                description: result.reason || "Faces do not match. Please try again.",
            });
            setIsVerifying(false);
        }
    } catch (error) {
        console.error("Face verification failed:", error);
        toast({
            variant: "destructive",
            title: "Verification Error",
            description: "An unexpected error occurred during face verification. Please try again.",
        });
        setIsVerifying(false);
    }
  };
  
  if (loading) {
    return <Skeleton className="w-full max-w-2xl h-[550px]" />;
  }

  if (!voter) {
    return (
      <Card className="w-full max-w-md text-center p-4">
        <CardHeader>
          <div className="mx-auto bg-destructive/10 p-3 rounded-full w-fit">
            <ShieldAlert className="h-10 w-10 text-destructive" />
          </div>
          <CardTitle className="font-headline mt-4">Invalid Voter</CardTitle>
          <CardDescription>Could not find voter details. Please start again.</CardDescription>
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
    <Card className="w-full max-w-2xl animate-in fade-in-50 duration-500">
      <CardHeader>
        <CardTitle className="font-headline text-center text-2xl">Face Verification</CardTitle>
        <CardDescription className="text-center">Please align your face with the camera to match your profile picture.</CardDescription>
      </CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-8 items-center py-8">
        <div className="flex flex-col items-center gap-4">
          <p className="font-semibold text-muted-foreground">Profile Picture</p>
          <Image
            src={voter.imageUrl}
            alt="Voter photo"
            width={200}
            height={200}
            className="rounded-lg border-4 border-muted"
            data-ai-hint={voter.sex === 'Male' ? 'man portrait' : 'woman portrait'}
          />
        </div>
        <div className="flex flex-col items-center gap-4">
          <p className="font-semibold text-muted-foreground">Live Camera</p>
          <div className="w-[200px] h-[200px] bg-muted rounded-lg flex items-center justify-center relative overflow-hidden border-4 border-primary">
            <video ref={videoRef} className="w-full h-full object-cover scale-x-[-1]" autoPlay muted playsInline />
            {hasCameraPermission === false && (
                <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center text-center p-4">
                    <Camera className="h-10 w-10 text-destructive mb-2" />
                    <p className="text-sm text-destructive-foreground">Camera access is required.</p>
                </div>
            )}
             {isVerified && (
                <div className="absolute inset-0 bg-green-500/80 flex items-center justify-center">
                    <CheckCircle className="h-16 w-16 text-white" />
                </div>
            )}
            {isVerifying && (
                <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center text-center p-4">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    <p className="text-sm mt-2 text-primary">Verifying...</p>
                </div>
            )}
          </div>
        </div>
      </CardContent>
      <canvas ref={canvasRef} className="hidden" />
      <CardFooter className="flex-col gap-4 pt-6">
        {hasCameraPermission === false && (
            <Alert variant="destructive">
                <Camera className="h-4 w-4" />
                <AlertTitle>Camera Access Denied</AlertTitle>
                <AlertDescription>
                   Please allow camera access in your browser settings to use this feature.
                </AlertDescription>
            </Alert>
        )}
        <Button 
            className="w-full" 
            size="lg"
            onClick={handleVerification}
            disabled={hasCameraPermission !== true || isVerifying || isVerified}
            suppressHydrationWarning
        >
            {isVerifying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isVerifying ? 'Verifying...' : isVerified ? 'Verified' : 'Verify & Proceed'}
            {!isVerifying && !isVerified && <ArrowRight className="ml-2 h-5 w-5" />}
        </Button>
         <Button asChild variant="outline" className="w-full" disabled={isVerifying || isVerified}>
            <Link href={`/details?aadhar=${aadhar}`}>Back to Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}


export default function FaceVerifyPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <Suspense fallback={<Skeleton className="h-[550px] w-full max-w-2xl" />}>
        <FaceVerifyContent />
      </Suspense>
    </div>
  )
}
