import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-center px-4">
      <h1 className="text-9xl font-extrabold text-primary/20">404</h1>
      <div className="absolute">
        <h2 className="text-2xl font-bold sm:text-3xl">Page Not Found</h2>
        <p className="mt-2 text-muted-foreground">Oops! The page you are looking for doesn&apos;t exist.</p>
        <Link href="/">
          <Button variant="nena" className="mt-8 px-8">
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
