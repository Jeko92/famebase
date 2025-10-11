# Addfame Famebase

> Influencer management platform for discovering, managing, and collaborating with influencers.

## Overview

Addfame Famebase is a modern web application built with Next.js 15, TypeScript, and PostgreSQL. It provides a comprehensive platform for managing influencer relationships, tracking campaigns, and analyzing engagement metrics.

## Tech Stack

- **Frontend**: Next.js 15.5 with App Router, React 19, Tailwind CSS v4
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL 16
- **Monorepo**: pnpm workspaces with Turbo
- **Language**: TypeScript 5.6

## Project Structure

```
addfame-famebase/
├── apps/
│   └── web/              # Next.js web application
├── packages/
│   ├── database/         # Prisma schema and database utilities
│   ├── typescript-config/ # Shared TypeScript configurations
│   └── ui/               # Shared UI components
├── .husky/               # Git hooks
└── pnpm-workspace.yaml   # Workspace configuration
```

## Getting Started

### Prerequisites

- Node.js 24.x or higher
- pnpm 10.x or higher
- PostgreSQL 16

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd addfame-famebase
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and configure your `DATABASE_URL`:
```env
DATABASE_URL="postgresql://username@localhost:5432/addfame_famebase"
```

4. Set up the database:
```bash
# Push schema to database
pnpm --filter database db:push

# Seed with sample data
pnpm --filter database db:seed
```

5. Start the development server:
```bash
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Development

### Available Scripts

```bash
# Development
pnpm dev                    # Start all workspaces in dev mode
pnpm --filter web dev       # Start only web app

# Database
pnpm --filter database db:push      # Push schema changes
pnpm --filter database db:generate  # Generate Prisma Client
pnpm --filter database db:studio    # Open Prisma Studio
pnpm --filter database db:seed      # Seed database

# Code Quality
pnpm lint                   # Run ESLint
pnpm type-check            # Run TypeScript compiler

# Build
pnpm build                  # Build all packages
```

### Database Schema

The application uses the following main models:

- **Influencer**: Profile information, metrics, and social platforms
- **InfluencerImage**: Image gallery for influencers
- **Campaign**: Marketing campaign management

## Features

- Influencer database with detailed profiles
- Campaign management
- Image gallery support
- Search and filter capabilities
- Analytics and metrics tracking
- User authentication with NextAuth
- Favorites management system
- Responsive design for mobile and desktop

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions on deploying to Vercel.

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/addfame-famebase)

**Note**: You'll need to:
1. Set up a PostgreSQL database (Neon, Supabase, or Vercel Postgres)
2. Configure environment variables (see DEPLOYMENT.md)
3. Run database migrations after first deployment

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

This project uses [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.

## License

[License Type] - See LICENSE file for details

## Authors

See [AUTHORS.md](AUTHORS.md) for the list of contributors.