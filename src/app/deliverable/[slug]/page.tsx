import DeliverableCreate from "@/components/DeliverableCreate";
import Deliverable from "@/components/Deliverable";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import DeliverableUpdate from "@/components/DeliverableUpdate";
import LargeHeading from "@/components/ui/LargeHeading";

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
      {isCreator && deliverable.Items.length === 0 ? (
        <DeliverableCreate
          deliverableName={deliverable.name}
          deliverableId={deliverable.id}
        />
      ) : isCreator && deliverable.Items.length > 0 ? (
        <DeliverableUpdate
          deliverableName={deliverable.name}
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