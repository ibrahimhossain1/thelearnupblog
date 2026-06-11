import Link from 'next/link'
import NewsletterForm from './NewsletterForm'
import { urlForImage } from '@/sanity/lib/image'

export default function Footer({ siteConfig, socialConfig }) {
  const logoText = siteConfig?.logoText || siteConfig?.siteName || "The Learn Up"
  
  // Resolve custom logo image url
  let logoUrl = null
  if (siteConfig?.logoImage?.asset?._ref && !siteConfig.logoImage.asset._ref.startsWith('mock')) {
    try {
      logoUrl = urlForImage(siteConfig.logoImage).height(64).url()
    } catch (err) {
      console.error('Failed to parse footer logo image:', err)
    }
  }

  return (
    <footer className="w-full border-t border-zinc-200/80 dark:border-zinc-800/50 bg-zinc-50 dark:bg-zinc-950/20 py-12 transition-colors duration-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Brand info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              {logoUrl && (
                <img 
                  src={logoUrl} 
                  alt={logoText} 
                  className="h-8 w-8 rounded-full object-cover dark:brightness-110 border border-zinc-200/50 dark:border-zinc-800/50" 
                />
              )}
              <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-primary via-accent to-pink-500 bg-clip-text text-transparent">
                {logoText}
              </span>
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xs leading-relaxed">
              {siteConfig?.tagline || "Explore premium articles, technical guides, and creative writing. Built with Next.js, Sanity, and deployed to Vercel."}
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-wider text-zinc-400 dark:text-zinc-600 uppercase">Navigation</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="text-zinc-600 hover:text-primary dark:text-zinc-400 dark:hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-zinc-600 hover:text-primary dark:text-zinc-400 dark:hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-zinc-600 hover:text-primary dark:text-zinc-400 dark:hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-zinc-600 hover:text-primary dark:text-zinc-400 dark:hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal (Required for AdSense) */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-wider text-zinc-400 dark:text-zinc-600 uppercase">Legal</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/privacy-policy" className="text-zinc-600 hover:text-primary dark:text-zinc-400 dark:hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-zinc-600 hover:text-primary dark:text-zinc-400 dark:hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-wider text-zinc-400 dark:text-zinc-600 uppercase">Newsletter</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Subscribe to get the latest insights delivered directly to your inbox.
            </p>
            <NewsletterForm title="" description="" placeholder="Your email address" />
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-zinc-200/80 dark:border-zinc-800/30 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center space-x-1">
            <span>{siteConfig?.footerText || `© ${new Date().getFullYear()} The Learn Up. All rights reserved.`}</span>
          </div>
          <div className="flex space-x-6 text-zinc-400 dark:text-zinc-500">            {socialConfig?.twitterLink && (
              <a href={socialConfig.twitterLink} target="_blank" rel="noopener noreferrer" className="hover:text-primary dark:hover:text-primary transition-colors" aria-label="Twitter (X)">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            )}
            {socialConfig?.githubLink && (
              <a href={socialConfig.githubLink} target="_blank" rel="noopener noreferrer" className="hover:text-primary dark:hover:text-primary transition-colors" aria-label="GitHub">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.48C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
              </a>
            )}
            {socialConfig?.facebookLink && (
              <a href={socialConfig.facebookLink} target="_blank" rel="noopener noreferrer" className="hover:text-primary dark:hover:text-primary transition-colors" aria-label="Facebook">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" clipRule="evenodd" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            )}
            {socialConfig?.youtubeLink && (
              <a href={socialConfig.youtubeLink} target="_blank" rel="noopener noreferrer" className="hover:text-primary dark:hover:text-primary transition-colors" aria-label="YouTube">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" clipRule="evenodd" d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 00-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 002.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.002 3.002 0 002.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}
