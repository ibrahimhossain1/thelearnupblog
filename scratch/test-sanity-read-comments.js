const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'ygp0nql6',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false,
});

async function main() {
  console.log('Fetching comments from Sanity...');
  try {
    const comments = await client.fetch(`*[_type == "comment"] { _id, name, email, comment, approved, post->{title} }`);
    console.log('Comments found:', JSON.stringify(comments, null, 2));
  } catch (err) {
    console.error('Error fetching comments:', err);
  }
}

main();
