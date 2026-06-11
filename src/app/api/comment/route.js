import { createClient } from 'next-sanity'
import { NextResponse } from 'next/server'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-05-03'
const token = process.env.SANITY_API_WRITE_TOKEN

export async function POST(request) {
  try {
    const { name, email, comment, postId } = await request.json()

    if (!name || !email || !comment || !postId) {
      return NextResponse.json(
        { message: 'All fields (name, email, comment, postId) are required' },
        { status: 400 }
      )
    }

    // Trim, normalize, and slice inputs to protect against oversized database payloads
    const cleanName = name.trim().slice(0, 100)
    const cleanEmail = email.trim().toLowerCase()
    const cleanComment = comment.trim().slice(0, 1000)

    if (!token) {
      return NextResponse.json(
        { message: 'Sanity write token is missing in server configuration. Please add SANITY_API_WRITE_TOKEN in .env.local' },
        { status: 500 }
      )
    }

    const writeClient = createClient({
      projectId,
      dataset,
      apiVersion,
      token,
      useCdn: false, // must be false for write operations
    })

    const newComment = await writeClient.create({
      _type: 'comment',
      name: cleanName,
      email: cleanEmail,
      comment: cleanComment,
      approved: false, // default to false for moderation
      post: {
        _type: 'reference',
        _ref: postId,
        _weak: true, // Use weak reference to allow comments on mock posts during testing
      },
    })

    return NextResponse.json(
      { message: 'Comment submitted successfully, awaiting approval', commentId: newComment._id },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error submitting comment:', error)
    return NextResponse.json(
      { message: 'Failed to submit comment', error: error.message },
      { status: 500 }
    )
  }
}
