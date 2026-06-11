import React, { useEffect, useState } from 'react'
import { useClient } from 'sanity'

// Common WP Box styling
const wpBoxStyle = {
  background: '#ffffff',
  border: '1px solid #c3c4c7',
  boxShadow: '0 1px 1px rgba(0, 0, 0, 0.04)',
  borderRadius: '4px',
  padding: '24px',
  marginBottom: '20px',
}

const headerStyle = {
  fontSize: '20px',
  fontWeight: '400',
  color: '#1d2327',
  margin: '0 0 12px 0',
  borderBottom: '1px solid #dcdcde',
  paddingBottom: '12px'
}

const containerStyle = {
  padding: '24px',
  backgroundColor: '#f0f0f1',
  minHeight: '100%',
  color: '#2c3338',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
}

export function UpdatesPanel() {
  return (
    <div style={containerStyle}>
      <h1 style={{ fontSize: '23px', fontWeight: '400', color: '#1d2327', margin: '0 0 20px 0' }}>WordPress Updates</h1>
      <div style={wpBoxStyle}>
        <h2 style={headerStyle}>Current Version</h2>
        <p style={{ fontSize: '13px', lineHeight: '1.6' }}>
          You have the latest version of WordPress clone running on <strong>Sanity + Next.js Headless Engine</strong>.
          Future security updates will be applied automatically.
        </p>
        <div style={{ marginTop: '20px', padding: '12px', background: '#ecf7ed', borderLeft: '4px solid #46b450', fontSize: '13px' }}>
          ✔️ Your site is fully up to date. No action is required.
        </div>
      </div>
    </div>
  )
}

export function TagsPanel() {
  return (
    <div style={containerStyle}>
      <h1 style={{ fontSize: '23px', fontWeight: '400', color: '#1d2327', margin: '0 0 20px 0' }}>Tags</h1>
      <div style={wpBoxStyle}>
        <h2 style={headerStyle}>Manage Tags</h2>
        <p style={{ fontSize: '13px', lineHeight: '1.6' }}>
          In this headless architecture, categories and tags are unified. You can create taxonomies in the <strong>Categories</strong> menu.
          If your project specifically needs a separate "Tags" schema, you can define a <code>tag.js</code> schema in <code>src/sanity/schemaTypes/</code>.
        </p>
      </div>
    </div>
  )
}

export function MediaLibraryPanel() {
  const client = useClient({ apiVersion: '2023-05-03' })
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    client.fetch(`*[_type == "sanity.imageAsset"] | order(_createdAt desc) { _id, url, originalFilename }`)
      .then(res => {
        setImages(res)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  return (
    <div style={containerStyle}>
      <h1 style={{ fontSize: '23px', fontWeight: '400', color: '#1d2327', margin: '0 0 20px 0' }}>Media Library</h1>
      <div style={wpBoxStyle}>
        <h2 style={headerStyle}>Uploaded Images</h2>
        {loading ? (
          <p>Loading media assets...</p>
        ) : images.length === 0 ? (
          <p style={{ fontSize: '13px', color: '#646970' }}>No media files found. Upload images inside posts to see them here.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '16px', marginTop: '16px' }}>
            {images.map(img => (
              <div key={img._id} style={{ border: '1px solid #c3c4c7', borderRadius: '4px', overflow: 'hidden', backgroundColor: '#f6f7f7', textAlign: 'center' }}>
                <div style={{ aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: '#fff' }}>
                  <img src={img.url} alt={img.originalFilename || 'Media'} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                </div>
                <div style={{ padding: '6px', fontSize: '10px', color: '#646970', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                  {img.originalFilename || 'image'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export function MediaAddPanel() {
  return (
    <div style={containerStyle}>
      <h1 style={{ fontSize: '23px', fontWeight: '400', color: '#1d2327', margin: '0 0 20px 0' }}>Upload New Media</h1>
      <div style={wpBoxStyle}>
        <h2 style={headerStyle}>Drag and Drop Upload</h2>
        <div style={{
          border: '2px dashed #c3c4c7',
          padding: '40px',
          textAlign: 'center',
          backgroundColor: '#f6f7f7',
          borderRadius: '4px'
        }}>
          <p style={{ fontSize: '16px', margin: '0 0 12px 0', color: '#1d2327' }}>Drop files here to upload</p>
          <span style={{ fontSize: '13px', color: '#646970' }}>or</span>
          <br /><br />
          <button style={{
            background: '#f6f7f7',
            border: '1px solid #2271b1',
            color: '#2271b1',
            padding: '6px 12px',
            borderRadius: '3px',
            cursor: 'pointer'
          }}>Select Files</button>
          <p style={{ fontSize: '11px', color: '#646970', marginTop: '16px' }}>Maximum upload file size: 64 MB.</p>
        </div>
      </div>
    </div>
  )
}

export function AppearancePanel() {
  return (
    <div style={containerStyle}>
      <h1 style={{ fontSize: '23px', fontWeight: '400', color: '#1d2327', margin: '0 0 20px 0' }}>Appearance & Styling</h1>
      <div style={wpBoxStyle}>
        <h2 style={headerStyle}>Next.js Headless Theme</h2>
        <p style={{ fontSize: '13px', lineHeight: '1.6' }}>
          This blog site uses a modern headless setup where styling is decoupled from the CMS.
          Instead of WordPress PHP themes, your layout and theme are coded in the Next.js React frontend:
        </p>
        <ul style={{ fontSize: '13px', lineHeight: '1.8', paddingLeft: '20px' }}>
          <li><strong>Global Styles:</strong> Coded in <code>src/app/globals.css</code> (using Tailwind CSS v4 / Vanilla CSS).</li>
          <li><strong>Components:</strong> Coded in <code>src/app/components/</code> (Header, Footer, HomeClient).</li>
          <li><strong>Page Layouts:</strong> Custom React components inside the Next.js <code>src/app/</code> directory.</li>
        </ul>
        <div style={{ marginTop: '20px', padding: '12px', background: '#f0f6fc', borderLeft: '4px solid #2271b1', fontSize: '13px' }}>
          💡 To modify the layout or colors, edit the React files in your code workspace.
        </div>
      </div>
    </div>
  )
}

export function PluginsPanel() {
  return (
    <div style={containerStyle}>
      <h1 style={{ fontSize: '23px', fontWeight: '400', color: '#1d2327', margin: '0 0 20px 0' }}>Plugins</h1>
      <div style={wpBoxStyle}>
        <h2 style={headerStyle}>Active Developer Modules</h2>
        <p style={{ fontSize: '13px', lineHeight: '1.6', marginBottom: '16px' }}>
          The following core modules are integrated into your Headless WordPress architecture:
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ padding: '12px', border: '1px solid #dcdcde', borderRadius: '4px', background: '#f6f7f7' }}>
            <strong style={{ fontSize: '14px', color: '#1d2327' }}>Next.js App Router v16</strong>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#646970' }}>Powers the ultra-fast SSR/ISR server-side rendering frontend.</p>
          </div>
          <div style={{ padding: '12px', border: '1px solid #dcdcde', borderRadius: '4px', background: '#f6f7f7' }}>
            <strong style={{ fontSize: '14px', color: '#1d2327' }}>Sanity CMS Engine v5</strong>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#646970' }}>Powers the content database schema and the real-time editing studio.</p>
          </div>
          <div style={{ padding: '12px', border: '1px solid #dcdcde', borderRadius: '4px', background: '#f6f7f7' }}>
            <strong style={{ fontSize: '14px', color: '#1d2327' }}>Framer Motion</strong>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#646970' }}>Provides the smooth animations and premium micro-interactions across layouts.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ProfilePanel() {
  return (
    <div style={containerStyle}>
      <h1 style={{ fontSize: '23px', fontWeight: '400', color: '#1d2327', margin: '0 0 20px 0' }}>Profile</h1>
      <div style={wpBoxStyle}>
        <h2 style={headerStyle}>User Profile Details</h2>
        <p style={{ fontSize: '13px', lineHeight: '1.6' }}>
          To edit user bio details, upload profile pictures, or add social media links, navigate to the <strong>Users</strong> menu in the sidebar and edit the respective User document.
        </p>
      </div>
    </div>
  )
}

export function ToolsPanel() {
  const client = useClient({ apiVersion: '2023-05-03' })
  const [importStatus, setImportStatus] = useState({ state: 'idle', message: '', progress: 0 })
  const [exporting, setExporting] = useState(false)

  const handleExport = async () => {
    setExporting(true)
    try {
      const docs = await client.fetch(`*[_type in ["post", "category", "author", "comment", "page", "siteConfig"]]`)
      const blob = new Blob([JSON.stringify(docs, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `wp-backup-${new Date().toISOString().slice(0, 10)}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      alert("Export failed: " + err.message)
    } finally {
      setExporting(false)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    setImportStatus({ state: 'reading', message: 'Reading backup file...', progress: 10 })

    const fileReader = new FileReader()
    fileReader.onload = async (event) => {
      try {
        const parsed = JSON.parse(event.target.result)
        if (!Array.isArray(parsed)) {
          throw new Error("Backup file must contain an array of documents.")
        }

        setImportStatus({ state: 'importing', message: `Importing ${parsed.length} documents...`, progress: 40 })

        const transaction = client.transaction()
        parsed.forEach(doc => {
          if (!doc._id || !doc._type) return
          const cleanDoc = { ...doc }
          delete cleanDoc._rev
          delete cleanDoc._updatedAt
          delete cleanDoc._createdAt
          
          transaction.createOrReplace(cleanDoc)
        })

        await transaction.commit()
        setImportStatus({ 
          state: 'success', 
          message: `Success! ${parsed.length} documents have been successfully imported and restored.`, 
          progress: 100 
        })
      } catch (err) {
        setImportStatus({ 
          state: 'error', 
          message: `Import failed: ${err.message}`, 
          progress: 0 
        })
      }
    }

    fileReader.onerror = () => {
      setImportStatus({ state: 'error', message: 'Failed to read file.', progress: 0 })
    }

    fileReader.readAsText(file)
  }

  return (
    <div style={containerStyle}>
      <h1 style={{ fontSize: '23px', fontWeight: '400', color: '#1d2327', margin: '0 0 20px 0' }}>Tools</h1>
      
      {/* Export Tool */}
      <div style={wpBoxStyle}>
        <h2 style={headerStyle}>Export Content (Data Backup)</h2>
        <p style={{ fontSize: '13px', lineHeight: '1.6', marginBottom: '16px' }}>
          When you click the button below, WordPress will generate a JSON file containing all posts, categories, comments, pages, and theme configurations for you to save to your computer.
        </p>
        <button 
          onClick={handleExport}
          disabled={exporting}
          style={{
            backgroundColor: exporting ? '#94a3b8' : '#2271b1',
            color: '#fff',
            border: 'none',
            borderRadius: '3px',
            padding: '8px 16px',
            cursor: exporting ? 'not-allowed' : 'pointer',
            fontSize: '13px',
            fontWeight: '500',
            transition: 'background-color 0.2s',
          }}
        >
          {exporting ? 'Generating Backup...' : 'Download Export JSON File'}
        </button>
      </div>

      {/* Import Tool */}
      <div style={wpBoxStyle}>
        <h2 style={headerStyle}>Import Content (Restore Backup)</h2>
        <p style={{ fontSize: '13px', lineHeight: '1.6', marginBottom: '16px' }}>
          If you have site data in a JSON backup file exported previously, you can select the file below to import it. Existing documents with the same IDs will be overwritten.
        </p>
        
        <div style={{ marginBottom: '16px' }}>
          <input 
            type="file" 
            accept=".json"
            onChange={handleFileChange}
            style={{
              fontSize: '13px',
              color: '#646970',
            }}
          />
        </div>

        {importStatus.state !== 'idle' && (
          <div style={{
            marginTop: '16px',
            padding: '12px',
            borderRadius: '4px',
            fontSize: '13px',
            backgroundColor: importStatus.state === 'success' ? '#ecf7ed' : importStatus.state === 'error' ? '#fcf0f0' : '#f0f6fc',
            borderLeft: `4px solid ${importStatus.state === 'success' ? '#46b450' : importStatus.state === 'error' ? '#d63636' : '#2271b1'}`,
            color: importStatus.state === 'success' ? '#2e6b34' : importStatus.state === 'error' ? '#9e2525' : '#1a4e7a',
          }}>
            {importStatus.message}
            {importStatus.progress > 0 && importStatus.progress < 100 && (
              <div style={{ width: '100%', backgroundColor: '#e2e8f0', height: '4px', borderRadius: '2px', marginTop: '8px', overflow: 'hidden' }}>
                <div style={{ width: `${importStatus.progress}%`, backgroundColor: '#2271b1', height: '100%' }}></div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export function SettingsPanel() {
  return (
    <div style={containerStyle}>
      <h1 style={{ fontSize: '23px', fontWeight: '400', color: '#1d2327', margin: '0 0 20px 0' }}>Settings</h1>
      <div style={wpBoxStyle}>
        <h2 style={headerStyle}>System Settings</h2>
        <p style={{ fontSize: '13px', lineHeight: '1.6' }}>
          In this headless architecture, general site settings like Title, Tagline, Logo Text, and Theme Colors are managed inside the singleton **General Settings** editor.
        </p>
        <p style={{ fontSize: '13px', lineHeight: '1.6', marginTop: '12px' }}>
          To edit these values, click **General** or **Customize** in the sidebar. System-level parameters like dataset variables and API versions are configured inside the <code>.env.local</code> file in your workspace.
        </p>
      </div>
    </div>
  )
}
