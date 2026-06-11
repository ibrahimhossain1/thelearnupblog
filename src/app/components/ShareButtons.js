'use client'

import { useState, useEffect } from 'react'
import { Copy, Check, Share2 } from 'lucide-react'

// Simple SVG for Facebook logo
const FacebookIcon = ({ size = 16 }) => (
  <svg className="fill-current" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
  </svg>
)

// Simple SVG for LinkedIn logo
const LinkedinIcon = ({ size = 16 }) => (
  <svg className="fill-current" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" clipRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
)

// Simple SVG for Twitter/X logo
const XIcon = ({ size = 16 }) => (
  <svg className="fill-current" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

// Simple SVG for WhatsApp logo
const WhatsAppIcon = ({ size = 16 }) => (
  <svg className="fill-current" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.97C16.38 2.016 13.921 1 12.007 1 6.57 1 2.146 5.37 2.142 10.8c-.001 1.765.485 3.488 1.408 5.093l-.993 3.626 3.731-.965zm11.517-5.36c-.22-.11-1.302-.642-1.503-.715-.202-.074-.348-.11-.495.11-.147.22-.569.715-.697.863-.128.147-.257.165-.477.055-.22-.11-.93-.343-1.771-1.092-.653-.582-1.095-1.302-1.223-1.522-.128-.22-.014-.339.096-.448.1-.1.22-.257.33-.385.11-.128.147-.22.22-.366.073-.147.037-.275-.018-.385-.055-.11-.495-1.192-.678-1.633-.178-.429-.374-.37-.514-.377-.13-.007-.28-.007-.43-.007-.15 0-.395.056-.603.284-.207.228-.79.771-.79 1.88 0 1.11.808 2.181.921 2.33 1.129 1.485 2.18 2.276 3.662 2.825.894.331 1.706.37 2.316.28.68-.1 2.083-.851 2.375-1.674.292-.823.292-1.53.205-1.678-.088-.15-.235-.23-.456-.34z" />
  </svg>
)

export default function ShareButtons({ title }) {
  const [shareUrl, setShareUrl] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setShareUrl(window.location.href)
    }
  }, [])

  const handleCopyLink = async (e) => {
    e.preventDefault()
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const encodedUrl = encodeURIComponent(shareUrl)
  const encodedTitle = encodeURIComponent(title || 'Check out this article!')

  return (
    <div className="py-6 border-t border-b border-zinc-100 dark:border-zinc-800/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-200">
        <Share2 size={16} className="text-indigo-500" />
        <span className="text-sm font-semibold tracking-wide">Share this article</span>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Facebook */}
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-9 h-9 rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-900/40 hover:bg-[#1877f2]/10 dark:hover:bg-[#1877f2]/10 hover:text-[#1877f2] hover:border-[#1877f2]/30 flex items-center justify-center text-zinc-500 transition-all duration-300 active:scale-95"
          title="Share on Facebook"
        >
          <FacebookIcon size={16} />
        </a>

        {/* Twitter/X */}
        <a
          href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-9 h-9 rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-900/40 hover:bg-black/10 dark:hover:bg-white/10 hover:text-black dark:hover:text-white hover:border-black/30 dark:hover:border-white/30 flex items-center justify-center text-zinc-500 transition-all duration-300 active:scale-95"
          title="Share on X (Twitter)"
        >
          <XIcon size={14} />
        </a>

        {/* LinkedIn */}
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-9 h-9 rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-900/40 hover:bg-[#0a66c2]/10 dark:hover:bg-[#0a66c2]/10 hover:text-[#0a66c2] hover:border-[#0a66c2]/30 flex items-center justify-center text-zinc-500 transition-all duration-300 active:scale-95"
          title="Share on LinkedIn"
        >
          <LinkedinIcon size={16} />
        </a>

        {/* WhatsApp */}
        <a
          href={`https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-9 h-9 rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-900/40 hover:bg-[#25d366]/10 dark:hover:bg-[#25d366]/10 hover:text-[#25d366] hover:border-[#25d366]/30 flex items-center justify-center text-zinc-500 transition-all duration-300 active:scale-95"
          title="Share on WhatsApp"
        >
          <WhatsAppIcon size={16} />
        </a>

        {/* Copy Link */}
        <button
          onClick={handleCopyLink}
          className={`h-9 px-4 rounded-xl border flex items-center gap-2 text-xs font-semibold transition-all duration-300 active:scale-95 ${
            copied
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500 dark:text-emerald-400'
              : 'border-zinc-200 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-900/40 hover:bg-indigo-500/10 dark:hover:bg-indigo-400/10 hover:text-indigo-650 dark:hover:text-indigo-400 hover:border-indigo-500/30 text-zinc-500'
          }`}
          title="Copy post link"
        >
          {copied ? (
            <>
              <Check size={14} />
              <span>Link Copied!</span>
            </>
          ) : (
            <>
              <Copy size={14} />
              <span>Copy Link</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
