import { loadUserConfig } from "../synth-sdk/src/loadConfig"

export function storeUserData(userData: any) {
  const config = await loadUserConfig()
  // Store user data in a database or file system
  const file =
}
