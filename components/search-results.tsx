"use client";

import { ProjectCard } from "./project-card";
import type { Project } from "@/lib/ethglobal-api";
import { Search, Frown, Loader2 } from "lucide-react";

interface SearchResultsProps {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  hasSearched: boolean;
  keyword: string;
}

export function SearchResults({
  projects,
  isLoading,
  error,
  hasSearched,
  keyword,
}: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">
          Searching 17,180+ hackathon projects...
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
          Try again in a moment or adjust your search
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          Found{" "}
          <span className="text-foreground font-semibold">
            {projects.length}
          </span>{" "}
          similar {projects.length === 1 ? "project" : "projects"}
          {keyword && (
            <>
              {" "}
              for &quot;<span className="text-primary">{keyword}</span>&quot;
            </>
          )}
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((project, index) => (
          <ProjectCard key={`${project.url}-${index}`} project={project} />
        ))}
      </div>
    </div>
  );
}
