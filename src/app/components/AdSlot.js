'use client'

import { useEffect, useState } from 'react'

export default function AdSlot({ slot, adsenseConfig, layout = 'auto', format = 'auto', responsive = 'true' }) {
  const [adLoaded, setAdLoaded] = useState(false)
  
  // Read CMS values
  const enableAds = adsenseConfig?.enableAds ?? false
  const publisherId = adsenseConfig?.adSensePublisherId || process.env.NEXT_PUBLIC_ADSENSE_CLIENT

  useEffect(() => {
    if (typeof window !== 'undefined' && publisherId && enableAds) {
      try {
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
        setAdLoaded(true)
      } catch (err) {
        console.error('AdSense error:', err)
      }
    }
  }, [publisherId, enableAds])

  // Hide ads and placeholders completely if disabled in CMS
  if (!enableAds) {
    return null
  }

  // If enabled but no publisherId, show a helper placeholder (in dev/layout preview)
  if (!publisherId) {
    return (
      <div className="my-8 mx-auto w-full max-w-5xl p-6 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 flex flex-col items-center justify-center min-h-[120px] md:min-h-[200px] relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="flex flex-col items-center gap-1 z-10 text-center">
          <span className="text-[10px] font-bold tracking-widest text-primary dark:text-primary bg-primary/10 px-2 py-0.5 rounded-full mb-1">
            Google AdSense Ad Slot (CMS Enabled)
          </span>
          <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            [Ad Unit Placement Placeholder]
          </span>
          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1">
            Enter your Google AdSense Publisher ID in Sanity Studio to replace this preview with live ads.
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="my-8 mx-auto overflow-hidden flex justify-center w-full max-w-5xl min-h-[100px]" style={{ clear: 'both' }}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={publisherId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-ad-layout={layout}
        data-full-width-responsive={responsive}
      />
    </div>
  )
}
