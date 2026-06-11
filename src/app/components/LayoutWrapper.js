'use client'

import { usePathname } from 'next/navigation'
import Header from './Header'
import Footer from './Footer'
import AIChatbot from './AIChatbot'

export default function LayoutWrapper({ children, siteConfig, socialConfig }) {
  const pathname = usePathname()
  const isStudio = pathname?.startsWith('/studio')

  if (isStudio) {
    return <>{children}</>
  }

  return (
    <>
      <Header siteConfig={siteConfig} />
      <main className="flex-grow">
        {children}
      </main>
      <AIChatbot />
      <Footer siteConfig={siteConfig} socialConfig={socialConfig} />
    </>
  )
}
