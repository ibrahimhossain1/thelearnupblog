const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'ygp0nql6',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false,
});

async function main() {
  console.log('Fetching posts from Sanity...');
  try {
    const posts = await client.fetch(`*[_type == "post"] { _id, title, "slug": slug.current }`);
    console.log('Posts found:', JSON.stringify(posts, null, 2));
  } catch (err) {
    console.error('Error fetching posts:', err);
  }
}

main();
