import { useState, useEffect, useCallback } from 'react'
import { useClient } from 'sanity'

export default function YouTubeVideosPanel() {
  const client = useClient({ apiVersion: '2024-01-01' })

  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState({ type: '', message: '' })
  const [docId, setDocId] = useState(null)

  const fetchVideos = useCallback(async () => {
    setLoading(true)
    try {
      const doc = await client.fetch(`*[_type == "siteConfig"][0]{ _id, youtubeVideos }`)
      setDocId(doc?._id || null)
      setVideos(doc?.youtubeVideos || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [client])

  useEffect(() => {
    fetchVideos()
  }, [fetchVideos])

  const addVideo = () => {
    if (videos.length >= 3) {
      setStatus({ type: 'error', message: 'You can add a maximum of 3 videos.' })
      return
    }
    setVideos([...videos, { _key: crypto.randomUUID(), title: '', videoId: '', description: '' }])
    setStatus({ type: '', message: '' })
  }

  const removeVideo = (key) => {
    setVideos(videos.filter(v => v._key !== key))
    setStatus({ type: '', message: '' })
  }

  const updateVideo = (key, field, value) => {
    setVideos(videos.map(v => v._key === key ? { ...v, [field]: value } : v))
  }

  const saveVideos = async () => {
    for (const v of videos) {
      if (!v.title.trim() || !v.videoId.trim()) {
        setStatus({ type: 'error', message: 'Please fill in the Title and Video ID for every video.' })
        return
      }
    }
    setSaving(true)
    setStatus({ type: '', message: '' })
    try {
      if (docId) {
        await client.patch(docId).set({ youtubeVideos: videos }).commit()
      } else {
        const created = await client.create({ _type: 'siteConfig', youtubeVideos: videos })
        setDocId(created._id)
      }
      setStatus({ type: 'success', message: '✅ Saved successfully! Changes will appear on the site within 60 seconds.' })
    } catch (err) {
      console.error(err)
      setStatus({ type: 'error', message: `❌ Failed to save: ${err.message}` })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '32px 24px', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111', margin: 0 }}>▶️ Featured YouTube Videos</h1>
        <p style={{ fontSize: 13, color: '#666', marginTop: 6 }}>
          Add up to <strong>3</strong> featured YouTube videos to display on the homepage.<br />
          To find the Video ID, look at the YouTube URL:{' '}
          <code style={{ background: '#f3f4f6', padding: '1px 6px', borderRadius: 4 }}>
            youtube.com/watch?v=<strong>THIS_PART</strong>
          </code>
        </p>
      </div>

      {loading ? (
        <p style={{ color: '#888', fontSize: 14 }}>Loading...</p>
      ) : (
        <>
          {/* Video Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {videos.map((video, idx) => (
              <div key={video._key} style={{
                border: '1px solid #e5e7eb', borderRadius: 12, padding: '20px 20px 16px',
                background: '#fafafa', position: 'relative'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <span style={{ fontWeight: 600, fontSize: 13, color: '#374151' }}>Video {idx + 1}</span>
                  <button onClick={() => removeVideo(video._key)} style={{
                    background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 6,
                    padding: '4px 10px', fontSize: 12, fontWeight: 600, cursor: 'pointer'
                  }}>✕ Remove</button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>
                    Video Title *
                    <input
                      value={video.title}
                      onChange={e => updateVideo(video._key, 'title', e.target.value)}
                      placeholder="e.g. Next.js 15 Tutorial"
                      style={inputStyle}
                    />
                  </label>

                  <label style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>
                    YouTube Video ID *
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 4 }}>
                      <input
                        value={video.videoId}
                        onChange={e => updateVideo(video._key, 'videoId', e.target.value.trim())}
                        placeholder="e.g. dQw4w9WgXcQ"
                        style={{ ...inputStyle, marginTop: 0, fontFamily: 'monospace' }}
                      />
                      {video.videoId && (
                        <a
                          href={`https://www.youtube.com/watch?v=${video.videoId}`}
                          target="_blank"
                          rel="noreferrer"
                          style={{ fontSize: 11, color: '#6366f1', whiteSpace: 'nowrap', textDecoration: 'none', fontWeight: 600 }}
                        >
                          ↗ Preview
                        </a>
                      )}
                    </div>
                  </label>

                  <label style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>
                    Brief Description (optional)
                    <textarea
                      value={video.description || ''}
                      onChange={e => updateVideo(video._key, 'description', e.target.value)}
                      placeholder="What is this video about..."
                      rows={2}
                      style={{ ...inputStyle, resize: 'vertical', fontFamily: 'system-ui' }}
                    />
                  </label>

                  {/* Preview Thumbnail */}
                  {video.videoId && (
                    <img
                      src={`https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`}
                      alt="thumbnail"
                      style={{ width: '100%', maxWidth: 280, borderRadius: 8, border: '1px solid #e5e7eb' }}
                      onError={e => { e.target.style.display = 'none' }}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Add Button */}
          {videos.length < 3 && (
            <button
              onClick={addVideo}
              style={{
                marginTop: 16, width: '100%', padding: '12px',
                border: '2px dashed #d1d5db', borderRadius: 10,
                background: 'transparent', color: '#6b7280',
                fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s'
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.color = '#6366f1' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.color = '#6b7280' }}
            >
              + Add New Video ({videos.length}/3)
            </button>
          )}

          {/* Status Message */}
          {status.message && (
            <div style={{
              marginTop: 14, padding: '10px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500,
              background: status.type === 'success' ? '#f0fdf4' : '#fef2f2',
              color: status.type === 'success' ? '#16a34a' : '#dc2626',
              border: `1px solid ${status.type === 'success' ? '#bbf7d0' : '#fecaca'}`
            }}>
              {status.message}
            </div>
          )}

          {/* Save Button */}
          <button
            onClick={saveVideos}
            disabled={saving}
            style={{
              marginTop: 20, padding: '12px 28px',
              background: saving ? '#a5b4fc' : '#6366f1',
              color: '#fff', border: 'none', borderRadius: 10,
              fontSize: 14, fontWeight: 700,
              cursor: saving ? 'not-allowed' : 'pointer', transition: 'background 0.2s'
            }}
          >
            {saving ? 'Saving...' : '💾 Save & Publish'}
          </button>
        </>
      )}
    </div>
  )
}

const inputStyle = {
  display: 'block',
  marginTop: 4,
  width: '100%',
  padding: '8px 12px',
  border: '1px solid #d1d5db',
  borderRadius: 8,
  fontSize: 13,
  background: '#fff',
  color: '#111',
  outline: 'none',
  boxSizing: 'border-box',
}
