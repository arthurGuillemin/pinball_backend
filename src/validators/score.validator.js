import { z } from 'zod'

export const scoreSchema = z.object({
  player_name: z.string().min(1).max(20),
  score: z.number().int().positive()
})