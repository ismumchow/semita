
import CustomFeed from "@/components/CustomFeed";
import DefaultFeed from "@/components/DefaultFeed";
import { buttonVariants } from "@/components/ui/Button";
import { getAuthSession } from "@/lib/auth";
import { Home as HomeIcon, MailIcon, Package } from "lucide-react";
import Link from "next/link";

export default async function Home() {
  const session = await getAuthSession();

  return (
    <>
    { session ? ( 
      <div>
        <h1 className="font-medium text-3xl md:text-4xl text-rose-900">Welcome Back, {session.user.name} !</h1> 
        <h3 className="text-2xl md:text:3xl text-rose-300 pt-2"> Start creating or tracking your deliverables today</h3>
      </div>) : (
        <div>
        <h1 className="font-medium text-3xl md:text-4xl text-rose-900">Welcome To Kothai!</h1> 
        <h3 className="text-2xl md:text:3xl text-rose-300 pt-2"> Start creating or tracking your deliverables today</h3>
      </div>
      )}
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-6">

      <div className="md:col-span-2">

        {/* feed */}
        {/* @ts-ignore */}
        { session ? <CustomFeed /> : <DefaultFeed />}
        
      </div>

      {/* subreddit info */}
      <div className="overflow-hidden h-fit rounded-lg border border-gray-200 order-first md:order-last md:col-span-1">
        <div className="bg-rose-100 px-6 py-4">
          <p className="font-semibold py-3 flex items-center gap-1.5">
            <Package className="h-4 w-4" />
             Want to Create a deliverable? 
          </p>
        </div>
        <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
          <div className="flex justify-between gap-x-4 py-3">
            <p className="text-zinc-500">
              Create a deliverable that you can track and share with your clients!
            </p>
          </div>

          <Link
            className={buttonVariants({
              className: "w-full mt-4 mb-6",
            })}
            href={`/deliverable/create`}>
            Create Deliverable
          </Link>
        </dl>
      </div>

    </div>
    </>
  );
}
