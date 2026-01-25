import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// utilitaire simple
const isNum = (v) => typeof v === "number" && Number.isFinite(v);

const fmt = (n, opts) =>
  isNum(n)
    ? n.toLocaleString(undefined, opts)
    : "—";

const fmtShort = (n) => {
  if (!isNum(n)) return "—";
  const abs = Math.abs(n);
  if (abs >= 1e12) return `${(n / 1e12).toFixed(2)}T`;
  if (abs >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
  if (abs >= 1e3) return `${(n / 1e3).toFixed(2)}K`;
  return n.toLocaleString();
};

export default function CryptoCard({ crypto, onToggleCompare, isCompared }) {
  // ✅ si l’objet est invalide ou incomplet → on n’affiche RIEN
  if (
    !crypto ||
    typeof crypto.id !== "string" ||
    typeof crypto.name !== "string" ||
    typeof crypto.symbol !== "string" ||
    !isNum(crypto.current_price)
  ) {
    return null;
  }

  const pct24 = crypto.price_change_percentage_24h;
  const pctClass =
    isNum(pct24) ? (pct24 >= 0 ? "text-green-500" : "text-red-500") : "text-gray-400";

  const price = crypto.current_price;
  const rank = crypto.market_cap_rank; // ✅ dispo via coins/markets
  const marketCap = crypto.market_cap; // ✅ dispo
  const circ = crypto.circulating_supply; // ✅ dispo
  const vol = crypto.total_volume; // ✅ dispo
  const high24 = crypto.high_24h; // ✅ dispo
  const low24 = crypto.low_24h; // ✅ dispo

  const handleCompare = (e) => {
    // empêche la navigation du Link
    e.preventDefault();
    e.stopPropagation();
    if (typeof onToggleCompare === "function") onToggleCompare(crypto.id);
  };

  return (
    <Link to={`/crypto/${crypto.id}`}>
      <motion.div
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-4 relative border border-gray-200 dark:border-gray-800"
        title="Clique pour voir les détails"
      >
        {/* Rang */}
        {isNum(rank) && (
          <div className="absolute top-3 right-3 text-xs font-semibold px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800">
            #{rank}
          </div>
        )}

        <div className="flex items-center gap-3">
          {crypto.image ? (
            <img
              src={crypto.image}
              alt={crypto.name}
              className="w-10 h-10"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800" />
          )}

          <div className="min-w-0">
            <h2 className="font-semibold truncate">{crypto.name}</h2>
            <p className="text-sm text-gray-500 uppercase">{crypto.symbol}</p>
          </div>
        </div>

        {/* Prix + variation */}
        <div className="mt-4">
          <p className="text-xl font-bold">${fmt(price)}</p>
          <p className={`text-sm ${pctClass}`}>
            {isNum(pct24) ? `${pct24.toFixed(2)}% (24h)` : "— (24h)"}
          </p>
          <p className="text-xs opacity-70 mt-1">
            24h : bas ${fmt(low24)} · haut ${fmt(high24)}
          </p>
        </div>

        {/* Infos “plus pro” */}
        <div className="mt-4 text-sm space-y-1">
          <div className="flex justify-between gap-3">
            <span className="opacity-80 flex items-center gap-1">
              Market cap
              {/* Tooltip simple via title */}
              <span
                className="inline-flex items-center justify-center w-4 h-4 rounded-full border text-xs opacity-70"
                title="Capitalisation ≈ prix × offre en circulation"
              >
                i
              </span>
            </span>
            <span className="font-semibold">${fmtShort(marketCap)}</span>
          </div>

          <div className="flex justify-between gap-3">
            <span className="opacity-80">Volume (24h)</span>
            <span className="font-semibold">${fmtShort(vol)}</span>
          </div>

          <div className="flex justify-between gap-3">
            <span className="opacity-80">Offre en circulation</span>
            <span className="font-semibold">{fmtShort(circ)}</span>
          </div>
        </div>

        {/* Bouton comparer */}
        <div className="mt-4">
          <button
            onClick={handleCompare}
            className={`w-full px-3 py-2 rounded-lg text-sm font-semibold border transition
              ${
                isCompared
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-transparent border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
          >
            {isCompared ? "Retirer de la comparaison" : "Comparer"}
          </button>
        </div>
      </motion.div>
    </Link>
  );
}
