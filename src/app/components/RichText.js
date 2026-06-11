import { PortableText } from '@portabletext/react'
import { urlForImage } from '@/sanity/lib/image'

const getYouTubeId = (url) => {
  if (!url) return null
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
  const match = url.match(regExp)
  return (match && match[2].length === 11) ? match[2] : null
}

export const RichTextComponents = {
  types: {
    image: ({ value }) => {
      return (
        <div className="relative my-8 rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
          <img
            src={urlForImage(value).url()}
            alt={value.alt || 'Blog Post Image'}
            className="w-full h-auto object-cover max-h-[500px]"
          />
          {value.alt && (
            <div className="px-5 py-3 text-xs text-zinc-550 dark:text-zinc-400 bg-zinc-100/50 dark:bg-zinc-900/80 border-t border-zinc-250/20 dark:border-zinc-800/50 font-medium">
              {value.alt}
            </div>
          )}
        </div>
      )
    },
    codeSnippet: ({ value }) => {
      return (
        <div className="my-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-950 p-5 overflow-x-auto font-mono text-xs md:text-sm text-zinc-100 relative group">
          <div className="absolute top-3 right-3 text-[10px] uppercase font-bold text-zinc-600 dark:text-zinc-500 tracking-wider">
            {value.language || 'Code'}
          </div>
          <pre className="mt-2"><code>{value.code}</code></pre>
        </div>
      )
    },
    youtube: ({ value }) => {
      const { url } = value
      const id = getYouTubeId(url)
      if (!id) return null
      return (
        <div className="relative my-8 aspect-video rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-md">
          <iframe
            src={`https://www.youtube.com/embed/${id}`}
            title="YouTube Video"
            className="absolute inset-0 w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      )
    }
  },
  block: {
    normal: ({ children }) => <p className="mb-6 leading-relaxed text-zinc-650 dark:text-zinc-300 text-sm md:text-base">{children}</p>,
    h1: ({ children }) => <h1 className="text-3xl md:text-4xl font-extrabold mt-12 mb-6 text-zinc-900 dark:text-white leading-tight">{children}</h1>,
    h2: ({ children, value }) => {
      const text = value?.children ? value.children.map(c => c.text).join('') : '';
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      return <h2 id={id} className="text-2xl md:text-3xl font-bold mt-12 mb-5 text-zinc-900 dark:text-white leading-snug scroll-mt-20">{children}</h2>
    },
    h3: ({ children, value }) => {
      const text = value?.children ? value.children.map(c => c.text).join('') : '';
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      return <h3 id={id} className="text-xl md:text-2xl font-bold mt-10 mb-4 text-zinc-900 dark:text-white leading-snug scroll-mt-20">{children}</h3>
    },
    h4: ({ children }) => <h4 className="text-lg md:text-xl font-bold mt-6 mb-3 text-zinc-900 dark:text-white">{children}</h4>,
    blockquote: ({ children }) => (
      <blockquote className="my-8 pl-6 border-l-4 border-indigo-500 italic text-zinc-800 dark:text-zinc-250 bg-indigo-500/5 py-4 pr-4 rounded-r-2xl font-medium text-sm md:text-base">
        {children}
      </blockquote>
    )
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc pl-6 mb-6 space-y-2.5 text-zinc-650 dark:text-zinc-300 text-sm md:text-base">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal pl-6 mb-6 space-y-2.5 text-zinc-650 dark:text-zinc-300 text-sm md:text-base">{children}</ol>
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
    number: ({ children }) => <li>{children}</li>
  },
  marks: {
    link: ({ children, value }) => {
      const rel = !value.href.startsWith('/') ? 'noreferrer noopener' : undefined
      return (
        <a
          href={value.href}
          rel={rel}
          target={!value.href.startsWith('/') ? '_blank' : undefined}
          className="text-indigo-550 dark:text-indigo-400 font-semibold hover:underline decoration-wavy decoration-indigo-500/30"
        >
          {children}
        </a>
      )
    },
    strong: ({ children }) => <strong className="font-bold text-zinc-900 dark:text-white">{children}</strong>,
    code: ({ children }) => <code className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-indigo-500 dark:text-indigo-400 font-mono text-xs md:text-sm font-semibold">{children}</code>
  }
}
