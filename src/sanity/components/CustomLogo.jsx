import React from 'react'

export default function CustomLogo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '2px 4px' }}>
      {/* WordPress Icon Logo */}
      <div style={{
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        backgroundColor: '#72aee6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#1d2327',
        fontWeight: 'bold',
        fontSize: '13px',
        fontFamily: 'Georgia, serif',
        lineHeight: '1',
        boxShadow: '0 0 4px rgba(255, 255, 255, 0.2)'
      }}>
        W
      </div>
      
      {/* Site Name with Home Icon */}
      <span style={{
        fontWeight: '500',
        color: '#f0f0f1',
        fontSize: '13px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
      }}>
        🏠 Test Website
      </span>

      {/* Mock updates indicator */}
      <span style={{
        fontSize: '11px',
        color: '#c3c4c7',
        backgroundColor: '#2c3338',
        padding: '1px 6px',
        borderRadius: '10px',
        marginLeft: '4px',
        display: 'flex',
        alignItems: 'center',
        gap: '2px'
      }}>
        🔄 0
      </span>

      {/* New Menu link */}
      <span style={{
        fontSize: '13px',
        color: '#c3c4c7',
        marginLeft: '12px',
        cursor: 'default',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        ➕ New
      </span>
      
      <style>{`
        /* -------------------------------------------------------------
           WORDPRESS ADMIN (WP-ADMIN) EXACT CLONE THEME FOR SANITY STUDIO
           ------------------------------------------------------------- */

        /* 1. Navbar (Admin Bar) styling */
        header[data-testid="studio-navbar"] {
          background-color: #1d2327 !important;
          border-bottom: none !important;
          height: 32px !important; /* wp-admin bar thickness */
          padding: 0 12px !important;
          position: relative !important;
        }
        
        /* Remove default search box padding adjustments */
        header[data-testid="studio-navbar"] [data-testid="search-input"] {
          border-radius: 4px !important;
          border: 1px solid #7e8993 !important;
        }

        /* Inject "Howdy, admin" on the right side of the admin bar */
        header[data-testid="studio-navbar"]::after {
          content: "Howdy, website.admin 👤";
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #c3c4c7;
          font-size: 13px;
          font-weight: 500;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          pointer-events: none;
        }

        /* Hide default user/profile button to prevent double admin representation */
        header[data-testid="studio-navbar"] [data-testid="user-menu"] {
          display: none !important;
        }

        /* 2. Sidebar Navigation (Dark wp-admin Menu Column) */
        [data-pane-id="root"] {
          background-color: #1d2327 !important;
          color: #c3c4c7 !important;
          border-right: none !important;
          min-width: 170px !important;
          max-width: 210px !important;
        }
        [data-pane-id="root"] header[data-testid="pane-header"] {
          background-color: #1d2327 !important;
          border-bottom: 1px solid #2c3338 !important;
          padding: 16px !important;
        }
        [data-pane-id="root"] header[data-testid="pane-header"] * {
          color: #f0f0f1 !important;
          font-size: 14px !important;
          font-weight: 600 !important;
          text-transform: capitalize;
          letter-spacing: 0.5px;
        }
        [data-pane-id="root"] [data-testid="pane-content"] {
          background-color: #1d2327 !important;
        }

        /* Sidebar Navigation Item button */
        [data-pane-id="root"] [role="button"] {
          border-radius: 0px !important;
          margin: 0 !important;
          padding: 10px 14px !important;
          color: #c3c4c7 !important;
          font-size: 14px !important;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
          background: transparent !important;
          border-left: 4px solid transparent !important;
          transition: none !important;
        }
        [data-pane-id="root"] [role="button"]:hover {
          background-color: #2c3338 !important;
          color: #72aee6 !important;
        }
        [data-pane-id="root"] [role="button"][aria-selected="true"],
        [data-pane-id="root"] [role="button"][data-selected="true"] {
          background-color: #2271b1 !important;
          color: #ffffff !important;
          border-left: 4px solid #72aee6 !important;
        }

        /* 3. Columns (Submenus & Document Lists) */
        /* All nested columns (e.g. posts lists, category lists) use a clean white background */
        [data-testid="pane"] {
          background-color: #ffffff !important;
        }
        [data-testid="pane"] header[data-testid="pane-header"] {
          background-color: #ffffff !important;
          border-bottom: 1px solid #dcdcde !important;
        }
        [data-testid="pane"] [data-testid="pane-content"] {
          background-color: #ffffff !important;
        }

        /* Hover and active states for document item list buttons */
        [data-testid="pane"] [role="button"] {
          border-radius: 0px !important;
          margin: 0 !important;
          border-bottom: 1px solid #f0f0f1 !important;
          padding: 12px 16px !important;
          color: #2c3338 !important;
        }
        [data-testid="pane"] [role="button"]:hover {
          background-color: #f6f7f7 !important;
          color: #2271b1 !important;
        }
        [data-testid="pane"] [role="button"][aria-selected="true"],
        [data-testid="pane"] [role="button"][data-selected="true"] {
          background-color: #f0f6fc !important;
          color: #2271b1 !important;
          border-left: 3px solid #2271b1 !important;
        }

        /* 4. Edit Pane canvas (Light-grey WP Background) */
        [data-testid="document-panel"] {
          background-color: #f0f0f1 !important;
        }
        [data-testid="document-panel"] header[data-testid="pane-header"] {
          background-color: #ffffff !important;
          border-bottom: 1px solid #dcdcde !important;
        }
        [data-testid="document-panel"] [data-testid="pane-content"] {
          background-color: #f0f0f1 !important;
        }

        /* WordPress boxed post/page editor container */
        [data-testid="document-panel"] form {
          background: #ffffff !important;
          border: 1px solid #c3c4c7 !important;
          box-shadow: 0 1px 1px rgba(0, 0, 0, 0.04) !important;
          border-radius: 4px !important;
          padding: 30px !important;
          margin: 24px auto !important;
          max-width: 900px !important;
        }

        /* 5. Inputs (WP form controls) */
        input, textarea, select {
          border: 1px solid #8c8f94 !important;
          border-radius: 4px !important;
          background-color: #ffffff !important;
          color: #2c3338 !important;
          box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.07) !important;
          padding: 8px 12px !important;
        }
        input:focus, textarea:focus, select:focus {
          border-color: #2271b1 !important;
          box-shadow: 0 0 0 1px #2271b1 !important;
          outline: 2px solid transparent !important;
        }

        /* WP Blue Buttons */
        button[data-intent="publish"],
        button[type="submit"],
        button[data-testid="action-intent-publish"] {
          background-color: #2271b1 !important;
          border-color: #2271b1 !important;
          color: #ffffff !important;
          border-radius: 3px !important;
          font-weight: 600 !important;
          box-shadow: none !important;
          text-shadow: none !important;
        }
        button[data-intent="publish"]:hover,
        button[type="submit"]:hover,
        button[data-testid="action-intent-publish"]:hover {
          background-color: #135e96 !important;
          border-color: #135e96 !important;
          color: #ffffff !important;
        }
      `}</style>
    </div>
  )
}
