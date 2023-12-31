import CustomFeed from "@/components/CustomFeed";
import DefaultFeed from "@/components/DefaultFeed";
import { Button } from "@/components/ui/Button";
import LargeHeading from "@/components/ui/LargeHeading";
import Paragraph from "@/components/ui/Paragraph";
import { getAuthSession } from "@/lib/auth";
import Link from "next/link";

export default async function Home() {
  const session = await getAuthSession();

  return (
    <>
      <div >
        <div className="pl-2">
          <h1 className="text-2xl text-gray-800 font-bold">Welcome Back!</h1>
          <p className="text-gray-400 font-light">
            Update and Create Deliverables Today
          </p>
        </div>
      </div>

      <div className="grid pt-2">
        {/* Adjusted the grid to fill height */}
        <div className="col-span-10 flex flex-col max-height">
          <div className="flex-grow ">
            {/* @ts-ignore */}
            {session ? <CustomFeed /> : <DefaultFeed />}
          </div>
          <div className= 'mx-24'>
            <Link href={"/deliverable/create"}>
              <Button className="w-full my-2 px-12 rounded-lg bg-lime-600">Create Deliverable</Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
