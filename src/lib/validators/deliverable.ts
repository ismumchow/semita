import { z } from "zod";

export const DeliverableValidator = z.object({
  name: z.string().min(3).max(30),
});

export const DeliverableNameValidator = z.object({
  deliverableId: z.string(),
  deliverableItems: z.array(z.string().min(3).max(30)),
  deliverableStatuses: z.array(z.string().min(3).max(30)),
});

export const DeliverableUpdateValidator = z.object({
  deliverableId: z.string(),
  deliverableItems: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      status: z.string(),
      deliverableId: z.string(),
    })
  ),
});

export const DeliverableDeleteValidator = z.object({
  deliverableId: z.string(),
});

export type DeliverablePayload = z.infer<typeof DeliverableValidator>;
export type DeliverableNamePayload = z.infer<typeof DeliverableNameValidator>;
export type DeliverableUpdatePayload = z.infer<
  typeof DeliverableUpdateValidator
>;
export type DeliverableDeletePayload = z.infer<typeof DeliverableDeleteValidator>;
