import ToFeedButton from "@/components/ToFeedButton";
import { getAuthSession } from "@/lib/auth";
import { FC, ReactNode } from "react";

interface layoutProps {}

const Layout = async ({
  children,
  params: { slug },
}: {
  children: ReactNode;
  params: { slug: string };
}) => {
  const session = await getAuthSession();

  return (
  <div className="sm:container max-w-7xl mx-auto h-full pt-12'">
   <div> 
      <ToFeedButton />
      <div className='grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6'>
      <ul className='flex flex-col col-span-2 space-y-6'>{children}</ul>
      </div>
    </div>
  </div>
  )
}

export default Layout;
