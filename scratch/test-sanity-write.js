async function testSubmit() {
  console.log('Testing comment submission to local API...');
  try {
    const res = await fetch('http://localhost:3000/api/comment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        comment: 'This is a test comment from the automated test runner.',
        postId: '31cd8249-c4ca-4567-9773-d5a0fbd0da17',
      }),
    });

    console.log('Response status:', res.status);
    const data = await res.json();
    console.log('Response body:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error in request:', err);
  }
}

testSubmit();
