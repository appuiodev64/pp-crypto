import { useParams, Link } from "react-router-dom"
import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

const isNum = (v) => typeof v === "number" && Number.isFinite(v)
const formatMoney = (v) => (isNum(v) ? `$${v.toLocaleString()}` : "N/A")

const fetchWithTimeout = async (url, ms = 9000) => {
  const controller = new AbortController()
  const t = setTimeout(() => controller.abort(), ms)
  try {
    return await fetch(url, { signal: controller.signal })
  } finally {
    clearTimeout(t)
  }
}

const CryptoDetail = () => {
  const { id } = useParams()
  const [summary, setSummary] = useState(null)   // ✅ vient du cache Home (instant)
  const [detail, setDetail] = useState(null)     // optionnel (description, etc.)
  const [chartData, setChartData] = useState([])
  const [loading, setLoading] = useState(true)

  const cacheKeyChart = useMemo(() => `cg_chart_${id}`, [id])
  const cacheKeyDetail = useMemo(() => `cg_detail_${id}`, [id])

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    // 1) summary instant depuis cg_home_cache
    try {
      const homeCached = localStorage.getItem("cg_home_cache")
      if (homeCached) {
        const arr = JSON.parse(homeCached)
        const found = Array.isArray(arr) ? arr.find((c) => c?.id === id) : null
        if (found && !cancelled) setSummary(found)
      }
    } catch {}

    // 2) chart instant si déjà préchargé / déjà visité
    try {
      const cachedChart = localStorage.getItem(cacheKeyChart)
      if (cachedChart && !cancelled) setChartData(JSON.parse(cachedChart))
    } catch {}

    // 3) fetch live (silencieux). Si ça rate, on garde ce qu’on a.
    const load = async () => {
      try {
        const [detailRes, chartRes] = await Promise.all([
          fetchWithTimeout(`https://api.coingecko.com/api/v3/coins/${id}`, 9000),
          fetchWithTimeout(
            `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=7`,
            9000
          )
        ])

        // si rate-limit, on ne casse rien : juste on n’update pas
        if (detailRes.ok) {
          const detailJson = await detailRes.json()
          if (!cancelled) {
            setDetail(detailJson)
            localStorage.setItem(cacheKeyDetail, JSON.stringify(detailJson))
          }
        } else {
          // fallback detail cache
          const d = localStorage.getItem(cacheKeyDetail)
          if (d && !cancelled) setDetail(JSON.parse(d))
        }

        if (chartRes.ok) {
          const chartRaw = await chartRes.json()
          const prices = Array.isArray(chartRaw?.prices) ? chartRaw.prices : []
          const formatted = prices
            .map((p) => ({ date: new Date(p[0]).toLocaleDateString(), price: p[1] }))
            .filter((x) => isNum(x.price))

          if (!cancelled) {
            setChartData(formatted)
            localStorage.setItem(cacheKeyChart, JSON.stringify(formatted))
          }
        }
      } catch {
        // silence
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [id, cacheKeyChart, cacheKeyDetail])

  // ✅ jamais page blanche : même sans summary, on affiche une carte neutre
  const name = detail?.name || summary?.name || id
  const img = detail?.image?.large || summary?.image || ""
  const price = summary?.current_price ?? detail?.market_data?.current_price?.usd ?? null
  const mcap = summary?.market_cap ?? detail?.market_data?.market_cap?.usd ?? null
  const pct24 = summary?.price_change_percentage_24h ?? detail?.market_data?.price_change_percentage_24h ?? null

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-gray-100 dark:bg-black px-6 py-10"
    >
      <Link to="/" className="text-blue-500 mb-6 inline-block">
        ← Retour au marché
      </Link>

      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6">
        <div className="flex items-center gap-4">
          {img ? (
            <img
              src={img}
              alt={name}
              className="w-14 h-14"
              loading="lazy"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-gray-200 dark:bg-gray-800" />
          )}
          <h1 className="text-3xl font-bold">{name}</h1>
        </div>

        <div className="mt-6 space-y-2">
          <p>💰 Prix actuel ($): {formatMoney(price)}</p>
          <p>📊 Capitalisation ($): {formatMoney(mcap)}</p>
          <p>🔄 Variation 24h (%): {isNum(pct24) ? `${pct24.toFixed(2)}%` : "N/A"}</p>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Évolution du prix (7 derniers jours)</h2>

          {Array.isArray(chartData) && chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <XAxis dataKey="date" />
                <YAxis domain={["auto", "auto"]} />
                <Tooltip />
                <Line type="monotone" dataKey="price" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm opacity-70">
              {loading ? "Chargement du graphique..." : "Graphique non disponible pour le moment."}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default CryptoDetail
