import { client } from '@/sanity/lib/client'
import { Sparkles, Cpu, Video, Terminal, Mail, ArrowUpRight } from 'lucide-react'

const FacebookIcon = ({ size = 20 }) => (
  <svg className="fill-current" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" clipRule="evenodd" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
)

const YoutubeIcon = ({ size = 20 }) => (
  <svg className="fill-current" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" clipRule="evenodd" d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 00-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 002.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.002 3.002 0 002.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
)

export const revalidate = 60

export const metadata = {
  title: 'About Us',
  description: 'Learn more about The Learn Up and our mission to share premium technology and AI insights.',
}

export default async function AboutPage() {
  let siteConfig = null
  let socialConfig = null

  try {
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
    if (projectId && projectId !== 'your-project-id') {
      [siteConfig, socialConfig] = await Promise.all([
        client.fetch(`*[_type == "siteConfig"][0]`),
        client.fetch(`*[_type == "socialMedia"][0]`)
      ])
    }
  } catch (err) {
    console.warn('Failed to fetch page configs for About page:', err.message)
  }

  const youtubeUrl = socialConfig?.youtubeLink || 'https://www.youtube.com'
  const facebookUrl = socialConfig?.facebookLink || 'https://www.facebook.com'
  const businessEmail = 'thelearnuponline@gmail.com'
  const featuredVideoId = siteConfig?.youtubeVideos?.[0]?.videoId || 'dQw4w9WgXcQ'

  return (
    <div className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8 space-y-20 font-sans">
      {/* Hero Section */}
      <div className="text-center space-y-6 max-w-3xl mx-auto">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-650 dark:text-indigo-400 border border-indigo-500/20 uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          Master Tomorrow Today
        </span>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-505 bg-clip-text text-transparent leading-tight">
          About The Learn Up
        </h1>
        <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-300 font-medium leading-relaxed">
          Welcome to The Learn Up – your ultimate digital hub for mastering tomorrow’s technology today!
        </p>
      </div>

      {/* Intro Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
        <div className="md:col-span-7 p-8 sm:p-10 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 backdrop-blur-sm flex flex-col justify-center space-y-4">
          <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
            The Learn Up is a premier technology and Artificial Intelligence (AI) platform. Our mission is to break down complex innovations into simple, actionable insights. Whether you are looking for deep-dive tutorials on Large Language Models (LLMs), practical guides on AI image and video generation, or the absolute latest updates in the fast-paced world of artificial intelligence, we have you covered.
          </p>
        </div>
        <div className="md:col-span-5 p-8 sm:p-10 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 bg-gradient-to-tr from-indigo-500/5 to-purple-500/5 dark:from-indigo-500/10 dark:to-purple-500/10 flex flex-col justify-center space-y-4">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white">YouTube Companion</h3>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
            This website serves as the official companion to The Learn Up YouTube channel. While our videos give you a visual walkthrough, this platform provides comprehensive articles, step-by-step guides, advanced prompts, and code snippets to give you a complete learning experience.
          </p>
        </div>
      </div>

      {/* What We Cover */}
      <div className="space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white">What We Cover</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            The world of technology is moving faster than ever, and staying ahead means staying informed. Here is what you can expect from us:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md dark:shadow-none hover:scale-[1.02] hover:border-indigo-500/30 transition-all duration-300 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
              <Sparkles size={20} />
            </div>
            <h3 className="font-bold text-zinc-900 dark:text-white text-base">Breaking AI News</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Stay on top of the rapidly evolving AI landscape. We bring you timely updates on new model releases, breakthroughs, and tech trends.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md dark:shadow-none hover:scale-[1.02] hover:border-indigo-500/30 transition-all duration-300 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
              <Cpu size={20} />
            </div>
            <h3 className="font-bold text-zinc-900 dark:text-white text-base">AI & LLM Deep Dives</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Practical use cases, testing, and implementation of powerful models like ChatGPT, Gemini, Groq, and open-source alternatives.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md dark:shadow-none hover:scale-[1.02] hover:border-indigo-500/30 transition-all duration-300 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-550 flex items-center justify-center shrink-0">
              <Video size={20} />
            </div>
            <h3 className="font-bold text-zinc-900 dark:text-white text-base">Next-Gen Content</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Guides on AI image generation (Midjourney, Stable Diffusion), AI video creation tools, and text-to-speech engines.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md dark:shadow-none hover:scale-[1.02] hover:border-indigo-500/30 transition-all duration-300 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
              <Terminal size={20} />
            </div>
            <h3 className="font-bold text-zinc-900 dark:text-white text-base">Automation & Tech</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Smart strategies, Python scripting, and AI agent developments to help you automate repetitive tasks and maximize productivity.
            </p>
          </div>
        </div>
      </div>

      {/* Why Choose The Learn Up & Video Embed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-5 space-y-6">
          <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-white leading-tight">
            Why Choose <br className="hidden lg:block"/>
            <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">The Learn Up?</span>
          </h2>
          <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed text-sm sm:text-base">
            We don't just report on technology; we show you how to use it. By combining the visual, engaging power of our YouTube channel with the detailed, scannable depth of our written articles, we provide a complete ecosystem. Our goal is to empower content creators, developers, entrepreneurs, and tech enthusiasts to leverage AI to its full potential.
          </p>
        </div>

        <div className="lg:col-span-7">
          <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border border-zinc-200 dark:border-zinc-800 bg-black">
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${featuredVideoId}`}
              title="The Learn Up Featured Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </div>

      {/* Meet the Founder */}
      <div className="p-8 sm:p-12 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center relative z-10">
          <div className="md:col-span-4 flex justify-center">
            <div className="relative group">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-indigo-500 to-pink-500 opacity-20 blur-xl group-hover:opacity-35 transition-opacity duration-300" />
              <img
                src="/founder_portrait.jpg"
                alt="Faysal Ahmed - Founder of The Learn Up"
                className="w-64 h-64 md:w-full md:h-auto aspect-square object-cover rounded-2xl border border-zinc-200 dark:border-zinc-700 shadow-xl group-hover:scale-[1.02] transition-transform duration-300"
              />
            </div>
          </div>

          <div className="md:col-span-8 space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest">Founder & Creator</span>
              <h2 className="text-3xl font-black text-zinc-900 dark:text-white">Faysal Ahmed</h2>
            </div>
            
            <blockquote className="border-l-4 border-indigo-500 dark:border-indigo-400 pl-4 italic text-zinc-700 dark:text-zinc-350 leading-relaxed text-sm sm:text-base">
              "Hi, I’m Faysal Ahmed, a technology enthusiast, digital entrepreneur, and the creator behind The Learn Up.
              <br/><br/>
              My journey started with a simple realization: while AI and modern technology are advancing at a breathtaking pace, many people are left overwhelmed by the complexity. I built this platform to bridge that gap. I spend hours researching, testing, and breaking down the latest AI tools and models so that you can easily integrate them into your career, business, or creative projects without the headache."
            </blockquote>
          </div>
        </div>
      </div>

      {/* Join the Community */}
      <div className="p-8 sm:p-12 rounded-3xl bg-zinc-950 text-white relative overflow-hidden border border-white/5 shadow-2xl text-center space-y-8">
        <div className="absolute top-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-3 relative z-10 max-w-xl mx-auto">
          <h2 className="text-3xl font-extrabold tracking-tight">Join the Community</h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Don't navigate the future alone. Join thousands of other tech enthusiasts and creators by staying connected with us:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto relative z-10">
          <a
            href={youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-red-500/40 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center">
                <YoutubeIcon size={20} />
              </div>
              <div className="text-left">
                <p className="text-xs text-zinc-400">Subscribe on</p>
                <p className="text-sm font-bold text-white">YouTube</p>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>

          <a
            href={facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-blue-500/40 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                <FacebookIcon size={20} />
              </div>
              <div className="text-left">
                <p className="text-xs text-zinc-400">Follow our</p>
                <p className="text-sm font-bold text-white">Facebook Page</p>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>

          <a
            href={`mailto:${businessEmail}`}
            className="flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-purple-500/40 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-450 flex items-center justify-center">
                <Mail size={20} />
              </div>
              <div className="text-left">
                <p className="text-xs text-zinc-400">Send inquiries to</p>
                <p className="text-sm font-bold text-white">Business Email</p>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>
      </div>
    </div>
  )
}
