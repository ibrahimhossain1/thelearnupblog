export const adsenseConfig = {
  name: 'adsenseConfig',
  title: 'Google AdSense Settings',
  type: 'document',
  fields: [
    {
      name: 'enableAds',
      title: 'Enable Google AdSense Advertisements',
      type: 'boolean',
      initialValue: false,
      description: 'Toggle to completely show or hide all ad placements and placeholders on the website.',
    },
    {
      name: 'adSensePublisherId',
      title: 'Google AdSense Publisher ID',
      type: 'string',
      description: 'Your Google AdSense Publisher ID. Format: pub-XXXXXXXXXXXXXXXX.',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (context.document.enableAds && !value) {
            return 'Publisher ID is required when ads are enabled.'
          }
          return true
        }),
    },
  ],
}
