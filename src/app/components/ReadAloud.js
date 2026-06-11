'use client'

import { useState, useEffect } from 'react'
import { Volume2, VolumeX, Pause } from 'lucide-react'

export default function ReadAloud() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [synth, setSynth] = useState(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      setSynth(window.speechSynthesis)
    }
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  const handlePlayPause = () => {
    if (!synth) return

    if (isPlaying && !isPaused) {
      // Pause speaking
      synth.pause()
      setIsPaused(true)
    } else if (isPlaying && isPaused) {
      // Resume speaking
      synth.resume()
      setIsPaused(false)
    } else {
      // Start speaking
      const articleElement = document.querySelector('.prose')
      if (!articleElement) return

      // Extract raw text, removing code snippet details
      const text = articleElement.innerText
        .replace(/Code[\s\S]*?\n\n/g, '') // Remove code snippet language identifiers
        .trim()

      if (!text) return

      const newUtterance = new SpeechSynthesisUtterance(text)
      newUtterance.onend = () => {
        setIsPlaying(false)
        setIsPaused(false)
      }
      newUtterance.onerror = () => {
        setIsPlaying(false)
        setIsPaused(false)
      }

      // Stop any current speech
      synth.cancel()
      
      synth.speak(newUtterance)
      setIsPlaying(true)
      setIsPaused(false)
    }
  }

  const handleStop = () => {
    if (!synth) return
    synth.cancel()
    setIsPlaying(false)
    setIsPaused(false)
  }

  if (!synth) return null

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handlePlayPause}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 text-xs text-zinc-500 hover:text-primary dark:text-zinc-400 dark:hover:text-primary transition-all shadow-sm focus:outline-none"
        title={isPlaying ? (isPaused ? 'Resume listening' : 'Pause listening') : 'Listen to Article'}
      >
        {isPlaying && !isPaused ? <Pause size={13} /> : <Volume2 size={13} />}
        <span>{isPlaying ? (isPaused ? 'Resume' : 'Pause') : 'Listen'}</span>
      </button>

      {isPlaying && (
        <button
          onClick={handleStop}
          className="flex items-center justify-center p-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 text-zinc-500 hover:text-red-500 dark:text-zinc-400 dark:hover:text-red-400 transition-all shadow-sm focus:outline-none"
          title="Stop listening"
        >
          <VolumeX size={13} />
        </button>
      )}
    </div>
  )
}
