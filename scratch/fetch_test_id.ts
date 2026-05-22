
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
  const { data, error } = await supabase
    .from('ai_estimate_results')
    .select('id, output_markdown')
    .limit(1)
  
  if (error) {
    console.error('Error fetching data:', error)
    return
  }

  if (!data || data.length === 0) {
    console.log('No estimate results found to test with.')
    return
  }

  console.log('Found estimate page:', data[0].id)
  console.log('Markdown snippet:', data[0].output_markdown?.substring(0, 100))
}

test()
