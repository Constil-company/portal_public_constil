
import axios from 'axios';

const supabaseUrl = 'https://avppbvsxayehguepyjkb.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2cHBidnN4YXllaGd1ZXB5amtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwMzM5NjIsImV4cCI6MjA5MjYwOTk2Mn0.9deO5EvQLpilKfIWdAFqfoWkKx5wOwRbdnX7o0N1Yek';

async function checkCompanyProfilesSchema() {
  try {
    const response = await axios.get(`${supabaseUrl}/rest/v1/company_profiles?limit=1`, {
      headers: {
        'apikey': anonKey,
        'Authorization': `Bearer ${anonKey}`
      }
    });
    console.log('Company Profile sample data:', response.data[0]);
  } catch (error) {
    if (error.response) {
      console.log('Error response:', JSON.stringify(error.response.data));
    } else {
      console.log('Error testing schema:', error.message);
    }
  }
}

checkCompanyProfilesSchema();
