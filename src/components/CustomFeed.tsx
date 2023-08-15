import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";

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
        select: {
          name: true,
          id: true,
          createdAt: true, // Include the createdAt field
          creator: true,
        },
      },
    },
  });

  return (
    <div className="flex flex-col  p-2">
      <div className="px-8 py-2 bg-white rounded-3xl shadow-md shadow-slate-300">
        {user?.followed.length ? (
          <Table>
            <TableCaption>A list of your followed deliverables.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Creator</TableHead>
                <TableHead>Created At</TableHead> {/* New Table Head */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {user.followed.map((deliverable) => (
                <TableRow key={deliverable.id}>
                  <TableCell className="text-lg">
                    <Link href={`/deliverable/${deliverable.name}`}>
                      <div className="font-semibold text-blue-900 ">{deliverable.name}</div>
                    </Link>
                  </TableCell>
                  <TableCell className="text-lg">
                    <Link href={`/deliverable/view-only/${deliverable.id}`}> 
                    {deliverable.id}
                    </Link>
                    </TableCell>
                  <TableCell className="text-lg">{deliverable.creator?.name?.split(" ")[0] || "Unknown"}</TableCell>
                 <TableCell className="text-lg">{format(deliverable.createdAt, 'MMMM d, yyyy')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-gray-500 text-md font-light pl-4">
            You are not following any deliverables yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default CustomFeed;
