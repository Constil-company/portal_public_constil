
import axios from 'axios';

const supabaseUrl = 'https://avppbvsxayehguepyjkb.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2cHBidnN4YXllaGd1ZXB5amtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwMzM5NjIsImV4cCI6MjA5MjYwOTk2Mn0.9deO5EvQLpilKfIWdAFqfoWkKx5wOwRbdnX7o0N1Yek';

async function testColumns() {
  const columns = ['legal_business_name', 'tax_id_number', 'legal_address', 'business_type', 'company_legal_name', 'industry', 'address'];
  
  for (const col of columns) {
    try {
      console.log(`Testing column: ${col}...`);
      await axios.post(`${supabaseUrl}/rest/v1/company_profiles?on_conflict=user_id`, 
        { [col]: 'test', user_id: '00000000-0000-0000-0000-000000000000' }, 
        {
          headers: {
            'apikey': anonKey,
            'Authorization': `Bearer ${anonKey}`,
            'Prefer': 'resolution=merge-duplicates'
          }
        }
      );
      console.log(`Column ${col} EXISTS.`);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        if (error.response.data.message.includes('column') && error.response.data.message.includes('not found')) {
           console.log(`Column ${col} DOES NOT EXIST.`);
        } else {
           console.log(`Column ${col} error: ${error.response.data.message}`);
        }
      } else {
        console.log(`Column ${col} request failed: ${error.message}`);
      }
    }
  }
}

testColumns();
