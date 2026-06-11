import { client } from '@/sanity/lib/client'
import BlogClient from './BlogClient'
import { mockPosts, mockCategories } from '@/app/utils/mockData'

// Revalidate every 60 seconds (ISR)
export const revalidate = 60

export default async function BlogPage() {
  let posts = []
  let categories = []

  try {
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
    
    if (projectId && projectId !== 'your-project-id') {
      // Fetch posts and categories in parallel to avoid a query waterfall
      const [fetchedPosts, fetchedCategories] = await Promise.all([
        client.fetch(`
          *[_type == "post" && (status == "publish" || (status == "schedule" && publishedAt <= now()) || !defined(status))] | order(coalesce(publishedAt, _createdAt) desc) {
            _id,
            title,
            slug,
            excerpt,
            publishedAt,
            isFeatured,
            mainImage,
            author->{
              name,
              slug,
              image
            },
            categories[]->{
              _id,
              title,
              slug
            }
          }
        `),
        client.fetch(`
          *[_type == "category"] {
            _id,
            title,
            slug
          }
        `)
      ]);

      posts = fetchedPosts || [];
      categories = fetchedCategories || [];
    }
  } catch (err) {
    console.warn('Sanity fetch failed on Blog page. Using fallback mock posts.', err.message)
  }

  const finalPosts = posts && posts.length > 0 ? posts : mockPosts
  const finalCategories = categories && categories.length > 0 ? categories : mockCategories

  return <BlogClient posts={finalPosts} categories={finalCategories} />
}
