import { useState } from "react"
import { simpleHash } from "../utils/hash"
import { motion } from "framer-motion"

const createBlock = (index, data, previousHash) => {
  const blockData = {
    index,
    timestamp: new Date().toLocaleString(),
    data,
    previousHash
  }

  return {
    ...blockData,
    hash: simpleHash(blockData)
  }
}

const BlockchainSimulation = () => {
  const [blockchain, setBlockchain] = useState([
    createBlock(0, "Bloc de genèse", "0")
  ])
  const [input, setInput] = useState("")

  const addBlock = () => {
    if (!input) return

    const lastBlock = blockchain[blockchain.length - 1]
    const newBlock = createBlock(
      blockchain.length,
      input,
      lastBlock.hash
    )

    setBlockchain([...blockchain, newBlock])
    setInput("")
  }
  const clearBlockchain = () => {
  setBlockchain([createBlock(0, "Bloc Genesis", "0")])
}

  return (
    <div className="min-w-5xl mx-auto bg-gray-100 dark:bg-black px-6 py-10">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">
        Simulation de Blockchain
      </h1>

      <div className="max-w-xl mx-auto mb-10 flex gap-3">
  <input
  value={input}
  onChange={e => setInput(e.target.value)}
  placeholder="Donnée du nouveau bloc"
  className="flex-1 px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400"
/>

  <button
    onClick={addBlock}
    className="px-4 py-2 bg-blue-600 text-white rounded-lg"
  >
    Ajouter un bloc
  </button>

  <button
    onClick={clearBlockchain}
    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
  >
    Clear
  </button>
</div>

      <div className="space-y-6 max-w-3xl mx-auto">
        {blockchain.map((block, index) => (
          <motion.div
            key={block.hash}
            initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow text-gray-800 dark:text-gray-200"
          >
            <p><strong>Index :</strong> {block.index}</p>
            <p><strong>Données :</strong> {block.data}</p>
            <p className="break-all"><strong>Hash :</strong> {block.hash}</p>
            <p className="break-all">
              <strong>Hash précédent :</strong>{" "}
              {block.previousHash}
            </p>

            {index > 0 && block.previousHash !== blockchain[index - 1].hash && (
              <p className="text-red-500 font-semibold mt-2">
                ⚠️ Chaîne compromise
              </p>
            )}
          </motion.div>
        ))}
      </div>
      <p className="text-center text-red-700 mt-8 text-sm opacity-80">
  Entre une donnée et clique sur « Ajouter un bloc » pour voir comment chaque nouveau bloc
  est lié au précédent grâce au hash.
</p>
    </div>
    
  )
}

export default BlockchainSimulation