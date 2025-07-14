import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: 'Indian Online Voting System using Aadhar',
  description: 'A secure and modern online voting system with Aadhar verification.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans ${inter.variable} antialiased relative overflow-x-hidden`}>
        <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden">
            <div className="absolute top-[-20%] left-[-20%] w-[50vw] h-[50vw] bg-primary/20 rounded-full blur-3xl animate-pulse opacity-30"></div>
            <div className="absolute top-[-20%] left-[-20%] w-[50vw] h-[50vw] bg-primary/10 rounded-full blur-3xl animate-pulse opacity-30"></div>
            <div className="absolute bottom-[-20%] right-[-20%] w-[40vw] h-[40vw] bg-blue-500/20 rounded-full blur-3xl animate-pulse opacity-30 animation-delay-4000"></div>
            <div className="absolute top-[30%] right-[10%] w-[30vw] h-[30vw] bg-purple-500/20 rounded-full blur-3xl animate-pulse opacity-30 animation-delay-2000"></div>
            <div className="absolute top-[30%] right-[10%] w-[30vw] h-[30vw] bg-purple-500/10 rounded-full blur-3xl animate-pulse opacity-30 animation-delay-2000"></div>
        </div>
        <div className="relative z-10">
            {children}
        </div>
        <Toaster />
      </body>
    </html>
  );
}
