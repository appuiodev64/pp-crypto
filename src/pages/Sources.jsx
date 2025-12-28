import { useEffect } from "react";

const sources = [
  {
    reference:
      "BITCOIN. Bitcoin Developer Documentation, [En ligne], https://developer.bitcoin.org/ (Page consultée le 26 novembre 2025).",
    usage:
      "Cette documentation a été utilisée pour comprendre le fonctionnement technique fondamental de Bitcoin et la structure des blocs dans une blockchain."
  },
  {
    reference:
      "BINANCE ACADEMY. Blockchain Basics, [En ligne], https://academy.binance.com/fr (Page consultée le 24 novembre 2025).",
    usage:
      "Cette ressource pédagogique a été utilisée pour approfondir les notions de transactions, de validation et de minage, qui ont été présenté sous forme de simulation dans le site web."
  },
  {
    reference:
      "COINBASE. Qu’est-ce que la blockchain ?, [En ligne], https://www.coinbase.com/fr/learn/crypto-basics/what-is-a-blockchain (Page consultée le 25 novembre 2025).",
    usage:
      "Cette source a été utilisée pour approfondir le concept de blockchain et expliquer le lien entre les blocs, les transactions et la sécurité."
  },
  {
    reference:
      "COINGECKO. Crypto Price API, [En ligne], https://www.coingecko.com/en/api (Page consultée le 26 novembre 2025).",
    usage:
      "L’API CoinGecko a été utilisée pour afficher les prix des cryptomonnaies en temps réel ainsi que les graphiques d’évolution des prix."
  },
  {
    reference:
      "COINMARKETCAP. Crypto Prices, Market Cap and Charts, [En ligne], https://coinmarketcap.com/ (Page consultée le 26 novembre 2025).",
    usage:
      "Ce site a été consulté afin de comparer et valider les données générales du marché des cryptomonnaies."
  },
  {
    reference:
      "IBM. Blockchain explained, [En ligne], https://www.ibm.com/topics/blockchain (Page consultée le 25 novembre 2025).",
    usage:
      "Cette source institutionnelle a permis d’obtenir une définition soldie de la blockchain et de comprendre ses caractéristiques principales, comme la décentralisation et la sécurité."
  },
  {
    reference:
      "INVESTOPEDIA. Blockchain, [En ligne], https://www.investopedia.com/terms/b/blockchain.asp (Page consultée le 24 novembre 2025).",
    usage:
      "Cette source a été utilisée pour clarifier le vocabulaire technique lié à la blockchain et aux cryptomonnaies."
  },
  {
    reference:
      "KAHN ACADEMY. Bitcoin and Cryptocurrencies, [En ligne], https://www.khanacademy.org/economics-finance-domain/core-finance/money-and-banking (Page consultée le 24 novembre 2025).",
    usage:
      "Cette ressource éducative a servi à renforcer la compréhension des principes économiques liés aux cryptomonnaies."
  },
  {
    reference:
      "REACT. React Documentation, [En ligne], https://react.dev/ (Page consultée le 23 novembre 2025).",
    usage:
      "La documentation React a été utilisée pour comprendre le langage informatique qui a servi a coder le site web."
  },
  {
    reference:
      "TAILWIND LABS. Tailwind CSS Documentation, [En ligne], https://tailwindcss.com/docs (Page consultée le 23 novembre 2025).",
    usage:
      "Cette documentation a servi à concevoir l’interface du site, assurer la compatibilité avec le mode sombre et améliorer l’expérience utilisateur."
  },
  {
    reference:
      "FRAMER. Framer Motion Documentation, [En ligne], https://www.framer.com/motion/ (Page consultée le 27 novembre 2025).",
    usage:
      "Cette ressource a été utilisée pour intégrer des animations fluides aux cartes de cryptomonnaies dans la page d'accueil et aux simulations interactives"
  },
  {
    reference:
      "VITE. Vite – Next Generation Frontend Tooling, [En ligne], https://vitejs.dev/ (Page consultée le 22 novembre 2025).",
    usage:
      "Vite a été utilisé comme outil de développement dans Visual Studio Code (Mon éditeur de code) pour créer et exécuter efficacement le projet React."
  },
  {
    reference:
      "COLLÈGE SAINT-LOUIS. Règles de présentation écrite, Montréal, 2019, document PDF.",
    usage:
      "Ce document a été utilisé afin de respecter les normes de présentation de la médiagraphie pour le rapport  du projet personnel."
  }
];

export default function Sources() {
  useEffect(() => {
      document.title = "Sources | Crypto & Blockchain";
    }, []);
  return (
    <div className="max-w-4xl mx-auto px-6 py-10 text-gray-800 dark:text-gray-200">
      <h1 className="text-3xl text-center font-bold mb-8 text-gray-900 dark:text-gray-100">
        Sources Bibliographiques
      </h1>

      <div className="space-y-6">
        {sources.map((source, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-900 rounded-xl p-5 shadow"
          >
            <p className="font-semibold text-gray-900 dark:text-gray-100">
              {source.reference}
            </p>

            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
              {source.usage}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}