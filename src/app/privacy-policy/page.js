import { client } from '@/sanity/lib/client'
import { PortableText } from '@portabletext/react'
import { RichTextComponents } from '@/app/components/RichText'

export const revalidate = 60

export const metadata = {
  title: 'Privacy Policy',
  description: 'Our privacy policy describes how we collect, store, and protect your information.',
}

export default async function PrivacyPolicyPage() {
  let pageData = null
  try {
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
    if (projectId && projectId !== 'your-project-id') {
      pageData = await client.fetch(`*[_type == "page" && slug.current == "privacy-policy"][0]`)
    }
  } catch (err) {
    console.warn('Failed to fetch privacy-policy page from Sanity:', err.message)
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
          Privacy Policy
        </h1>
        <p className="text-xs text-zinc-400 dark:text-zinc-500 mb-8">Last Updated: June 10, 2026</p>
        
        <div className="space-y-6 text-zinc-600 dark:text-zinc-300 leading-relaxed text-sm md:text-base">
          <p>
            At The Learn Up, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by The Learn Up and how we use it.
          </p>
          
          <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 mt-8">Log Files</h2>
          <p>
            The Learn Up follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services' analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users' movement on the website, and gathering demographic information.
          </p>

          <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 mt-8">Cookies and Web Beacons</h2>
          <p>
            Like any other website, The Learn Up uses 'cookies'. These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.
          </p>

          <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 mt-8">Google DoubleClick DART Cookie</h2>
          <p>
            Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to our site and other sites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL – <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://policies.google.com/technologies/ads</a>.
          </p>

          <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 mt-8">Third-Party Privacy Policies</h2>
          <p>
            The Learn Up's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.
          </p>
          <p>
            Third-party ad servers or ad networks uses technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on The Learn Up, which are sent directly to users' browser. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit.
          </p>
          <p>
            Note that The Learn Up has no access to or control over these cookies that are used by third-party advertisers.
          </p>

          <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 mt-8">Consent</h2>
          <p>
            By using our website, you hereby consent to our Privacy Policy and agree to its Terms and Conditions.
          </p>
        </div>
      </div>
    </div>
  )
}
