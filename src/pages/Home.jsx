import { useEffect, useMemo, useState } from "react";
import CryptoCard from "../components/CryptoCard";
import { motion } from "framer-motion";
import CryptoCardSkeleton from "../components/CryptoCardSkeleton";
import { Link } from "react-router-dom";

const MARKETS_URL =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=30&page=1";

const fetchWithTimeout = async (url, ms = 8000) => {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(t);
  }
};

// ✅ précharge en douceur (concurrence faible + pause)
const prefetchQueue = async (tasks, concurrency = 2, gapMs = 800) => {
  let i = 0;
  const workers = Array.from({ length: concurrency }).map(async () => {
    while (i < tasks.length) {
      const idx = i++;
      try {
        await tasks[idx]();
      } catch {
        // silence
      }
      await new Promise((r) => setTimeout(r, gapMs));
    }
  });
  await Promise.all(workers);
};

const fmt = (n) =>
  typeof n === "number" && Number.isFinite(n) ? n.toLocaleString() : "—";

const fmtShort = (n) => {
  if (typeof n !== "number" || !Number.isFinite(n)) return "—";
  const abs = Math.abs(n);
  if (abs >= 1e12) return `${(n / 1e12).toFixed(2)}T`;
  if (abs >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
  if (abs >= 1e3) return `${(n / 1e3).toFixed(2)}K`;
  return n.toLocaleString();
};

export default function Home() {
  const [cryptos, setCryptos] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Comparaison (max 2)
  const [compareIds, setCompareIds] = useState([]);

  const compareCryptos = useMemo(
    () => cryptos.filter((c) => compareIds.includes(c.id)),
    [cryptos, compareIds]
  );

  const toggleCompare = (id) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 2) {
        // simple + humain : on remplace le plus ancien
        return [prev[1], id];
      }
      return [...prev, id];
    });
  };

  useEffect(() => {
    let cancelled = false;
    document.title = "Accueil | Crypto & Blockchain";

    const load = async () => {
      setLoading(true);

      // 1) montre tout de suite le cache si dispo
      const cached = localStorage.getItem("cg_home_cache");
      if (cached && !cancelled) {
        try {
          setCryptos(JSON.parse(cached));
          setLoading(false);
        } catch {}
      }

      // 2) puis tente de refresh en live
      try {
        const res = await fetchWithTimeout(MARKETS_URL, 9000);
        if (!res.ok) throw new Error("API error");
        const data = await res.json();
        if (!Array.isArray(data)) throw new Error("Bad data");

        if (cancelled) return;
        setCryptos(data);
        setLoading(false);
        localStorage.setItem("cg_home_cache", JSON.stringify(data));

        // 3) précharge TOP 6 charts
        const top = data.slice(0, 6);
        const tasks = top.map((c) => async () => {
          const chartKey = `cg_chart_${c.id}`;
          if (localStorage.getItem(chartKey)) return;

          const chartRes = await fetchWithTimeout(
            `https://api.coingecko.com/api/v3/coins/${c.id}/market_chart?vs_currency=usd&days=7`,
            9000
          );
          if (!chartRes.ok) return;

          const chartRaw = await chartRes.json();
          const prices = Array.isArray(chartRaw?.prices) ? chartRaw.prices : [];
          const formatted = prices
            .map((p) => ({
              date: new Date(p[0]).toLocaleDateString(),
              price: p[1],
            }))
            .filter((x) => typeof x.price === "number" && Number.isFinite(x.price));

          localStorage.setItem(chartKey, JSON.stringify(formatted));
        });

        prefetchQueue(tasks, 2, 900);
      } catch {
        if (!cached && !cancelled) {
          setCryptos([]);
          setLoading(false);
        }
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-100 dark:bg-black px-6 py-10"
    >
      <h1 className="text-3xl font-bold mb-2 text-center">
        Voici les principales cryptomonnaies du marché international
      </h1>

      <p className="max-w-3xl mx-auto text-center mt-3 opacity-90 leading-relaxed">
        Clique sur une crypto pour voir ses détails. Tu peux aussi en sélectionner deux pour les comparer.
      </p>

      {/* ✅ Zone comparaison */}
      {compareCryptos.length > 0 && (
        <div className="max-w-5xl mx-auto mt-8 mb-8 bg-white dark:bg-gray-900 rounded-2xl shadow p-5 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold">Comparaison</h2>
            <button
              onClick={() => setCompareIds([])}
              className="text-sm px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Réinitialiser
            </button>
          </div>

          <p className="text-sm opacity-80 mt-1">
            Astuce : clique sur “Comparer” sur une carte (max 2).
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {compareCryptos.map((c) => (
              <div
                key={c.id}
                className="rounded-xl border border-gray-200 dark:border-gray-800 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold truncate">
                      {c.name} <span className="opacity-70 uppercase">({c.symbol})</span>
                    </p>
                    <p className="text-sm opacity-80">
                      Rang : #{fmt(c.market_cap_rank)}
                    </p>
                  </div>
                  <Link
                    to={`/crypto/${c.id}`}
                    className="text-sm underline underline-offset-2 text-blue-600 dark:text-blue-400"
                  >
                    Détails
                  </Link>
                </div>

                <div className="mt-3 text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="opacity-80">Prix</span>
                    <span className="font-semibold">${fmt(c.current_price)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-80">Variation (24h)</span>
                    <span className="font-semibold">
                      {typeof c.price_change_percentage_24h === "number"
                        ? `${c.price_change_percentage_24h.toFixed(2)}%`
                        : "—"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-80">Market cap</span>
                    <span className="font-semibold">${fmtShort(c.market_cap)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-80">Volume (24h)</span>
                    <span className="font-semibold">${fmtShort(c.total_volume)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-80">Offre circulation</span>
                    <span className="font-semibold">{fmtShort(c.circulating_supply)}</span>
                  </div>
                </div>
              </div>
            ))}

            {compareCryptos.length === 1 && (
              <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-700 p-4 flex items-center justify-center text-sm opacity-80">
                Sélectionne une 2e crypto pour comparer.
              </div>
            )}
          </div>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-8">
        {loading ? (
          Array.from({ length: 12 }).map((_, i) => <CryptoCardSkeleton key={i} />)
        ) : cryptos.length > 0 ? (
          cryptos
            .map((crypto) => (
              <CryptoCard
                key={crypto.id}
                crypto={crypto}
                onToggleCompare={toggleCompare}
                isCompared={compareIds.includes(crypto.id)}
              />
            ))
            .filter(Boolean)
        ) : (
          <div className="col-span-full text-center text-sm opacity-80">
            Données indisponibles pour le moment.
          </div>
        )}
      </div>
    </motion.div>
  );
}
