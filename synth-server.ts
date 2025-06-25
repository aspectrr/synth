import { Elysia, t } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { findAvailablePort } from "./utils/localserver";

const app = new Elysia()
  .use(swagger())
  .get("/health", () => "OK")
  .post("/synth-callback", ({ body }) => {
    console.log("Synth callback received");
    console.log(body);
    return { status: "success" };
  })
  .listen(await findAvailablePort());

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
