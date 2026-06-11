import { client } from '@/sanity/lib/client'
import { PortableText } from '@portabletext/react'
import { RichTextComponents } from '@/app/components/RichText'

export const revalidate = 60

export const metadata = {
  title: 'About Us',
  description: 'Learn more about The Learn Up and our mission to share premium insights.',
}

export default async function AboutPage() {
  let pageData = null
  try {
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
    if (projectId && projectId !== 'your-project-id') {
      pageData = await client.fetch(`*[_type == "page" && slug.current == "about"][0]`)
    }
  } catch (err) {
    console.warn('Failed to fetch about page from Sanity:', err.message)
  }

  if (pageData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8 animate-fade-in">
        <div className="space-y-8">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl bg-gradient-to-r from-primary via-accent to-pink-500 bg-clip-text text-transparent">
            {pageData.title}
          </h1>
          {pageData.body && (
            <div className="prose prose-zinc dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-300 leading-relaxed text-sm md:text-base">
              <PortableText value={pageData.body} components={RichTextComponents} />
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <div className="space-y-12">
        {/* Title */}
        <div className="text-center md:text-left space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl bg-gradient-to-r from-primary via-accent to-pink-500 bg-clip-text text-transparent">
            About The Learn Up
          </h1>
          <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl">
            We are dedicated to bringing you high-quality insights on modern technology, premium design aesthetics, and web developments.
          </p>
        </div>

        {/* Intro */}
        <div className="relative p-8 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/60 bg-zinc-50/50 dark:bg-zinc-900/50 overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-100 transition-opacity duration-300" />
          <div className="relative z-10 space-y-4 text-zinc-600 dark:text-zinc-300 leading-relaxed text-sm md:text-base">
            <h2 className="text-xl font-bold text-zinc-850 dark:text-zinc-100">Our Mission</h2>
            <p>
              The Learn Up was created as a creative outlet and a technical resource for developers, designers, and tech enthusiasts. We write about complex topics and break them down into readable, beautiful, and interactive articles.
            </p>
            <p>
              Our code design standards prioritize absolute visual excellence, using high-performance static rendering, modern fonts, glassmorphism designs, and smooth micro-animations. We believe that websites should not only be functional but should also provide a delightful user experience.
            </p>
          </div>
        </div>

        {/* Team Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">Meet the Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-bold shrink-0">
                FA
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-zinc-800 dark:text-zinc-100">Faysal Ahmed</h3>
                <p className="text-xs text-primary font-medium">Founder & Chief Editor</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">
                  Full stack developer and tech enthusiast. Enthusiastic about creating state-of-the-art web applications.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-accent to-pink-600 flex items-center justify-center text-white font-bold shrink-0">
                AG
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-zinc-800 dark:text-zinc-100">Antigravity AI</h3>
                <p className="text-xs text-accent font-medium">Content Architect & Tech Writer</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">
                  Advanced AI model designed by Google DeepMind. Specialized in writing clean code and outstanding tech blogs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
