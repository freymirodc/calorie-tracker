-- Note: auth.users table already has RLS enabled by Supabase
-- We don't need to (and can't) modify it

-- Create daily_calories table
CREATE TABLE daily_calories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  calories_consumed INTEGER NOT NULL DEFAULT 0,
  target_calories INTEGER NOT NULL,
  fasting_hours DECIMAL(4,2) DEFAULT 0,
  fast_start_time TIME,
  fast_end_time TIME,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Create weekly_goals table
CREATE TABLE weekly_goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  week_start DATE NOT NULL,
  total_target_calories INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, week_start)
);

-- Enable RLS on tables
ALTER TABLE daily_calories ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_goals ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for daily_calories
CREATE POLICY "Users can view their own daily calories" ON daily_calories
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own daily calories" ON daily_calories
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily calories" ON daily_calories
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own daily calories" ON daily_calories
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for weekly_goals
CREATE POLICY "Users can view their own weekly goals" ON weekly_goals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own weekly goals" ON weekly_goals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own weekly goals" ON weekly_goals
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own weekly goals" ON weekly_goals
  FOR DELETE USING (auth.uid() = user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for daily_calories
CREATE TRIGGER update_daily_calories_updated_at 
  BEFORE UPDATE ON daily_calories 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_daily_calories_user_date ON daily_calories(user_id, date);
CREATE INDEX idx_daily_calories_date ON daily_calories(date);
CREATE INDEX idx_weekly_goals_user_week ON weekly_goals(user_id, week_start);
