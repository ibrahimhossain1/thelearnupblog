'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, ArrowRight, Flame, Play, Tv, Send } from 'lucide-react'
import { urlForImage } from '@/sanity/lib/image'

export default function HomeClient({ posts = [], categories = [], youtubeVideos = [] }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [currentSlide, setCurrentSlide] = useState(0)

  // Newsletter State
  const [email, setEmail] = useState('')
  const [newsletterLoading, setNewsletterLoading] = useState(false)
  const [newsletterStatus, setNewsletterStatus] = useState({ type: '', message: '' })

  // Resolve main image URL or use a sleek gradient fallback
  const getPostImage = (post) => {
    if (post.mainImage?.url) {
      return { type: 'url', value: post.mainImage.url }
    }
    if (post.mainImage?.asset?._ref && !post.mainImage.asset._ref.startsWith('mock')) {
      try {
        return { type: 'url', value: urlForImage(post.mainImage).width(800).height(480).url() }
      } catch (err) {
        console.error('Failed to generate image url:', err)
      }
    }
    
    const gradients = [
      'linear-gradient(135deg, var(--wp-primary-color) 0%, var(--wp-accent-color) 50%, #ec4899 100%)',
      'linear-gradient(135deg, #3b82f6 0%, #14b8a6 50%, #10b981 100%)',
      'linear-gradient(135deg, #d946ef 0%, #f43f5e 50%, #f59e0b 100%)',
      'linear-gradient(135deg, #8b5cf6 0%, #6366f1 50%, #06b6d4 100%)'
    ]
    const idx = post._id ? post._id.toString().charCodeAt(0) % gradients.length : 0
    return { type: 'gradient', value: gradients[idx] }
  }

  // Filter posts based on search and selected category
  const filteredPosts = posts.filter((post) => {
    // Safe check: Filter out posts that do not have a valid slug to avoid broken dynamic routes
    if (!post.slug?.current) return false

    const matchesSearch =
      (post.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory =
      selectedCategory === 'all' ||
      post.categories?.some((cat) => cat.slug?.current === selectedCategory)

    return matchesSearch && matchesCategory
  })

  // Find featured posts for the slideshow
  const featuredPosts = posts.filter((p) => p.isFeatured).length > 0
    ? posts.filter((p) => p.isFeatured)
    : posts.slice(0, 3)

  // Auto cycle slides every 5 seconds (clears and restarts interval on slide change to avoid quick double-jumps)
  useEffect(() => {
    if (featuredPosts.length <= 1) return
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredPosts.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [currentSlide, featuredPosts.length])

  // Setup Trending Posts
  const activeFeaturedId = featuredPosts[currentSlide]?._id
  let trendingList = posts.filter(p => p.isTrending && p._id !== activeFeaturedId)
  if (trendingList.length === 0) {
    trendingList = posts.filter(p => p._id !== activeFeaturedId).slice(0, 4)
  } else {
    trendingList = trendingList.slice(0, 4)
  }

  // Handle Newsletter Submission
  const handleSubscribe = async (e) => {
    e.preventDefault()
    if (!email) return
    setNewsletterLoading(true)
    setNewsletterStatus({ type: '', message: '' })

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (res.ok) {
        setNewsletterStatus({ type: 'success', message: data.message })
        setEmail('')
      } else {
        setNewsletterStatus({ type: 'error', message: data.message || 'Something went wrong.' })
      }
    } catch (err) {
      console.error(err)
      setNewsletterStatus({ type: 'error', message: 'Failed to connect. Please try again.' })
    } finally {
      setNewsletterLoading(false)
    }
  }

  // Default YouTube videos if not set in Sanity
  const defaultVideos = [
    { title: "Next.js 15 + Sanity CMS Blog Tutorial", videoId: "bM2G_q43d4c", description: "Learn how to build this full-featured headless CMS blogging system with high performance and interactive UI." },
    { title: "ChatGPT Prompt Engineering for Developers", videoId: "mJN8OS-q080", description: "Learn how to write effective prompts to generate code, scripts, and production-ready architectures." },
    { title: "Vercel Analytics & SEO Best Practices", videoId: "A3O59gRUpF4", description: "Optimize your Next.js application for ultimate speed, SEO scores, and tracking visitor analytics in real-time." }
  ]
  const finalVideos = youtubeVideos && youtubeVideos.length > 0 ? youtubeVideos : defaultVideos

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      
      {/* 1. Hero Section (Featured Slideshow) */}
      {featuredPosts.length > 0 && (
        <div className="relative rounded-3xl overflow-hidden border border-zinc-200/80 dark:border-zinc-800/50 bg-white dark:bg-zinc-900/30 shadow-lg group h-[500px] sm:h-[450px]">
          <div className="relative h-full overflow-hidden">
            {featuredPosts.map((post, index) => {
              const img = getPostImage(post)
              const isActive = index === currentSlide

              return (
                <div
                  key={post._id}
                  className={`absolute inset-0 grid grid-cols-1 md:grid-cols-12 gap-0 items-stretch ${
                    isActive ? 'slide-active' : 'slide-inactive'
                  }`}
                >
                  {/* Image */}
                  <div className="md:col-span-7 relative min-h-[200px] md:min-h-full overflow-hidden">
                    {img.type === 'url' ? (
                      <img
                        src={img.value}
                        alt={post.title}
                        className="slide-image absolute inset-0 w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        className="slide-image absolute inset-0 w-full h-full"
                        style={{ background: img.value }}
                      />
                    )}
                    {post.categories?.[0] && (
                      <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold text-white bg-black/40 backdrop-blur-md border border-white/10 uppercase tracking-wider z-10">
                        {post.categories[0].title}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="md:col-span-5 p-6 md:p-8 flex flex-col justify-center bg-zinc-50/40 dark:bg-zinc-900/60 relative">
                    <div className="slide-content flex flex-col gap-3">
                      <span className="text-[10px] font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full self-start uppercase tracking-wider">
                        Featured Article
                      </span>
                      <h2 className="text-lg md:text-xl font-bold tracking-tight text-zinc-900 dark:text-white leading-snug line-clamp-3">
                        {post.title}
                      </h2>
                      <p className="text-xs text-zinc-550 dark:text-zinc-400 line-clamp-3 leading-relaxed">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center gap-4 pt-3 border-t border-zinc-200/60 dark:border-zinc-800 text-[10px] text-zinc-500 dark:text-zinc-400">
                        <span className="font-semibold text-zinc-700 dark:text-zinc-300">{post.author?.name || 'Admin'}</span>
                        <span>•</span>
                        <span>
                          {new Date(post.publishedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      <Link
                        href={`/posts/${post.slug?.current}`}
                        className="mt-2 inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-tr from-primary to-accent hover:from-primary-hover hover:to-accent-hover text-white font-bold text-xs shadow-md shadow-primary/10 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] self-start"
                      >
                        <span>Read Article</span>
                        <ArrowRight size={14} />
                      </Link>
                    </div>

                    {/* Dots Indicator */}
                    {featuredPosts.length > 1 && (
                      <div className="absolute bottom-4 left-6 flex space-x-1.5 z-25">
                        {featuredPosts.map((_, dotIdx) => (
                          <button
                            key={dotIdx}
                            onClick={() => setCurrentSlide(dotIdx)}
                            className={`h-1.5 rounded-full transition-all duration-500 ${
                              dotIdx === currentSlide 
                                ? 'bg-primary w-6' 
                                : 'bg-zinc-300 dark:bg-zinc-700 hover:bg-zinc-400 dark:hover:bg-zinc-650 w-1.5'
                            }`}
                            aria-label={`Go to slide ${dotIdx + 1}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* 2. Filter, Search and Article Grid */}
      <section id="articles-section" className="space-y-8 pt-4">
        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-zinc-200/80 dark:border-zinc-800/50">
          {/* Categories Carousel/Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none shrink-0">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border shrink-0 transition-all ${
                selectedCategory === 'all'
                  ? 'bg-zinc-900 text-white border-zinc-900 dark:bg-white dark:text-zinc-900 dark:border-white shadow-sm'
                  : 'bg-transparent text-zinc-500 border-zinc-250 hover:border-zinc-350 dark:text-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-750'
              }`}
            >
              All Posts
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => setSelectedCategory(cat.slug?.current)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border shrink-0 transition-all ${
                  selectedCategory === cat.slug?.current
                    ? 'bg-zinc-900 text-white border-zinc-900 dark:bg-white dark:text-zinc-900 dark:border-white shadow-sm'
                    : 'bg-transparent text-zinc-500 border-zinc-250 hover:border-zinc-350 dark:text-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-750'
                }`}
              >
                {cat.title}
              </button>
            ))}
          </div>

          {/* Search & Reset */}
          <div className="flex items-center gap-3 w-full md:max-w-md">
            <div className="relative flex-grow">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 dark:focus:ring-primary/30 transition-all"
              />
            </div>
            {(selectedCategory !== 'all' || searchQuery !== '') && (
              <button
                onClick={() => {
                  setSelectedCategory('all')
                  setSearchQuery('')
                }}
                className="px-4 py-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 font-bold text-xs transition-colors shrink-0"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Trending Now Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Flame size={20} className="text-amber-500 fill-amber-500 animate-pulse" />
            <h2 className="text-base md:text-lg font-bold text-zinc-900 dark:text-white">Trending Now</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trendingList.slice(0, 3).map((post) => {
              const img = getPostImage(post)
              return (
                <article
                  key={post._id}
                  className="group flex flex-col rounded-3xl border border-zinc-200/80 dark:border-zinc-800/85 bg-white dark:bg-zinc-900/30 overflow-hidden hover:shadow-lg dark:hover:bg-zinc-900/60 hover:border-primary/20 dark:hover:border-primary/20 transition-all duration-300"
                >
                  {/* Card Image */}
                  <Link href={`/posts/${post.slug?.current}`} className="relative block aspect-video overflow-hidden bg-zinc-100 dark:bg-zinc-950">
                    {img.type === 'url' ? (
                      <img
                        src={img.value}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                      />
                    ) : (
                      <div
                        className="w-full h-full"
                        style={{ background: img.value }}
                      />
                    )}
                  </Link>

                  {/* Card Content */}
                  <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {post.categories?.map((cat) => (
                          <span
                            key={cat._id}
                            className="text-[9px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md uppercase tracking-wider"
                          >
                            {cat.title}
                          </span>
                        ))}
                      </div>

                      <h3 className="text-sm md:text-base font-bold text-zinc-900 dark:text-white group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                        <Link href={`/posts/${post.slug?.current}`}>
                          {post.title}
                        </Link>
                      </h3>

                      <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-3 leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800/50 text-[10px] text-zinc-400 dark:text-zinc-500">
                      <span className="font-semibold text-zinc-700 dark:text-zinc-300">{post.author?.name || 'Admin'}</span>
                      <span>
                        {new Date(post.publishedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </div>

        <div className="flex flex-col gap-1 border-t border-zinc-200/80 dark:border-zinc-800/50 pt-8">
          <h3 className="font-bold text-zinc-900 dark:text-white text-lg sm:text-xl">Recent Articles</h3>
          <p className="text-xs text-zinc-550 dark:text-zinc-400">
            Browse the latest insights, tutorials, and announcements.
          </p>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl">
            <p className="text-zinc-500 dark:text-zinc-400 text-sm">No articles found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.slice(0, 9).map((post) => {
              const img = getPostImage(post)
              return (
                <article
                  key={post._id}
                  className="group flex flex-col rounded-3xl border border-zinc-200/80 dark:border-zinc-800/85 bg-white dark:bg-zinc-900/30 overflow-hidden hover:shadow-lg dark:hover:bg-zinc-900/60 hover:border-primary/20 dark:hover:border-primary/20 transition-all duration-300"
                >
                  {/* Card Image */}
                  <Link href={`/posts/${post.slug?.current}`} className="relative block aspect-video overflow-hidden bg-zinc-100 dark:bg-zinc-950">
                    {img.type === 'url' ? (
                      <img
                        src={img.value}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                      />
                    ) : (
                      <div
                        className="w-full h-full"
                        style={{ background: img.value }}
                      />
                    )}
                  </Link>

                  {/* Card Content */}
                  <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {post.categories?.map((cat) => (
                          <span
                            key={cat._id}
                            className="text-[9px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md uppercase tracking-wider"
                          >
                            {cat.title}
                          </span>
                        ))}
                      </div>

                      <h3 className="text-sm md:text-base font-bold text-zinc-900 dark:text-white group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                        <Link href={`/posts/${post.slug?.current}`}>
                          {post.title}
                        </Link>
                      </h3>

                      <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-3 leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800/50 text-[10px] text-zinc-400 dark:text-zinc-500">
                      <span className="font-semibold text-zinc-700 dark:text-zinc-300">{post.author?.name || 'Admin'}</span>
                      <span>
                        {new Date(post.publishedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>

      {/* 3. YouTube Video Showcase Widget */}
      <section className="space-y-6 pt-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 flex items-center gap-2">
            <Tv size={20} className="text-primary" />
            <span>Featured Video Guides</span>
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Watch premium video tutorials, walkthroughs, and updates from the @thelearnup channel.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {finalVideos.map((video, idx) => (
            <div key={idx} className="flex flex-col rounded-3xl border border-zinc-200/60 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/30 overflow-hidden hover:shadow-lg hover:border-primary/20 dark:hover:border-primary/20 transition-all duration-300 group">
              <div className="relative aspect-video rounded-t-3xl overflow-hidden shadow-sm bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${video.videoId}`}
                  title={video.title}
                  className="absolute inset-0 w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="p-5 flex-grow flex flex-col justify-between space-y-2">
                <div className="space-y-1">
                  <h4 className="font-bold text-zinc-800 dark:text-zinc-200 text-sm leading-snug group-hover:text-primary transition-colors">
                    {video.title}
                  </h4>
                  {video.description && (
                    <p className="text-xs text-zinc-500 dark:text-zinc-450 line-clamp-2 leading-relaxed">
                      {video.description}
                    </p>
                  )}
                </div>
                <div className="pt-2 flex items-center gap-1.5 text-[10px] font-bold text-red-500 uppercase tracking-wider">
                  <Play size={10} className="fill-red-500" />
                  <span>Watch on YouTube</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Full-Width Newsletter Banner */}
      <section className="relative rounded-3xl overflow-hidden border border-zinc-250/60 dark:border-zinc-800 bg-gradient-to-r from-primary/10 via-accent/10 to-pink-500/10 dark:from-primary/5 dark:via-accent/5 dark:to-pink-500/5 p-8 md:p-12 shadow-sm text-center flex flex-col items-center justify-center space-y-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="space-y-2 z-10 max-w-xl">
          <h3 className="font-extrabold text-zinc-800 dark:text-zinc-100 text-2xl md:text-3xl tracking-tight leading-tight">
            Stay Ahead of the Curve
          </h3>
          <p className="text-xs md:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Join the community newsletter of <strong>The Learn Up</strong> to receive weekly guides, exclusive prompt packs, and web development resources directly in your inbox.
          </p>
        </div>

        <form onSubmit={handleSubscribe} className="relative z-10 w-full max-w-md flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="flex-grow px-5 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 dark:focus:ring-primary/30 transition-all text-zinc-800 dark:text-zinc-100 shadow-sm"
          />
          <button
            type="submit"
            disabled={newsletterLoading}
            className="px-6 py-3 rounded-2xl bg-gradient-to-tr from-primary to-accent hover:from-primary-hover hover:to-accent-hover text-white text-sm font-bold shadow-md shadow-primary/10 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {newsletterLoading ? (
              <span>Subscribing...</span>
            ) : (
              <>
                <span>Join Now</span>
                <Send size={14} />
              </>
            )}
          </button>
        </form>

        {newsletterStatus.message && (
          <div
            className={`z-10 px-5 py-3 rounded-2xl text-xs font-bold text-center max-w-md w-full animate-fade-in ${
              newsletterStatus.type === 'success'
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
            }`}
          >
            {newsletterStatus.message}
          </div>
        )}
      </section>

    </div>
  )
}
