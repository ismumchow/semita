import { db } from "@/lib/db";
import { notFound } from "next/navigation";

interface pageProps {
  params: {
    id: string;
  };
}

const page = async ({ params }: pageProps) => {
  console.log(params)
  const id = params.id;

  const deliverable = await db.deliverable.findUnique({
    where: { id: id },
    include: {
      Items: true,
    },
  });


  //if (!deliverable) return notFound();

  return <div>{id}</div>;
};

export default page;
