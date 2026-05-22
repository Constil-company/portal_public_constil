
import axios from 'axios';

const supabaseUrl = 'https://avppbvsxayehguepyjkb.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2cHBidnN4YXllaGd1ZXB5amtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwMzM5NjIsImV4cCI6MjA5MjYwOTk2Mn0.9deO5EvQLpilKfIWdAFqfoWkKx5wOwRbdnX7o0N1Yek';

async function testInvoiceIsDeleted() {
  try {
    console.log(`Testing column is_deleted on invoices...`);
    await axios.patch(`${supabaseUrl}/rest/v1/invoices?id=eq.00000000-0000-0000-0000-000000000000`, 
      { is_deleted: false }, 
      {
        headers: {
          'apikey': anonKey,
          'Authorization': `Bearer ${anonKey}`
        }
      }
    );
    console.log(`Column is_deleted EXISTS.`);
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      if (error.response.data.message.includes('column') && error.response.data.message.includes('not found')) {
         console.log(`Column is_deleted DOES NOT EXIST.`);
      } else {
         console.log(`Column error: ${error.response.data.message}`);
      }
    } else {
      console.log(`Request failed: ${error.message}`);
    }
  }
}

testInvoiceIsDeleted();
