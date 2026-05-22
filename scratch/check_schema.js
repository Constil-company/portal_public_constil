
import axios from 'axios';

const supabaseUrl = 'https://avppbvsxayehguepyjkb.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2cHBidnN4YXllaGd1ZXB5amtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwMzM5NjIsImV4cCI6MjA5MjYwOTk2Mn0.9deO5EvQLpilKfIWdAFqfoWkKx5wOwRbdnX7o0N1Yek';

async function checkClientSchema() {
  try {
    const response = await axios.get(`${supabaseUrl}/rest/v1/clients?limit=1`, {
      headers: {
        'apikey': anonKey,
        'Authorization': `Bearer ${anonKey}`
      }
    });
    console.log('Client sample data:', response.data[0]);
  } catch (error) {
    console.error('Error fetching client sample:', error.message);
  }
}

checkClientSchema();
