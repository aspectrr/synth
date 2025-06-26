import { pathToFileURL } from "url";
import path from "path";
import type { SynthConfig } from "./schema";

export async function loadSynthConfig(
  configPath = "./synth.config.ts",
): Promise<SynthConfig> {
  const abs = path.resolve(process.cwd(), configPath);
  const mod = await import(pathToFileURL(abs).toString());
  const config = mod.default as SynthConfig;
  return config;
}
