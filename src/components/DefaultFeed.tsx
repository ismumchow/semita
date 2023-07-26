import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { notFound } from 'next/navigation'

const DefaultFeed = async () => {

  return <div> default feed </div>
}

export default DefaultFeed