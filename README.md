# ETHGlobal Search

A frontend app that lets ETHGlobal hackathon participants search through **17,180+ past hackathon projects** to check if their idea has already been built before.

## Features

- **Full-text search** across 6 years of ETHGlobal hackathon projects
- **Filter by event** (ETHGlobal Bangkok, San Francisco, Brussels, etc.)
- **Quick search tags** for popular topics (AI agents, wallet abstraction, ZK proofs, etc.)
- **Project details** including descriptions, GitHub links, demos, and prizes won
- **Finalist/winner badges** to identify successful projects

## How It Works

This app uses the [ETHGlobal Skills API](https://github.com/ethglobal-skills/repo) to search through hackathon project data.

### Data Source

The ETHGlobal Skills repo maintains a curated database of:
- 17,180+ hackathon projects from the past 6 years
- 80+ ETHGlobal events worldwide
- Sponsor docs and bounties for upcoming hacks
- All Finalist and bounty winners

The data is collected and indexed from ETHGlobal's hackathon submission platform, making it searchable via REST API endpoints.

### API Endpoints

| Endpoint | Description |
|----------|-------------|
| `/api/projects` | Search projects by keyword, event, sponsor, or prize |
| `/api/sponsors` | Get list of sponsor names |
| `/api/prizes` | Get sponsor bounties and requirements |

### Rate Limits

- **10 free requests/minute** for unauthenticated use
- Compatible with [x402](https://github.com/agentcashdev) for paid access ($0.05 USDC per request after free tier)

## Getting Started

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to start searching.

## Tech Stack

- **Next.js 16** with App Router
- **Tailwind CSS 4** for styling
- **shadcn/ui** components
- **SWR** for data fetching

## Links

- [Live App](https://ethglobal-search.vercel.app)
- [ETHGlobal Skills API](https://github.com/ethglobal-skills/repo)
- [This Repo](https://github.com/officialcmg/ethglobal-search)

## Built with v0

This project was built with [v0](https://v0.app). You can continue developing by visiting the link below:

[Continue working on v0 →](https://v0.app/chat/projects/prj_DUwsjDnLXaD2RoLLoyVMFcvVB3ai)

<a href="https://v0.app/chat/api/kiro/clone/officialcmg/ethglobal-search" alt="Open in Kiro"><img src="https://pdgvvgmkdvyeydso.public.blob.vercel-storage.com/open%20in%20kiro.svg?sanitize=true" /></a>
