"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { SearchForm } from "@/components/search-form";
import { SearchResults } from "@/components/search-results";
import { Stats } from "@/components/stats";
import { useLocalSearch, type Project } from "@/hooks/use-local-search";

export default function Home() {
  const {
    isLoading: isInitializing,
    isInitialized,
    results,
    totalResults,
    events,
    error: initError,
    projectCount,
    search,
  } = useLocalSearch();

  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [lastKeyword, setLastKeyword] = useState("");

  const handleSearch = (params: {
    keyword: string;
    event?: string;
  }) => {
    if (!isInitialized) return;
    
    setIsSearching(true);
    setHasSearched(true);
    setLastKeyword(params.keyword);
    
    search(params.keyword, { event: params.event });
  };

  // Stop searching state when results come in
  useEffect(() => {
    if (hasSearched && !isInitializing) {
      setIsSearching(false);
    }
  }, [results, isInitializing, hasSearched]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 md:py-24 px-4">
          <div className="container mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground text-balance">
                Has it been{" "}
                <span className="text-primary">built before?</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
                Search across {projectCount > 0 ? projectCount.toLocaleString() : "17,180"}+ ETHGlobal hackathon projects to see if
                your idea has been explored before, find inspiration, or
                discover opportunities to build something new.
              </p>
            </div>

            <SearchForm 
              onSearch={handleSearch} 
              isLoading={isSearching || isInitializing}
              isInitializing={isInitializing}
              events={events}
            />
          </div>
        </section>

        {/* Results Section */}
        <section className="pb-16 px-4">
          <div className="container mx-auto max-w-5xl">
            <SearchResults
              projects={results}
              totalResults={totalResults}
              isLoading={isSearching}
              isInitializing={isInitializing}
              error={initError}
              hasSearched={hasSearched}
              keyword={lastKeyword}
            />
          </div>
        </section>

        {/* Stats Section - only show if no search yet */}
        {!hasSearched && !isInitializing && (
          <section className="pb-16 px-4">
            <div className="container mx-auto">
              <Stats projectCount={projectCount} />
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="container mx-auto text-center space-y-3">
          <p className="text-sm text-muted-foreground">
            Data sourced from{" "}
            <a
              href="https://github.com/ethglobal-skills/repo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              ETHGlobal Skills
            </a>
          </p>
          <p className="text-xs text-muted-foreground/60">
            Searching locally - no API rate limits
          </p>
        </div>
      </footer>
    </div>
  );
}
