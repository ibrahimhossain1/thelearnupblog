import { author } from './author'
import { category } from './category'
import { post } from './post'
import { blockContent } from './blockContent'
import { comment } from './comment'
import { pageSchema } from './pageSchema'
import { siteConfig } from './siteConfig'
import { subscriber } from './subscriber'
import { adsenseConfig } from './adsenseConfig'
import { socialMedia } from './socialMedia'

export const schema = {
  types: [post, author, category, blockContent, comment, pageSchema, siteConfig, subscriber, adsenseConfig, socialMedia],
}
