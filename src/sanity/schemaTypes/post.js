export const post = {
  name: 'post',
  title: 'Post',
  type: 'document',
  initialValue: () => ({
    status: 'publish',
    publishedAt: new Date().toISOString(),
    isFeatured: false,
    isTrending: false,
  }),
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'excerpt',
      title: 'Excerpt (Short Description)',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(200),
    },
    {
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: {type: 'author'},
    },
    {
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{type: 'reference', to: {type: 'category'}}],
    },
    {
      name: 'status',
      title: 'Post Status',
      type: 'string',
      options: {
        list: [
          {title: 'Publish (Visible immediately)', value: 'publish'},
          {title: 'Schedule (Publish at future date)', value: 'schedule'},
          {title: 'Draft (Keep hidden)', value: 'draft'},
        ],
        layout: 'radio', // Display as toggle radio buttons for easy clicking
      },
      initialValue: 'publish',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      validation: (Rule) => Rule.custom((publishedAt, context) => {
        const status = context.document?.status
        if (status === 'schedule') {
          if (!publishedAt) {
            return 'Published date/time is required for scheduled posts'
          }
          if (new Date(publishedAt) <= new Date()) {
            return 'For scheduled posts, the date/time must be set in the future'
          }
        }
        return true
      }),
    },
    {
      name: 'isFeatured',
      title: 'Featured Post?',
      type: 'boolean',
      description: 'Check this to show the post in the main hero section of the homepage.',
      initialValue: false,
    },
    {
      name: 'isTrending',
      title: 'Trending Post?',
      type: 'boolean',
      description: 'Check this to show the post in the trending section on the homepage.',
      initialValue: false,
    },
    {
      name: 'mainImage',
      title: 'Main image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          validation: (Rule) => Rule.required(),
        }
      ]
    },
    {
      name: 'body',
      title: 'Body',
      type: 'blockContent',
    },
  ],
}
