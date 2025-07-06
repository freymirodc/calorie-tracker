-- Create user_fasting_presets table
CREATE TABLE user_fasting_presets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name VARCHAR(100) NOT NULL,
  hours DECIMAL(4,2) NOT NULL CHECK (hours >= 0 AND hours <= 168),
  description TEXT,
  color VARCHAR(20) NOT NULL DEFAULT 'gray',
  bg_color VARCHAR(50) NOT NULL DEFAULT 'bg-gray-500',
  text_color VARCHAR(50) NOT NULL DEFAULT 'text-white',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on user_fasting_presets
ALTER TABLE user_fasting_presets ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_fasting_presets
CREATE POLICY "Users can view their own fasting presets" ON user_fasting_presets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own fasting presets" ON user_fasting_presets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own fasting presets" ON user_fasting_presets
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own fasting presets" ON user_fasting_presets
  FOR DELETE USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX idx_user_fasting_presets_user_id ON user_fasting_presets(user_id);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_fasting_presets_updated_at 
    BEFORE UPDATE ON user_fasting_presets 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
