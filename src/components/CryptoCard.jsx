import { motion } from "framer-motion"
import { Link } from "react-router-dom"

// utilitaire simple
const isNum = (v) => typeof v === "number" && Number.isFinite(v)

const CryptoCard = ({ crypto }) => {
  // ✅ si l’objet est invalide ou incomplet → on n’affiche RIEN
  if (
    !crypto ||
    typeof crypto.id !== "string" ||
    typeof crypto.name !== "string" ||
    typeof crypto.symbol !== "string" ||
    !isNum(crypto.current_price)
  ) {
    return null
  }

  const pct24 = crypto.price_change_percentage_24h
  const pctClass =
    isNum(pct24)
      ? pct24 >= 0
        ? "text-green-500"
        : "text-red-500"
      : "text-gray-400"

  return (
    <Link to={`/crypto/${crypto.id}`}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-4"
      >
        <div className="flex items-center gap-3">
          {crypto.image ? (
            <img
              src={crypto.image}
              alt={crypto.name}
              className="w-10 h-10"
              loading="lazy"
              onError={(e) => {
                // empêche image cassée
                e.currentTarget.style.display = "none"
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

        <div className="mt-4">
          <p className="text-xl font-bold">
            ${crypto.current_price.toLocaleString()}
          </p>
          <p className={`text-sm ${pctClass}`}>
            {isNum(pct24) ? `${pct24.toFixed(2)}% (24h)` : "— (24h)"}
          </p>
        </div>
      </motion.div>
    </Link>
  )
}

export default CryptoCard
