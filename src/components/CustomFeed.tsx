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

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";

const CustomFeed = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
})  => {
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
    <div className="flex flex-col ">
      <div>
        {user?.followed.length ? (
          <Card>
            <Table>
              <TableCaption className="text-blue-300">A list of your followed deliverables.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="pt-2 pl-4">Name</TableHead>
                  <TableHead className="pt-2 pl-4">ID</TableHead>
                  <TableHead className="pt-2 pl-4">Creator</TableHead>
                  <TableHead className="pt-2 pl-4">Created At</TableHead> {/* New Table Head */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {user.followed.map((deliverable) => (
                  <TableRow key={deliverable.id}>
                    <TableCell className="text-lg">
                      <Link href={`/deliverable/${deliverable.name}`}>
                        <div className=" text-blue-900 ">
                          {deliverable.name}
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell className="text-lg">
                      <Link href={`/deliverable/view-only/${deliverable.id}`}>
                        {deliverable.id}
                      </Link>
                    </TableCell>
                    <TableCell className="text-lg">
                      {deliverable.creator?.name?.split(" ")[0] || "Unknown"}
                    </TableCell>
                    <TableCell className="text-lg">
                      {format(deliverable.createdAt, "MMMM d, yyyy")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>No Deliverables Found</CardTitle>
              <CardDescription>
                You haven&apos;t followed any deliverables yet.
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CustomFeed;
