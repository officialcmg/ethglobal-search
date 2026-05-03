"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { SearchForm } from "@/components/search-form";
import { SearchResults } from "@/components/search-results";
import { Stats } from "@/components/stats";
import { searchProjects, type Project } from "@/lib/ethglobal-api";

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [lastKeyword, setLastKeyword] = useState("");

  const handleSearch = async (params: {
    keyword: string;
    event?: string;
    sponsor?: string;
  }) => {
    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    setLastKeyword(params.keyword);

    try {
      const result = await searchProjects({
        keyword: params.keyword || undefined,
        event: params.event === "all" ? undefined : params.event,
        sponsor: params.sponsor,
        limit: 50,
        include: "description",
      });
      setProjects(result.projects);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to search projects");
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  };

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
                Search across 17,180+ ETHGlobal hackathon projects to see if
                your idea has been explored before, find inspiration, or
                discover opportunities to build something new.
              </p>
            </div>

            <SearchForm onSearch={handleSearch} isLoading={isLoading} />
          </div>
        </section>

        {/* Results Section */}
        <section className="pb-16 px-4">
          <div className="container mx-auto max-w-5xl">
            <SearchResults
              projects={projects}
              isLoading={isLoading}
              error={error}
              hasSearched={hasSearched}
              keyword={lastKeyword}
            />
          </div>
        </section>

        {/* Stats Section - only show if no search yet */}
        {!hasSearched && (
          <section className="pb-16 px-4">
            <div className="container mx-auto">
              <Stats />
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="container mx-auto text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Powered by{" "}
            <a
              href="https://github.com/ethglobal-skills/repo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              ETHGlobal Skills API
            </a>
          </p>
          <p className="text-xs text-muted-foreground">
            10 free requests per minute • $0.05 USDC per request after via x402
          </p>
        </div>
      </footer>
    </div>
  );
}
