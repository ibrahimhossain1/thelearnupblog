import { client } from '@/sanity/lib/client'
import HomeClient from '@/app/components/HomeClient'
import { mockPosts, mockCategories } from '@/app/utils/mockData'

// Revalidate cache every 60 seconds (ISR - Incremental Static Regeneration)
export const revalidate = 60

export default async function HomePage() {
  let posts = []
  let categories = []
  let youtubeVideos = []

  try {
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
    
    // Only fetch if a valid projectId is set (not the placeholder)
    if (projectId && projectId !== 'your-project-id') {
      // Fetch posts, categories, and siteConfig in parallel to eliminate the query waterfall
      const [fetchedPosts, fetchedCategories, fetchedSiteConfig] = await Promise.all([
        client.fetch(`
          *[_type == "post" && (status == "publish" || (status == "schedule" && publishedAt <= now()) || !defined(status))] | order(coalesce(publishedAt, _createdAt) desc) {
            _id,
            title,
            slug,
            excerpt,
            publishedAt,
            isFeatured,
            isTrending,
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
        `),
        client.fetch(`
          *[_type == "siteConfig"][0] {
            youtubeVideos
          }
        `)
      ]);

      posts = fetchedPosts || [];
      categories = fetchedCategories || [];
      youtubeVideos = fetchedSiteConfig?.youtubeVideos || [];
    }
  } catch (err) {
    console.warn('Sanity fetch failed. Using premium fallback mock data.', err.message)
  }

  // Use high-quality mock data if database is empty or fetch failed
  const finalPosts = posts && posts.length > 0 ? posts : mockPosts
  const finalCategories = categories && categories.length > 0 ? categories : mockCategories

  return <HomeClient posts={finalPosts} categories={finalCategories} youtubeVideos={youtubeVideos} />
}
