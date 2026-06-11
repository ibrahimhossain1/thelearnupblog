'use client'

import { useState } from 'react'
import { MessageSquare, Send, User, Clock, CheckCircle2, AlertCircle } from 'lucide-react'

export default function Comments({ postId, initialComments = [] }) {
  const [comments, setComments] = useState(initialComments)
  const [formData, setFormData] = useState({ name: '', email: '', comment: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState({ success: null, message: '' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.comment) return

    setIsSubmitting(true)
    setSubmitStatus({ success: null, message: '' })

    try {
      const res = await fetch('/api/comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          comment: formData.comment,
          postId,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        setSubmitStatus({
          success: true,
          message: 'Thank you! Your comment has been submitted and is awaiting approval by the moderator.',
        })
        setFormData({ name: '', email: '', comment: '' })
      } else {
        setSubmitStatus({
          success: false,
          message: data.message || 'Something went wrong. Please try again.',
        })
      }
    } catch (err) {
      console.error('Error submitting comment:', err)
      setSubmitStatus({
        success: false,
        message: 'Could not connect to the server. Please check your connection and try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-10 pt-10 border-t border-zinc-150 dark:border-zinc-800/60">
      {/* Comments Header */}
      <div className="flex items-center gap-2.5 text-zinc-900 dark:text-white">
        <MessageSquare size={20} className="text-indigo-500" />
        <h3 className="text-lg md:text-xl font-bold tracking-tight">
          Comments ({comments.length})
        </h3>
      </div>

      {/* Submission Status Message */}
      {submitStatus.message && (
        <div
          className={`p-5 rounded-2xl border flex items-start gap-3.5 text-sm leading-relaxed ${
            submitStatus.success
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-800 dark:text-emerald-400'
              : 'bg-rose-500/10 border-rose-500/20 text-rose-800 dark:text-rose-400'
          }`}
        >
          {submitStatus.success ? (
            <CheckCircle2 size={18} className="shrink-0 text-emerald-500 mt-0.5" />
          ) : (
            <AlertCircle size={18} className="shrink-0 text-rose-500 mt-0.5" />
          )}
          <span>{submitStatus.message}</span>
        </div>
      )}

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="p-8 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/10 space-y-6">
        <h4 className="text-sm font-bold tracking-wider text-zinc-400 dark:text-zinc-600 uppercase">Leave a Comment</h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label htmlFor="commenter-name" className="text-[10px] font-bold tracking-wider text-zinc-500 dark:text-zinc-400 uppercase">
              Name
            </label>
            <input
              id="commenter-name"
              type="text"
              required
              autoComplete="name"
              placeholder="Your name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-400/30 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="commenter-email" className="text-[10px] font-bold tracking-wider text-zinc-500 dark:text-zinc-400 uppercase">
              Email Address
            </label>
            <input
              id="commenter-email"
              type="email"
              required
              autoComplete="email"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-400/30 transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="comment-text" className="text-[10px] font-bold tracking-wider text-zinc-500 dark:text-zinc-400 uppercase">
            Comment
          </label>
          <textarea
            id="comment-text"
            required
            rows={4}
            placeholder="Write your thoughts here..."
            value={formData.comment}
            onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-400/30 transition-all resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 rounded-xl text-xs font-semibold text-white bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-500 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none self-start"
        >
          {isSubmitting ? (
            <span>Submitting...</span>
          ) : (
            <>
              <span>Submit Comment</span>
              <Send size={12} />
            </>
          )}
        </button>
      </form>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400 italic text-center py-6 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
            No comments yet. Be the first to share your thoughts!
          </p>
        ) : (
          <div className="space-y-6">
            {comments.map((c) => (
              <div
                key={c._id}
                className="p-6 rounded-3xl border border-zinc-150 dark:border-zinc-850/60 bg-white dark:bg-zinc-900/10 flex gap-4"
              >
                <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500 font-bold uppercase shrink-0">
                  <User size={16} />
                </div>
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <h5 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">{c.name}</h5>
                    <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 dark:text-zinc-500">
                      <Clock size={10} />
                      <span>
                        {new Date(c._createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-350 leading-relaxed whitespace-pre-line">
                    {c.comment}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
