import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import { Button, buttonVariants } from '@/components/ui/Button'
// import  UserAccountNav  from './UserAccountNav'

const Navbar = async () => {
  const session = await getServerSession(authOptions)
  return (
    <div className='fixed top-0 inset-x-0 h-fit bg-zinc-100 border-b border-zinc-300 z-[10] py-2'>
      <div className='container max-w-7xl h-full mx-auto flex items-center justify-between gap-2'>
        {/* logo */}
        <Link href='/' className='flex gap-2 items-center'>
          <p className='hidden font-extrabold text-zinc-700 text-lg md:block border-slate-700 border-b-4'> Semita </p>
        </Link>


        {/* actions */}
        {session?.user ? (
        //   <UserAccountNav user={session.user} />
          <Button > Sign Out </Button>
        ) : (
          <Link href='/sign-in' className={buttonVariants()}>
            Sign In
          </Link>
        )}
      </div>
    </div>
  )
}

export default Navbar