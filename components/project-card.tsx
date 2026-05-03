"use client";

import { ExternalLink, Github, Trophy, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { Project } from "@/hooks/use-local-search";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const hasPrizes = project.prizes && project.prizes.length > 0;

  return (
    <Card className="p-5 bg-card border-border hover:border-primary/50 transition-all duration-200 group h-full">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1 flex-1 min-w-0">
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 group/link"
            >
              <h3 className="font-semibold text-foreground group-hover/link:text-primary transition-colors truncate">
                {project.title}
              </h3>
              <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover/link:opacity-100 transition-opacity flex-shrink-0" />
            </a>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {project.tagline}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          {project.event && (
            <span className="flex items-center gap-1.5 px-2 py-1 bg-secondary rounded-md">
              <Calendar className="h-3 w-3" />
              {project.event}
            </span>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-2 py-1 bg-secondary hover:bg-secondary/80 rounded-md transition-colors"
            >
              <Github className="h-3 w-3" />
              GitHub
            </a>
          )}
          {project.live_demo && (
            <a
              href={project.live_demo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-2 py-1 bg-secondary hover:bg-secondary/80 rounded-md transition-colors"
            >
              <ExternalLink className="h-3 w-3" />
              Demo
            </a>
          )}
        </div>

        {hasPrizes && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
            {project.prizes?.slice(0, 2).map((prize, index) => (
              <span
                key={index}
                className="flex items-center gap-1.5 px-2 py-1 bg-primary/10 text-primary text-xs rounded-md truncate max-w-full"
              >
                <Trophy className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{prize.prize_title || prize.name}</span>
              </span>
            ))}
            {project.prizes && project.prizes.length > 2 && (
              <span className="px-2 py-1 bg-secondary text-muted-foreground text-xs rounded-md">
                +{project.prizes.length - 2} more
              </span>
            )}
          </div>
        )}

        {project.description && (
          <p className="text-sm text-muted-foreground pt-2 border-t border-border line-clamp-2">
            {project.description}
          </p>
        )}
      </div>
    </Card>
  );
}
