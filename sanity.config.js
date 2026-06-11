import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schema } from './src/sanity/schemaTypes'

// Import custom components
import CustomLogo from './src/sanity/components/CustomLogo'
import Dashboard from './src/sanity/components/Dashboard'
import SEOPreview from './src/sanity/components/SEOPreview'

// Import WordPress clone placeholder panels
import {
  UpdatesPanel,
  TagsPanel,
  MediaLibraryPanel,
  MediaAddPanel,
  AppearancePanel,
  PluginsPanel,
  ProfilePanel,
  ToolsPanel,
  SettingsPanel
} from './src/sanity/components/PlaceholderPanels'

import YouTubeVideosPanel from './src/sanity/components/YouTubeVideosPanel'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'ygp0nql6'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

export default defineConfig({
  basePath: '/studio',
  name: 'default',
  title: 'Premium Blog Studio',

  projectId,
  dataset,

  // 1. Custom Branding (Logo & theme overrides)
  studio: {
    components: {
      logo: CustomLogo
    }
  },

  // 2. Custom Tools (Interactive Dashboard)
  tools: (prev) => {
    // Keep only the custom 'dashboard' and the default 'structure' tool
    // This will hide 'vision' and 'releases' from the top bar
    return [
      {
        name: 'dashboard',
        title: 'Dashboard',
        component: Dashboard,
      },
      ...prev.filter(tool => tool.name === 'structure')
    ]
  },

  plugins: [
    // 3. Document Views (Real-time SEO Preview tab for posts)
    structureTool({
      structure: (S) =>
        S.list()
          .title('wp-admin')
          .items([
            // 1. Dashboard Submenu
            S.listItem()
              .title('Dashboard')
              .icon(() => '🎛️')
              .child(
                S.list()
                  .title('Dashboard')
                  .items([
                    S.listItem()
                      .title('Home')
                      .icon(() => '🏠')
                      .child(S.component(Dashboard).title('Dashboard')),
                    S.listItem()
                      .title('Updates')
                      .icon(() => '🔄')
                      .child(S.component(UpdatesPanel).title('Updates')),
                  ])
              ),

            S.divider(),

            // 2. Posts Submenu
            S.listItem()
              .title('Posts')
              .icon(() => '📌')
              .child(
                S.list()
                  .title('Posts')
                  .items([
                    S.documentTypeListItem('post').title('All Posts'),
                    S.documentTypeListItem('category').title('Categories'),
                    S.listItem()
                      .title('Tags')
                      .child(S.component(TagsPanel).title('Tags')),
                  ])
              ),

            // 3. Media Submenu
            S.listItem()
              .title('Media')
              .icon(() => '🖼️')
              .child(
                S.list()
                  .title('Media')
                  .items([
                    S.listItem()
                      .title('Library')
                      .child(S.component(MediaLibraryPanel).title('Library')),
                    S.listItem()
                      .title('Add New')
                      .child(S.component(MediaAddPanel).title('Add New')),
                  ])
              ),

            // 4. Pages Submenu
            S.listItem()
              .title('Pages')
              .icon(() => '📄')
              .child(
                S.list()
                  .title('Pages')
                  .items([
                    S.documentTypeListItem('page').title('All Pages'),
                  ])
              ),

            // 5. Comments
            S.documentTypeListItem('comment')
              .title('Comments')
              .icon(() => '💬'),

            // 6. Newsletter Subscribers
            S.documentTypeListItem('subscriber')
              .title('Newsletter Subscribers')
              .icon(() => '✉️'),

            // AdSense
            S.listItem()
              .title('AdSense')
              .icon(() => '💰')
              .child(
                S.document()
                  .schemaType('adsenseConfig')
                  .documentId('adsenseConfig')
              ),

            // Social Media
            S.listItem()
              .title('Social Media')
              .icon(() => '🌐')
              .child(
                S.document()
                  .schemaType('socialMedia')
                  .documentId('socialMedia')
              ),

            // 🎬 Featured YouTube Videos
            S.listItem()
              .title('Featured YouTube Videos')
              .icon(() => '▶️')
              .child(
                S.component(YouTubeVideosPanel).title('Featured YouTube Videos')
              ),

            S.divider(),

            // 6. Appearance Submenu
            S.listItem()
              .title('Appearance')
              .icon(() => '🎨')
              .child(
                S.list()
                  .title('Appearance')
                  .items([
                    S.listItem().title('Themes').child(S.component(AppearancePanel).title('Themes')),
                    S.listItem().title('Customize').child(S.document().schemaType('siteConfig').documentId('siteConfig')),
                    S.listItem().title('Widgets').child(S.component(AppearancePanel).title('Widgets')),
                    S.listItem().title('Menus').child(S.component(AppearancePanel).title('Menus')),
                  ])
              ),

            // 7. Plugins Submenu
            S.listItem()
              .title('Plugins')
              .icon(() => '🔌')
              .child(
                S.list()
                  .title('Plugins')
                  .items([
                    S.listItem().title('Installed Plugins').child(S.component(PluginsPanel).title('Installed Plugins')),
                    S.listItem().title('Add New').child(S.component(PluginsPanel).title('Add New')),
                  ])
              ),

            // 8. Users Submenu (Authors)
            S.listItem()
              .title('Users')
              .icon(() => '👥')
              .child(
                S.list()
                  .title('Users')
                  .items([
                    S.documentTypeListItem('author').title('All Users'),
                    S.listItem().title('Profile').child(S.component(ProfilePanel).title('Profile')),
                  ])
              ),

            // 9. Tools Submenu
            S.listItem()
              .title('Tools')
              .icon(() => '🛠️')
              .child(
                S.list()
                  .title('Tools')
                  .items([
                    S.listItem().title('Site Health').child(S.component(ToolsPanel).title('Site Health')),
                    S.listItem().title('Import').child(S.component(ToolsPanel).title('Import')),
                    S.listItem().title('Export').child(S.component(ToolsPanel).title('Export')),
                  ])
              ),

            // 10. Settings Submenu
            S.listItem()
              .title('Settings')
              .icon(() => '⚙️')
              .child(
                S.list()
                  .title('Settings')
                  .items([
                    S.listItem().title('General').child(S.document().schemaType('siteConfig').documentId('siteConfig')),
                    S.listItem().title('Writing').child(S.component(SettingsPanel).title('Writing')),
                    S.listItem().title('Reading').child(S.component(SettingsPanel).title('Reading')),
                  ])
              ),
          ]),
      defaultDocumentNode: (S, { schemaType }) => {
        if (schemaType === 'post') {
          return S.document().views([
            S.view.form(),
            S.view.component(SEOPreview).title('SEO Preview')
          ])
        }
        return S.document().views([S.view.form()])
      }
    }),
    visionTool()
  ],

  schema: {
    types: schema.types,
  },
})
