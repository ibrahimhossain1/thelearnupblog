import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Calendar, User, ArrowLeft, Clock } from 'lucide-react'
import { PortableText } from '@portabletext/react'
import { client } from '@/sanity/lib/client'
import { urlForImage } from '@/sanity/lib/image'
import { RichTextComponents } from '@/app/components/RichText'
import { mockPosts } from '@/app/utils/mockData'
import AdSlot from '@/app/components/AdSlot'
import ShareButtons from '@/app/components/ShareButtons'
import Comments from '@/app/components/Comments'
import ProgressBar from '@/app/components/ProgressBar'
import NewsletterForm from '@/app/components/NewsletterForm'
import FocusMode from '@/app/components/FocusMode'
import ReadAloud from '@/app/components/ReadAloud'

// Custom SVG Icons for Author Socials
const YoutubeIcon = ({ size = 16 }) => (
  <svg className="fill-current" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.528 3.545 12 3.545 12 3.545s-7.528 0-9.388.508a3.003 3.003 0 00-2.11 2.11C0 8.022 0 12 0 12s0 3.978.502 5.837a3.003 3.003 0 002.11 2.11c1.86.508 9.388.508 9.388.508s7.528 0 9.388-.508a3.003 3.003 0 002.11-2.11C24 15.978 24 12 24 12s0-3.978-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
)

const GithubIcon = ({ size = 16 }) => (
  <svg className="fill-current" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.48C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
)

const TwitterIcon = ({ size = 16 }) => (
  <svg className="fill-current" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

const FacebookIcon = ({ size = 16 }) => (
  <svg className="fill-current" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
  </svg>
)

// Revalidate cache every 60 seconds
export const revalidate = 60

// Estimate reading time from portable text block content
const calculateReadingTime = (body) => {
  if (!body) return 1
  let text = ''
  body.forEach((block) => {
    if (block._type === 'block' && block.children) {
      block.children.forEach((child) => {
        if (child.text) {
          text += child.text + ' '
        }
      })
    }
  })
  const words = text.trim().split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200)) // 200 WPM
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  let post = null

  try {
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
    if (projectId && projectId !== 'your-project-id') {
      post = await client.fetch(
        `*[_type == "post" && slug.current == $slug && (status == "publish" || (status == "schedule" && publishedAt <= now()) || !defined(status))][0] { title, excerpt, mainImage }`,
        { slug }
      )
    }
  } catch (err) {
    // Silently proceed to mock fallback
  }

  if (!post) {
    post = mockPosts.find((p) => p.slug.current === slug)
  }

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  // Resolve image for social previews
  let ogImage = null
  if (post.mainImage?.url) {
    ogImage = post.mainImage.url
  } else if (post.mainImage?.asset?._ref && !post.mainImage.asset._ref.startsWith('mock')) {
    try {
      ogImage = urlForImage(post.mainImage).width(1200).height(630).url()
    } catch (err) {}
  }

  return {
    title: post.title,
    description: post.excerpt || 'Read this post on The Learn Up.',
    openGraph: {
      title: post.title,
      description: post.excerpt || 'Read this post on The Learn Up.',
      type: 'article',
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : [],
    }
  }
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params
  let post = null
  let siteConfig = null
  let adsenseConfig = null
  let relatedPosts = []

  try {
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
    if (projectId && projectId !== 'your-project-id') {
      // Fetch post, siteConfig, and adsenseConfig in parallel to prevent request waterfalls
      const [fetchedPost, fetchedSiteConfig, fetchedAdsenseConfig] = await Promise.all([
        client.fetch(
          `*[_type == "post" && slug.current == $slug && (status == "publish" || (status == "schedule" && publishedAt <= now()) || !defined(status))][0] {
            _id,
            title,
            slug,
            excerpt,
            publishedAt,
            mainImage,
            body,
            author->{
              name,
              slug,
              image,
              bio,
              youtube,
              github,
              twitter,
              facebook
            },
            categories[]->{
              _id,
              title,
              slug
            },
            "comments": *[_type == "comment" && post._ref == ^._id && approved == true] | order(_createdAt desc) {
              _id,
              name,
              comment,
              _createdAt
            }
          }`,
          { slug }
        ),
        client.fetch(`*[_type == "siteConfig"][0]`),
        client.fetch(`*[_type == "adsenseConfig"][0]`)
      ]);

      post = fetchedPost;
      siteConfig = fetchedSiteConfig;
      adsenseConfig = fetchedAdsenseConfig;
    }
  } catch (err) {
    console.warn('Sanity single post fetch failed. Using mock fallback.', err.message)
  }

  // Fallback to mock post if not found in Sanity
  if (!post) {
    const foundMock = mockPosts.find((p) => p.slug.current === slug)
    if (foundMock) {
      post = { ...foundMock }
      try {
        const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
        if (projectId && projectId !== 'your-project-id') {
          const comments = await client.fetch(
            `*[_type == "comment" && post._ref == $postId && approved == true] | order(_createdAt desc) {
              _id,
              name,
              comment,
              _createdAt
            }`,
            { postId: post._id }
          )
          post.comments = comments
        }
      } catch (err) {
        console.warn('Failed to fetch comments for mock post from Sanity:', err.message)
      }
    }
  }

  if (!post) {
    notFound()
  }

  // Fetch related posts (sharing categories)
  if (post.categories && post.categories.length > 0) {
    try {
      const categoryIds = post.categories.map(c => c._id).filter(Boolean)
      const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
      if (projectId && projectId !== 'your-project-id' && categoryIds.length > 0) {
        relatedPosts = await client.fetch(
          `*[_type == "post" && _id != $currentId && count(categories[@._ref in $categoryIds]) > 0] | order(publishedAt desc)[0..2] {
            _id,
            title,
            slug,
            excerpt,
            mainImage,
            publishedAt
          }`,
          { currentId: post._id, categoryIds }
        )
      }
    } catch (err) {
      console.warn('Failed to fetch related posts from Sanity:', err.message)
    }
  }

  // If no related posts found, select a couple of mock posts as fallback
  if (relatedPosts.length === 0) {
    relatedPosts = mockPosts
      .filter((p) => p._id !== post._id)
      .slice(0, 3)
  }

  const readingTime = calculateReadingTime(post.body)
  
  // Resolve main image URL or use a sleek gradient fallback
  let featuredImg = null
  if (post.mainImage?.url) {
    featuredImg = { type: 'url', value: post.mainImage.url }
  } else if (post.mainImage?.asset?._ref && !post.mainImage.asset._ref.startsWith('mock')) {
    try {
      featuredImg = { type: 'url', value: urlForImage(post.mainImage).width(1200).height(600).url() }
    } catch (err) {
      console.error(err)
    }
  }
  if (!featuredImg) {
    const gradients = [
      'linear-gradient(135deg, var(--wp-primary-color) 0%, var(--wp-accent-color) 50%, #ec4899 100%)',
      'linear-gradient(135deg, #3b82f6 0%, #14b8a6 50%, #10b981 100%)',
      'linear-gradient(135deg, #d946ef 0%, #f43f5e 50%, #f59e0b 100%)',
      'linear-gradient(135deg, #8b5cf6 0%, #6366f1 50%, #06b6d4 100%)'
    ]
    const idx = post._id ? post._id.toString().charCodeAt(0) % gradients.length : 0
    featuredImg = { type: 'gradient', value: gradients[idx] }
  }

  // Resolve author image URL
  let authorImg = null
  if (post.author?.image?.asset?._ref && !post.author.image.asset._ref.startsWith('mock')) {
    try {
      authorImg = urlForImage(post.author.image).width(96).height(96).url()
    } catch (err) {
      console.error(err)
    }
  }

  // Extract headings for Section Jump (Table of Contents)
  const extractHeadings = (body) => {
    if (!body) return []
    return body
      .filter((block) => block._type === 'block' && ['h2', 'h3'].includes(block.style))
      .map((block) => {
        const text = block.children ? block.children.map((child) => child.text).join('') : ''
        const id = text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
        return {
          text,
          id,
          style: block.style,
        }
      })
  }

  const headings = extractHeadings(post.body)

  return (
    <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
      <ProgressBar />

      {/* Back Button & Focus Mode Toggle */}
      <div className="flex items-center justify-between mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-primary dark:text-zinc-400 dark:hover:text-primary transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Articles</span>
        </Link>
        <FocusMode />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start post-grid">
        {/* Main Content Column */}
        <div className="lg:col-span-8 space-y-8 post-content-col">
          {/* Header Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {post.categories?.map((cat) => (
                <span
                  key={cat._id}
                  className="text-xs font-bold text-primary dark:text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-wider"
                >
                  {cat.title}
                </span>
              ))}
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-tight">
              {post.title}
            </h1>

            <p className="text-base text-zinc-500 dark:text-zinc-400 leading-relaxed italic border-l-2 border-zinc-200 dark:border-zinc-800 pl-4 py-1">
              {post.excerpt}
            </p>

            {/* Author details & metadata */}
            <div className="flex flex-wrap items-center gap-6 pt-4 text-xs text-zinc-500 dark:text-zinc-400 border-b border-zinc-100 dark:border-zinc-800/60 pb-6">
              <div className="flex items-center gap-2">
                {authorImg ? (
                  <img src={authorImg} alt={post.author?.name} className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold uppercase">
                    {post.author?.name?.slice(0, 2) || 'AD'}
                  </div>
                )}
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">{post.author?.name || 'Admin'}</span>
                
                {/* Author Social Links */}
                {post.author && (post.author.youtube || post.author.github || post.author.twitter || post.author.facebook) && (
                  <div className="flex items-center gap-2.5 ml-3 pl-3 border-l border-zinc-200 dark:border-zinc-800/80">
                    {post.author.youtube && (
                      <a href={post.author.youtube} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-red-500 transition-colors" title="YouTube Channel">
                        <YoutubeIcon size={13} />
                      </a>
                    )}
                    {post.author.github && (
                      <a href={post.author.github} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors" title="GitHub Profile">
                        <GithubIcon size={13} />
                      </a>
                    )}
                    {post.author.twitter && (
                      <a href={post.author.twitter} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-black dark:hover:text-white transition-colors" title="Twitter / X">
                        <TwitterIcon size={13} />
                      </a>
                    )}
                    {post.author.facebook && (
                      <a href={post.author.facebook} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-blue-600 transition-colors" title="Facebook Page">
                        <FacebookIcon size={13} />
                      </a>
                    )}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar size={14} />
                <span>
                  {new Date(post.publishedAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock size={14} />
                <span>{readingTime} min read</span>
              </div>
              <div className="sm:ml-auto flex items-center shrink-0">
                <ReadAloud />
              </div>
            </div>
          </div>

          {/* Hero Image (Thumbnail style) */}
          <div className="max-w-2xl mx-auto aspect-video rounded-3xl overflow-hidden border border-zinc-200/80 dark:border-zinc-800/40 relative shadow-md">
            {featuredImg.type === 'url' ? (
              <img src={featuredImg.value} alt={post.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full" style={{ background: featuredImg.value }} />
            )}
          </div>

          {/* Google AdSense Banner Slot 1 (Above Body) */}
          <AdSlot slot="adsense-banner-post-top" adsenseConfig={adsenseConfig} />

          {/* Section Jump / Table of Contents */}
          {headings.length > 0 && (
            <div className="p-6 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/40 bg-zinc-50/50 dark:bg-zinc-900/20 shadow-sm transition-all duration-300">
              <h3 className="text-xs font-bold tracking-wider text-zinc-400 dark:text-zinc-450 uppercase mb-4">
                Table of Contents (Jump to Section)
              </h3>
              <ul className="space-y-2.5 text-sm">
                {headings.map((heading, idx) => (
                  <li 
                    key={idx} 
                    style={{ paddingLeft: heading.style === 'h3' ? '16px' : '0' }}
                    className="flex items-start gap-1.5"
                  >
                    <span className="text-primary mt-1 shrink-0">→</span>
                    <a
                      href={`#${heading.id}`}
                      className="text-zinc-600 hover:text-primary dark:text-zinc-350 dark:hover:text-primary transition-colors hover:underline"
                    >
                      {heading.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Article Body Content */}
          <div className="prose prose-zinc dark:prose-invert max-w-none">
            {post.body && (
              <PortableText value={post.body} components={RichTextComponents} />
            )}
          </div>

          {/* Social Sharing Buttons */}
          <ShareButtons title={post.title} />

          {/* Google AdSense Banner Slot 2 (Below Body) */}
          <AdSlot slot="adsense-banner-post-bottom" adsenseConfig={adsenseConfig} />

          {/* Related Posts Recommendation Grid */}
          {relatedPosts.length > 0 && (
            <div className="pt-8 border-t border-zinc-100 dark:border-zinc-800">
              <h3 className="text-sm font-bold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase mb-6">
                You May Also Like
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {relatedPosts.map((relPost) => {
                  let relImg = null
                  if (relPost.mainImage?.url) {
                    relImg = relPost.mainImage.url
                  } else if (relPost.mainImage?.asset?._ref && !relPost.mainImage.asset._ref.startsWith('mock')) {
                    try {
                      relImg = urlForImage(relPost.mainImage).width(400).height(225).url()
                    } catch (e) {}
                  }
                  return (
                    <Link
                      key={relPost._id}
                      href={`/posts/${relPost.slug.current}`}
                      className="flex flex-col gap-2.5 group hover:opacity-90 transition-opacity"
                    >
                      <div className="aspect-video w-full rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 relative">
                        {relImg ? (
                          <img src={relImg} alt={relPost.title} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-tr from-primary/10 to-accent/10 flex items-center justify-center text-primary font-bold text-xs">
                            Read Post
                          </div>
                        )}
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                          {relPost.title}
                        </h4>
                        <span className="text-[10px] text-zinc-400 dark:text-zinc-500">
                          {new Date(relPost.publishedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}

          {/* Comments Section */}
          <Comments postId={post._id} initialComments={post.comments || []} />
        </div>

        {/* Sidebar Column */}
        <aside className="lg:col-span-4 space-y-8 lg:sticky lg:top-24 post-sidebar">
          {/* Newsletter Subscription Widget */}
          <NewsletterForm 
            title="Join the Newsletter" 
            description="Subscribe to get notification alerts when we publish new insights on design and web technologies." 
          />

          {/* Sidebar Google AdSense Ad Slot */}
          <AdSlot slot="adsense-sidebar-widget" adsenseConfig={adsenseConfig} format="rectangle" />
        </aside>
      </div>
    </article>
  )
}

export async function generateStaticParams() {
  try {
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
    if (projectId && projectId !== 'your-project-id') {
      const posts = await client.fetch(`*[_type == "post" && (status == "publish" || (status == "schedule" && publishedAt <= now()) || !defined(status))] { "slug": slug.current }`)
      return posts.map((post) => ({
        slug: post.slug,
      }))
    }
  } catch (err) {
    console.warn('Failed to generate static params for posts:', err.message)
  }

  // Fallback to mock data slugs
  return mockPosts.map((post) => ({
    slug: post.slug.current,
  }))
}
