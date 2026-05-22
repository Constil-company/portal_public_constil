
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
const supabase = createClient(supabaseUrl, supabaseKey)

async function checkTable() {
  const { data, error } = await supabase
    .from('ai_estimate_chatbot')
    .select('*')
    .limit(1)

  if (error) {
    if (error.code === 'PGRST116' || error.message.includes('does not exist')) {
      console.log('Table ai_estimate_chatbot does not exist')
    } else {
      console.error('Error checking table:', error)
    }
  } else {
    console.log('Table ai_estimate_chatbot exists')
  }
}

checkTable()
