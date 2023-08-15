import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { DeliverableDeleteValidator } from "@/lib/validators/deliverable";
import { z } from "zod";

export async function PATCH(req: Request, res: Response) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response(`Unauthorized`, { status: 401 });
    }
    const body = await req.json();
    console.log(body.data);
    const { deliverableId } = DeliverableDeleteValidator.parse(body.data);
    console.log(deliverableId);

    // Check if the deliverable exists
    const deliverableExists = await db.deliverable.findFirst({
      where: {
        id: deliverableId,
      },
    });

    if (!deliverableExists) {
      return new Response("Deliverable does not exist", { status: 404 });
    }

    await db.item.deleteMany({
      where: {
        deliverableId: deliverableId,
      },
    });

    await db.status.deleteMany({
      where: {
        deliverableId: deliverableId,
      },
    });

    await db.deliverable.delete({
      where: {
        id: deliverableId,
      },
    });

    return new Response(`Deliverable with ID ${deliverableId} deleted`, {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }
    return new Response("Could not delete deliverable", { status: 500 });
  }
}
