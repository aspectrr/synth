import { configSchema } from "./schema";
import type { SynthConfig } from "./schema";

/**
 * Used in `app.config.ts` to provide type-safe configuration.
 */
export function defineConfig(config: SynthConfig): SynthConfig {
  // You can optionally validate the config
  configSchema.parse(config);
  return config;
}
