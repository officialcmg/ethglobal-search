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
  currentPage: number;
  totalPages: number;
}

const RESULTS_PER_PAGE = 100;

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
    currentPage: 1,
    totalPages: 1,
  });
  
  // Store all filtered results for pagination
  const filteredResultsRef = useRef<Project[]>([]);

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

        // Extract unique events and sort by most recent
        const eventSet = new Set<string>();
        projects.forEach((p) => {
          if (p.event) eventSet.add(p.event);
        });
        // Sort events by extracting year and putting recent first
        const events = Array.from(eventSet).sort((a, b) => {
          // Extract year from event name (e.g., "ETHGlobal Bangkok 2024" -> 2024)
          const yearA = parseInt(a.match(/20\d{2}/)?.[0] || "0");
          const yearB = parseInt(b.match(/20\d{2}/)?.[0] || "0");
          if (yearB !== yearA) return yearB - yearA;
          // If same year, sort alphabetically reversed (later in alphabet = later in year typically)
          return b.localeCompare(a);
        });

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
    (query: string, filters: { event?: string; prizeWinnersOnly?: boolean } = {}, page: number = 1) => {
      if (!fuseRef.current || !projectsRef.current.length) return;

      setState((prev) => ({ ...prev, isLoading: true }));

      // Use setTimeout to prevent blocking UI
      setTimeout(() => {
        let results: Project[];

        if (query && query.trim()) {
          // Fuzzy search with Fuse.js
          const fuseResults = fuseRef.current!.search(query, { limit: 2000 });
          results = fuseResults.map((r) => r.item);
        } else {
          // No query - return all projects (will be filtered)
          results = [...projectsRef.current];
        }

        // Apply event filter
        if (filters.event && filters.event !== "all") {
          results = results.filter((p) => p.event === filters.event);
        }

        // Apply prize winners filter
        if (filters.prizeWinnersOnly) {
          results = results.filter((p) => p.prizes && p.prizes.length > 0);
        }

        // Store all filtered results for pagination
        filteredResultsRef.current = results;
        
        const total = results.length;
        const totalPages = Math.ceil(total / RESULTS_PER_PAGE);
        const startIndex = (page - 1) * RESULTS_PER_PAGE;
        const paginatedResults = results.slice(startIndex, startIndex + RESULTS_PER_PAGE);

        setState((prev) => ({
          ...prev,
          isLoading: false,
          results: paginatedResults,
          totalResults: total,
          currentPage: page,
          totalPages,
        }));
      }, 0);
    },
    []
  );

  // Go to specific page
  const goToPage = useCallback((page: number) => {
    const total = filteredResultsRef.current.length;
    const totalPages = Math.ceil(total / RESULTS_PER_PAGE);
    
    if (page < 1 || page > totalPages) return;
    
    const startIndex = (page - 1) * RESULTS_PER_PAGE;
    const paginatedResults = filteredResultsRef.current.slice(startIndex, startIndex + RESULTS_PER_PAGE);
    
    setState((prev) => ({
      ...prev,
      results: paginatedResults,
      currentPage: page,
    }));
  }, []);

  return {
    ...state,
    search,
    goToPage,
  };
}
