import { z } from "zod";

export const themeSchema = z.object({
  primary: z.string().regex(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i),
  secondary: z.string(),
  error: z.string(),
  success: z.string(),
});

export type SynthTheme = z.infer<typeof themeSchema>;

export const configSchema = z.object({
  name: z.string(),
  configPath: z.string().optional(),
  theme: themeSchema.optional(),
  commandsPath: z.string().optional(),
  outputDir: z.string().optional(),
  plugins: z.array(z.string()).optional(),
  logLevel: z.enum(["debug", "info", "warn", "error", "silent"]).optional(),
  env: z.enum(["development", "production"]).optional(),
  hooks: z
    .object({
      onStart: z.string().optional(),
      onComplete: z.string().optional(),
    })
    .optional(),
});

export type SynthConfig = z.infer<typeof configSchema>;
