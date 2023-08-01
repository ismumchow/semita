import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { DeliverableNameValidator } from "@/lib/validators/deliverable";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      deliverableId,
      deliverableItems,
      deliverableStatuses,
    } = DeliverableNameValidator.parse(body);

    const session = await getAuthSession();

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Begin a transaction
    const updatedDeliverable = await db.$transaction(async (db) => {
      // Find the deliverable
      const deliverable = await db.deliverable.findFirst({
        where: {
          id: deliverableId,
        },
      });

      if (!deliverable) {
        throw new Error(`Deliverable not found`);
      }

      const statuses = await db.status.createMany({
        data: deliverableStatuses.map((status) => ({
          name: status,
          deliverableId: deliverable.id,
        })),
      });
      
      const items = await db.item.createMany({
        data: deliverableItems.map((item) => ({
          name: item,
          deliverableId: deliverable.id,
        })),
      });
      return deliverable;
    });

    return new Response("Deliverable updated", { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 });
    }

    return new Response(
      "Could not update deliverable at this time. Please try later",
      { status: 500 }
    );
  }
}
