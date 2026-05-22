const axios = require('axios');
const fs = require('fs');

async function run() {
  const env = fs.readFileSync('.env', 'utf-8');
  const supabaseUrl = env.match(/VITE_SUPABASE_URL=(.*)/)[1].trim();
  const anonKey = env.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1].trim();
  const bucketName = 'paybue-invoice-estimation'; // From .env
  
  try {
    const response = await axios.post(
      `${supabaseUrl}/storage/v1/object/${bucketName}/testfile.txt`,
      Buffer.from('hello world'),
      {
        headers: {
          'apikey': anonKey,
          'Authorization': `Bearer ${anonKey}`, // using anonKey instead of user token, just to see if we get 401 instead of 400
          'Content-Type': 'text/plain'
        }
      }
    );
    console.log(response.status);
  } catch (err) {
    console.log("Status:", err.response?.status);
    console.log("Error details:", err.response?.data);
  }
}
run();
