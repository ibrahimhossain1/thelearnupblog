'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname, useParams } from 'next/navigation'
import Link from 'next/link'
import { MessageSquare, X, Send, Sparkles, Bot, User, HelpCircle } from 'lucide-react'

// Helper to format inline elements like links and bold text
function formatInlineMarkdown(text, lineIndex) {
  if (!text) return ''

  let tokens = [{ type: 'text', content: text }]

  // Parse Links: [Text](url)
  let nextTokens = []
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
  for (const token of tokens) {
    if (token.type !== 'text') {
      nextTokens.push(token)
      continue
    }
    let lastIndex = 0
    let match
    const str = token.content
    linkRegex.lastIndex = 0
    while ((match = linkRegex.exec(str)) !== null) {
      const [_, linkText, url] = match
      if (match.index > lastIndex) {
        nextTokens.push({ type: 'text', content: str.slice(lastIndex, match.index) })
      }
      nextTokens.push({ type: 'link', text: linkText, url: url })
      lastIndex = linkRegex.lastIndex
    }
    if (lastIndex < str.length) {
      nextTokens.push({ type: 'text', content: str.slice(lastIndex) })
    }
  }
  tokens = nextTokens

  // Parse Bold: **text**
  nextTokens = []
  const boldRegex = /\*\*([^*]+)\*\*/g
  for (const token of tokens) {
    if (token.type !== 'text') {
      nextTokens.push(token)
      continue
    }
    let lastIndex = 0
    let match
    const str = token.content
    boldRegex.lastIndex = 0
    while ((match = boldRegex.exec(str)) !== null) {
      const [_, boldText] = match
      if (match.index > lastIndex) {
        nextTokens.push({ type: 'text', content: str.slice(lastIndex, match.index) })
      }
      nextTokens.push({ type: 'bold', content: boldText })
      lastIndex = boldRegex.lastIndex
    }
    if (lastIndex < str.length) {
      nextTokens.push({ type: 'text', content: str.slice(lastIndex) })
    }
  }
  tokens = nextTokens

  // Render tokens
  return tokens.map((token, i) => {
    if (token.type === 'link') {
      return (
        <Link 
          key={`l-${lineIndex}-${i}`} 
          href={token.url} 
          className="text-primary dark:text-primary-hover font-bold hover:underline decoration-2 underline-offset-2 transition-all inline-block"
        >
          {token.text}
        </Link>
      )
    }
    if (token.type === 'bold') {
      return (
        <strong key={`b-${lineIndex}-${i}`} className="font-extrabold text-zinc-950 dark:text-white">
          {token.content}
        </strong>
      )
    }
    return token.content
  })
}

// Helper to parse block markdown elements like lists and paragraphs
function renderMarkdown(text) {
  if (!text) return ''

  const lines = text.split('\n')
  const elements = []
  let currentListItems = []
  let listType = null // 'ul' or 'ol' or null

  const flushList = (key) => {
    if (currentListItems.length > 0) {
      if (listType === 'ul') {
        elements.push(
          <ul key={key} className="list-disc pl-5 my-2 space-y-1.5 text-zinc-700 dark:text-zinc-300">
            {currentListItems}
          </ul>
        )
      } else if (listType === 'ol') {
        elements.push(
          <ol key={key} className="list-decimal pl-5 my-2 space-y-1.5 text-zinc-700 dark:text-zinc-300">
            {currentListItems}
          </ol>
        )
      }
      currentListItems = []
      listType = null
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmed = line.trim()

    // Check for bullet list item: starts with * or - followed by space
    const ulMatch = line.match(/^(\s*)([*-])\s+(.*)$/)
    // Check for ordered list item: starts with number. followed by space
    const olMatch = line.match(/^(\s*)(\d+)\.\s+(.*)$/)

    if (ulMatch) {
      if (listType !== 'ul') {
        flushList(`list-flush-${i}`)
        listType = 'ul'
      }
      const content = ulMatch[3]
      currentListItems.push(
        <li key={`li-${i}`} className="leading-relaxed">
          {formatInlineMarkdown(content, i)}
        </li>
      )
    } else if (olMatch) {
      if (listType !== 'ol') {
        flushList(`list-flush-${i}`)
        listType = 'ol'
      }
      const content = olMatch[3]
      currentListItems.push(
        <li key={`li-${i}`} className="leading-relaxed">
          {formatInlineMarkdown(content, i)}
        </li>
      )
    } else {
      flushList(`list-flush-${i}`)
      
      if (trimmed === '') {
        elements.push(<div key={`empty-${i}`} className="h-2.5" />)
      } else {
        elements.push(
          <p key={`p-${i}`} className="my-1.5 leading-relaxed text-zinc-800 dark:text-zinc-200">
            {formatInlineMarkdown(line, i)}
          </p>
        )
      }
    }
  }

  flushList('list-flush-end')
  return elements;
}

export default function AIChatbot() {
  const pathname = usePathname()
  const params = useParams()
  
  const [isOpen, setIsOpen] = useState(false)
  const [model, setModel] = useState('openrouter/free')
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
          className="relative flex items-center gap-2 px-5 py-3 rounded-full bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 group border border-white/10 dark:border-zinc-800 font-bold text-sm tracking-wide"
          aria-label="Open AI Assistant"
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/25 to-accent/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <Sparkles className="w-4 h-4 text-indigo-400 dark:text-indigo-600 animate-pulse z-10" />
          <span className="z-10">Ask</span>
          <span className="relative flex h-2 w-2 z-10">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </button>
      )}

      {/* Chat Window Container */}
      {isOpen && (
        <div className="w-[90vw] sm:w-[400px] h-[550px] max-h-[80vh] flex flex-col rounded-3xl border border-zinc-200/50 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-lg shadow-2xl overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom-6">
          {/* Header */}
          <div className="px-5 py-4 bg-zinc-950 dark:bg-zinc-900 text-white flex items-center justify-between border-b border-zinc-800 relative">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-indigo-500/10 dark:bg-indigo-400/10 flex items-center justify-center text-xs font-black tracking-tighter text-indigo-400 border border-indigo-500/20">
                ASK
              </div>
              <div>
                <h3 className="text-sm font-bold tracking-wide">The Learn Up AI</h3>
                <p className="text-[10px] text-zinc-400">Online</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Close Button */}
              <button
                onClick={() => {
                  setIsOpen(false)
                }}
                className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                title="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-5 py-6 space-y-4 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs border ${msg.role === 'user' ? 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200/50 dark:border-zinc-800' : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-500 dark:text-indigo-400 font-bold'}`}>
                  {msg.role === 'user' ? (
                    <User className="w-3.5 h-3.5 text-zinc-650 dark:text-zinc-350" />
                  ) : (
                    <span className="text-[9px] font-black tracking-tighter">ASK</span>
                  )}
                </div>
                {/* Message Bubble */}
                <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 rounded-tr-none' : 'bg-zinc-100/80 dark:bg-zinc-800/60 text-zinc-800 dark:text-zinc-200 rounded-tl-none border border-zinc-200/30 dark:border-zinc-800/30'}`}>
                  {msg.role === 'user' ? (
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  ) : (
                    <div className="break-words space-y-1">
                      {renderMarkdown(msg.content)}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex gap-3 max-w-[85%]">
                <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 border bg-indigo-500/10 border-indigo-500/20 text-indigo-500 dark:text-indigo-400 font-bold animate-pulse">
                  <span className="text-[9px] font-black tracking-tighter">ASK</span>
                </div>
                <div className="rounded-2xl rounded-tl-none px-4 py-3 bg-zinc-100/80 dark:bg-zinc-800/60 text-zinc-500 flex items-center gap-1">
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
            <div className="px-5 py-2.5 border-t border-zinc-200/60 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 flex gap-2 overflow-x-auto">
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
            className="p-4 border-t border-zinc-200/60 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex gap-2.5 items-center"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about blog posts..."
              disabled={isLoading}
              className="flex-grow px-4 py-2.5 rounded-2xl text-sm border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:text-white transition-all disabled:opacity-50"
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
