import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { DeliverableNameValidator } from "@/lib/validators/deliverable";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      deliverableName,
      deliverableItems,
      deliverableStatuses,
    } = DeliverableNameValidator.parse(body);

    const session = await getAuthSession();

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Begin a transaction
    const updatedDeliverable = await db.$transaction(async (prisma) => {
      // Find the deliverable
      const deliverable = await prisma.deliverable.findFirst({
        where: {
          name: deliverableName,
        },
      });

      if (!deliverable) {
        throw new Error(`Deliverable ${deliverableName} not found`);
      }

      // Create items
      const items = await prisma.item.createMany({
        data: deliverableItems.map((item) => ({
          name: item,
          deliverableId: deliverable.id,
        })),
      });

      // Create statuses
      const statuses = await prisma.status.createMany({
        data: deliverableStatuses.map((status) => ({
          name: status,
          deliverableId: deliverable.id,
        })),
      });

      // Fetch the created items and statuses
      const createdItems = await prisma.item.findMany({
        where: {
          deliverableId: deliverable.id,
        },
      });
      const createdStatuses = await prisma.status.findMany({
        where: {
          deliverableId: deliverable.id,
        },
      });

      // Create item-status connections
      for (const item of createdItems) {
        for (const status of createdStatuses) {
          await prisma.itemStatus.create({
            data: {
              itemId: item.id,
              statusId: status.id,
            },
          });
        }
      }

      return deliverable;
    });

    console.log(updatedDeliverable);

    return new Response("Deliverable created", { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 });
    }

    return new Response(
      "Could not create deliverable at this time. Please try later",
      { status: 500 }
    );
  }
}
