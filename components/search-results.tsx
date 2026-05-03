"use client";

import { ProjectCard } from "./project-card";
import type { Project } from "@/hooks/use-local-search";
import { Search, Frown, Loader2, Database, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SearchResultsProps {
  projects: Project[];
  totalResults: number;
  isLoading: boolean;
  isInitializing: boolean;
  error: string | null;
  hasSearched: boolean;
  keyword: string;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function SearchResults({
  projects,
  totalResults,
  isLoading,
  isInitializing,
  error,
  hasSearched,
  keyword,
  currentPage,
  totalPages,
  onPageChange,
}: SearchResultsProps) {
  if (isInitializing) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="relative">
          <Database className="h-12 w-12 text-primary animate-pulse" />
          <Loader2 className="h-6 w-6 animate-spin text-primary absolute -bottom-1 -right-1" />
        </div>
        <div className="text-center space-y-2">
          <p className="text-foreground font-medium">Loading project database...</p>
          <p className="text-muted-foreground text-sm">
            Downloading 17,180+ projects for local search
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">
          Searching projects...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="p-4 bg-destructive/10 rounded-full">
          <Frown className="h-8 w-8 text-destructive" />
        </div>
        <p className="text-destructive font-medium">{error}</p>
        <p className="text-muted-foreground text-sm">
          Try refreshing the page
        </p>
      </div>
    );
  }

  if (!hasSearched) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-6">
        <div className="p-6 bg-secondary rounded-full">
          <Search className="h-12 w-12 text-muted-foreground" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold text-foreground">
            Search past projects
          </h3>
          <p className="text-muted-foreground max-w-md">
            Enter your idea above to see if something similar has been built at
            an ETHGlobal hackathon before
          </p>
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-6">
        <div className="p-6 bg-primary/10 rounded-full">
          <span className="text-4xl">🎉</span>
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold text-foreground">
            No similar projects found!
          </h3>
          <p className="text-muted-foreground max-w-md">
            Your idea for &quot;{keyword}&quot; appears to be unique. This could
            be a great opportunity to build something new!
          </p>
        </div>
      </div>
    );
  }

  const startResult = (currentPage - 1) * 100 + 1;
  const endResult = Math.min(currentPage * 100, totalResults);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <p className="text-muted-foreground">
          Found{" "}
          <span className="text-foreground font-semibold">
            {totalResults.toLocaleString()}
          </span>{" "}
          {totalResults === 1 ? "project" : "projects"}
          {keyword && (
            <>
              {" "}
              for &quot;<span className="text-primary">{keyword}</span>&quot;
            </>
          )}
          {totalPages > 1 && (
            <span className="text-muted-foreground/70">
              {" "}(showing {startResult}-{endResult})
            </span>
          )}
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((project, index) => (
          <ProjectCard key={`${project.url}-${index}`} project={project} />
        ))}
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="border-border"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          
          <div className="flex items-center gap-1">
            {/* Show page numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((page) => {
                // Show first, last, current, and pages around current
                return (
                  page === 1 ||
                  page === totalPages ||
                  Math.abs(page - currentPage) <= 1
                );
              })
              .reduce<(number | "...")[]>((acc, page, idx, arr) => {
                // Add ellipsis between gaps
                if (idx > 0 && page - (arr[idx - 1] as number) > 1) {
                  acc.push("...");
                }
                acc.push(page);
                return acc;
              }, [])
              .map((page, idx) =>
                page === "..." ? (
                  <span key={`ellipsis-${idx}`} className="px-2 text-muted-foreground">
                    ...
                  </span>
                ) : (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => onPageChange(page)}
                    className={currentPage === page ? "bg-primary" : "border-border"}
                  >
                    {page}
                  </Button>
                )
              )}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="border-border"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}
