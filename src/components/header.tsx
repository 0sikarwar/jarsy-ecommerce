import Link from 'next/link';
import { Button } from './ui/button';
import { Footprints, User } from 'lucide-react';
import { CartSheet } from './cart-sheet';

export function Header() {
    return (
        <header className="container mx-auto px-4 py-4 sticky top-0 bg-background/80 backdrop-blur-sm z-40 border-b">
            <div className="flex justify-between items-center">
                <Link href="/" className="flex items-center gap-2">
                    <Footprints className="h-6 w-6 text-primary" />
                    <span className="font-headline text-2xl font-bold tracking-tight">
                        Sole Central
                    </span>
                </Link>
                <nav className="flex items-center gap-4">
                    <CartSheet />
                    <Button asChild variant="ghost" size="icon">
                        <Link href="/account">
                            <User className="h-5 w-5" />
                            <span className="sr-only">Account</span>
                        </Link>
                    </Button>
                </nav>
            </div>
        </header>
    );
}
