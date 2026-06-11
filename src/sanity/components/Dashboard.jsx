import React, { useState, useEffect } from 'react'
import { useClient } from 'sanity'

export default function Dashboard() {
  const client = useClient({ apiVersion: '2023-05-03' })
  const [stats, setStats] = useState({ posts: 0, pages: 0, comments: 0 })
  const [siteConfig, setSiteConfig] = useState(null)
  const [recentComments, setRecentComments] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Quick Draft State
  const [draftTitle, setDraftTitle] = useState('')
  const [draftContent, setDraftContent] = useState('')
  const [savingDraft, setSavingDraft] = useState(false)
  const [draftStatus, setDraftStatus] = useState('')

  const fetchStats = async () => {
    try {
      setLoading(true)
      const postsCount = await client.fetch(`count(*[_type == "post"])`)
      const pagesCount = await client.fetch(`count(*[_type == "page"])`)
      const commentsCount = await client.fetch(`count(*[_type == "comment"])`)
      
      const config = await client.fetch(`*[_type == "siteConfig"][0]`)
      const commentsList = await client.fetch(`*[_type == "comment"] | order(_createdAt desc)[0..4] {
        _id,
        name,
        email,
        comment,
        approved,
        _createdAt
      }`)
      
      setStats({
        posts: postsCount,
        pages: pagesCount,
        comments: commentsCount
      })
      setSiteConfig(config)
      setRecentComments(commentsList || [])
    } catch (err) {
      console.error('Error fetching dashboard counts:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  const handleSaveDraft = async (e) => {
    e.preventDefault()
    if (!draftTitle) return
    
    setSavingDraft(true)
    setDraftStatus('')
    
    try {
      const newDraft = {
        _type: 'post',
        title: draftTitle,
        slug: {
          _type: 'slug',
          current: draftTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        },
        excerpt: draftContent.slice(0, 150),
        publishedAt: new Date().toISOString(),
        isFeatured: false,
        body: [
          {
            _key: 'b1',
            _type: 'block',
            children: [{ _type: 'span', text: draftContent }],
            style: 'normal'
          }
        ]
      }
      
      await client.create(newDraft)
      
      setDraftTitle('')
      setDraftContent('')
      setDraftStatus('Draft saved successfully!')
      
      await fetchStats()
    } catch (err) {
      console.error('Error saving draft:', err)
      setDraftStatus('Failed to save draft: ' + err.message)
    } finally {
      setSavingDraft(false)
    }
  }

  const handleApproveComment = async (id) => {
    try {
      await client.patch(id).set({ approved: true }).commit()
      await fetchStats()
    } catch (err) {
      alert("Failed to approve comment: " + err.message)
    }
  }

  const handleDeleteComment = async (id) => {
    if (!confirm("Are you sure you want to delete this comment?")) return
    try {
      await client.delete(id)
      await fetchStats()
    } catch (err) {
      alert("Failed to delete comment: " + err.message)
    }
  }

  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#f0f0f1',
      color: '#2c3338',
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
      boxSizing: 'border-box'
    }}>
      <style>{`
        .wp-welcome-panel {
          background: #ffffff;
          border: 1px solid #c3c4c7;
          box-shadow: 0 1px 1px rgba(0, 0, 0, 0.04);
          padding: 24px;
          margin-bottom: 20px;
          border-radius: 4px;
          position: relative;
        }
        .wp-welcome-dismiss {
          position: absolute;
          top: 16px;
          right: 16px;
          color: #646970;
          cursor: pointer;
          font-size: 13px;
          text-decoration: none;
        }
        .wp-welcome-dismiss:hover {
          color: #d54e21;
        }
        .wp-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
        }
        @media (min-width: 900px) {
          .wp-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        .wp-widget {
          background: #ffffff;
          border: 1px solid #c3c4c7;
          box-shadow: 0 1px 1px rgba(0, 0, 0, 0.04);
          border-radius: 4px;
          margin-bottom: 20px;
        }
        .wp-widget-header {
          padding: 12px 15px;
          border-bottom: 1px solid #c3c4c7;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .wp-widget-header h2 {
          margin: 0;
          font-size: 14px;
          font-weight: 600;
          color: #1d2327;
        }
        .wp-widget-body {
          padding: 15px;
          font-size: 13px;
          line-height: 1.5;
        }
        .wp-btn-primary {
          background: #2271b1;
          border: 1px solid #2271b1;
          color: #fff;
          padding: 8px 16px;
          font-size: 13px;
          font-weight: 500;
          border-radius: 3px;
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
          box-shadow: 0 1px 0 #135e96;
        }
        .wp-btn-primary:hover {
          background: #135e96;
          border-color: #135e96;
        }
        .wp-input {
          width: 100%;
          border: 1px solid #8c8f94;
          border-radius: 4px;
          padding: 6px 10px;
          font-size: 13px;
          box-sizing: border-box;
          margin-bottom: 12px;
          color: #2c3338;
        }
        .wp-input:focus {
          border-color: #2271b1;
          box-shadow: 0 0 0 1px #2271b1;
          outline: none;
        }
        .wp-links-col h3 {
          font-size: 14px;
          margin: 0 0 12px 0;
          font-weight: 600;
          color: #1d2327;
        }
        .wp-links-col ul {
          margin: 0;
          padding: 0;
          list-style: none;
        }
        .wp-links-col li {
          margin-bottom: 10px;
          font-size: 13px;
        }
        .wp-links-col a {
          color: #2271b1;
          text-decoration: none;
        }
        .wp-links-col a:hover {
          color: #135e96;
        }
        .comment-item {
          padding: 12px 0;
          border-bottom: 1px solid #f0f0f1;
        }
        .comment-item:last-child {
          border-bottom: none;
        }
      `}</style>

      {/* Main Title */}
      <h1 style={{ fontSize: '23px', fontWeight: '400', color: '#1d2327', margin: '0 0 20px 0' }}>Dashboard</h1>

      {/* Welcome Widget */}
      <div className="wp-welcome-panel">
        <a href="#" className="wp-welcome-dismiss" onClick={(e) => { e.preventDefault(); e.target.parentElement.style.display = 'none'; }}>✖ Dismiss</a>
        <h2 style={{ fontSize: '21px', fontWeight: '400', color: '#1d2327', margin: '0 0 8px 0' }}>
          Welcome to {siteConfig?.siteName || 'The Learn Up'}!
        </h2>
        <p style={{ fontSize: '14px', color: '#646970', margin: '0 0 24px 0' }}>
          {siteConfig?.tagline || 'Manage your posts, pages, comments, and settings from here.'}
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
          {/* Col 1 */}
          <div className="wp-links-col">
            <h3>Get Started</h3>
            <a href="/studio/structure/siteConfig" className="wp-btn-primary" style={{ marginBottom: '12px' }}>Customize Your Site</a>
            <p style={{ margin: 0, fontSize: '13px', color: '#646970' }}>
              or, <a href="/studio/structure/siteConfig" style={{ color: '#2271b1', textDecoration: 'none' }}>edit brand name & links</a>
            </p>
          </div>

          {/* Col 2 */}
          <div className="wp-links-col">
            <h3>Next Steps</h3>
            <ul>
              <li>✍️ <a href="/studio/intent/create/type=post/">Write your first blog post</a></li>
              <li>➕ <a href="/studio/intent/create/type=page/">Add dynamic page</a></li>
              <li>🏠 <a href="/" target="_blank" rel="noopener noreferrer">View live homepage</a></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="wp-links-col">
            <h3>Backup & Restore</h3>
            <ul>
              <li>📥 <a href="/studio/structure/tools">Export JSON backup</a></li>
              <li>📤 <a href="/studio/structure/tools">Restore JSON backup</a></li>
              <li>💬 <a href="/studio/structure/comment">Moderate reader comments</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Masonry Columns */}
      <div className="wp-grid">
        {/* Left Column Widgets */}
        <div>
          {/* Site Health Widget */}
          <div className="wp-widget">
            <div className="wp-widget-header">
              <h2>Site Engine Health</h2>
              <span style={{ fontSize: '12px', color: '#646970' }}>▼</span>
            </div>
            <div className="wp-widget-body" style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', minHeight: '100px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#ecf7ed',
                border: '1px solid #46b450',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px'
              }}>🟢</div>
              <div>
                <p style={{ margin: '0 0 10px 0', fontSize: '13px', fontWeight: 'bold', color: '#2e6b34' }}>
                  Your site health is Good.
                </p>
                <ul style={{ margin: '6px 0', paddingLeft: '16px', fontSize: '12px', color: '#646970', lineHeight: '1.7' }}>
                  <li>🚀 Vercel Hosting Engine: **Active**</li>
                  <li>📦 Sanity Real-time Database: **Connected**</li>
                  <li>💰 Google AdSense Integration: **Enabled**</li>
                </ul>
              </div>
            </div>
          </div>

          {/* At a Glance Widget */}
          <div className="wp-widget">
            <div className="wp-widget-header">
              <h2>At a Glance</h2>
              <span style={{ fontSize: '12px', color: '#646970' }}>▼</span>
            </div>
            <div className="wp-widget-body" style={{ paddingBottom: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                <a href="/studio/structure/post" style={{ color: '#2271b1', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  📌 {stats.posts} {stats.posts === 1 ? 'Post' : 'Posts'}
                </a>
                <a href="/studio/structure/page" style={{ color: '#2271b1', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  📄 {stats.pages} {stats.pages === 1 ? 'Page' : 'Pages'}
                </a>
                <a href="/studio/structure/comment" style={{ color: '#2271b1', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  💬 {stats.comments} {stats.comments === 1 ? 'Comment' : 'Comments'}
                </a>
              </div>
              <div style={{ borderTop: '1px solid #dcdcde', paddingTop: '12px', color: '#646970', fontSize: '12px' }}>
                Running Next.js on Vercel with a customized color theme.
                <br />
                🔍 Search engines: <strong>Encouraged (SEO Enabled)</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column Widgets */}
        <div>
          {/* Quick Draft Widget */}
          <div className="wp-widget">
            <div className="wp-widget-header">
              <h2>Quick Draft</h2>
              <span style={{ fontSize: '12px', color: '#646970' }}>▼</span>
            </div>
            <div className="wp-widget-body">
              <form onSubmit={handleSaveDraft}>
                <label style={{ fontSize: '12px', fontWeight: '500', color: '#1d2327', display: 'block', marginBottom: '4px' }}>Title</label>
                <input
                  type="text"
                  required
                  value={draftTitle}
                  onChange={(e) => setDraftTitle(e.target.value)}
                  placeholder="Enter title"
                  className="wp-input"
                />

                <label style={{ fontSize: '12px', fontWeight: '500', color: '#1d2327', display: 'block', marginBottom: '4px' }}>Content</label>
                <textarea
                  rows={4}
                  value={draftContent}
                  onChange={(e) => setDraftContent(e.target.value)}
                  placeholder="What's on your mind?"
                  className="wp-input"
                  style={{ resize: 'none', fontFamily: 'inherit' }}
                />

                {draftStatus && (
                  <div style={{
                    marginBottom: '12px',
                    fontSize: '12px',
                    color: draftStatus.startsWith('Error') ? '#b32d2e' : '#46b450',
                    fontWeight: 'bold'
                  }}>
                    {draftStatus}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={savingDraft || !draftTitle}
                  className="wp-btn-primary"
                  style={{ border: 'none' }}
                >
                  {savingDraft ? 'Saving...' : 'Save Draft'}
                </button>
              </form>
            </div>
          </div>

          {/* Comments Moderation Inbox Widget */}
          <div className="wp-widget">
            <div className="wp-widget-header">
              <h2>Recent Reader Comments</h2>
              <span style={{ fontSize: '12px', color: '#646970' }}>▼</span>
            </div>
            <div className="wp-widget-body" style={{ padding: '10px 15px' }}>
              {recentComments.length === 0 ? (
                <p style={{ color: '#646970', margin: '10px 0' }}>No comments submitted yet.</p>
              ) : (
                recentComments.map((comment) => (
                  <div key={comment._id} className="comment-item">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <strong style={{ color: '#1d2327' }}>{comment.name}</strong>
                      <span style={{ fontSize: '11px', color: '#646970' }}>
                        {new Date(comment._createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p style={{ margin: '0 0 8px 0', color: '#2c3338', fontSize: '12px', fontStyle: 'italic' }}>
                      "{comment.comment}"
                    </p>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      {comment.approved ? (
                        <span style={{ fontSize: '11px', color: '#2e6b34', backgroundColor: '#ecf7ed', padding: '2px 6px', borderRadius: '3px', fontWeight: '500' }}>
                          Approved
                        </span>
                      ) : (
                        <>
                          <span style={{ fontSize: '11px', color: '#9e2525', backgroundColor: '#fcf0f0', padding: '2px 6px', borderRadius: '3px', fontWeight: '500' }}>
                            Pending
                          </span>
                          <button 
                            onClick={() => handleApproveComment(comment._id)}
                            style={{
                              border: '1px solid #46b450',
                              backgroundColor: '#fff',
                              color: '#2e6b34',
                              fontSize: '11px',
                              padding: '2px 8px',
                              borderRadius: '3px',
                              cursor: 'pointer'
                            }}
                          >
                            Approve
                          </button>
                        </>
                      )}
                      <button 
                        onClick={() => handleDeleteComment(comment._id)}
                        style={{
                          border: '1px solid #d63636',
                          backgroundColor: '#fff',
                          color: '#9e2525',
                          fontSize: '11px',
                          padding: '2px 8px',
                          borderRadius: '3px',
                          cursor: 'pointer'
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
