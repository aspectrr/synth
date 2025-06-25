import chalk from "chalk";
import type { SynthTheme } from "./schema";

export function createTheme(theme?: SynthTheme) {
  return {
    primary: chalk.hex(theme?.primary || "#00FF00"),
    secondary: chalk.hex(theme?.secondary || "#888888"),
    error: chalk.hex(theme?.error || "#FF0000"),
    success: chalk.hex(theme?.success || "#00CC99"),
  };
}
