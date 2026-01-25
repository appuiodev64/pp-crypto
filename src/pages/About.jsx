import { motion } from "framer-motion";

export default function About() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-100 dark:bg-black px-6 py-10"
    >
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl text-center font-bold mb-4">À propos de mon projet PP</h1>

        <div className="bg-white dark:bg-card rounded-xl shadow p-6 space-y-4">
          <section>
            <h2 className="text-xl font-semibold mb-2">But du site</h2>
            <p className="opacity-90 leading-relaxed">
              Ce site a pour but  d’expliquer, de façon simple et visuelle, le fonctionnement des
              cryptomonnaies et de la technologie blockchain à des élèves du secondaire 4 et 5,
             en utilisant des données réelles et des simulations.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">Public cible</h2>
            <p className="opacity-90 leading-relaxed">
              Élèves de Secondaire 4 et 5 intéressés qui veulent comprendre les bases sans trop se prendre la tête. Ils pourront ainsi en apprendre davantage sur la blockchain, les blocs,
            les transactions et le marché volatile des cryptomonnaies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">Ce que j’ai réalisé</h2>
            <ul className="list-disc pl-6 opacity-90 space-y-1">
              <li>Des pages éducatives pour comprendre les concepts</li>
              <li>Une section de simulation d’une transaction</li>
              <li>Un affichage des principales cryptomonnaies à l'aide d'une API qui recueille les données publiques</li>
              <li>Une page Sources et un sondage avec Google Forms pour recueillir des retours</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">Technologies utilisées</h2>
            <ul className="list-disc pl-6 opacity-90 space-y-1">
              <li>ReactJS</li>
              <li>Tailwind CSS</li>
              <li>Framer Motion</li>
              <li>Recharts</li>
              <li>API CoinGecko pour les prix et les graphiques</li>
            </ul>
          </section>
        </div>
      </div>
    </motion.div>
  );
}