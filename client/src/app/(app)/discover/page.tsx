"use client";

import { useState, useEffect, useCallback } from "react";
import { SearchBar } from "@/components/discover/SearchBar";
import { SearchResults } from "@/components/discover/SearchResults";
import { TrendingTopics } from "@/components/discover/TrendingTopics";
import { discoverService } from "@/services/discover.service";
import { SearchType } from "@/types";
import { cn } from "@/lib/utils";
import { useSearchParams, useRouter } from "next/navigation";

const SEARCH_TYPES: { id: SearchType; label: string }[] = [
  { id: "users", label: "Users" },
  { id: "posts", label: "Posts" },
  { id: "hashtags", label: "Hashtags" },
  { id: "rooms", label: "Rooms" },
];

export default function DiscoverPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const initialQuery = searchParams.get("query") || "";
  const initialType = (searchParams.get("type") as SearchType) || "users";

  const [query, setQuery] = useState(initialQuery);
  const [activeType, setActiveType] = useState<SearchType>(initialType);
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = useCallback(async (searchQuery: string, type: SearchType) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const data = await discoverService.search(searchQuery, type);
      setResults(data || []);
    } catch (error) {
      console.error("Search failed:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(query, activeType);
      
      // Update URL without refreshing
      const params = new URLSearchParams();
      if (query) params.set("query", query);
      params.set("type", activeType);
      router.replace(`/discover?${params.toString()}`, { scroll: false });
    }, 500);

    return () => clearTimeout(timer);
  }, [query, activeType, handleSearch, router]);

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header & Search */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b p-4 md:p-6 space-y-6">
        <div className="max-w-4xl mx-auto w-full space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h1 className="text-2xl font-bold tracking-tight">Discover</h1>
            <div className="w-full md:w-96">
              <SearchBar 
                value={query} 
                onChange={setQuery} 
                placeholder={`Search for ${activeType}...`}
              />
            </div>
          </div>

          {/* Custom Tabs */}
          <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-lg w-fit">
            {SEARCH_TYPES.map((type) => (
              <button
                key={type.id}
                onClick={() => setActiveType(type.id)}
                className={cn(
                  "px-4 py-1.5 text-sm font-medium rounded-md transition-all",
                  activeType === type.id
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Results Area */}
          <div className="lg:col-span-3">
            {!query.trim() ? (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary h-8 w-8"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold">Start exploring</h2>
                  <p className="text-muted-foreground max-w-xs">
                    Search for people, posts, hashtags, or rooms to see what's happening.
                  </p>
                </div>
              </div>
            ) : (
              <SearchResults 
                results={results} 
                type={activeType} 
                isLoading={isLoading} 
              />
            )}
          </div>

          {/* Sidebar - Desktop Only */}
          <div className="hidden lg:block space-y-6">
            <TrendingTopics />
            <div className="p-5 rounded-xl border bg-card/50 space-y-3">
              <h3 className="font-semibold text-sm">Suggestions</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Connect with people sharing your interests or join rooms that match your vibe.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
