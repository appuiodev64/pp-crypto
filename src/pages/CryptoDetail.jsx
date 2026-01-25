// src/pages/CryptoDetail.jsx
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// ---------------- Utils ----------------
const isNum = (v) => typeof v === "number" && Number.isFinite(v);

const fmt = (n, opts) => (isNum(n) ? n.toLocaleString(undefined, opts) : "—");

const fmtShort = (n) => {
  if (!isNum(n)) return "—";
  const abs = Math.abs(n);
  if (abs >= 1e12) return `${(n / 1e12).toFixed(2)}T`;
  if (abs >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
  if (abs >= 1e3) return `${(n / 1e3).toFixed(2)}K`;
  return n.toLocaleString();
};

const fmtDate = (iso) => {
  if (!iso || typeof iso !== "string") return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString();
};

const stripHtml = (s) => (typeof s === "string" ? s.replace(/<[^>]*>/g, "") : "");

const inferConsensus = ({ categories, hashing_algorithm }) => {
  const cats = Array.isArray(categories) ? categories.join(" ").toLowerCase() : "";
  const hash = typeof hashing_algorithm === "string" ? hashing_algorithm.toLowerCase() : "";

  if (cats.includes("proof of stake") || cats.includes("pos")) return "Proof of Stake (PoS)";
  if (cats.includes("proof of work") || cats.includes("pow")) return "Proof of Work (PoW)";
  if (hash) return "Proof of Work (PoW) (indicatif)";
  return "—";
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchWithRetry(url, { tries = 3, timeoutMs = 9000 } = {}) {
  let lastErr = null;

  for (let attempt = 1; attempt <= tries; attempt++) {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const res = await fetch(url, { signal: controller.signal });

      // Si rate-limited / serveur en charge, on retente
      if (res.status === 429 || res.status >= 500) {
        lastErr = new Error(`HTTP ${res.status}`);
        // backoff simple (attempt 1 -> 600ms, 2 -> 1200ms, 3 -> 2400ms)
        await sleep(600 * Math.pow(2, attempt - 1));
        continue;
      }

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res;
    } catch (e) {
      lastErr = e;
      await sleep(400 * Math.pow(2, attempt - 1));
    } finally {
      clearTimeout(t);
    }
  }

  throw lastErr || new Error("Fetch failed");
}

// Cache helpers
function readCache(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function writeCache(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

function nowISO() {
  return new Date().toISOString();
}

// ---------------- Component ----------------
export default function CryptoDetail() {
  const { id } = useParams();

  const detailKey = useMemo(() => `cg_detail_v2_${id}`, [id]);
  const chartKey = useMemo(() => `cg_chart_7d_${id}`, [id]);

  const [coin, setCoin] = useState(null);           // données complètes (si possible)
  const [basic, setBasic] = useState(null);         // fallback coins/markets
  const [chart, setChart] = useState([]);           // 7 jours
  const [loading, setLoading] = useState(true);
  const [warning, setWarning] = useState("");       // info non bloquante (API chargée)
  const [cacheInfo, setCacheInfo] = useState("");   // “dernière maj …”

  useEffect(() => {
    let cancelled = false;

    const loadFromCacheFirst = () => {
      const cachedDetail = readCache(detailKey);
      if (cachedDetail?.data) {
        setCoin(cachedDetail.data);
        setCacheInfo(cachedDetail.savedAt ? `Dernière mise à jour : ${new Date(cachedDetail.savedAt).toLocaleString()}` : "");
      }

      const cachedChart = readCache(chartKey);
      if (Array.isArray(cachedChart?.data)) {
        setChart(cachedChart.data);
      }
    };

    const fetchDetail = async () => {
      // Endpoint complet : market_data + description (FR) + links + categories
      // IMPORTANT: on laisse localization=true pour avoir description.fr quand dispo
      const url = `https://api.coingecko.com/api/v3/coins/${id}?localization=true&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`;
      const res = await fetchWithRetry(url, { tries: 3, timeoutMs: 9000 });
      return await res.json();
    };

    const fetchBasicMarkets = async () => {
      // fallback très utile quand /coins/{id} est rate-limited
      const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${encodeURIComponent(
        id
      )}&order=market_cap_desc&per_page=1&page=1&sparkline=false`;
      const res = await fetchWithRetry(url, { tries: 3, timeoutMs: 9000 });
      const arr = await res.json();
      return Array.isArray(arr) && arr[0] ? arr[0] : null;
    };

    const fetchChart7d = async () => {
      const url = `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=7`;
      const res = await fetchWithRetry(url, { tries: 3, timeoutMs: 9000 });
      const raw = await res.json();
      const prices = Array.isArray(raw?.prices) ? raw.prices : [];

      return prices
        .map((p) => ({
          date: new Date(p[0]).toLocaleDateString(),
          price: p[1],
        }))
        .filter((x) => isNum(x.price));
    };

    const load = async () => {
      setLoading(true);
      setWarning("");

      // 1) Afficher cache immédiatement (meilleure UX)
      loadFromCacheFirst();

      // 2) Puis on tente de rafraîchir en live
      try {
        const data = await fetchDetail();
        if (cancelled) return;

        setCoin(data);
        writeCache(detailKey, { data, savedAt: nowISO() });
        setCacheInfo(`Dernière mise à jour : ${new Date().toLocaleString()}`);
      } catch {
        // 3) Si détail complet échoue, on essaye le fallback "basic"
        try {
          const b = await fetchBasicMarkets();
          if (cancelled) return;
          if (b) {
            setBasic(b);
            setWarning(
              "L’API est chargée : certaines infos avancées ne sont pas disponibles, mais les données principales sont affichées."
            );
          } else {
            setWarning(
              "L’API est chargée : affichage des dernières données sauvegardées si disponibles."
            );
          }
        } catch {
          setWarning(
            "L’API est chargée : affichage des dernières données sauvegardées si disponibles."
          );
        }
      }

      // 4) Chart (indépendant) : on tente aussi, sinon on garde cache
      try {
        const c = await fetchChart7d();
        if (cancelled) return;
        setChart(c);
        writeCache(chartKey, { data: c, savedAt: nowISO() });
      } catch {
        // pas bloquant
      }

      if (!cancelled) setLoading(false);
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [id, detailKey, chartKey]);

  // ---------------- Data extraction ----------------
  const md = coin?.market_data || null;

  // prix / variation (priorité: coin.market_data, sinon basic fallback)
  const price = md?.current_price?.usd ?? basic?.current_price;
  const pct24 = md?.price_change_percentage_24h ?? basic?.price_change_percentage_24h;
  const pctClass = isNum(pct24) ? (pct24 >= 0 ? "text-green-500" : "text-red-500") : "text-gray-400";
  const rank = coin?.market_cap_rank ?? basic?.market_cap_rank;

  const marketCap = md?.market_cap?.usd ?? basic?.market_cap;
  const vol = md?.total_volume?.usd ?? basic?.total_volume;
  const high24 = md?.high_24h?.usd ?? basic?.high_24h;
  const low24 = md?.low_24h?.usd ?? basic?.low_24h;

  const circ = md?.circulating_supply ?? basic?.circulating_supply;
  const maxSupply = md?.max_supply ?? basic?.max_supply;

  const ath = md?.ath?.usd ?? basic?.ath;
  const athDate = md?.ath_date?.usd ?? basic?.ath_date;
  const atl = md?.atl?.usd ?? basic?.atl;
  const atlDate = md?.atl_date?.usd ?? basic?.atl_date;

  const circRatio =
    isNum(circ) && isNum(maxSupply) && maxSupply > 0 ? ((circ / maxSupply) * 100) : null;

  // description FR (CoinGecko fournit parfois une version fr)
  const descFR = stripHtml(coin?.description?.fr || "");
  const descEN = stripHtml(coin?.description?.en || "");
  const description = descFR || ""; // priorité FR

  const showENFallback = !descFR && !!descEN;

  // liens (si détail complet dispo)
  const homepage = coin?.links?.homepage?.find((x) => typeof x === "string" && x.startsWith("http"));
  const whitepaper = coin?.links?.whitepaper;
  const explorer = coin?.links?.blockchain_site?.find((x) => typeof x === "string" && x.startsWith("http"));

  const consensus = coin
    ? inferConsensus({ categories: coin.categories, hashing_algorithm: coin.hashing_algorithm })
    : "—";

  const titleName = coin?.name ?? basic?.name ?? id;

  // ---------------- Render ----------------
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-100 dark:bg-black px-6 py-10"
    >
      <div className="max-w-5xl mx-auto">
        <Link to="/" className="underline opacity-80">
          ← Retour
        </Link>

        {/* Warning non bloquant */}
        {warning && (
          <div className="mt-4 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 rounded-xl p-4 text-sm">
            {warning}
          </div>
        )}

        {/* Cache info */}
        {cacheInfo && (
          <p className="mt-2 text-xs opacity-70">{cacheInfo}</p>
        )}

        {/* Header */}
        <div className="mt-4 bg-white dark:bg-gray-900 rounded-2xl shadow p-6 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-4">
            {/* image : coin.image.large si dispo sinon basic.image */}
            {coin?.image?.large || basic?.image ? (
              <img
                src={coin?.image?.large || basic?.image}
                alt={titleName}
                className="w-14 h-14"
                loading="lazy"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-gray-200 dark:bg-gray-800" />
            )}

            <div className="min-w-0">
              <h1 className="text-3xl font-bold truncate">{titleName}</h1>
              <p className="uppercase text-sm opacity-80">
                {coin?.symbol ?? basic?.symbol ?? ""}{" "}
                {isNum(rank) ? `· Rang #${rank}` : ""}
              </p>
            </div>

            <div className="ml-auto text-right">
              <p className="text-2xl font-bold">${fmt(price)}</p>
              <p className={`text-sm ${pctClass}`}>
                {isNum(pct24) ? `${pct24.toFixed(2)}% (24h)` : "— (24h)"}
              </p>
              <p className="text-xs opacity-70 mt-1">
                24h : bas ${fmt(low24)} · haut ${fmt(high24)}
              </p>
            </div>
          </div>

          {/* Description FR */}
          {description ? (
            <p className="mt-4 text-sm opacity-90 leading-relaxed">
              {description.slice(0, 420)}
              {description.length > 420 ? "…" : ""}
            </p>
          ) : showENFallback ? (
            <p className="mt-4 text-sm opacity-90 leading-relaxed">
              <span className="font-semibold">
                Courte description en anglais sourcée depuis l'API: 
              </span>{" "}
              {descEN.slice(0, 320)}{descEN.length > 320 ? "…" : ""}
            </p>
          ) : null}

          {/* Liens */}
          {(homepage || (typeof whitepaper === "string" && whitepaper.startsWith("http")) || explorer) && (
            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              {homepage && (
                <a className="underline text-blue-600 dark:text-blue-400" href={homepage} target="_blank" rel="noreferrer">
                  Site officiel
                </a>
              )}
              {typeof whitepaper === "string" && whitepaper.startsWith("http") && (
                <a className="underline text-blue-600 dark:text-blue-400" href={whitepaper} target="_blank" rel="noreferrer">
                  Document officiel de cette crypto
                </a>
              )}
              {explorer && (
                <a className="underline text-blue-600 dark:text-blue-400" href={explorer} target="_blank" rel="noreferrer">
                  Voir toutes les transactions sur le blockchain explorer
                </a>
              )}
            </div>
          )}
        </div>

        {/* Chart 7 days */}
        <div className="mt-6 bg-white dark:bg-gray-900 rounded-2xl shadow p-6 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Évolution du prix (7 jours)</h2>
            <p className="text-xs opacity-70">Source : CoinGecko</p>
          </div>

          {chart?.length ? (
            <div className="mt-4 w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chart}>
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="price" dot={false} strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="mt-3 text-sm opacity-80">
              Graphique indisponible pour le moment car l'API est malheuresement chargée). Si tu reviens plus tard, il se mettra à jour.
            </p>
          )}
        </div>

        {/* Grids */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 border border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-semibold mb-3">Marché</h2>
            <div className="text-sm space-y-2">
              <Row label="Market cap" value={`$${fmtShort(marketCap)}`} hint="≈ prix × offre en circulation" />
              <Row label="Volume (24h)" value={`$${fmtShort(vol)}`} />
              <Row label="Plus haut (ATH)" value={`$${fmt(ath)}`} />
              <Row label="Date de l’ATH" value={fmtDate(athDate)} />
              <Row label="Plus bas (ATL)" value={`$${fmt(atl)}`} />
              <Row label="Date de l’ATL" value={fmtDate(atlDate)} />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 border border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-semibold mb-3">Offre & technologie</h2>
            <div className="text-sm space-y-2">
              <Row label="Offre en circulation" value={fmtShort(circ)} />
              <Row label="Offre maximale" value={fmtShort(maxSupply)} hint="Si ‘—’, pas de limite fixe connue" />
              <Row
                label="Pourcentage déjà en circulation"
                value={circRatio === null ? "—" : `${circRatio.toFixed(2)}%`}
                hint="circulating ÷ max supply"
              />
              <Row label="Consensus" value={coin ? consensus : "—"} hint="Indicatif (basé sur CoinGecko)" />
              <Row label="Algorithme de hashing" value={coin?.hashing_algorithm || "—"} />
              <Row
                label="Catégories"
                value={
                  Array.isArray(coin?.categories) && coin.categories.length
                    ? coin.categories.slice(0, 3).join(", ")
                    : "—"
                }
                hint={Array.isArray(coin?.categories) && coin.categories.length > 3 ? "…" : ""}
              />
            </div>
          </div>
        </div>

        {/* Petit état "loading" non bloquant */}
        {loading && (
          <p className="text-center text-sm opacity-70 mt-6">
            Mise à jour en cours…
          </p>
        )}
      </div>
    </motion.div>
  );
}

function Row({ label, value, hint }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <p className="opacity-80">
          {label}
          {hint ? (
            <span
              className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full border text-xs opacity-70"
              title={hint}
            >
              i
            </span>
          ) : null}
        </p>
      </div>
      <p className="font-semibold text-right break-all">{value}</p>
    </div>
  );
}
