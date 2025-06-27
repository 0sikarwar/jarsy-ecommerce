import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

export default function OrderSuccessPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12 flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-lg text-center shadow-lg">
        <CardHeader className="items-center">
            <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-full mb-4">
                <CheckCircle2 className="h-12 w-12 text-green-500" />
            </div>
            <CardTitle className="text-3xl font-headline">Order Placed Successfully!</CardTitle>
            <CardDescription className="pt-2 text-lg">
                Thank you for your purchase.
            </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            You will receive an email confirmation shortly. Your imaginary shoes are on their way!
          </p>
          <Button asChild size="lg">
            <Link href="/">Continue Shopping</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
