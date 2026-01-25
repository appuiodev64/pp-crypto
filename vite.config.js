import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  // Charge .env / .env.local etc.
  const env = loadEnv(mode, process.cwd(), "");
  const CMC_KEY = env.CMC_API_KEY;

  return {
    plugins: [
      react(),
      {
        name: "cmc-local-proxy",
        configureServer(server) {
          server.middlewares.use("/api/cmc", async (req, res) => {
            try {
              if (!CMC_KEY) {
                res.statusCode = 500;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ error: "CMC_API_KEY manquante dans .env" }));
                return;
              }

              const url = new URL(req.url, "http://localhost");
              const endpoint = url.searchParams.get("endpoint") || "quotes";
              const slug = url.searchParams.get("slug") || "bitcoin";
              const time_start = url.searchParams.get("time_start");
              const time_end = url.searchParams.get("time_end");

              const base = "https://pro-api.coinmarketcap.com";
              let target = "";

              if (endpoint === "quotes") {
                target = `${base}/v1/cryptocurrency/quotes/latest?slug=${encodeURIComponent(slug)}&convert=USD`;
              } else if (endpoint === "info") {
                target = `${base}/v2/cryptocurrency/info?slug=${encodeURIComponent(slug)}`;
              } else if (endpoint === "ohlcv") {
                if (!time_start || !time_end) {
                  res.statusCode = 400;
                  res.setHeader("Content-Type", "application/json");
                  res.end(JSON.stringify({ error: "time_start et time_end requis pour ohlcv" }));
                  return;
                }
                target =
                  `${base}/v2/cryptocurrency/ohlcv/historical?slug=${encodeURIComponent(slug)}` +
                  `&convert=USD&time_period=daily&time_start=${encodeURIComponent(time_start)}` +
                  `&time_end=${encodeURIComponent(time_end)}`;
              } else {
                res.statusCode = 400;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ error: "endpoint invalide (quotes/info/ohlcv)" }));
                return;
              }

              const r = await fetch(target, {
                headers: {
                  "X-CMC_PRO_API_KEY": CMC_KEY,
                  Accept: "application/json",
                },
              });

              const text = await r.text();
              res.statusCode = r.status;
              res.setHeader("Content-Type", "application/json");
              res.end(text);
            } catch (e) {
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ error: String(e) }));
            }
          });
        },
      },
    ],
  };
});
