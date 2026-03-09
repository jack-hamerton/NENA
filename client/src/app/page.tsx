import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 bg-nena-atmosphere z-0" />
      
      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center px-4 pt-24 pb-16 text-center lg:pt-32">
        <div className="animate-float-in opacity-0">
          <Badge variant="outline" className="mb-4 gap-2 border-primary/20 bg-primary/5 text-primary">
            <Sparkles className="h-3 w-3" /> Now in Beta
          </Badge>
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
            Empowering <span className="text-primary">Creativity</span> & <br className="hidden sm:block" />
            Connecting Communities
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Join NENA, the ultimate destination for visual artists and designers. 
            Share your work, host live rooms, and grow your audience in a community built for you.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/signup">
              <Button size="lg" variant="nena" className="w-full px-8 text-base">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="w-full px-8 text-base rounded-full">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Hero Visual Stub */}
        <div className="mt-20 w-full max-w-5xl px-4 animate-scale-up opacity-0">
          <div className="relative aspect-[16/9] rounded-2xl border border-white/10 bg-card/50 shadow-2xl backdrop-blur-sm overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/20 font-bold text-4xl uppercase tracking-widest bg-gradient-to-br from-primary/5 to-accent/5">
              NENA Feed Mockup
            </div>
            {/* Overlay glow */}
            <div className="absolute -bottom-1/4 -right-1/4 h-1/2 w-1/2 rounded-full bg-primary/20 blur-[120px]" />
            <div className="absolute -top-1/4 -left-1/4 h-1/2 w-1/2 rounded-full bg-accent/20 blur-[120px]" />
          </div>
        </div>
      </main>

      {/* Footer Stub */}
      <footer className="relative z-10 border-t border-white/5 py-12 px-4">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-xl font-bold text-primary">NENA</div>
          <div className="flex gap-8 text-sm text-muted-foreground font-medium">
            <Link href="#" className="hover:text-primary transition-colors">About</Link>
            <Link href="#" className="hover:text-primary transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-primary transition-colors">Terms</Link>
            <Link href="#" className="hover:text-primary transition-colors">Support</Link>
          </div>
          <p className="text-xs text-muted-foreground">© 2024 NENA. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
