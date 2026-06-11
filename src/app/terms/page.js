import { client } from '@/sanity/lib/client'
import { PortableText } from '@portabletext/react'
import { RichTextComponents } from '@/app/components/RichText'

export const revalidate = 60

export const metadata = {
  title: 'Terms of Service',
  description: 'Terms and conditions for using the The Learn Up website.',
}

export default async function TermsOfServicePage() {
  let pageData = null
  try {
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
    if (projectId && projectId !== 'your-project-id') {
      pageData = await client.fetch(`*[_type == "page" && slug.current == "terms"][0]`)
    }
  } catch (err) {
    console.warn('Failed to fetch terms page from Sanity:', err.message)
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
      <div className="prose prose-zinc dark:prose-invert max-w-none">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl mb-2 bg-gradient-to-r from-primary via-accent to-pink-500 bg-clip-text text-transparent">
          Terms of Service
        </h1>
        <p className="text-xs text-zinc-400 dark:text-zinc-500 mb-8">Last Updated: June 10, 2026</p>
        
        <div className="space-y-6 text-zinc-600 dark:text-zinc-300 leading-relaxed text-sm md:text-base">
          <p>
            Welcome to The Learn Up! These terms and conditions outline the rules and regulations for the use of The Learn Up's Website.
          </p>
          <p>
            By accessing this website, we assume you accept these terms and conditions. Do not continue to use The Learn Up if you do not agree to take all of the terms and conditions stated on this page.
          </p>

          <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 mt-8">License</h2>
          <p>
            Unless otherwise stated, The Learn Up and/or its licensors own the intellectual property rights for all material on The Learn Up. All intellectual property rights are reserved. You may access this from The Learn Up for your own personal use subjected to restrictions set in these terms and conditions.
          </p>
          <p>You must not:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Republish material from The Learn Up</li>
            <li>Sell, rent or sub-license material from The Learn Up</li>
            <li>Reproduce, duplicate or copy material from The Learn Up</li>
            <li>Redistribute content from The Learn Up</li>
          </ul>

          <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 mt-8">User Comments & Content</h2>
          <p>
            Parts of this website offer an opportunity for users to post and exchange opinions and information in certain areas of the website. Comments do not reflect the views and opinions of The Learn Up, its agents, and/or affiliates. Comments reflect the views and opinions of the person who posts their views and opinions.
          </p>

          <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 mt-8">Disclaimer</h2>
          <p>
            To the maximum extent permitted by applicable law, we exclude all representations, warranties and conditions relating to our website and the use of this website. Nothing in this disclaimer will:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>limit or exclude our or your liability for death or personal injury;</li>
            <li>limit or exclude our or your liability for fraud or fraudulent microrepresentation;</li>
            <li>limit any of our or your liabilities in any way that is not permitted under applicable law.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
