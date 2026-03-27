import { z } from "zod";

export const scoreSchema = z.object({
  playerName: z.string().min(1).max(20),
  score: z.number().int().positive(),
});
