import { z } from "zod";

export const PlayableClassIndexResponseSchema = z
  .object({
    classes: z.array(
      z.object({
        name: z.string(),
        id: z.number(),
      })
    ),
  })
  .transform((x) => x.classes);

export type PlayableClassIndexResponse = z.infer<
  typeof PlayableClassIndexResponseSchema
>;

export const PlayableClassResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  specializations: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
    })
  ),
});

export type PlayableClassResponse = z.infer<typeof PlayableClassResponseSchema>;
