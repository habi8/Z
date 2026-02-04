import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

async function testSupabase() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
        console.error('Missing Supabase credentials in .env')
        return
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    console.log('Testing Supabase Storage...')

    // Check if we can list buckets
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets()

    if (bucketError) {
        console.error('Error listing buckets:', bucketError)
    } else {
        console.log('Available buckets:', buckets.map(b => b.name))
        const mediaBucket = buckets.find(b => b.name === 'media')
        if (mediaBucket) {
            console.log('Found "media" bucket.')
            console.log('Public:', mediaBucket.public)
        } else {
            console.error('"media" bucket NOT found.')
        }
    }
}

testSupabase()
