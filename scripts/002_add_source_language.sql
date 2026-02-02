-- Add source_language column to documents table
alter table public.documents 
add column if not exists source_language text not null default 'en';

-- Add comment explaining the column
comment on column public.documents.source_language is 'ISO 639-1 language code for the source language of the document';
