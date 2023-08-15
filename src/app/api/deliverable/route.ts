import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { DeliverableValidator } from '@/lib/validators/deliverable'
import { z } from 'zod'

export async function POST(req: Request) {
  try {
    const session = await getAuthSession()

    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const { name } = DeliverableValidator.parse(body)

    // check if subreddit already exists
    const deliverableExists = await db.deliverable.findFirst({
      where: {
        name,
      },
    })

    if (deliverableExists) {
      return new Response('Deliverable with this name already exists', { status: 409 })
    }

    // create subreddit and associate it with the user
    const deliverable = await db.deliverable.create({
      data: {
        name,
        creatorId: session.user.id,
        followers: {
          connect: {
            id: session.user.id,
          },
        },
      },
    });

    console.log(deliverable.name)

    return new Response(deliverable.name)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 })
    }

    return new Response('Could not create subreddit', { status: 500 })
  }
}
