import { loadSynthConfig } from "../synth-sdk/src/loadConfig";

export async function storeUserData(userData: any) {
  const config = await loadSynthConfig();
  // Store user data in a database or file system
  const file = config.configPath || "";
  console.log(file, userData);
}

export function loadUserData() {}
