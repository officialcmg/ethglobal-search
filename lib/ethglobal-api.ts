export interface Project {
  title: string;
  url: string;
  tagline: string;
  github?: string;
  live_demo?: string;
  hackathon: string;
  prizes_won?: string[];
  description?: string;
  how_its_made?: string;
}

export interface ProjectsResponse {
  projects: Project[];
}

export async function searchProjects(params: {
  keyword?: string;
  event?: string;
  sponsor?: string;
  prize?: string;
  limit?: number;
  include?: string;
}): Promise<ProjectsResponse> {
  const searchParams = new URLSearchParams();
  
  if (params.keyword) searchParams.set("keyword", params.keyword);
  if (params.event) searchParams.set("event", params.event);
  if (params.sponsor) searchParams.set("sponsor", params.sponsor);
  if (params.prize) searchParams.set("prize", params.prize);
  if (params.limit) searchParams.set("limit", params.limit.toString());
  if (params.include) searchParams.set("include", params.include);

  // Use local API route to avoid CORS issues
  const response = await fetch(`/api/search?${searchParams.toString()}`);
  
  if (!response.ok) {
    if (response.status === 402) {
      throw new Error("Rate limit exceeded. The API allows 10 free requests per minute.");
    }
    throw new Error(`API error: ${response.status}`);
  }
  
  return response.json();
}

export const EVENTS = [
  "ETHGlobal Mumbai",
  "ETHGlobal Tokyo 2026",
  "ETHOnline 2026",
  "ETHGlobal Lisbon 2026",
  "ETHGlobal New York 2026",
  "Open Agents",
  "ETHGlobal Cannes 2026",
  "HackMoney 2026",
  "ETHGlobal Buenos Aires",
  "ETHOnline 2025",
  "ETHGlobal New Delhi",
  "ETHGlobal New York 2025",
  "Unite Defi",
  "ETHGlobal Cannes",
  "ETHGlobal Prague",
  "ETHGlobal Taipei",
  "ETHGlobal Trifecta",
  "Agentic Ethereum",
  "ETHGlobal Bangkok",
  "ETHGlobal San Francisco",
  "ETHGlobal Singapore",
  "ETHOnline 2024",
  "Superhack 2024",
  "ETHGlobal Brussels",
  "StarkHack",
  "HackFS 2024",
  "ETHGlobal Sydney",
  "Scaling Ethereum 2024",
  "Frameworks",
  "ETHGlobal London",
  "Circuit Breaker",
  "LFGHO",
  "ETHIndia 2023",
  "ETHGlobal Istanbul",
  "ETHOnline 2023",
  "ETHGlobal New York",
  "Superhack",
  "ETHGlobal Paris",
  "ETHGlobal Waterloo",
  "HackFS 2023",
  "Autonomous Worlds",
  "ETHGlobal Lisbon",
  "ETHGlobal Tokyo",
  "Scaling Ethereum 2023",
  "FVM Space Warp",
  "ETHIndia 2022",
  "Hack FEVM",
  "ETHSanFrancisco 2022",
  "ETHBogotá",
  "ETHOnline 2022",
  "ETHMexico",
  "Metabolism",
  "HackFS 2022",
  "ETHNewYork 2022",
  "HackMoney 2022",
  "ETHAmsterdam",
  "DAOHacks",
  "LFGrow",
  "BuildQuest",
  "Road to Web3",
  "NFTHack 2022",
  "Web3Jam",
  "UniCode",
  "ETHOnline 2021",
  "HackFS 2021",
  "HackMoney 2021",
  "Web3 Weekend",
  "Scaling Ethereum",
  "NFTHack",
  "MarketMake",
  "ETHOnline",
  "HackFS",
  "HackMoney",
  "ETHLondonUK",
  "ETHWaterloo 2019",
  "ETHBoston",
  "ETHNewYork",
  "ETHCapeTown",
  "ETHParis",
  "ETHSingapore",
  "ETHSanFrancisco",
  "ETHWaterloo",
];
