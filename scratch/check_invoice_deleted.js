
import axios from 'axios';

const supabaseUrl = 'https://avppbvsxayehguepyjkb.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2cHBidnN4YXllaGd1ZXB5amtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwMzM5NjIsImV4cCI6MjA5MjYwOTk2Mn0.9deO5EvQLpilKfIWdAFqfoWkKx5wOwRbdnX7o0N1Yek';

async function checkInvoiceColumns() {
  try {
    const response = await axios.get(`${supabaseUrl}/rest/v1/invoices?limit=1`, {
      headers: {
        'apikey': anonKey,
        'Authorization': `Bearer ${anonKey}`
      }
    });
    if (response.data && response.data[0]) {
      console.log('Invoice columns:', Object.keys(response.data[0]));
    } else {
      console.log('No invoices found to check columns.');
    }
  } catch (error) {
    console.log('Error:', error.message);
  }
}

checkInvoiceColumns();
