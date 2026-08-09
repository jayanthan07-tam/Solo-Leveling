-- =========================================================
-- SOLO LEVELING LIFE SYSTEM - DATABASE SCHEMA (Supabase PostgreSQL)
-- =========================================================

-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  player_id VARCHAR(20) UNIQUE NOT NULL, -- e.g. SOLO-7K4P9Q
  name VARCHAR(100) NOT NULL,
  dob DATE NOT NULL,
  gender VARCHAR(20) DEFAULT 'Unspecified',
  weight NUMERIC(5, 2) DEFAULT 70.0,
  avatar_url TEXT DEFAULT '',
  timezone VARCHAR(50) DEFAULT 'UTC',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PLAYER STATS TABLE
CREATE TABLE IF NOT EXISTS public.player_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  level INT DEFAULT 0,
  xp INT DEFAULT 0,
  coins INT DEFAULT 0,
  total_xp INT DEFAULT 0,
  total_coins_earned INT DEFAULT 0,
  total_coins_spent INT DEFAULT 0,
  streak INT DEFAULT 0,
  last_active_date DATE DEFAULT CURRENT_DATE,
  strength INT DEFAULT 10,
  vitality INT DEFAULT 10,
  agility INT DEFAULT 10,
  intelligence INT DEFAULT 10,
  focus INT DEFAULT 10,
  discipline INT DEFAULT 10,
  creativity INT DEFAULT 10,
  equipped_title VARCHAR(100) DEFAULT 'Novice Hunter',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. QUESTS TABLE (Template / System Quests & User Quests)
CREATE TABLE IF NOT EXISTS public.quests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE, -- null for global system daily quests
  title VARCHAR(150) NOT NULL,
  description TEXT,
  category VARCHAR(30) NOT NULL, -- 'STUDY', 'FITNESS', 'LEARNING', 'DAILY TASKS'
  xp_reward INT NOT NULL DEFAULT 20,
  coin_reward INT NOT NULL DEFAULT 20,
  difficulty VARCHAR(20) DEFAULT 'E-RANK', -- 'E-RANK', 'D-RANK', 'C-RANK', 'B-RANK', 'A-RANK', 'S-RANK'
  is_daily BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. QUEST COMPLETIONS TABLE
CREATE TABLE IF NOT EXISTS public.quest_completions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  quest_id UUID REFERENCES public.quests(id) ON DELETE SET NULL,
  quest_title VARCHAR(150) NOT NULL,
  category VARCHAR(30) NOT NULL,
  xp_earned INT NOT NULL,
  coins_earned INT NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. DAILY TASKS TABLE
CREATE TABLE IF NOT EXISTS public.daily_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title VARCHAR(150) NOT NULL,
  description TEXT,
  category VARCHAR(30) DEFAULT 'DAILY TASKS',
  priority VARCHAR(20) DEFAULT 'MEDIUM',
  status VARCHAR(20) DEFAULT 'PENDING', -- 'PENDING', 'COMPLETED', 'FAILED', 'SKIPPED'
  due_date DATE DEFAULT CURRENT_DATE,
  xp_reward INT DEFAULT 15,
  coin_reward INT DEFAULT 15,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. SKILLS TABLE
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50) DEFAULT 'General',
  progress_percent INT DEFAULT 0,
  total_minutes INT DEFAULT 0,
  target_hours INT DEFAULT 100,
  xp_earned INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. SKILL SESSIONS TABLE
CREATE TABLE IF NOT EXISTS public.skill_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES public.skills(id) ON DELETE SET NULL,
  duration_minutes INT NOT NULL,
  notes TEXT,
  xp_earned INT DEFAULT 20,
  session_date TIMESTAMPTZ DEFAULT NOW()
);

-- 8. ACHIEVEMENTS & PLAYER ACHIEVEMENTS
CREATE TABLE IF NOT EXISTS public.achievements (
  id VARCHAR(50) PRIMARY KEY, -- e.g. 'FIRST_BLOOD'
  title VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(30) NOT NULL,
  icon_name VARCHAR(50) DEFAULT 'Award',
  xp_reward INT DEFAULT 50,
  coin_reward INT DEFAULT 50,
  title_reward VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS public.player_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  achievement_id VARCHAR(50) NOT NULL REFERENCES public.achievements(id),
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(profile_id, achievement_id)
);

-- 9. TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type VARCHAR(10) NOT NULL, -- 'EARNED', 'SPENT'
  amount INT NOT NULL,
  description VARCHAR(200) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(30) DEFAULT 'SYSTEM', -- 'LEVEL_UP', 'QUEST', 'ACHIEVEMENT', 'SYSTEM'
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. INVENTORY / EQUIPMENT TABLE
CREATE TABLE IF NOT EXISTS public.inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  item_id VARCHAR(50) NOT NULL, -- e.g. 'NOVICE_BLADE'
  name VARCHAR(100) NOT NULL,
  category VARCHAR(30) NOT NULL, -- 'WEAPON', 'ARMOR', 'RING', 'ACCESSORY'
  price INT NOT NULL,
  is_equipped BOOLEAN DEFAULT false,
  purchased_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. TITLES TABLE
CREATE TABLE IF NOT EXISTS public.player_titles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title_name VARCHAR(100) NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(profile_id, title_name)
);

-- =========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quest_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_titles ENABLE ROW LEVEL SECURITY;

-- Default Policies: Users access only their own profile's data
CREATE POLICY "Profiles self access" ON public.profiles FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Stats self access" ON public.player_stats FOR ALL USING (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY "Quests access" ON public.quests FOR ALL USING (profile_id IS NULL OR profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY "Completions self access" ON public.quest_completions FOR ALL USING (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY "Daily tasks self access" ON public.daily_tasks FOR ALL USING (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY "Skills self access" ON public.skills FOR ALL USING (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY "Skill sessions self access" ON public.skill_sessions FOR ALL USING (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY "Player achievements self access" ON public.player_achievements FOR ALL USING (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY "Transactions self access" ON public.transactions FOR ALL USING (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY "Notifications self access" ON public.notifications FOR ALL USING (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY "Inventory self access" ON public.inventory FOR ALL USING (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY "Titles self access" ON public.player_titles FOR ALL USING (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- Global read access for system achievements
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Achievements public read" ON public.achievements FOR SELECT USING (true);

-- Insert Default System Achievements
INSERT INTO public.achievements (id, title, description, category, icon_name, xp_reward, coin_reward, title_reward) VALUES
('FIRST_BLOOD', 'First Blood', 'Complete your very first quest.', 'SYSTEM', 'Zap', 50, 50, 'Novice Hunter'),
('KNOWLEDGE_SEEKER', 'Knowledge Seeker', 'Complete 10 learning quests.', 'LEARNING', 'BookOpen', 150, 100, 'Knowledge Seeker'),
('IRON_BODY', 'Iron Body', 'Complete 25 fitness quests.', 'FITNESS', 'Dumbbell', 250, 200, 'Iron Body'),
('STUDY_MASTER', 'Study Master', 'Complete 50 study sessions.', 'STUDY', 'Brain', 300, 250, 'Study Master'),
('CONSISTENCY', 'Disciplined Monarch', 'Maintain a 7-day active streak.', 'SYSTEM', 'Flame', 200, 150, 'The Disciplined'),
('HUNTER', 'High Rank Hunter', 'Reach Level 10.', 'SYSTEM', 'Shield', 500, 400, 'Hunter'),
('ELITE', 'Shadow Commander', 'Reach Level 25.', 'SYSTEM', 'Crown', 1000, 1000, 'Elite'),
('MONARCH', 'Shadow Monarch', 'Reach Level 50.', 'SYSTEM', 'Sparkles', 5000, 5000, 'Monarch')
ON CONFLICT (id) DO NOTHING;
