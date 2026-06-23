import http from "node:http";
import { handler } from "./lambda/index.mjs";

const port = Number(process.env.PORT) || 3000;

const server = http.createServer(async (request, response) => {
  if (request.method === "OPTIONS") {
    response.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,OPTIONS",
    });
    response.end();
    return;
  }

  if (request.method !== "GET" || request.url !== "/costs") {
    response.writeHead(404, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ message: "Not found" }));
    return;
  }

  const result = await handler();
  response.writeHead(result.statusCode, result.headers);
  response.end(result.body);
});

server.listen(port, "127.0.0.1", () => {
  console.log(`SpendOps API running at http://127.0.0.1:${port}/costs`);
});
