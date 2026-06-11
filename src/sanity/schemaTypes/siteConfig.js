export const siteConfig = {
  name: 'siteConfig',
  title: 'Site Configuration',
  type: 'document',
  fields: [
    {
      name: 'siteName',
      title: 'Site Title',
      type: 'string',
      initialValue: 'The Learn Up',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      initialValue: 'Premium Insights & Creative Stories',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'logoText',
      title: 'Logo Text (Navbar)',
      type: 'string',
      initialValue: 'The Learn Up',
    },
    {
      name: 'logoImage',
      title: 'Logo Image (Navbar/Footer)',
      type: 'image',
      description: 'Upload a custom logo image (PNG, SVG, or JPG). If uploaded, this will be used in the navbar and footer instead of the default text logo.',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'primaryColor',
      title: 'Primary Brand Color Theme',
      type: 'string',
      description: 'Choose the accent color for buttons, links, and text gradients on the blog.',
      initialValue: 'indigo',
      options: {
        list: [
          { title: 'Classic Indigo', value: 'indigo' },
          { title: 'WordPress Blue', value: 'blue' },
          { title: 'Modern Violet', value: 'violet' },
          { title: 'Vibrant Rose', value: 'rose' },
          { title: 'Emerald Green', value: 'emerald' },
        ],
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'footerText',
      title: 'Footer Copyright Text',
      type: 'string',
      initialValue: '© 2026 The Learn Up Team. All rights reserved.',
    },

    {
      name: 'menuItems',
      title: 'Navigation Menu Items (Header)',
      type: 'array',
      description: 'Manage links in your header navigation. Leave empty to use default pages.',
      of: [
        {
          type: 'object',
          name: 'menuItem',
          title: 'Menu Item',
          fields: [
            { name: 'label', title: 'Link Label', type: 'string', validation: Rule => Rule.required() },
            { name: 'url', title: 'Target Link / URL', type: 'string', description: 'Example: /about or /blog?category=coding', validation: Rule => Rule.required() }
          ]
        }
      ]
    },
    {
      name: 'youtubeVideos',
      title: 'Featured YouTube Videos',
      type: 'array',
      description: 'Add up to 3 featured YouTube videos to display on the homepage.',
      of: [
        {
          type: 'object',
          name: 'youtubeVideo',
          title: 'YouTube Video',
          fields: [
            { name: 'title', title: 'Video Title', type: 'string', validation: Rule => Rule.required() },
            { name: 'videoId', title: 'YouTube Video ID', type: 'string', description: 'The 11-character ID in the YouTube URL (e.g. dQw4w9WgXcQ)', validation: Rule => Rule.required() },
            { name: 'description', title: 'Brief Description', type: 'text', rows: 2 }
          ]
        }
      ]
    }
  ],
}
