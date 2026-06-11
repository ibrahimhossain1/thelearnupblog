'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname, useParams } from 'next/navigation'
import Link from 'next/link'
import { MessageSquare, X, Send, Sparkles, Settings, Bot, User, HelpCircle } from 'lucide-react'

// Helper to parse markdown links in chat replies
function parseMarkdownLinks(text) {
  if (!text) return ''
  
  // Regex to match [Link Text](url)
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g
  const parts = []
  let lastIndex = 0
  let match
  
  while ((match = regex.exec(text)) !== null) {
    const [_, linkText, url] = match
    const matchIndex = match.index
    
    if (matchIndex > lastIndex) {
      parts.push(text.slice(lastIndex, matchIndex))
    }
    
    parts.push(
      <Link 
        key={matchIndex} 
        href={url} 
        className="text-primary dark:text-primary-hover font-semibold hover:underline decoration-2 underline-offset-2 transition-all"
      >
        {linkText}
      </Link>
    )
    
    lastIndex = regex.lastIndex
  }
  
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }
  
  return parts.length > 0 ? parts : text
}

export default function AIChatbot() {
  const pathname = usePathname()
  const params = useParams()
  
  const [isOpen, setIsOpen] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [model, setModel] = useState('openai/gpt-oss-120b:free')
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hi! I am The Learn Up Assistant. Ask me anything about our blog posts, trending topics, or categories! 🚀'
    }
  ])
  const [isLoading, setIsLoading] = useState(false)
  
  const messagesEndRef = useRef(null)

  // Determine if user is currently reading a blog post
  const isPostPage = pathname?.startsWith('/posts/') && params?.slug
  const currentPostSlug = isPostPage ? params.slug : null

  // Auto scroll to bottom when messages change or chat opens
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen])

  const handleSend = async (textToSend) => {
    const text = textToSend || input
    if (!text.trim() || isLoading) return

    if (!textToSend) {
      setInput('')
    }

    const userMessage = { role: 'user', content: text }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setIsLoading(true)

    try {
      // API call to our Next.js Route Handler
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: updatedMessages.filter(msg => msg.role !== 'system'), // only send user/assistant history
          currentPostSlug,
          model,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
      } else {
        setMessages(prev => [
          ...prev, 
          { 
            role: 'assistant', 
            content: `⚠️ Error: ${data.error || 'Failed to communicate with AI model. Please verify your OpenRouter API Key.'}` 
          }
        ])
      }
    } catch (err) {
      console.error('Chat error:', err)
      setMessages(prev => [
        ...prev, 
        { 
          role: 'assistant', 
          content: '⚠️ Connection error: Failed to reach the chatbot server. Please check your internet connection.' 
        }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSummarize = () => {
    handleSend('Please summarize this article for me and give me the key takeaways.')
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative flex items-center justify-center w-14 h-14 rounded-full bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 shadow-xl hover:scale-110 active:scale-95 transition-all duration-300 group border border-white/10 dark:border-zinc-800"
          aria-label="Open AI Assistant"
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/25 to-accent/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <MessageSquare className="w-6 h-6 z-10 transition-transform duration-300 group-hover:rotate-6" />
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-primary"></span>
          </span>
        </button>
      )}

      {/* Chat Window Container */}
      {isOpen && (
        <div className="w-[90vw] sm:w-[400px] h-[550px] max-h-[80vh] flex flex-col rounded-3xl border border-zinc-200/50 dark:border-zinc-850 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-lg shadow-2xl overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom-6">
          {/* Header */}
          <div className="px-5 py-4 bg-zinc-950 dark:bg-zinc-900 text-white flex items-center justify-between border-b border-zinc-850 relative">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-white/10 flex items-center justify-center text-primary-hover border border-white/10">
                <Bot className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold tracking-wide">The Learn Up AI</h3>
                <p className="text-[10px] text-zinc-400">Online | Free Model</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Settings Toggle */}
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-1.5 rounded-xl transition-colors ${showSettings ? 'bg-white/10 text-white' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
                title="Model Settings"
              >
                <Settings className="w-4 h-4" />
              </button>
              {/* Close Button */}
              <button
                onClick={() => {
                  setIsOpen(false)
                  setShowSettings(false)
                }}
                className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                title="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Settings Sub-Panel */}
          {showSettings && (
            <div className="p-4 bg-zinc-50 dark:bg-zinc-900/80 border-b border-zinc-200/50 dark:border-zinc-800 text-xs space-y-2.5 animate-in slide-in-from-top duration-200">
              <p className="font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider text-[9px]">Select AI Model (Free)</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setModel('openai/gpt-oss-120b:free')}
                  className={`px-3 py-2 rounded-xl font-semibold border text-center transition-all ${model === 'openai/gpt-oss-120b:free' ? 'bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 border-transparent shadow-sm' : 'bg-white dark:bg-zinc-850 text-zinc-650 dark:text-zinc-300 border-zinc-200/60 dark:border-zinc-800 hover:bg-zinc-100/60 dark:hover:bg-zinc-800'}`}
                >
                  GPT-OSS-120B (High)
                </button>
                <button
                  onClick={() => setModel('openai/gpt-oss-20b:free')}
                  className={`px-3 py-2 rounded-xl font-semibold border text-center transition-all ${model === 'openai/gpt-oss-20b:free' ? 'bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 border-transparent shadow-sm' : 'bg-white dark:bg-zinc-850 text-zinc-650 dark:text-zinc-300 border-zinc-200/60 dark:border-zinc-800 hover:bg-zinc-100/60 dark:hover:bg-zinc-800'}`}
                >
                  GPT-OSS-20B (Fast)
                </button>
              </div>
              <p className="text-[10px] text-zinc-400 leading-normal">Both models run via OpenRouter without token charges, perfect for answering blog queries.</p>
            </div>
          )}

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-5 py-6 space-y-4 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-850">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs border ${msg.role === 'user' ? 'bg-zinc-100 dark:bg-zinc-850 border-zinc-200/50 dark:border-zinc-850' : 'bg-primary/10 border-primary/20 text-primary'}`}>
                  {msg.role === 'user' ? <User className="w-3.5 h-3.5 text-zinc-650 dark:text-zinc-350" /> : <Bot className="w-3.5 h-3.5" />}
                </div>
                {/* Message Bubble */}
                <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 rounded-tr-none' : 'bg-zinc-100/80 dark:bg-zinc-850/60 text-zinc-800 dark:text-zinc-200 rounded-tl-none border border-zinc-200/30 dark:border-zinc-800/30'}`}>
                  {msg.role === 'user' ? (
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  ) : (
                    <div className="whitespace-pre-wrap break-words">
                      {parseMarkdownLinks(msg.content)}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex gap-3 max-w-[85%]">
                <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 border bg-primary/10 border-primary/20 text-primary animate-pulse">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="rounded-2xl rounded-tl-none px-4 py-3 bg-zinc-100/80 dark:bg-zinc-850/60 text-zinc-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500 animate-bounce duration-300" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500 animate-bounce duration-300" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500 animate-bounce duration-300" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions Panel */}
          {isPostPage && !isLoading && (
            <div className="px-5 py-2.5 border-t border-zinc-150 dark:border-zinc-850 bg-zinc-50/50 dark:bg-zinc-900/30 flex gap-2 overflow-x-auto">
              <button
                onClick={handleSummarize}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-primary dark:text-primary-hover bg-primary/10 hover:bg-primary/20 border border-primary/10 transition-colors shrink-0"
              >
                <Sparkles className="w-3 h-3" />
                <span>Summarize this article</span>
              </button>
            </div>
          )}

          {/* Input Area */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
            className="p-4 border-t border-zinc-150 dark:border-zinc-850 bg-white dark:bg-zinc-900 flex gap-2.5 items-center"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about blog posts..."
              disabled={isLoading}
              className="flex-grow px-4 py-2.5 rounded-2xl text-sm border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-850 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:text-white transition-all disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-2.5 rounded-2xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 hover:opacity-90 active:scale-95 transition-all disabled:opacity-40"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
