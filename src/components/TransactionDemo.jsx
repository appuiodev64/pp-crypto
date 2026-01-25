import { useState } from "react";
import { motion } from "framer-motion";

export default function TransactionDemo() {
  const [mempool, setMempool] = useState([]);
  const [blocks, setBlocks] = useState([{ id: 1, txs: [], confirmed: true }]);
  const [tx, setTx] = useState("");

  function addTx() {
    if (!tx.trim()) return;
    setMempool([...mempool, tx]);
    setTx("");
  }

  function mine() {
    if (!mempool.length) return;
    const newBlock = { id: blocks.length + 1, txs: mempool, confirmed: false };
    setBlocks([...blocks, newBlock]);
    setMempool([]);

    setTimeout(() => {
      setBlocks(b =>
        b.map(bl =>
          bl.id === newBlock.id ? { ...bl, confirmed: true } : bl
        )
      );
    }, 1000);
  }

  function clearSimulation() {
    setMempool([]);
    setBlocks([{ id: 1, txs: [], confirmed: true }]);
    setTx("");
  }

  return (
    <div className="min-w-5xl bg-gray-100 dark:bg-black px-6 py-10 text-gray-800 dark:text-gray-200">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">
        Simulation de transactions
      </h1>

      {/* Input + boutons */}
      <div className="max-w-xl mx-auto mb-8 flex gap-3">
        <input
          value={tx}
          onChange={e => setTx(e.target.value)}
          placeholder="ex: Alice → Bob : 1 BTC"
          className="flex-1 px-4 py-2 rounded-lg border
                     bg-white dark:bg-gray-800
                     text-gray-900 dark:text-gray-100
                     placeholder-gray-400"
        />

        <button
          onClick={addTx}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Ajouter
        </button>

        <button
          onClick={mine}
          className="px-4 py-2 bg-green-600 text-white rounded-lg"
        >
          Miner
        </button>

        <button
          onClick={clearSimulation}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Effacer
        </button>
      </div>

      {/* Mempool */}
      <div className="max-w-xl mx-auto mb-10 bg-white dark:bg-gray-900 rounded-xl p-4 shadow">
        <h2 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
          Mempool (transactions non confirmées)
        </h2>

        {mempool.length ? (
          mempool.map((t, i) => (
            <div key={i}>• {t}</div>
          ))
        ) : (
          <div className="italic text-gray-500 dark:text-gray-400">
            Aucune transaction en attente
          </div>
        )}
      </div>

      {/* Blocs */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {blocks.map(b => (
          <motion.div
            key={b.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-xl p-4 shadow
              ${
                b.confirmed
                  ? "bg-green-50 dark:bg-green-900/30"
                  : "bg-white dark:bg-gray-900"
              }
              text-gray-800 dark:text-gray-200
            `}
          >
            <div className="font-bold mb-2">
              Bloc #{b.id}
            </div>

            {b.txs.length ? (
              b.txs.map((t, i) => (
                <div key={i}>• {t}</div>
              ))
            ) : (
              <div className="italic text-gray-500 dark:text-gray-400">
                — bloc vide —
              </div>
            )}

            {!b.confirmed && (
              <div className="mt-2 text-yellow-500 font-semibold">
                ⛏️ Minage en cours…
              </div>
            )}
          </motion.div>
        ))}
      </div>
      <p className="text-center mt-8 text-sm opacity-80 text-red-700">
Entre un expéditeur, un destinataire et un montant, puis clique sur « Ajouter » pour envoyer une transaction
  dans le mempool. Clique ensuite sur « Miner » pour la confirmer dans un bloc.
</p>
    </div>
  );
}