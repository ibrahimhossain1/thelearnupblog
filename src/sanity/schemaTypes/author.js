export const author = {
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'bio',
      title: 'Bio',
      type: 'text',
      rows: 3,
    },
    {
      name: 'youtube',
      title: 'YouTube Channel URL',
      type: 'url',
    },
    {
      name: 'github',
      title: 'GitHub Profile URL',
      type: 'url',
    },
    {
      name: 'twitter',
      title: 'Twitter / X URL',
      type: 'url',
    },
    {
      name: 'facebook',
      title: 'Facebook Profile URL',
      type: 'url',
    },
  ],
}
