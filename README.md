# SOLO LEVELING LIFE SYSTEM

> A futuristic, production-quality anime/RPG gamified personal-development web application for Study + Fitness + Learning + Daily Tasks.

![System Preview Banner](public/favicon.svg)

## ⚡ Overview

The **Solo Leveling Life System** transforms your daily habit development into a dark-fantasy RPG HUD interface inspired by Solo Leveling. Earn XP, level up your character stats (STR, VIT, AGI, INT, FOC, DISC, CRE), unlock titles & achievements, track your lifetime counter in high precision, and manage your wallet balance.

---

## ✨ Features

1. **Authentication & Player Creation**:
   - Unique Player ID generation (`SOLO-7K4P9Q`).
   - Exact Date of Birth age calculation and system initialization sequence animation.
2. **3D Liquid Glass HUD Interface**:
   - Neon purple, cyan, and pink visual language with glassmorphism backdrop blur.
   - Scanline overlays, hexagonal grids, and Web Audio API synthesized HUD sound FX.
3. **Live Life Timer**:
   - Real-time counter displaying Years, Months, Days, Hours, Minutes, Seconds based on exact date math.
4. **RPG Level & XP Progression**:
   - Scalable XP formula: `requiredXP = round(100 * 1.25^level)`.
   - Full-screen level up fanfare popup with sound effects and coin bonuses (+100 G).
5. **Quest Directives System**:
   - Quests grouped across **Study**, **Fitness**, **Learning**, and **Daily Tasks**.
   - Custom quest creator with customizable XP and Coin rewards.
6. **Anime Fitness Experience**:
   - Dedicated physical training modal with wellness guidance and exercise options (Walking, Stretching, Push-ups).
7. **Pomodoro Focus Study Chamber**:
   - Liquid ring countdown timer (15, 25, 45, 60 min & custom) with study subject tracking.
8. **Learning Skills Matrix**:
   - Skill mastery progress bars (Web Dev, Python, Communication) with target hours tracking.
9. **Character Stats & Radar Graph**:
   - RPG Attribute breakdown (STR, VIT, AGI, INT, FOC, DISC, CRE) and interactive Recharts Radar graph.
10. **Coins Balance & Vault**:
    - Dedicated wallet viewer with immutable transaction ledger.
11. **Equipment Shop & Equippable Titles**:
    - Shop for weapons, armor, rings, and title unlocks ("The Disciplined", "Hunter", "Monarch").
12. **Consistency Streak System**:
    - Weekly calendar breakdown (MON-SUN) and streak maintenance tracking.
13. **Mobile-First Responsive Design**:
    - Fixed bottom navigation bar for mobile viewports with single-column cards and large touch targets.
14. **Progressive Web App (PWA)**:
    - Installable on mobile home screens ("Add to Home Screen") via `manifest.json` and `sw.js`.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS, Custom Liquid Glass CSS System, Google Fonts (`Orbitron`, `Rajdhani`, `Inter`)
- **Graphics & Charts**: Recharts, Lucide React Icons
- **Audio Engine**: Web Audio API Synthesizer
- **Database & Auth**: Supabase PostgreSQL & Supabase Auth (`@supabase/supabase-js`)
- **Local Fallback**: Reactive LocalStorage Engine for zero-config offline usage

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### 2. Installation
```bash
git clone https://github.com/your-username/solo-leveling-life-system.git
cd solo-leveling-life-system
npm install
```

### 3. Local Development
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🗄️ Supabase Setup & Migration

1. Create a new project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase Dashboard.
3. Paste the contents of [`supabase/schema.sql`](supabase/schema.sql) and click **Run**.
4. Copy your Supabase Project URL and Anon API Key.
5. Create a `.env.local` file in the root directory:
```env
VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

---

## 🌐 Deployment

### Deploy to Vercel
1. Push your repository to GitHub.
2. Import your repository into [Vercel](https://vercel.com).
3. Set the Environment Variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).
4. Click **Deploy**.

---

## 🔒 Security & Data Integrity

- **Row Level Security (RLS)**: Enforced across all Supabase PostgreSQL tables so users can only read/write their own records.
- **Server-Validated Balance Calculations**: Coin spendings are validated before transaction ledger commits.
