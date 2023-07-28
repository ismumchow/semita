import DeliverableCreate from "@/components/DeliverableCreate";
import Deliverable from "@/components/Deliverable";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

interface PageProps {
  params: {
    slug: string;
  };
}

const page = async ({ params }: PageProps) => {
  const { slug } = params;

  const session = await getAuthSession();

  const deliverable = await db.deliverable.findFirst({
    where: { name: slug },
    include: {
      Items: {
        include: {
          ItemStatuses: true,
        },
      },
      creator: true,
    },
  });
  

  const isCreator = session?.user?.id === deliverable?.creator?.id;

  console.log(deliverable)

  if (!deliverable) return notFound();

  return (
    <>
      <h1 className="font-bold text-3xl md:text-4xl text-gray-700 mb-2 leading-tight">
        Deliverable :<span className="text-rose-400"> {deliverable.name}</span>
      </h1>

      {deliverable.Items.length <= 0 && isCreator ? (
        <DeliverableCreate
          deliverableName={deliverable.name}
          deliverableId={deliverable.id}
        />
      ) : (
        <Deliverable items={deliverable.Items} />
      )}
    </>
  );
};

export default page;
