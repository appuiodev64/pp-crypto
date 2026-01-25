// src/pages/Sources.jsx
import { motion } from "framer-motion";

const sections = [
  {
    title: "Contenu (crypto, blockchain, transactions)",
    items: [
      {
        ref: "COINBASE.",
        title: "Qu’est-ce qu’une blockchain ?",
        url: "https://www.coinbase.com/fr/learn/crypto-basics/what-is-a-blockchain",
        date: "15 octobre 2025",
        usedFor:
          "M’a servi à expliquer simplement ce qu’est une blockchain d'un niveau secondaire.",
      },
      {
        ref: "IBM THINK, SUSNJARA, Stephanie et SMALLEY, Ian.",
        title: "What is blockchain?",
        url: "https://www.ibm.com/think/topics/blockchain",
        date: "14 octobre 2025",
        usedFor:
          "M’a aidé à comprendre les blocs, le registre distribué et les avantages.",
      },
      {
        ref: "INVESTOPEDIA, LIU, Xiaojie.",
        title:
          "Blockchain Facts: What Is It, How It Works, and How It Can Be Used",
        url: "https://www.investopedia.com/terms/b/blockchain.asp",
        date: "16 octobre 2025",
        usedFor:
          "M’a servi à vérifier des définitions que je ne comprenais pas comme le hash et la validation avec une source fiable.",
      },
      {
        ref: "KHAN ACADEMY.",
        title: "Bitcoin: Overview (video)",
        url: "https://www.khanacademy.org/economics-finance-domain/core-finance/money-and-banking/bitcoin/v/bitcoin-overview",
        date: "18 octobre 2025",
        usedFor:
          "M’a servi à comprendre le  Bitcoin et les bases des cryptomonnaies.",
      },
      {
        ref: "BANQUE DE FRANCE, BARTHÉLEMY, Jean, NGUYEN, Benoît et GARDIN, Paul.",
        title:
          "Cryptoactifs et stabilité financière : des risques de contagion ?",
        url: "https://www.banque-france.fr/fr/publications-et-statistiques/publications/cryptoactifs-et-stabilite-financiere-des-risques-de-contagion",
        date: "11 janvier 2026",
        usedFor:
          "M’a servi à comprendre les risques et l’impact financier avec  une source institutionnelle de la banque.",
      },
      {
        ref: "GOUVERNEMENT DU CANADA.",
        title: "Cryptoactifs",
        // ⚠️ garde ton URL si c'est celle que tu as mise dans ton rapport/site
        url: "https://www.canada.ca/fr/agence-consommation-matiere-financiere/services/paiment/monnaie-numerique.html",
        date: "9 janvier 2026",
        usedFor:
          "M’a servi pour prendre des précautions et comprendre les risques liés aux cryptomonnaies avec une source gouvernementale.",
      },
    ],
  },
  {
    title: "Données (prix, graphiques, marché)",
    items: [
      {
        ref: "COINGECKO.",
        title:
          "Crypto Data API: Most Comprehensive & Reliable Crypto Price & Market Data",
        url: "https://www.coingecko.com/en/api",
        date: "6 décembre 2025",
        usedFor:
          "M’a servi à afficher les prix, variations et infos de cryptomonnaies dans le site.",
      },
      {
        ref: "COINGECKO.",
        title: "Introduction – CoinGecko API",
        url: "https://docs.coingecko.com/",
        date: "10 décembre 2025",
        usedFor:
          "M’a servi à comprendre comment utiliser les endpoints (markets, coins, market_chart).",
      },
      {
        ref: "COINMARKETCAP.",
        title: "CoinMarketCap",
        url: "https://coinmarketcap.com/",
        date: "8 décembre 2025",
        usedFor:
          "M’a servi à comparer et valider des tendances générales du marché comme le prix et la capitalisation.",
      },
    ],
  },
  {
    title: "Outils et bibliothèques (développement du site)",
    items: [
      {
        ref: "REACT.",
        title: "React",
        url: "https://react.dev/",
        date: "5 novembre 2025",
        usedFor:
          "M’a servi à construire l’interface du site avec des composants.",
      },
      {
        ref: "REACT ROUTER.",
        title: "React Router Official Documentation",
        url: "https://reactrouter.com/",
        date: "12 novembre 2025",
        usedFor:
          "M’a servi à créer la navigation entre les pages du site (routing).",
      },
      {
        ref: "TAILWIND LABS.",
        title: "Documentation (Tailwind CSS v2)",
        url: "https://v2.tailwindcss.com/docs",
        date: "7 novembre 2025",
        usedFor:
          "M’a servi à styliser rapidement le site ",
      },
      {
        ref: "MOTION.",
        title: "Motion Documentation",
        url: "https://motion.dev/docs",
        date: "10 novembre 2025",
        usedFor:
          "M’a servi à ajouter des animations simples et fluides dans le site.",
      },
      {
        ref: "PERRY, Matt.",
        title: "About Motion",
        url: "https://motion.dev/about",
        date: "9 novembre 2025",
        usedFor:
          "M’a servi à comprendre l’outil d’animation et comment l’utiliser dans un projet React.",
      },
      {
        ref: "RECHARTS.",
        title: "Recharts",
        url: "https://recharts.org/",
        date: "15 novembre 2025",
        usedFor:
          "M’a servi à afficher des graphiques comme l'évolution du prix sur 7 jours",
      },
      {
        ref: "VITE.",
        title: "Vite | Next Generation Frontend Tooling",
        url: "https://vite.dev/",
        date: "18 novembre 2025",
        usedFor:
          "M’a servi à démarrer et compiler rapidement mon projet React.",
      },
    ],
  },
];

function SourceCard({ item }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-5 border border-gray-200 dark:border-gray-800">
      <p className="font-semibold text-gray-900 dark:text-gray-100">
        {item.ref} <span className="italic">{item.title}</span>,{" "}
        <span className="opacity-90">[En ligne]</span>
      </p>

      <a
        href={item.url}
        target="_blank"
        rel="noreferrer"
        className="break-all text-blue-600 dark:text-blue-400 underline underline-offset-2"
      >
        {item.url}
      </a>

      <p className="text-sm opacity-80 mt-2">
        (Page consultée le {item.date})
      </p>

      <p className="mt-3 text-sm leading-relaxed opacity-90">
        <span className="font-semibold">À quoi ça m’a servi :</span>{" "}
        {item.usedFor}
      </p>
    </div>
  );
}

export default function Sources() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-100 dark:bg-black px-6 py-10"
    >
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-900 dark:text-gray-100">
          Sources
        </h1>
        <p className="opacity-80 mb-8 text-gray-800 dark:text-gray-200">
          Voici les sources que j’ai utilisées pour construire le contenu du site, obtenir des
          données de marché, et développer le site web.
        </p>

        <div className="space-y-10">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                {section.title}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {section.items.map((item) => (
                  <SourceCard key={item.url} item={item} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
