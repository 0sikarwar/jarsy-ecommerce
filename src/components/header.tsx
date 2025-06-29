
"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { Footprints, User, LogIn, LogOut } from 'lucide-react';
import { CartSheet } from './cart-sheet';
import { useCustomer } from '@/hooks/use-customer';
import { logoutAction } from '@/lib/actions/customer';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Skeleton } from './ui/skeleton';

export function Header() {
  const { customer, isLoading, refetchCustomer } = useCustomer();
  const { toast } = useToast();
  const router = useRouter();

  const handleLogout = async () => {
    await logoutAction();
    await refetchCustomer();
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
    });
    router.push('/');
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

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
          {isLoading ? (
            <Skeleton className="h-10 w-10 rounded-full" />
          ) : customer ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button asChild variant="ghost" size="icon">
                  <Avatar className="h-10 w-10 cursor-pointer">
                    <AvatarImage src="https://placehold.co/128x128.png" alt="User avatar" data-ai-hint="avatar person"/>
                    <AvatarFallback>{getInitials(customer.first_name, customer.last_name)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <p className="font-semibold">{customer.first_name} {customer.last_name}</p>
                  <p className="text-xs text-muted-foreground font-normal">{customer.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/account">
                    <User className="mr-2 h-4 w-4" />
                    <span>My Account</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="outline">
              <Link href="/login">
                <LogIn className="mr-2 h-4 w-4" /> Login
              </Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
