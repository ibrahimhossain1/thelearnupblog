import React from 'react'

export default function SEOPreview(props) {
  const { document } = props
  const { displayed } = document

  // If the document is not a post or hasn't loaded yet
  if (!displayed) {
    return <div style={{ padding: '20px', color: '#a1a1aa' }}>Loading preview...</div>
  }

  const { title = 'Untitled Post', slug, excerpt = 'No description provided yet.', mainImage } = displayed
  const slugString = slug?.current || 'your-post-slug'

  // Helper to parse image URL from Sanity image asset ref
  const getImageUrl = (image) => {
    if (!image) return null
    if (image.url) return image.url
    const ref = image.asset?._ref
    if (!ref) return null
    
    try {
      const parts = ref.split('-')
      if (parts.length < 4) return null
      const id = parts[1]
      const dimensions = parts[2]
      const extension = parts[3]
      
      // We can read projectId/dataset from env or fallback to 'ygp0nql6'/'production'
      const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'ygp0nql6'
      const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
      
      return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${extension}`
    } catch (err) {
      console.error(err)
      return null
    }
  }

  const imageUrl = getImageUrl(mainImage)

  return (
    <div style={{
      padding: '32px 24px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      backgroundColor: '#09090b',
      color: '#e4e4e7',
      minHeight: '100%',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      gap: '40px'
    }}>
      <style>{`
        .preview-section {
          background: #18181b;
          border: 1px solid rgba(63, 63, 70, 0.4);
          border-radius: 16px;
          padding: 24px;
        }
        .preview-title {
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          color: #a1a1aa;
          letter-spacing: 0.8px;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .card-image-placeholder {
          background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 14px;
        }
      `}</style>

      <div>
        <h2 style={{ fontSize: '20px', fontWeight: '800', margin: 0, color: 'white' }}>SEO & Social Media Preview</h2>
        <p style={{ margin: '4px 0 0 0', color: '#71717a', fontSize: '13px' }}>See how this post appears on search engines and social feeds.</p>
      </div>

      {/* 1. Google Search Preview */}
      <div className="preview-section">
        <div className="preview-title">🔍 Google Search Snippet</div>
        <div style={{
          background: '#ffffff',
          color: '#202124',
          padding: '16px 20px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
          fontFamily: 'arial, sans-serif'
        }}>
          {/* Breadcrumb URL */}
          <div style={{ fontSize: '12px', color: '#202124', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            https://thelearnup.com <span style={{ color: '#5f6368' }}>› posts › {slugString}</span>
          </div>
          {/* Title */}
          <a href="#" style={{
            fontSize: '20px',
            color: '#1a0dab',
            textDecoration: 'none',
            lineHeight: '1.3',
            marginBottom: '4px',
            display: 'block',
            fontWeight: 'normal'
          }} onClick={(e) => e.preventDefault()}>
            {title} | The Learn Up
          </a>
          {/* Description */}
          <div style={{ fontSize: '14px', color: '#4d5156', lineHeight: '1.58', wordBreak: 'break-word' }}>
            <span style={{ color: '#70757a', marginRight: '6px' }}>
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} —
            </span>
            {excerpt.length > 155 ? `${excerpt.slice(0, 155)}...` : excerpt}
          </div>
        </div>
      </div>

      {/* 2. Facebook Share Card Preview */}
      <div className="preview-section">
        <div className="preview-title">👍 Facebook Share Card</div>
        <div style={{
          background: '#18181b',
          border: '1px solid #27272a',
          borderRadius: '12px',
          overflow: 'hidden',
          width: '100%',
          maxWidth: '520px',
          fontFamily: 'Helvetica, Arial, sans-serif'
        }}>
          {/* Header */}
          <div style={{ padding: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              fontWeight: 'bold',
              fontSize: '12px',
              color: 'white'
            }}>TL</div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#e4e4e7' }}>The Learn Up</div>
              <div style={{ fontSize: '11px', color: '#71717a', marginTop: '2px' }}>Just now · 🌐</div>
            </div>
          </div>
          
          {/* Text */}
          <div style={{ padding: '0 12px 12px 12px', fontSize: '13px', color: '#e4e4e7', lineHeight: '1.4' }}>
            {excerpt}
          </div>

          {/* Image */}
          <div style={{ width: '100%', aspectRatio: '1.91/1', position: 'relative' }}>
            {imageUrl ? (
              <img src={imageUrl} alt={title} style={{ width: '100%', height: '100%', objectCover: 'cover' }} />
            ) : (
              <div className="card-image-placeholder" style={{ width: '100%', height: '100%' }}>
                No Featured Image Uploaded
              </div>
            )}
          </div>

          {/* Card Info */}
          <div style={{ padding: '12px', background: '#27272a', borderTop: '1px solid #3f3f46' }}>
            <div style={{ fontSize: '11px', color: '#a1a1aa', textTransform: 'uppercase' }}>THELEARNUP.COM</div>
            <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'white', marginTop: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {title}
            </div>
            <div style={{ fontSize: '12px', color: '#a1a1aa', marginTop: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {excerpt}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Twitter/X Summary Card Preview */}
      <div className="preview-section">
        <div className="preview-title">🐦 Twitter / X Summary Card</div>
        <div style={{
          background: '#000000',
          border: '1px solid #2f3336',
          borderRadius: '16px',
          overflow: 'hidden',
          width: '100%',
          maxWidth: '500px',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
        }}>
          {/* Header */}
          <div style={{ padding: '12px', display: 'flex', gap: '8px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              fontWeight: 'bold',
              color: 'white',
              flexShrink: 0
            }}>TL</div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '14px', fontWeight: 'bold', color: 'white' }}>The Learn Up</span>
                <span style={{ fontSize: '13px', color: '#71717a' }}>@thelearnup · Just now</span>
              </div>
              
              <div style={{ fontSize: '14px', color: 'white', marginTop: '4px', lineHeight: '1.4' }}>
                {excerpt}
              </div>

              {/* Card */}
              <div style={{
                border: '1px solid #2f3336',
                borderRadius: '12px',
                overflow: 'hidden',
                marginTop: '12px',
                background: '#000000'
              }}>
                <div style={{ width: '100%', aspectRatio: '1.91/1', position: 'relative' }}>
                  {imageUrl ? (
                    <img src={imageUrl} alt={title} style={{ width: '100%', height: '100%', objectCover: 'cover' }} />
                  ) : (
                    <div className="card-image-placeholder" style={{ width: '100%', height: '100%' }}>
                      No Featured Image Uploaded
                    </div>
                  )}
                </div>
                
                <div style={{ padding: '12px' }}>
                  <div style={{ fontSize: '13px', color: '#71717a' }}>thelearnup.com</div>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'white', marginTop: '2px' }}>{title}</div>
                  <div style={{ fontSize: '13px', color: '#71717a', marginTop: '4px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {excerpt}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
