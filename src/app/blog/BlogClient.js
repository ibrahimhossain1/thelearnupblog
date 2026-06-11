'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Calendar, User, ChevronLeft, ChevronRight } from 'lucide-react'
import { urlForImage } from '@/sanity/lib/image'

const POSTS_PER_PAGE = 18

export default function BlogClient({ posts = [], categories = [] }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)

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
    
    // Choose gradient based on post ID
    const gradients = [
      'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)',
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

  // Pagination calculations
  const totalPosts = filteredPosts.length
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE)
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE)

  // Reset page when search or category changes
  const handleCategoryChange = (catSlug) => {
    setSelectedCategory(catSlug)
    setCurrentPage(1)
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1)
  }

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1)
  }

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Title */}
      <div className="space-y-4 text-center md:text-left">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          All Articles
        </h1>
        <p className="text-sm md:text-base text-zinc-500 dark:text-zinc-400 max-w-2xl leading-relaxed">
          Browse through our full library of design guidelines, technical resources, and monetization guides.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-zinc-200/80 dark:border-zinc-800/30">
        {/* Categories Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none shrink-0">
          <button
            onClick={() => handleCategoryChange('all')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border shrink-0 transition-all ${
              selectedCategory === 'all'
                ? 'bg-zinc-900 text-white border-zinc-900 dark:bg-white dark:text-zinc-900 dark:border-white shadow-sm'
                : 'bg-transparent text-zinc-500 border-zinc-200 hover:border-zinc-350 dark:text-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-700'
            }`}
          >
            All Posts
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => handleCategoryChange(cat.slug?.current)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border shrink-0 transition-all ${
                selectedCategory === cat.slug?.current
                  ? 'bg-zinc-900 text-white border-zinc-900 dark:bg-white dark:text-zinc-900 dark:border-white shadow-sm'
                  : 'bg-transparent text-zinc-500 border-zinc-200 hover:border-zinc-350 dark:text-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-700'
              }`}
            >
              {cat.title}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:max-w-md">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-400/30 transition-all"
          />
        </div>
      </section>

      {/* Grid of posts */}
      <section className="space-y-12">
        {paginatedPosts.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl">
            <p className="text-zinc-500 dark:text-zinc-400 text-sm">No articles found matching your criteria.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedPosts.map((post) => {
                const img = getPostImage(post)
                return (
                  <article
                    key={post._id}
                    className="group flex flex-col rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/80 overflow-hidden hover:shadow-lg dark:hover:bg-zinc-900/95 transition-all duration-300"
                  >
                    {/* Card Image */}
                    <Link href={`/posts/${post.slug?.current}`} className="relative block aspect-video overflow-hidden">
                      {img.type === 'url' ? (
                        <img
                          src={img.value}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-800 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:scale-104"
                        />
                      ) : (
                        <div
                          className="w-full h-full transition-transform duration-800 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:scale-104"
                          style={{ background: img.value }}
                        />
                      )}
                    </Link>

                    {/* Card Content */}
                    <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        {/* Meta Tags */}
                        <div className="flex items-center gap-2">
                          {post.categories?.map((cat) => (
                            <span
                              key={cat._id}
                              className="text-[10px] font-extrabold text-indigo-500 dark:text-indigo-400 bg-indigo-500/10 dark:bg-indigo-400/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider"
                            >
                              {cat.title}
                            </span>
                          ))}
                        </div>

                        {/* Title */}
                        <h3 className="text-lg font-bold text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 leading-snug">
                          <Link href={`/posts/${post.slug?.current}`}>
                            {post.title}
                          </Link>
                        </h3>

                        {/* Excerpt */}
                        <p className="text-xs md:text-sm text-zinc-550 dark:text-zinc-450 line-clamp-3 leading-relaxed">
                          {post.excerpt}
                        </p>
                      </div>

                      {/* Footer Meta */}
                      <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800/50 text-[11px] text-zinc-400 dark:text-zinc-500">
                        <div className="flex items-center gap-1.5 font-semibold text-zinc-700 dark:text-zinc-300">
                          <User size={12} />
                          <span>{post.author?.name || 'Admin'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar size={12} />
                          <span>
                            {new Date(post.publishedAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-6 pt-6 border-t border-zinc-200/60 dark:border-zinc-800/30">
                <button
                  onClick={goToPrevPage}
                  disabled={currentPage === 1}
                  className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-350 disabled:opacity-40 disabled:pointer-events-none transition-all duration-200 active:scale-95 flex items-center justify-center"
                  aria-label="Previous Page"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-xs md:text-sm font-semibold text-zinc-555 dark:text-zinc-400">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-350 disabled:opacity-40 disabled:pointer-events-none transition-all duration-200 active:scale-95 flex items-center justify-center"
                  aria-label="Next Page"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  )
}
