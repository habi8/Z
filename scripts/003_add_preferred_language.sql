-- Add preferred_language column to profiles table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'preferred_language'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN preferred_language text DEFAULT 'en';
  END IF;
END $$;

-- Update any null values to default
UPDATE public.profiles SET preferred_language = 'en' WHERE preferred_language IS NULL;
