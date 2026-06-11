async function test() {
  try {
    const response = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          { role: 'assistant', content: 'Hi! I am The Learn Up Assistant. Ask me anything about our blog posts, trending topics, or categories! 🚀' },
          { role: 'user', content: 'Please summarize this article for me and give me the key takeaways.' }
        ],
        currentPostSlug: 'how-to-build-a-coding-vibe',
        model: 'openrouter/free'
      })
    });

    console.log('Status:', response.status);
    const data = await response.json();
    console.log('Response:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error:', err);
  }
}

test();
