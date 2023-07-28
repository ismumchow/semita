import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";

const CustomFeed = async () => {
  const session = await getAuthSession();

  // only rendered if session exists, so this will not happen
  if (!session) return notFound();

  const user = await db.user.findUnique({
    where: {
      id: session.user.id,
    },
    include: {
      followed: {
        include: {
          creator: true,
        },
      },
    },
  });

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="text-align space-y-2">
        <div className="p-4 pl-8 bg-white rounded shadow">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-3">
            Your Followed Deliverables
          </h2>
          {user?.followed.length ? (
            <div className="space-y-4">
              {user.followed.map((deliverable) => (
                <Link
                  href={`/deliverable/${deliverable.name}`}
                  key={deliverable.id}>
                  <span className="p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 ease-in-out bg-white hover:bg-pink-100 flex items-center justify-between cursor-pointer">
                    <span className="text-lg lg:text-xl font-semibold text-rose-900">
                      {deliverable.name}
                    </span>
                    <p className="text-rose-800">
                      Created By: {deliverable.creator?.name || 'Unknown'}
                    </p>
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-lg font-light">
              You are not following any deliverables yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomFeed;
