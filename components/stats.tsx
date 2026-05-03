"use client";

import { Trophy, Calendar, Users, Zap } from "lucide-react";

interface StatsProps {
  projectCount?: number;
}

export function Stats({ projectCount = 17180 }: StatsProps) {
  const stats = [
    {
      icon: Trophy,
      value: projectCount > 0 ? projectCount.toLocaleString() : "17,180+",
      label: "Projects",
    },
    {
      icon: Calendar,
      value: "6 Years",
      label: "Of Hackathons",
    },
    {
      icon: Users,
      value: "80+",
      label: "Events",
    },
    {
      icon: Zap,
      value: "Instant",
      label: "Local Search",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex flex-col items-center p-4 bg-card border border-border rounded-lg"
        >
          <stat.icon className="h-5 w-5 text-primary mb-2" />
          <span className="text-xl font-bold text-foreground">{stat.value}</span>
          <span className="text-xs text-muted-foreground">{stat.label}</span>
        </div>
      ))}
    </div>
  );
}
