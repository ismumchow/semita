import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import LargeHeading from './ui/LargeHeading'

const DefaultFeed = async () => {

  return (
  <div className='container border-2 roudned-lg'> 
    <LargeHeading> 
      No deliverables yet!
    </LargeHeading>
  </div>
     )
}

export default DefaultFeed