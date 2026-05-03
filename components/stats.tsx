"use client";

import { Trophy, Calendar, Users, Zap } from "lucide-react";

const stats = [
  {
    icon: Trophy,
    value: "17,180+",
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
    value: "Live",
    label: "API Access",
  },
];

export function Stats() {
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
