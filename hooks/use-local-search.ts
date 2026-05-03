"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Fuse from "fuse.js";

export interface Project {
  title: string;
  tagline?: string;
  description?: string;
  event?: string;
  url?: string;
  github?: string;
  live_demo?: string;
  how_its_made?: string;
  prizes?: { prize_title?: string; prize_image?: string; name?: string }[];
}

interface SearchState {
  isLoading: boolean;
  isInitialized: boolean;
  results: Project[];
  totalResults: number;
  events: string[];
  error: string | null;
  projectCount: number;
}

export function useLocalSearch() {
  const fuseRef = useRef<Fuse<Project> | null>(null);
  const projectsRef = useRef<Project[]>([]);
  const [state, setState] = useState<SearchState>({
    isLoading: true,
    isInitialized: false,
    results: [],
    totalResults: 0,
    events: [],
    error: null,
    projectCount: 0,
  });

  // Initialize Fuse and load data
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch("/projects.json");
        if (!response.ok) throw new Error("Failed to fetch projects");

        const data = await response.json();
        
        // Handle both array and {projects: []} format
        const projects: Project[] = Array.isArray(data) ? data : data.projects || [];
        
        projectsRef.current = projects;

        // Initialize Fuse.js
        fuseRef.current = new Fuse(projects, {
          keys: [
            { name: "title", weight: 0.4 },
            { name: "tagline", weight: 0.3 },
            { name: "description", weight: 0.2 },
            { name: "how_its_made", weight: 0.1 },
          ],
          threshold: 0.4,
          ignoreLocation: true,
          includeScore: true,
          minMatchCharLength: 2,
        });

        // Extract unique events
        const eventSet = new Set<string>();
        projects.forEach((p) => {
          if (p.event) eventSet.add(p.event);
        });
        const events = Array.from(eventSet).sort().reverse();

        setState((prev) => ({
          ...prev,
          isLoading: false,
          isInitialized: true,
          projectCount: projects.length,
          events,
        }));
      } catch (error) {
        console.error("[v0] Failed to load projects:", error);
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: "Failed to load project data. Please refresh the page.",
        }));
      }
    };

    loadData();
  }, []);

  // Search function
  const search = useCallback(
    (query: string, filters: { event?: string } = {}) => {
      if (!fuseRef.current || !projectsRef.current.length) return;

      setState((prev) => ({ ...prev, isLoading: true }));

      // Use setTimeout to prevent blocking UI
      setTimeout(() => {
        let results: Project[];

        if (query && query.trim()) {
          // Fuzzy search with Fuse.js
          const fuseResults = fuseRef.current!.search(query, { limit: 500 });
          results = fuseResults.map((r) => r.item);
        } else {
          // No query - return all projects (will be filtered)
          results = [...projectsRef.current];
        }

        // Apply event filter
        if (filters.event && filters.event !== "all") {
          results = results.filter((p) => p.event === filters.event);
        }

        const total = results.length;
        results = results.slice(0, 100); // Limit to 100 for performance

        setState((prev) => ({
          ...prev,
          isLoading: false,
          results,
          totalResults: total,
        }));
      }, 0);
    },
    []
  );

  return {
    ...state,
    search,
  };
}
