import { useEffect, useState } from "react"
import CryptoCard from "../components/CryptoCard"
import { motion } from "framer-motion"
import CryptoCardSkeleton from "../components/CryptoCardSkeleton"

const MARKETS_URL =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=30&page=1"

const fetchWithTimeout = async (url, ms = 8000) => {
  const controller = new AbortController()
  const t = setTimeout(() => controller.abort(), ms)
  try {
    return await fetch(url, { signal: controller.signal })
  } finally {
    clearTimeout(t)
  }
}

// ✅ précharge en douceur (concurrence faible + pause)
const prefetchQueue = async (tasks, concurrency = 2, gapMs = 800) => {
  let i = 0
  const workers = Array.from({ length: concurrency }).map(async () => {
    while (i < tasks.length) {
      const idx = i++
      try {
        await tasks[idx]()
      } catch {
        // silence
      }
      await new Promise((r) => setTimeout(r, gapMs))
    }
  })
  await Promise.all(workers)
}

const Home = () => {
  const [cryptos, setCryptos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    document.title = "Accueil | Crypto & Blockchain";

    const load = async () => {
      setLoading(true)

      // 1) montre tout de suite le cache si dispo (instant)
      const cached = localStorage.getItem("cg_home_cache")
      if (cached && !cancelled) {
        try {
          setCryptos(JSON.parse(cached))
          setLoading(false)
        } catch {}
      }

      // 2) puis tente de refresh en live (silencieux)
      try {
        const res = await fetchWithTimeout(MARKETS_URL, 9000)
        if (!res.ok) throw new Error("API error")
        const data = await res.json()
        if (!Array.isArray(data)) throw new Error("Bad data")

        if (cancelled) return
        setCryptos(data)
        setLoading(false)
        localStorage.setItem("cg_home_cache", JSON.stringify(data))

        // 3) (optionnel mais pro) précharge seulement TOP 6 charts, pas 30
        // Ça évite le “Données indisponibles” sur les cryptos les plus cliquées.
        const top = data.slice(0, 6)
        const tasks = top.map((c) => async () => {
          const chartKey = `cg_chart_${c.id}`
          // si déjà en cache, skip
          if (localStorage.getItem(chartKey)) return

          const chartRes = await fetchWithTimeout(
            `https://api.coingecko.com/api/v3/coins/${c.id}/market_chart?vs_currency=usd&days=7`,
            9000
          )
          if (!chartRes.ok) return
          const chartRaw = await chartRes.json()
          const prices = Array.isArray(chartRaw?.prices) ? chartRaw.prices : []
          const formatted = prices
            .map((p) => ({
              date: new Date(p[0]).toLocaleDateString(),
              price: p[1]
            }))
            .filter((x) => typeof x.price === "number" && Number.isFinite(x.price))

          localStorage.setItem(chartKey, JSON.stringify(formatted))
        })

        // exécute en arrière-plan, sans bloquer l’UI
        prefetchQueue(tasks, 2, 900)
      } catch {
        // rien à afficher : on garde le cache (déjà mis)
        if (!cached && !cancelled) {
          setCryptos([])
          setLoading(false)
        }
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-100 dark:bg-black px-6 py-10"
    >
      <h1 className="text-3xl font-bold mb-6 text-center">
        Voici les principales cryptomonnaies du marché international
      </h1>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {loading ? (
          Array.from({ length: 12 }).map((_, i) => <CryptoCardSkeleton key={i} />)
        ) : cryptos.length > 0 ? (
          cryptos.map((crypto) => <CryptoCard key={crypto.id} crypto={crypto} />).filter(Boolean)
        ) : (
          <div className="col-span-full text-center text-sm opacity-80">
            Données indisponibles pour le moment.
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default Home
