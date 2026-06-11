async function testSubmitMock() {
  console.log('Testing comment submission for a mock post (p1) to local API...');
  try {
    const res = await fetch('http://localhost:3000/api/comment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User 2',
        email: 'test2@example.com',
        comment: 'This is a test comment for a mock post.',
        postId: 'p1',
      }),
    });

    console.log('Response status:', res.status);
    const data = await res.json();
    console.log('Response body:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error in request:', err);
  }
}

testSubmitMock();
