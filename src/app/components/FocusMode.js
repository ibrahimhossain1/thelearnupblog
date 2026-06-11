'use client'

import { useState, useEffect } from 'react'
import { Eye, EyeOff } from 'lucide-react'

export default function FocusMode() {
  const [isFocus, setIsFocus] = useState(false)

  const toggleFocus = () => {
    setIsFocus(!isFocus)
  }

  useEffect(() => {
    const bodyClass = document.body.classList
    if (isFocus) {
      bodyClass.add('focus-mode-active')
    } else {
      bodyClass.remove('focus-mode-active')
    }
    return () => {
      bodyClass.remove('focus-mode-active')
    }
  }, [isFocus])

  return (
    <>
      <button
        onClick={toggleFocus}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 text-xs text-zinc-500 hover:text-primary dark:text-zinc-400 dark:hover:text-primary transition-all shadow-sm focus:outline-none"
        title="Toggle Distraction-free Focus Reading Mode"
      >
        <Eye size={13} />
        <span>Focus Mode</span>
      </button>

      {isFocus && (
        <button
          onClick={toggleFocus}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-tr from-primary to-accent text-white text-xs font-bold shadow-lg hover:scale-105 active:scale-95 transition-all"
        >
          <EyeOff size={14} />
          <span>Exit Focus Mode</span>
        </button>
      )}
    </>
  )
}
