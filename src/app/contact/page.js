'use client'

import { useState, useEffect } from 'react'
import { Mail, MapPin, Send, CheckCircle2, ArrowUpRight, HelpCircle } from 'lucide-react'
import { client } from '@/sanity/lib/client'

// Custom inline SVG icons to prevent lucide-react build errors
const FacebookIcon = ({ size = 18 }) => (
  <svg className="fill-current" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" clipRule="evenodd" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
)

const YoutubeIcon = ({ size = 18 }) => (
  <svg className="fill-current" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" clipRule="evenodd" d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 00-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 002.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.002 3.002 0 002.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
)

function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className="border-b border-zinc-200 dark:border-zinc-800/80 py-4 transition-all">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left font-semibold text-zinc-800 dark:text-zinc-200 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
      >
        <span className="text-sm sm:text-base">{question}</span>
        <span className="text-zinc-400 dark:text-zinc-500 font-bold text-lg select-none ml-4">
          {isOpen ? '−' : '+'}
        </span>
      </button>
      <div
        className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100 mt-2.5' : 'grid-rows-[0fr] opacity-0'}`}
      >
        <div className="overflow-hidden">
          <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
            {answer}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [socialConfig, setSocialConfig] = useState(null)

  useEffect(() => {
    const fetchSocial = async () => {
      try {
        const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
        if (projectId && projectId !== 'your-project-id') {
          const data = await client.fetch(`*[_type == "socialMedia"][0]`)
          setSocialConfig(data)
        }
      } catch (err) {
        console.warn('Failed to fetch social links on Contact page:', err.message)
      }
    }
    fetchSocial()
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.message) return
    setIsSubmitting(true)

    // Simulate sending message
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitted(true)
      setFormData({ name: '', email: '', message: '' })
    }, 1500)
  }

  const youtubeUrl = socialConfig?.youtubeLink || 'https://www.youtube.com'
  const facebookUrl = socialConfig?.facebookLink || 'https://www.facebook.com'
  const businessEmail = 'thelearnuponline@gmail.com'

  return (
    <div className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8 space-y-20 relative overflow-hidden font-sans">
      {/* Decorative Blur Blobs */}
      <div className="absolute top-1/4 left-10 w-72 h-72 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none animate-pulse duration-[6000ms]" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-3xl pointer-events-none animate-pulse duration-[8000ms]" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start relative z-10">
        {/* Info Column */}
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-650 dark:text-indigo-400 border border-indigo-500/20 uppercase tracking-widest">
              Get In Touch
            </span>
            <h1 className="text-4xl font-black tracking-tight sm:text-5xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent leading-tight">
              Let's Connect & Collaborate
            </h1>
            <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed text-sm sm:text-base">
              Have a question, feedback, sponsorship inquiry, or want to collaborate on a project? Fill out the form or reach out to us directly. We are always eager to connect with fellow creators, developers, and tech enthusiasts.
            </p>
          </div>

          <div className="space-y-4 pt-4">
            {/* Email Card */}
            <a 
              href={`mailto:${businessEmail}`}
              className="flex items-center gap-4 p-5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/35 backdrop-blur-sm hover:scale-[1.01] hover:border-indigo-500/20 transition-all group"
            >
              <div className="w-11 h-11 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
                <Mail size={20} />
              </div>
              <div className="flex-grow text-sm">
                <p className="font-bold text-zinc-900 dark:text-zinc-200">Email Address</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">
                  {businessEmail}
                </p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>

            {/* Location Card */}
            <div className="flex items-center gap-4 p-5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/35 backdrop-blur-sm text-sm">
              <div className="w-11 h-11 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
                <MapPin size={20} />
              </div>
              <div>
                <p className="font-bold text-zinc-900 dark:text-zinc-200">Location</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Dhaka, Bangladesh</p>
              </div>
            </div>

            {/* Social media connections */}
            <div className="p-5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/35 backdrop-blur-sm space-y-4">
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Quick Connect</p>
              <div className="flex items-center gap-3">
                <a
                  href={youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 rounded-xl bg-red-500/10 hover:bg-red-500/15 border border-red-500/10 text-red-500 text-xs font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-all"
                >
                  <YoutubeIcon size={16} />
                  <span>YouTube</span>
                </a>
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 rounded-xl bg-blue-500/10 hover:bg-blue-500/15 border border-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-all"
                >
                  <FacebookIcon size={16} />
                  <span>Facebook</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Form Column */}
        <div className="lg:col-span-7">
          <div className="p-8 sm:p-10 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/40 backdrop-blur-md shadow-xl shadow-zinc-100/30 dark:shadow-none relative overflow-hidden">
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-16 text-center space-y-5">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center animate-bounce">
                  <CheckCircle2 size={32} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-zinc-900 dark:text-white">Message Sent!</h3>
                  <p className="text-sm text-zinc-550 dark:text-zinc-400 max-w-sm leading-relaxed mx-auto">
                    Thank you for reaching out, Faysal. We have received your message and will get back to you at our earliest convenience.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name field */}
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-xs font-bold tracking-wider text-zinc-400 uppercase">
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      autoComplete="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-400/30 dark:text-white transition-all placeholder-zinc-400"
                      placeholder="Your name"
                    />
                  </div>
                  {/* Email field */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-xs font-bold tracking-wider text-zinc-400 uppercase">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      autoComplete="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-400/30 dark:text-white transition-all placeholder-zinc-400"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                {/* Message field */}
                <div className="space-y-2">
                  <label htmlFor="message" className="text-xs font-bold tracking-wider text-zinc-400 uppercase">
                    Message
                  </label>
                  <textarea
                    id="message"
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-400/30 dark:text-white transition-all resize-none placeholder-zinc-400"
                    placeholder="Type your message here..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-95 shadow-md shadow-indigo-500/10 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:pointer-events-none"
                >
                  {isSubmitting ? (
                    'Sending Message...'
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send size={15} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="pt-10 space-y-8">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-indigo-500/10 text-indigo-500">
            <HelpCircle size={20} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white">Frequently Asked Questions</h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
            Quick answers to some common questions before you send a message.
          </p>
        </div>

        <div className="max-w-4xl mx-auto p-6 sm:p-8 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/35 backdrop-blur-sm space-y-1">
          <FAQItem 
            question="How can I submit a guest post or collaborate?"
            answer="We love collaborating with developers and creators! Send us a brief outline of your topic via our contact form or directly to our business email, and we'll get back to you if it fits our content and quality standards."
          />
          <FAQItem 
            question="How often do you post new content?"
            answer="We publish new articles and guides weekly, aligning with our latest YouTube video releases to ensure you get both visual walkthroughs and detailed written tutorials."
          />
          <FAQItem 
            question="Are your code templates free to use in commercial projects?"
            answer="Yes! All code snippets and project templates shared on The Learn Up are open-source and free to use in your personal or commercial applications unless specified otherwise."
          />
          <FAQItem 
            question="Can I request a specific tutorial or tool review?"
            answer="Absolutely! Many of our articles and videos are inspired by reader suggestions. Use the form to let us know what model, framework, or automation tool you'd like us to cover next."
          />
        </div>
      </div>
    </div>
  )
}
