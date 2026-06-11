const fs = require('fs');
const path = require('path');
const { createClient } = require('@sanity/client');

// 1. Read env variables from .env.local
const envPath = path.join(__dirname, '../.env.local');
let token = null;
let projectId = 'ygp0nql6'; // Fallback to user project ID
let dataset = 'production';

if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  const tokenMatch = content.match(/SANITY_API_WRITE_TOKEN=["']?([^"'\s]+)["']?/);
  if (tokenMatch) token = tokenMatch[1];
  
  const projectMatch = content.match(/NEXT_PUBLIC_SANITY_PROJECT_ID=["']?([^"'\s]+)["']?/);
  if (projectMatch) projectId = projectMatch[1];

  const datasetMatch = content.match(/NEXT_PUBLIC_SANITY_DATASET=["']?([^"'\s]+)["']?/);
  if (datasetMatch) dataset = datasetMatch[1];
}

if (!token) {
  console.error('Error: SANITY_API_WRITE_TOKEN not found in .env.local');
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2023-05-03',
  token,
  useCdn: false,
});

// 2. Define mock data to import
const mockCategories = [
  { _id: 'c1', title: 'Design', slug: { current: 'design' } },
  { _id: 'c2', title: 'Development', slug: { current: 'development' } },
  { _id: 'c3', title: 'Monetization', slug: { current: 'monetization' } },
  { _id: 'c4', title: 'Technology', slug: { current: 'technology' } },
];

const mockAuthors = [
  {
    _id: 'a1',
    name: 'Faysal Ahmed',
    slug: { current: 'faysal-ahmed' },
    image: null,
    bio: 'Founder & Full Stack Developer'
  },
  {
    _id: 'a2',
    name: 'Antigravity AI',
    slug: { current: 'antigravity-ai' },
    image: null,
    bio: 'Content Architect & Tech Writer'
  }
];

const basePosts = [
  {
    _id: 'p1',
    title: 'Designing the Perfect Premium Web Application Layout',
    slug: { current: 'designing-perfect-premium-web-layout' },
    excerpt: 'Explore best practices in modern web design, including HSL color schemes, sleek glassmorphism, responsive grids, and delightful micro-animations.',
    publishedAt: '2026-06-10T10:00:00Z',
    isFeatured: true,
    author: mockAuthors[0],
    categories: [mockCategories[0], mockCategories[3]],
    mainImage: {
      url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1200&auto=format&fit=crop&q=80',
      alt: 'Premium web layout design preview'
    },
    body: [
      {
        _key: 'b1',
        _type: 'block',
        children: [{ _type: 'span', text: 'Web design is evolving at an incredible pace. What used to be acceptable a few years ago now feels outdated. In this guide, we dive deep into how you can design premium interfaces that instantly wow your visitors.' }],
        style: 'normal'
      },
      {
        _key: 'b2',
        _type: 'block',
        children: [{ _type: 'span', text: '1. Use a Curated Color Palette' }],
        style: 'h2'
      },
      {
        _key: 'b3',
        _type: 'block',
        children: [{ _type: 'span', text: 'Instead of choosing plain primaries, use tailormade HSL colors. Sleek dark modes accompanied by glowing color gradients (like violet to pink) create an immersive environment.' }],
        style: 'normal'
      },
      {
        _key: 'b4',
        _type: 'block',
        children: [{ _type: 'span', text: '2. Leverage Glassmorphism' }],
        style: 'h2'
      },
      {
        _key: 'b5',
        _type: 'block',
        children: [{ _type: 'span', text: 'A subtle blur on navigation bars and cards makes the UI feel light, floating, and premium. Combine backdrop-filter with light borders (e.g. 1px solid white/10%) to achieve this effect.' }],
        style: 'normal'
      }
    ]
  },
  {
    _id: 'p2',
    title: 'Monetizing Your Blog: The Ultimate Guide to Google AdSense',
    slug: { current: 'monetizing-blog-ultimate-guide-adsense' },
    excerpt: 'Learn the exact steps required to get your blog approved by Google AdSense and maximize your earnings with strategic ad placements.',
    publishedAt: '2026-06-09T14:30:00Z',
    isFeatured: true,
    author: mockAuthors[1],
    categories: [mockCategories[2]],
    mainImage: {
      url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1200&auto=format&fit=crop&q=80',
      alt: 'Google AdSense monetization graphic'
    },
    body: [
      {
        _key: 'b1',
        _type: 'block',
        children: [{ _type: 'span', text: 'Starting a blog is a rewarding journey, but monetizing it allows you to sustain your efforts. Google AdSense is one of the most popular ad networks globally. Here is how you can ensure approval.' }],
        style: 'normal'
      },
      {
        _key: 'b2',
        _type: 'block',
        children: [{ _type: 'span', text: 'Mandatory Requirements for AdSense Approval' }],
        style: 'h2'
      },
      {
        _key: 'b3',
        _type: 'block',
        children: [{ _type: 'span', text: 'Google takes site quality seriously. To get approved, you must have high-quality original content, a clear site navigation structure, and essential policy pages: Privacy Policy, Terms of Service, About, and Contact. Make sure these pages are easily accessible from your footer.' }],
        style: 'normal'
      }
    ]
  },
  {
    _id: 'p3',
    title: 'Next.js App Router and Headless CMS: A Perfect Match',
    slug: { current: 'nextjs-app-router-headless-cms-match' },
    excerpt: 'Why Next.js App Router and headless CMS solutions like Sanity.io are the go-to architecture for high-performance content websites in 2026.',
    publishedAt: '2026-06-08T09:15:00Z',
    isFeatured: true,
    author: mockAuthors[0],
    categories: [mockCategories[1], mockCategories[3]],
    mainImage: {
      url: 'https://images.unsplash.com/photo-1618401471353-b98aedd07871?w=1200&auto=format&fit=crop&q=80',
      alt: 'Next.js and Sanity connection schematic'
    },
    body: [
      {
        _key: 'b1',
        _type: 'block',
        children: [{ _type: 'span', text: 'Modern web architecture has shifted away from traditional monolithic platforms. The pairing of Next.js and Sanity.io offers speed, security, and developer productivity.' }],
        style: 'normal'
      }
    ]
  },
  {
    _id: 'p4',
    title: 'Mastering Color Schemes in Modern Web Interfaces',
    slug: { current: 'mastering-color-schemes-modern-web-interfaces' },
    excerpt: 'A deep dive into color theory, accessibility, and setting up scalable custom theme configurations for Tailwind CSS v4.',
    publishedAt: '2026-06-07T11:00:00Z',
    isFeatured: false,
    author: mockAuthors[1],
    categories: [mockCategories[0]],
    mainImage: {
      url: 'https://images.unsplash.com/photo-1500462969772-60633d1afb17?w=1200&auto=format&fit=crop&q=80',
      alt: 'Harmonious color palettes graphic'
    },
    body: [
      {
        _key: 'b1',
        _type: 'block',
        children: [{ _type: 'span', text: 'Color has a powerful impact on how users perceive your site. A premium layout depends on a harmonious, accessible color scheme.' }],
        style: 'normal'
      }
    ]
  },
  {
    _id: 'p5',
    title: 'Optimizing Web Performance: The Core Web Vitals Guide',
    slug: { current: 'optimizing-web-performance-core-web-vitals-guide' },
    excerpt: 'Learn how to analyze and optimize your site to achieve 100/100 Lighthouse scores, covering LCP, FID, CLS, and Next.js optimization techniques.',
    publishedAt: '2026-06-06T08:30:00Z',
    isFeatured: false,
    author: mockAuthors[0],
    categories: [mockCategories[1], mockCategories[3]],
    mainImage: {
      url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80',
      alt: 'Performance analytics on laptop screen'
    },
    body: [
      {
        _key: 'b1',
        _type: 'block',
        children: [{ _type: 'span', text: 'Web performance directly translates to conversion rates and search rankings. Google’s Core Web Vitals measure the loading speed, interactivity, and visual stability of your web page.' }],
        style: 'normal'
      }
    ]
  },
  {
    _id: 'p6',
    title: 'The Rise of Agentic AI: Transforming Software Engineering',
    slug: { current: 'rise-of-agentic-ai-transforming-software-engineering' },
    excerpt: 'Explore how autonomous agentic AI coders are changing the way software is designed, written, tested, and deployed in 2026.',
    publishedAt: '2026-06-05T13:45:00Z',
    isFeatured: false,
    author: mockAuthors[1],
    categories: [mockCategories[3]],
    mainImage: {
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
      alt: 'Abstract glowing technology neural network'
    },
    body: [
      {
        _key: 'b1',
        _type: 'block',
        children: [{ _type: 'span', text: 'Artificial intelligence is transitioning from passive question-answering systems to active, autonomous agents capable of executing complex engineering plans.' }],
        style: 'normal'
      }
    ]
  },
  {
    _id: 'p7',
    title: 'The Art of Writing Clean and Maintainable JavaScript Code',
    slug: { current: 'art-of-writing-clean-javascript-code' },
    excerpt: 'Deep dive into JavaScript design patterns, refactoring techniques, clean code principles, and avoiding common memory leaks.',
    publishedAt: '2026-06-04T10:15:00Z',
    isFeatured: false,
    author: mockAuthors[0],
    categories: [mockCategories[1]],
    mainImage: {
      url: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=1200&auto=format&fit=crop&q=80',
      alt: 'Coding workspace illustration'
    },
    body: [
      {
        _key: 'b1',
        _type: 'block',
        children: [{ _type: 'span', text: 'Writing code is easy; writing clean code that others can read and maintain is an art form. In this article, we cover SOLID principles in JS.' }],
        style: 'normal'
      }
    ]
  },
  {
    _id: 'p8',
    title: 'Navigating the Future of Remote Software Engineering',
    slug: { current: 'navigating-future-of-remote-engineering' },
    excerpt: 'An inside look into remote engineering culture, team synchronization tools, async workflows, and avoiding burnout while working from home.',
    publishedAt: '2026-06-03T16:20:00Z',
    isFeatured: false,
    author: mockAuthors[1],
    categories: [mockCategories[3]],
    mainImage: {
      url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80',
      alt: 'Colleagues cooperating remotely'
    },
    body: [
      {
        _key: 'b1',
        _type: 'block',
        children: [{ _type: 'span', text: 'Remote work is no longer a temporary perk—it is a core business model. Successful remote engineering requires deep changes in communication.' }],
        style: 'normal'
      }
    ]
  },
  {
    _id: 'p9',
    title: 'Building a Brand: Modern Marketing for Indie Developers',
    slug: { current: 'building-brand-marketing-indie-developers' },
    excerpt: 'How to build, market, and monetize your digital products as a solo developer, using organic social media, SEO, and community marketing.',
    publishedAt: '2026-06-02T09:00:00Z',
    isFeatured: false,
    author: mockAuthors[0],
    categories: [mockCategories[2]],
    mainImage: {
      url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&auto=format&fit=crop&q=80',
      alt: 'Marketing planning desk sketch'
    },
    body: [
      {
        _key: 'b1',
        _type: 'block',
        children: [{ _type: 'span', text: 'Indie developers often fail not because they build bad products, but because they do not know how to market them. Here is a step-by-step branding roadmap.' }],
        style: 'normal'
      }
    ]
  }
];

async function importData() {
  console.log('--- STARTING IMPORT OF MOCK DATA TO SANITY ---');
  
  // 1. Import Categories
  console.log('Importing categories...');
  for (const cat of mockCategories) {
    const doc = {
      _id: cat._id,
      _type: 'category',
      title: cat.title,
      slug: {
        _type: 'slug',
        current: cat.slug.current,
      }
    };
    await client.createOrReplace(doc);
    console.log(`Created/updated category: ${cat.title} (${cat._id})`);
  }

  // 2. Import Authors
  console.log('Importing authors...');
  for (const author of mockAuthors) {
    const doc = {
      _id: author._id,
      _type: 'author',
      name: author.name,
      slug: {
        _type: 'slug',
        current: author.slug.current,
      },
      bio: author.bio,
    };
    await client.createOrReplace(doc);
    console.log(`Created/updated author: ${author.name} (${author._id})`);
  }

  // 3. Import Posts
  console.log('Importing posts...');
  for (const post of basePosts) {
    const doc = {
      _id: post._id,
      _type: 'post',
      title: post.title,
      slug: {
        _type: 'slug',
        current: post.slug.current,
      },
      excerpt: post.excerpt,
      publishedAt: post.publishedAt,
      isFeatured: post.isFeatured || false,
      author: {
        _type: 'reference',
        _ref: post.author._id,
      },
      categories: post.categories.map(cat => ({
        _type: 'reference',
        _ref: cat._id,
        _key: cat._id,
      })),
      mainImage: {
        _type: 'image',
        alt: post.title,
        url: post.mainImage.url,
      },
      body: post.body,
    };
    await client.createOrReplace(doc);
    console.log(`Created/updated post: ${post.title} (${post._id})`);
  }
  
  console.log('--- MOCK DATA IMPORT COMPLETED SUCCESSFULLY ---');
}

importData().catch(err => {
  console.error('Error during data import:', err);
  process.exit(1);
});
