import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import {  DeliverableUpdateValidator } from "@/lib/validators/deliverable";
import { z } from "zod";
export async function PATCH(req: Request) {
    try {
      const body = await req.json();
  
      const { deliverableId, deliverableItems } =
        DeliverableUpdateValidator.parse(body);
  
      const session = await getAuthSession();
  
      if (!session) {
        return new Response("Unauthorized", { status: 401 });
      }
  
      // Begin a transaction
      const updatedDeliverable = await db.$transaction(async (db) => {
        // Find the deliverable
        const deliverable = await db.deliverable.findUnique({
          where: { id: deliverableId },
        });
  
        if (!deliverable) {
          throw new Error('Deliverable not found');
        }
  
        // Iterate over the deliverableItems and update each one
        const updatedDeliverableItems = deliverableItems.map(async (item) => {
          const existingItem = await db.item.findUnique({
            where: { id: item.id },
          });
  
          if (!existingItem) {
            throw new Error(`Deliverable item with id ${item.id} not found`);
          }
  
          // Update the deliverable item with the new status
          return db.item.update({
            where: { id: item.id },
            data: { status: item.status },
          });
        });
  
        return Promise.all(updatedDeliverableItems);
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
  
