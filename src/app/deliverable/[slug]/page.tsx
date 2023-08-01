import DeliverableCreate from "@/components/DeliverableCreate";
import Deliverable from "@/components/Deliverable";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import DeliverableUpdate from "@/components/DeliverableUpdate";

interface PageProps {
  params: {
    slug: string;
  };
}

const Page = async ({ params }: PageProps) => {
  const { slug } = params;

  const session = await getAuthSession();

  const deliverable = await db.deliverable.findFirst({
    where: { name: slug },
    include: {
      Statuses: true,
      Items: true,
      creator: true,
    },
  });
  
  const isCreator = session?.user?.id === deliverable?.creatorId

  if (!deliverable) return notFound();

  return (
    <>
      <h1 className="font-bold text-3xl md:text-4xl text-gray-700 mb-2 leading-tight">
        Deliverable :<span className="text-rose-400"> {deliverable.name}</span>
      </h1>

      {isCreator && deliverable.Items.length === 0 ? (
        <DeliverableCreate
          deliverableName={deliverable.name}
          deliverableId={deliverable.id}
        />
      ) : isCreator && deliverable.Items.length > 0 ? (
        <DeliverableUpdate
          deliverableId={deliverable.id}
          items={deliverable.Items}
          statuses={deliverable.Statuses}
        />
      ) : (
        <Deliverable items={deliverable.Items} />
      )}
    </>
  );
}

export default Page;