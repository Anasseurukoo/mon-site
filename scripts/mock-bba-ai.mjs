import { createServer } from "node:http";

const server = createServer(async (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:3000");
  response.setHeader("Access-Control-Allow-Headers", "content-type");
  response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  if (request.method === "OPTIONS") {
    response.writeHead(204).end();
    return;
  }

  let body = "";
  for await (const chunk of request) body += chunk;
  const conversation = JSON.parse(body || "{}").messages ?? [];
  const prompt = conversation.at(-1)?.content ?? "";

  if (prompt.includes("BACKEND_FAILURE_TEST")) {
    response.writeHead(503).end(JSON.stringify({ error: "simulated unavailable" }));
    return;
  }
  if (prompt.includes("FORMATTING_TEST")) {
    response.end(JSON.stringify({ reply: "Réponse **en gras** avec un [lien](https://builtbyanas.com/services/).\n\nPoints importants :\n1. Première étape\n2. Deuxième étape\n\n- Élément A\n- Élément B\n\nDernier paragraphe. [lien non sûr](javascript:alert(1))" }));
    return;
  }
  if (/^bonjour\b/i.test(prompt)) {
    response.end(JSON.stringify({ reply: "Bonjour ! Je suis BBA AI, conçu et intégré par BuiltByAnas. Qu’aimerais-tu construire ?" }));
    return;
  }
  if (/site premium/i.test(prompt)) {
    response.end(JSON.stringify({ reply: "Bonne idée. Quel est l’objectif principal de ton site et que doivent pouvoir faire ses visiteurs ?" }));
    return;
  }
  response.end(JSON.stringify({ reply: "Réponse locale de test." }));
});

server.listen(3101, "127.0.0.1", () => console.log("Local BBA AI mock listening at http://127.0.0.1:3101"));
