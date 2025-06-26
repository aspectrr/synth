import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { storeUserData } from "./utils/storeuserdata";

const app = new Elysia()
  .use(swagger())
  .post("/", ({ body }) => {
    console.log("Synth callback received");
    console.log(body);
    storeUserData(body);
    return { status: "success" };
  })
  .get("/health", () => "OK")
  .listen(0);

console.log(
  `Opening website at: https://example.com/login?synth-callback=http://localhost:${app.server?.port}`,
);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
