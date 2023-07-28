import { z } from 'zod'

export const DeliverableValidator = z.object({
  name: z.string().min(3).max(21),
})

export const DeliverableNameValidator = z.object({
  deliverableId: z.string(),
  deliverableName: z.string().min(3).max(21),
  deliverableItems: z.array(z.string().min(3).max(21)),
  deliverableStatuses: z.array(z.string().min(3).max(21)),
})

export type DeliverablePayload = z.infer<typeof DeliverableValidator>
export type DeliverableNamePayload = z.infer<typeof DeliverableNameValidator>