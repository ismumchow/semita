import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { notFound } from 'next/navigation'

const CustomFeed = async () => {
  const session = await getAuthSession()

  // only rendered if session exists, so this will not happen
  if (!session) return notFound()

  const delivarables = await db.user.findUnique({
    where: {
        id: session.user.id,
    },
    include: {
      followed : true,
    },
  })

  return <div> custom feed </div>
}

export default CustomFeed