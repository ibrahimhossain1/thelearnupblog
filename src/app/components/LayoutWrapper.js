'use client'

import { usePathname } from 'next/navigation'
import Header from './Header'
import Footer from './Footer'

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
      <Footer siteConfig={siteConfig} socialConfig={socialConfig} />
    </>
  )
}
