export const socialMedia = {
  name: 'socialMedia',
  title: 'Social Media Links',
  type: 'document',
  fields: [
    {
      name: 'facebookLink',
      title: 'Facebook Link',
      type: 'url',
      description: 'Your Facebook profile or page URL',
    },
    {
      name: 'twitterLink',
      title: 'Twitter / X Link',
      type: 'url',
      description: 'Your Twitter / X profile URL',
    },
    {
      name: 'youtubeLink',
      title: 'YouTube Link',
      type: 'url',
      description: 'Your YouTube channel URL',
    },
    {
      name: 'githubLink',
      title: 'GitHub Link',
      type: 'url',
      description: 'Your GitHub profile or repository URL',
    },
  ],
  preview: {
    prepare() {
      return {
        title: 'Social Media Links',
        subtitle: 'Manage footer social icon links',
      }
    }
  }
}
