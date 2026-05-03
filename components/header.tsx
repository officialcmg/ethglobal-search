import { Github, Hexagon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Hexagon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="font-bold text-foreground">ETHGlobal Search</h1>
            <p className="text-xs text-muted-foreground">
              17,180+ hackathon projects
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://github.com/ethglobal-skills/repo"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="outline"
              size="sm"
              className="border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
            >
              <Github className="h-4 w-4 mr-2" />
              View API
            </Button>
          </a>
        </div>
      </div>
    </header>
  );
}
