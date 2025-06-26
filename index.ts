import fs from "fs/promises";
import { validate, dereference } from "@readme/openapi-parser";

export async function generateAPIRoutes(json: string) {
  try {
    const validApi = await validate(json);
    console.log(validApi.valid);
    const api = await dereference(json);
    console.log(JSON.stringify(api, null, 2));
  } catch (err) {
    console.error(err);
  }
}

try {
  const file = await fs.readFile("steel-api.json", "utf8");
  generateAPIRoutes(JSON.parse(file));
} catch (err) {
  console.error(err);
}
