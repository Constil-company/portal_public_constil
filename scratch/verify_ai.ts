
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { ChatGoogleGenerativeAI } from "https://esm.sh/@langchain/google-genai"
import { HumanMessage, SystemMessage } from "https://esm.sh/@langchain/core/messages"

const supabaseUrl = "https://avppbvsxayehguepyjkb.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2cHBidnN4YXllaGd1ZXB5amtiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzAzMzk2MiwiZXhwIjoyMDkyNjA5OTYyfQ.IjIDpaxklgfczNpmHlrKAThnGzlECeMwtv9QodFPwZk"
const googleApiKey = "AIzaSyD4roU6eWDW3bPu5VtsakigssjVCZEDwYI"

const supabase = createClient(supabaseUrl, supabaseKey)

async function verify() {
  console.log('--- AI Integration Verification ---')
  
  // 1. Fetch data
  const { data: pageData, error: pageError } = await supabase
    .from('ai_estimate_results')
    .select('id, output_markdown')
    .limit(1)
    .single()

  if (pageError || !pageData) {
    console.error('Error: Could not find any estimate results in Supabase.')
    return
  }

  console.log('Step 1: Found Estimate Page ID:', pageData.id)

  // 2. Initialize Gemini
  const llm = new ChatGoogleGenerativeAI({
    apiKey: googleApiKey,
    modelName: "gemini-1.5-flash",
    temperature: 0.7,
  })

  console.log('Step 2: Gemini Initialized')

  // 3. Test Chat
  const query = "What is the total project cost?"
  const systemPrompt = `You are a Construction Assistant. Use this data: ${pageData.output_markdown}`
  
  console.log('Step 3: Sending test query:', query)
  
  try {
    const response = await llm.invoke([
      new SystemMessage(systemPrompt),
      new HumanMessage(query)
    ])
    console.log('AI Response:', response.content)
    console.log('--- Verification Successful ---')
  } catch (e) {
    console.error('AI Call Failed:', e.message)
  }
}

verify()
