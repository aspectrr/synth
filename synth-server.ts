import bun from "bun";

bun.serve({
  routes: {
    "/login": {
      POST: async (req) => {
        const body = await req.json();
        return new Response("Hello Login");
      },
    },
  },
});
