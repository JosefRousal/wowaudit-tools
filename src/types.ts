import { z } from "zod";

export const DifficultySchema = z.enum(["normal", "heroic", "mythic"]);

export type Difficulty = z.infer<typeof DifficultySchema>;
