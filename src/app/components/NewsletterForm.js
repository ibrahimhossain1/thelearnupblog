'use client'

import { useState } from 'react'

export default function NewsletterForm({ title = "Subscribe to Newsletter", description = "Get the latest insights delivered directly to your inbox.", placeholder = "Enter your email" }) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState({ type: '', message: '' })

  const handleSubscribe = async (e) => {
    e.preventDefault()
    if (!email) return

    setLoading(true)
    setStatus({ type: '', message: '' })

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (res.ok) {
        setStatus({ type: 'success', message: data.message })
        setEmail('')
      } else {
        setStatus({ type: 'error', message: data.message || 'Something went wrong.' })
      }
    } catch (err) {
      console.error(err)
      setStatus({ type: 'error', message: 'Failed to connect. Please try again later.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/40 bg-white dark:bg-zinc-900/20 shadow-sm relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div className="relative z-10 space-y-4">
        <div className="space-y-1">
          <h3 className="text-sm font-bold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase">{title}</h3>
          <p className="text-xs text-zinc-550 dark:text-zinc-400 leading-relaxed">{description}</p>
        </div>

        <form onSubmit={handleSubscribe} className="space-y-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={placeholder}
            className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs focus:outline-none focus:ring-2 focus:ring-primary/50 dark:focus:ring-primary/30 transition-all text-zinc-800 dark:text-zinc-150"
          />
          <button
            type="submit"
            disabled={loading || !email}
            className="w-full px-4 py-2.5 rounded-xl bg-gradient-to-tr from-primary to-accent hover:from-primary-hover hover:to-accent-hover text-white text-xs font-bold shadow-md shadow-primary/10 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? 'Subscribing...' : 'Subscribe Now'}
          </button>
        </form>

        {status.message && (
          <div
            className={`p-3 rounded-xl text-xs font-semibold text-center animate-fade-in ${
              status.type === 'success'
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
            }`}
          >
            {status.message}
          </div>
        )}
      </div>
    </div>
  )
}
