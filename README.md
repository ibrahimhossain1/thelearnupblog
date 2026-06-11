# The Learn Up Blog 🚀

A modern, high-performance, and feature-rich blog site built with **Next.js**, **Tailwind CSS**, and **Sanity CMS**. It includes Google AdSense integration, custom comment moderation, distraction-free focus mode, newsletter subscription, and a responsive reading experience.

---

## Features ✨

* **Headless CMS:** Fully integrated with [Sanity.io](https://sanity.io) for managing articles, authors, categories, comments, and settings.
* **Google AdSense Integration:** Ready-to-go ad slots configurable directly from the Sanity Studio dashboard.
* **Distraction-Free Reading:** Built-in **Focus Mode** toggler that hides layout elements for an immersive reading experience.
* **Read Aloud:** Accessibility feature that reads blog posts aloud to users using Web Speech API.
* **Interactive Comments:** Moderated comment system where visitors can share feedback (requires approval in Sanity Studio).
* **Newsletter Signup:** A beautiful subscription widget to capture visitor emails.
* **Dark & Light Mode:** Seamless theme support matching user system preferences or custom toggling.
* **Performance Optimized:** Rapid load times using Next.js App Router, image caching, and parallel CMS data queries.

---

## Tech Stack 🛠️

* **Frontend:** Next.js (App Router, React 19)
* **Styling:** Tailwind CSS (v4)
* **Database & CMS:** Sanity.io (Next-Sanity client)
* **Icons:** Lucide React
* **Animations:** Framer Motion

---

## Getting Started 💻

### 1. Clone & Install Dependencies

First, navigate to your project directory and install the required packages:

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory and add your Sanity credentials (refer to `.env.local` template):

```env
NEXT_PUBLIC_SANITY_PROJECT_ID="your-sanity-project-id"
NEXT_PUBLIC_SANITY_DATASET="production"
SANITY_API_WRITE_TOKEN="your-sanity-write-token"
```

### 3. Run the Development Server

Start the local development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the live blog.

### 4. Open Sanity Studio

To manage content, launch the Sanity Studio:

```bash
# Locally embedded at /studio
# Run Next.js and open: http://localhost:3000/studio
```

---

## Deployment 🌐

This project is optimized to be deployed on **Vercel** or **Cloudflare Pages**. 

### Deploying to Vercel
1. Push your repository to GitHub.
2. Import the project into Vercel.
3. Configure the environment variables (`NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, and `SANITY_API_WRITE_TOKEN`) in the Vercel dashboard.
4. Click **Deploy**.
