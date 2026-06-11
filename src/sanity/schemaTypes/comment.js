export const comment = {
  name: 'comment',
  title: 'Comment',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'comment',
      title: 'Comment',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'approved',
      title: 'Approved',
      type: 'boolean',
      description: "Comments won't show on the site until they are approved",
      initialValue: false,
    },
    {
      name: 'post',
      title: 'Post',
      type: 'reference',
      to: [{ type: 'post' }],
      validation: (Rule) => Rule.required(),
    },
  ],
  preview: {
    select: {
      name: 'name',
      comment: 'comment',
      postTitle: 'post.title',
    },
    prepare({ name, comment, postTitle }) {
      return {
        title: `${name} on "${postTitle || 'unknown post'}"`,
        subtitle: comment ? (comment.length > 50 ? `${comment.slice(0, 50)}...` : comment) : '',
      }
    },
  },
}
