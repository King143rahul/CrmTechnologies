import { serve } from "@hono/node-server";
import server from "./dist/server/server.js";

const port = parseInt(process.env.PORT || "8000", 10);
const host = process.env.HOST || "0.0.0.0";

console.log("Starting production storefront server using Hono Node Server...");

serve(
  {
    fetch: (request) => {
      // Pass empty env and ctx objects
      return server.fetch(request, {}, {});
    },
    port,
    hostname: host,
  },
  (info) => {
    console.log(`Storefront running at http://${info.address}:${info.port}`);
  }
);
