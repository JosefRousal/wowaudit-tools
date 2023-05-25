import { z } from "zod";

export const SpecTierSimSchema = z
  .object({
    class_id: z.number(),
    data: z.object({
      T30: z.object({
        "2p": z.number(),
        "4p": z.number(),
        "no tier": z.number(),
      }),
    }),
  })
  .transform((x) => ({
    classId: x.class_id,
    data: {
      T30: {
        twoPiece: x.data.T30["2p"],
        fourPiece: x.data.T30["4p"],
        noTier: x.data.T30["no tier"],
      },
    },
  }));

export type SpecTierSim = z.infer<typeof SpecTierSimSchema>;
