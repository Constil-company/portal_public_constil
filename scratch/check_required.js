
import axios from 'axios';

const supabaseUrl = 'https://avppbvsxayehguepyjkb.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2cHBidnN4YXllaGd1ZXB5amtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwMzM5NjIsImV4cCI6MjA5MjYwOTk2Mn0.9deO5EvQLpilKfIWdAFqfoWkKx5wOwRbdnX7o0N1Yek';

async function checkRequiredColumns() {
  try {
    const response = await axios.get(`${supabaseUrl}/rest/v1/`, {
      headers: { 'apikey': anonKey }
    });
    const props = response.data.definitions.company_profiles.properties;
    const required = response.data.definitions.company_profiles.required || [];
    console.log('Required columns:', required);
    
    // Also check which ones are not null in the properties (some might not be in 'required' array but have no default)
    const allProps = Object.keys(props);
    console.log('All columns:', allProps);
  } catch (error) {
    console.log('Error:', error.message);
  }
}

checkRequiredColumns();
