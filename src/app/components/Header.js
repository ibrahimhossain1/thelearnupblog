'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTheme } from '../context/ThemeContext'
import { Sun, Moon, Rss, Menu, X } from 'lucide-react'
import { urlForImage } from '@/sanity/lib/image'

export default function Header({ siteConfig }) {
  const { theme, toggleTheme } = useTheme()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const logoText = siteConfig?.logoText || siteConfig?.siteName || "The Learn Up"
  
  // Resolve custom logo image url
  let logoUrl = null
  if (siteConfig?.logoImage?.asset?._ref && !siteConfig.logoImage.asset._ref.startsWith('mock')) {
    try {
      logoUrl = urlForImage(siteConfig.logoImage).height(64).url()
    } catch (err) {
      console.error('Failed to parse logo image:', err)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/80 dark:border-zinc-800/50 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2.5 group">
          {logoUrl ? (
            <img 
              src={logoUrl} 
              alt={logoText} 
              className="h-9 w-9 rounded-full object-cover shadow-md shadow-primary/10 group-hover:scale-105 transition-transform duration-300 border border-zinc-200/50 dark:border-zinc-800/50" 
            />
          ) : (
            <div className="p-2 rounded-xl bg-gradient-to-tr from-primary to-accent text-white shadow-md shadow-primary/10 group-hover:scale-105 transition-transform duration-300">
              <Rss size={20} />
            </div>
          )}
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary via-accent to-pink-500 bg-clip-text text-transparent group-hover:opacity-90 transition-opacity">
            {logoText}
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
          {siteConfig?.menuItems && siteConfig.menuItems.length > 0 ? (
            siteConfig.menuItems.map((item, idx) => (
              <Link
                key={idx}
                href={item.url}
                className="text-zinc-600 hover:text-primary dark:text-zinc-300 dark:hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            ))
          ) : (
            <>
              <Link href="/" className="text-zinc-600 hover:text-primary dark:text-zinc-300 dark:hover:text-primary transition-colors">
                Home
              </Link>
              <Link href="/blog" className="text-zinc-600 hover:text-primary dark:text-zinc-300 dark:hover:text-primary transition-colors">
                Blog
              </Link>
              <Link href="/about" className="text-zinc-600 hover:text-primary dark:text-zinc-300 dark:hover:text-primary transition-colors">
                About
              </Link>
              <Link href="/contact" className="text-zinc-600 hover:text-primary dark:text-zinc-300 dark:hover:text-primary transition-colors">
                Contact
              </Link>
            </>
          )}
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-3.5">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-all duration-200 focus:outline-none"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-all focus:outline-none"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-200/80 dark:border-zinc-800/50 bg-white dark:bg-zinc-950 px-4 py-4 space-y-3 shadow-inner">
          <nav className="flex flex-col space-y-2.5">
            {siteConfig?.menuItems && siteConfig.menuItems.length > 0 ? (
              siteConfig.menuItems.map((item, idx) => (
                <Link
                  key={idx}
                  href={item.url}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-zinc-650 hover:text-primary dark:text-zinc-300 dark:hover:text-primary transition-colors text-sm font-semibold py-1 px-2 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900"
                >
                  {item.label}
                </Link>
              ))
            ) : (
              <>
                <Link 
                  href="/" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-zinc-650 hover:text-primary dark:text-zinc-300 dark:hover:text-primary transition-colors text-sm font-semibold py-1 px-2 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900"
                >
                  Home
                </Link>
                <Link 
                  href="/blog" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-zinc-650 hover:text-primary dark:text-zinc-300 dark:hover:text-primary transition-colors text-sm font-semibold py-1 px-2 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900"
                >
                  Blog
                </Link>
                <Link 
                  href="/about" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-zinc-650 hover:text-primary dark:text-zinc-300 dark:hover:text-primary transition-colors text-sm font-semibold py-1 px-2 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900"
                >
                  About
                </Link>
                <Link 
                  href="/contact" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-zinc-650 hover:text-primary dark:text-zinc-300 dark:hover:text-primary transition-colors text-sm font-semibold py-1 px-2 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900"
                >
                  Contact
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
