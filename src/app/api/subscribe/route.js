import { createClient } from 'next-sanity'
import { NextResponse } from 'next/server'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-05-03'
const token = process.env.SANITY_API_WRITE_TOKEN

export async function POST(request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { message: 'Email address is required' },
        { status: 400 }
      )
    }

    const cleanEmail = email.trim().toLowerCase()

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
      useCdn: false,
    })

    // Check if email already subscribed
    const existing = await writeClient.fetch(
      `*[_type == "subscriber" && email == $email][0]`,
      { email: cleanEmail }
    )

    if (existing) {
      return NextResponse.json(
        { message: 'You are already subscribed!' },
        { status: 200 }
      )
    }

    const newSubscriber = await writeClient.create({
      _type: 'subscriber',
      email: cleanEmail,
      subscribedAt: new Date().toISOString(),
    })

    return NextResponse.json(
      { message: 'Thank you for subscribing!', subscriberId: newSubscriber._id },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error subscribing email:', error)
    return NextResponse.json(
      { message: 'Failed to subscribe', error: error.message },
      { status: 500 }
    )
  }
}
