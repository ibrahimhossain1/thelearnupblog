const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env.local') });

async function test() {
  const openRouterApiKey = process.env.OPENROUTER_API_KEY;
  console.log('API Key:', openRouterApiKey ? `${openRouterApiKey.slice(0, 10)}...` : 'undefined');

  try {
    const apiResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openRouterApiKey}`,
      },
      body: JSON.stringify({
        model: 'openrouter/free',
        messages: [
          { role: 'user', content: 'Say hello!' }
        ],
      })
    });

    console.log('Status:', apiResponse.status);
    const text = await apiResponse.text();
    console.log('Response:', text);
  } catch (err) {
    console.error('Error:', err);
  }
}

test();
