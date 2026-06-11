import { createImageUrlBuilder } from '@sanity/image-url'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'your-project-id'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

const imageBuilder = createImageUrlBuilder({ projectId, dataset })

export const urlForImage = (source) => {
  return imageBuilder.image(source)
}
