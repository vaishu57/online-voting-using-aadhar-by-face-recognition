"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function ForgotPasswordRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/auth");
  }, [router]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <div className="flex flex-col items-center gap-4 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-muted-foreground">Redirecting...</p>
      </div>
    </div>
  );
}
