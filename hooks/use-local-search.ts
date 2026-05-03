"use client";

import { useState, useEffect, useRef, useCallback } from "react";

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
  const workerRef = useRef<Worker | null>(null);
  const [state, setState] = useState<SearchState>({
    isLoading: true,
    isInitialized: false,
    results: [],
    totalResults: 0,
    events: [],
    error: null,
    projectCount: 0,
  });

  // Initialize worker and load data
  useEffect(() => {
    // Create worker
    workerRef.current = new Worker("/search-worker.js");

    // Handle messages from worker
    workerRef.current.onmessage = (e) => {
      const { type, payload } = e.data;

      switch (type) {
        case "INIT_COMPLETE":
          setState((prev) => ({
            ...prev,
            isLoading: false,
            isInitialized: true,
            projectCount: payload,
          }));
          // Get events after initialization
          workerRef.current?.postMessage({ type: "GET_EVENTS" });
          break;

        case "SEARCH_RESULTS":
          setState((prev) => ({
            ...prev,
            isLoading: false,
            results: payload.results,
            totalResults: payload.total,
          }));
          break;

        case "EVENTS":
          setState((prev) => ({
            ...prev,
            events: payload,
          }));
          break;
      }
    };

    workerRef.current.onerror = (error) => {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Failed to initialize search. Please refresh the page.",
      }));
      console.error("Worker error:", error);
    };

    // Fetch and load projects data
    const loadData = async () => {
      try {
        const response = await fetch("/projects.json");
        if (!response.ok) throw new Error("Failed to fetch projects");

        const data = await response.json();
        workerRef.current?.postMessage({ type: "INIT", payload: data });
      } catch (error) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: "Failed to load project data. Please refresh the page.",
        }));
        console.error("Failed to load projects:", error);
      }
    };

    loadData();

    // Cleanup
    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  // Search function
  const search = useCallback(
    (query: string, filters: { event?: string } = {}) => {
      if (!workerRef.current || !state.isInitialized) return;

      setState((prev) => ({ ...prev, isLoading: true }));
      workerRef.current.postMessage({
        type: "SEARCH",
        payload: { query, filters },
      });
    },
    [state.isInitialized]
  );

  return {
    ...state,
    search,
  };
}
