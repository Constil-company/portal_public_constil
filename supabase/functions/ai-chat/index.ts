
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
}

const json = (data: any, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) return json({ error: 'Missing Authorization header' }, 200)

    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const fireworksApiKey = Deno.env.get('FIREWORKS_API_KEY')

    const supabase = createClient(supabaseUrl!, supabaseKey!)

    // Auth check
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) return json({ error: 'Unauthorized' }, 200)

    const body = await req.json()
    const { action, estimate_page_id } = body
    if (!estimate_page_id) return json({ error: 'estimate_page_id is required' }, 200)

    // Get current estimate data
    const { data: pageData, error: pageError } = await supabase
      .from('ai_estimate_results')
      .select('*, ai_estimates(*)')
      .eq('id', estimate_page_id)
      .single()

    if (pageError || !pageData) return json({ error: 'Estimate page not found' }, 200)

    // --- Helper: Call Fireworks (matches your Construction_agent.py setup) ---
    const callAI = async (systemPrompt: string, userPrompt: string, model = "accounts/fireworks/models/gpt-oss-120b") => {
      const res = await fetch('https://api.fireworks.ai/inference/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${fireworksApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error?.message || "AI Request Failed")
      return data.choices[0].message.content
    }

    // --- Action: CHAT (Mirrors create_Chat in Django) ---
    if (action === 'chat') {
      const { query } = body
      if (!query) return json({ error: 'query is required' }, 200)

      const qa_system_prompt = `You are a STRICT, DATA-BOUND Construction Cost Estimation Assistant.
      You are provided with a single source of truth called **ESTIMATE DATA** (in Markdown format).
      
      ESTIMATE DATA:
      ${pageData.output_markdown}

      CORE RULES:
      1. Answer ONLY using information explicitly present in the ESTIMATE DATA.
      2. If info is missing, respond with: "The provided estimate doesn't contain information about this."
      3. Use exact wording, quantities, and costs.`

      const responseText = await callAI(qa_system_prompt, query)

      // Save to history (Mirrors Django model save)
      const { data: chatRecord, error: insertError } = await supabase
        .from('ai_estimate_chatbot')
        .insert({
          estimate_page_id,
          user_id: user.id,
          query,
          response: { text: responseText }
        })
        .select()
        .single()

      if (insertError) throw insertError

      // Return exact format expected by frontend
      return json({
        status: true,
        data: chatRecord
      })
    }

    // --- Action: APPLY (Mirrors construct_chat in Django) ---
    if (action === 'apply') {
      const { conversation_history, query: user_query } = body
      
      const modifierPrompt = `You are an expert construction estimator. Your task is to apply specific modifications to a construction estimate based on a user's request.
      
      USER REQUEST: ${user_query || 'Apply changes from history'}
      HISTORY: ${JSON.stringify(conversation_history)}
      CURRENT ESTIMATE DATA (JSON): ${JSON.stringify(pageData.output_json)}
      CURRENT ESTIMATE TEXT (MARKDOWN): ${pageData.output_markdown}
      
      INSTRUCTIONS:
      1. Analyze the request and identify which items, quantities, or costs need to change.
      2. Modify the "CURRENT ESTIMATE DATA (JSON)" to reflect these changes.
      3. CRITICAL: KEEP ALL OTHER DATA INTACT. Do not remove tables or rows that weren't mentioned.
      4. Update the "updated_markdown" text to match the new JSON data.
      5. If no changes are needed, set "requires_changes" to false.
      6. Return ONLY the result in this JSON format:
      {
        "requires_changes": true,
        "final_output": { "tables": [...] },
        "updated_markdown": "..."
      }`;

      const aiResponse = await callAI("You are a JSON generator. Return only raw JSON.", modifierPrompt)
      const result = JSON.parse(aiResponse.replace(/```json|```/g, '').trim())

      if (result.requires_changes && result.final_output) {
        const { data: updatedPage, error: updateError } = await supabase
          .from('ai_estimate_results')
          .update({
            output_json: result.final_output,
            output_markdown: result.updated_markdown
          })
          .eq('id', estimate_page_id)
          .select()
          .single()

        if (updateError) throw updateError

        return json({
          status: true,
          massage: "updated", // Matching the typo in your Django response!
          ai_response: updatedPage
        })
      }

      return json({
        status: true,
        action: "chat",
        message: "No changes were made to the estimate.",
        ai_response: null
      }, 402) // Matching your Django status code 402
    }

    // --- Action: HISTORY ---
    if (action === 'history') {
      const { data } = await supabase
        .from('ai_estimate_chatbot')
        .select('*')
        .eq('estimate_page_id', estimate_page_id)
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })
      return json({ status: true, data })
    }

    return json({ error: 'Invalid action' }, 200)
  } catch (error) {
    return json({ status: false, error: error.message }, 200)
  }
})
