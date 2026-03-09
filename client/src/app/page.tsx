"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Sparkles, Shield, Zap, Target, Globe } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background font-sans">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 bg-nena-atmosphere z-0 opacity-80" />
      
      {/* Navigation */}
      <nav className="relative z-20 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center shadow-nena-glow">
            <span className="text-white font-bold text-xl">N</span>
          </div>
          <span className="text-xl font-bold tracking-tight">NenaSpace</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="text-sm font-medium">Login</Button>
          </Link>
          <Link href="/signup">
            <Button variant="nena" size="sm" className="rounded-full px-5 shadow-lg">Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center px-4 pt-16 pb-24 text-center lg:pt-24 max-w-5xl mx-auto">
        <div className="animate-float-in">
          <Badge variant="outline" className="mb-6 gap-2 border-primary/20 bg-primary/5 text-primary py-1 px-3">
            <Sparkles className="h-3.5 w-3.5" /> Network for Empowerment Narrative & Advocacy
          </Badge>
          <h1 className="mb-8 text-5xl font-extrabold tracking-tight sm:text-7xl lg:text-8xl bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
            Speak Truth. <br />
            <span className="text-primary italic">Spark Change.</span>
          </h1>
          <p className="mx-auto mb-12 max-w-3xl text-lg text-muted-foreground sm:text-xl leading-relaxed">
            Nena is more than a platform; it&apos;s a digital sanctuary built for Africa and the world. 
            We amplify voices, protect stories, and turn community dialogue into measurable impact.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/signup">
              <Button size="lg" variant="nena" className="w-full sm:w-auto px-10 text-lg shadow-nena-deep group">
                Join the Movement <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline" className="w-full sm:w-auto px-10 text-lg rounded-full border-primary/20 hover:bg-primary/5 transition-all">
                Learn Our Story
              </Button>
            </Link>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-6 w-full animate-float-in-delayed">
          <div className="p-8 rounded-2xl bg-card/40 border border-white/5 backdrop-blur-md shadow-xl hover:bg-card/60 transition-all group">
            <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Safe Harbor</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Privacy by design. End-to-end encryption ensures your voice remains yours alone, fostering truth and transformation.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-card/40 border border-white/5 backdrop-blur-md shadow-xl hover:bg-card/60 transition-all group">
            <div className="h-12 w-12 bg-accent/10 rounded-xl flex items-center justify-center mb-6 text-accent group-hover:scale-110 transition-transform">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">AI Synthesis</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Turn talk into action. Our AI transcribes and summarizes community dialogue into actionable policy proposals in minutes.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-card/40 border border-white/5 backdrop-blur-md shadow-xl hover:bg-card/60 transition-all group">
            <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
              <Target className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Real Impact</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Measure what matters. Our engine connects dialogue to outcomes, providing data-driven proof for real-world change.
            </p>
          </div>
        </div>

        {/* Hero Visual Mockup */}
        <div className="mt-28 w-full animate-scale-up">
          <div className="relative aspect-[16/10] sm:aspect-[21/9] rounded-3xl border border-white/10 bg-card/30 shadow-2xl backdrop-blur-lg overflow-hidden p-2">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
            <div className="h-full w-full rounded-2xl border border-white/10 bg-background/40 flex items-center justify-center relative overflow-hidden">
               <div className="absolute top-4 left-6 flex items-center gap-2">
                 <div className="h-3 w-3 rounded-full bg-red-500/50" />
                 <div className="h-3 w-3 rounded-full bg-yellow-500/50" />
                 <div className="h-3 w-3 rounded-full bg-green-500/50" />
               </div>
               <div className="text-center space-y-4">
                  <Globe className="h-16 w-16 mx-auto text-primary/40 animate-pulse" />
                  <p className="text-muted-foreground/40 font-mono text-xs tracking-widest uppercase">NENA Feed Interface Mockup</p>
               </div>
               {/* Decorative floating elements */}
               <div className="absolute bottom-10 right-10 p-4 bg-primary/10 rounded-xl border border-primary/20 backdrop-blur w-48 h-24 animate-float-in" />
               <div className="absolute top-20 right-20 p-4 bg-accent/10 rounded-xl border border-accent/20 backdrop-blur w-32 h-40 animate-float-in-delayed" />
            </div>
            {/* Overlay glow */}
            <div className="absolute -bottom-1/4 -right-1/4 h-1/2 w-1/2 rounded-full bg-primary/20 blur-[120px]" />
            <div className="absolute -top-1/4 -left-1/4 h-1/2 w-1/2 rounded-full bg-accent/20 blur-[120px]" />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-12 px-6 mt-16">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 bg-primary rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-xs">N</span>
              </div>
              <span className="font-bold">NenaSpace</span>
            </div>
            <p className="text-xs text-muted-foreground">© 2026 NENA. Empowering narrartives & advocacy.</p>
          </div>
          
          <div className="flex gap-10 text-sm font-medium">
            <div className="flex flex-col gap-3">
              <span className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Company</span>
              <Link href="#" className="hover:text-primary transition-colors">About Us</Link>
              <Link href="#" className="hover:text-primary transition-colors">Principles</Link>
              <Link href="#" className="hover:text-primary transition-colors">Impact</Link>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Legal</span>
              <Link href="#" className="hover:text-primary transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-primary transition-colors">Terms</Link>
              <Link href="#" className="hover:text-primary transition-colors">Security</Link>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Support</span>
              <Link href="#" className="hover:text-primary transition-colors">Help Center</Link>
              <Link href="#" className="hover:text-primary transition-colors">Contact</Link>
              <Link href="#" className="hover:text-primary transition-colors">Beta Access</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
