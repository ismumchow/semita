import LargeHeading from "@/components/ui/LargeHeading";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

interface pageProps {
  params: {
    id: string;
  };
}

const page = async ({ params }: pageProps) => {
  const id = params.id;

  const deliverable = await db.deliverable.findUnique({
    where: { id: id },
    include: {
      Items: true,
      creator: true,
    },
  });

  if (!deliverable) return notFound();

  return (
    <div className="w-2/3 mx-auto">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>
           These are the Deliverable items in :{" "}
            <span className="text-blue-500"> {deliverable.name} </span>
          </CardTitle>
          <CardDescription>
            Something wrong? Contact{" "} {deliverable.creator.name}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {deliverable.Items.map((item, index) => (
            <div key={index} className="flex items-center justify-between space-x-4">
              <p className=" leading-none text-gray-700 pl-4 ">
                {item.name}
              </p>
              <div className="bg-gray-200 px-2 py-1 rounded-lg">
                {item.status}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
