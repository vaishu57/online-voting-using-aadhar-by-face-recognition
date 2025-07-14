import { cn } from "@/lib/utils";

const SymbolWrapper = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={cn("flex h-24 w-24 items-center justify-center", className)}>
        {children}
    </div>
);

export const LotusSymbol = () => (
    <SymbolWrapper className="text-primary">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5.5C12 5.5 12 2 15 2C18 2 18 5.5 18 5.5C18 5.5 18 9 12 9C6 9 6 5.5 6 5.5C6 5.5 6 2 9 2C12 2 12 5.5 12 5.5Z" />
            <path d="M12 9C12 9 12.5 13 16 14.5C19.5 16 20.5 22 20.5 22" />
            <path d="M12 9C12 9 11.5 13 8 14.5C4.5 16 3.5 22 3.5 22" />
        </svg>
    </SymbolWrapper>
);

export const HandSymbol = () => (
    <SymbolWrapper className="text-blue-400">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"/>
            <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2"/>
            <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"/>
            <path d="M18 8a2 2 0 1 0 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.5-2L4.5 12.5a2 2 0 0 1 0-3l1.2-1.2c.5-.5 1.2-.8 2-.8H18Z"/>
        </svg>
    </SymbolWrapper>
);

export const BroomSymbol = () => (
    <SymbolWrapper className="text-gray-400">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 10.5L13.5 3H12" />
            <path d="M17.5 15l-4.5-4.5" />
            <path d="M21 21l-7.5-7.5" />
            <path d="M13.5 3L2 14.5" />
            <path d="M2 14.5L9.5 22" />
        </svg>
    </SymbolWrapper>
);

export const ElephantSymbol = () => (
    <SymbolWrapper className="text-purple-400">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 12.5C20 15.5 17 17 17 17H15C13 17 11 15 11 12.5C11 10 13 7 15 7H16C18 7 20 10 20 12.5Z"/>
            <path d="M15 17H7C4.5 17 3.5 15 3.5 13C3.5 11 4.5 9 7 9H11"/>
            <path d="M7 9V6C7 4.5 8 3 9.5 3C11 3 12 4.5 12 6V9"/>
            <path d="M11 12.5C11 12.5 10 18 7 21"/>
            <path d="M17 17C17 17 18 20 20 21"/>
        </svg>
    </SymbolWrapper>
);

export const StarSymbol = () => (
    <SymbolWrapper className="text-red-500">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
    </SymbolWrapper>
);
