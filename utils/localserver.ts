import bun from "bun";

export function findAvailablePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = bun.serve({
      fetch() {
        return new Response("Synthhhhhhh");
      },
    });

    const port = server.port;
    if (port === undefined) {
      reject(new Error("Failed to find available port"));
    } else {
      server.stop();
      resolve(port);
    }
  });
}
