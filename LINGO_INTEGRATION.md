# Lingo.dev Integration Guide

This project is structured to seamlessly integrate with Lingo.dev for translation workflows and localization management.

## Database Structure

The application includes a dedicated `lingo_translations` table that's ready for Lingo.dev integration:

```sql
CREATE TABLE lingo_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  target_language TEXT NOT NULL,
  translated_content JSONB,
  lingo_translation_id TEXT,
  lingo_project_id TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Key Fields:
- `document_id`: Links to source document
- `target_language`: ISO language code (e.g., 'es', 'fr', 'de')
- `translated_content`: JSONB field for translated document content
- `lingo_translation_id`: Lingo.dev translation ID for tracking
- `lingo_project_id`: Lingo.dev project ID for organization
- `status`: Translation status ('pending', 'in_progress', 'completed', 'review')

## How to Add Lingo.dev Integration

### Step 1: Install Lingo.dev CLI (Locally)

```bash
# Install Lingo.dev CLI on your local machine
npm install -g @lingo-dev/cli

# Authenticate with your Lingo.dev account
lingo auth login
```

### Step 2: Initialize Lingo.dev in Your Project

```bash
# Initialize Lingo.dev configuration
lingo init

# This will create a lingo.config.js file with your project settings
```

### Step 3: Configure Lingo.dev

Create a `lingo.config.js` in the project root:

```javascript
module.exports = {
  projectId: 'your-lingo-project-id',
  sourceLanguage: 'en',
  targetLanguages: ['es', 'fr', 'de', 'ja', 'pt'],
  translationPath: './translations',
  
  // Custom integration with Supabase
  hooks: {
    onTranslationComplete: async (translation) => {
      // Update Supabase with completed translation
      const { createClient } = require('@supabase/supabase-js')
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      )
      
      await supabase
        .from('lingo_translations')
        .update({
          translated_content: translation.content,
          status: 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('lingo_translation_id', translation.id)
    }
  }
}
```

### Step 4: Create Translation Workflow API Routes

Add these API routes to handle Lingo.dev webhooks:

#### `/app/api/lingo/webhook/route.ts`

```typescript
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const payload = await request.json()

  const { translationId, status, content, documentId } = payload

  // Update translation status in database
  const { error } = await supabase
    .from('lingo_translations')
    .update({
      status,
      translated_content: content,
      updated_at: new Date().toISOString()
    })
    .eq('lingo_translation_id', translationId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
```

#### `/app/api/translations/create/route.ts`

```typescript
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { documentId, targetLanguages } = await request.json()

  // Fetch source document
  const { data: document, error: docError } = await supabase
    .from('documents')
    .select('*')
    .eq('id', documentId)
    .single()

  if (docError || !document) {
    return NextResponse.json({ error: 'Document not found' }, { status: 404 })
  }

  // Create translation records for each target language
  const translations = targetLanguages.map((lang: string) => ({
    document_id: documentId,
    target_language: lang,
    status: 'pending',
    lingo_project_id: process.env.LINGO_PROJECT_ID
  }))

  const { data, error } = await supabase
    .from('lingo_translations')
    .insert(translations)
    .select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // TODO: Send to Lingo.dev API for translation
  // This would call Lingo.dev's API to initiate translation
  
  return NextResponse.json({ success: true, translations: data })
}
```

### Step 5: Environment Variables

Add these environment variables to your project:

```bash
# Lingo.dev Configuration
LINGO_PROJECT_ID=your_project_id
LINGO_API_KEY=your_api_key
LINGO_WEBHOOK_SECRET=your_webhook_secret

# Supabase (already configured)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Usage in the Application

### Requesting a Translation

```typescript
// In your component or API route
const requestTranslation = async (documentId: string, targetLanguages: string[]) => {
  const response = await fetch('/api/translations/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ documentId, targetLanguages })
  })
  
  return response.json()
}
```

### Checking Translation Status

```typescript
const getTranslations = async (documentId: string) => {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('lingo_translations')
    .select('*')
    .eq('document_id', documentId)
  
  return data
}
```

### Displaying Translated Content

```typescript
const getTranslatedDocument = async (documentId: string, language: string) => {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('lingo_translations')
    .select('translated_content')
    .eq('document_id', documentId)
    .eq('target_language', language)
    .eq('status', 'completed')
    .single()
  
  return data?.translated_content
}
```

## Features Ready for Lingo.dev

1. **Document Structure**: All documents are stored with structured content that can be easily extracted and translated
2. **Language Tracking**: Source language is tracked per document
3. **Translation Management**: Dedicated table for managing translation status and content
4. **Workspace Organization**: Documents are organized in workspaces for project-based translation workflows
5. **User Permissions**: Row Level Security ensures users can only access their own content

## Next Steps

Once Lingo.dev is installed locally:

1. Add translation request UI in the document editor
2. Display available translations and allow language switching
3. Implement translation review workflow
4. Add glossary management integration
5. Set up translation memory for consistent terminology
6. Configure automated translation workflows

## Benefits of This Structure

- **Separation of Concerns**: Source content and translations are stored separately
- **Scalability**: Easy to add new languages without modifying existing documents
- **Flexibility**: Support for multiple translation workflows (manual, automated, hybrid)
- **Tracking**: Full audit trail of translation status and history
- **Integration Ready**: Database schema designed specifically for Lingo.dev integration

## Documentation

- [Lingo.dev Documentation](https://docs.lingo.dev)
- [Lingo.dev API Reference](https://docs.lingo.dev/api)
- [Translation Best Practices](https://docs.lingo.dev/best-practices)
