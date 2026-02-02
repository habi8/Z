-- Add source_language column to documents table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'documents' 
    AND column_name = 'source_language'
  ) THEN
    ALTER TABLE public.documents ADD COLUMN source_language text DEFAULT 'en';
  END IF;
END $$;

-- Update any existing documents without source_language
UPDATE public.documents 
SET source_language = 'en' 
WHERE source_language IS NULL;
