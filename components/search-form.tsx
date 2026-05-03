"use client";

import { useState } from "react";
import { Search, Sparkles, Filter, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SearchFormProps {
  onSearch: (params: {
    keyword: string;
    event?: string;
  }) => void;
  isLoading?: boolean;
  isInitializing?: boolean;
  events?: string[];
}

export function SearchForm({ onSearch, isLoading, isInitializing, events = [] }: SearchFormProps) {
  const [keyword, setKeyword] = useState("");
  const [event, setEvent] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isInitializing) return;
    onSearch({
      keyword: keyword.trim(),
      event: event || undefined,
    });
  };

  const handleQuickSearch = (query: string) => {
    if (isInitializing) return;
    setKeyword(query);
    onSearch({ keyword: query, event: event || undefined });
  };

  const quickSearches = [
    "AI agent",
    "wallet abstraction",
    "NFT marketplace",
    "DeFi lending",
    "ZK proof",
    "cross-chain bridge",
    "DAO governance",
    "identity verification",
  ];

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder={isInitializing ? "Loading project database..." : "Describe your idea... e.g. 'AI agent for DeFi trading'"}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            disabled={isInitializing}
            className="pl-12 pr-24 h-14 text-base bg-card border-border focus-visible:ring-primary"
          />
          <Button
            type="submit"
            disabled={isLoading || isInitializing}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {isInitializing ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading
              </span>
            ) : isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Searching
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Search
              </span>
            )}
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            disabled={isInitializing}
            className="text-muted-foreground border-border hover:bg-secondary"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {event && (
              <span className="ml-2 px-1.5 py-0.5 bg-primary/20 text-primary rounded text-xs">
                1
              </span>
            )}
          </Button>
          {event && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setEvent("")}
              className="text-muted-foreground"
            >
              <X className="h-4 w-4 mr-1" />
              Clear filters
            </Button>
          )}
        </div>

        {showFilters && (
          <div className="p-4 bg-card border border-border rounded-lg space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Filter by Event
              </label>
              <Select value={event} onValueChange={setEvent}>
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue placeholder="All events" />
                </SelectTrigger>
                <SelectContent className="max-h-64">
                  <SelectItem value="all">All events</SelectItem>
                  {events.map((e) => (
                    <SelectItem key={e} value={e}>
                      {e}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </form>

      <div className="flex flex-wrap gap-2">
        <span className="text-sm text-muted-foreground py-1">Try:</span>
        {quickSearches.map((query) => (
          <button
            key={query}
            onClick={() => handleQuickSearch(query)}
            disabled={isLoading || isInitializing}
            className="px-3 py-1 text-sm bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-full transition-colors border border-border hover:border-primary/50 disabled:opacity-50"
          >
            {query}
          </button>
        ))}
      </div>
    </div>
  );
}
