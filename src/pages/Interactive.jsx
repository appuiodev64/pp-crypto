import TransactionDemo from "../components/TransactionDemo";
import MiningSimulator from "../components/BlockchainSimulation";
import { useEffect } from "react";
export default function Interactive() {
  useEffect(() => {
        document.title = "Simulation | Crypto & Blockchain";
      }, []);
  return (
    <div className="space-y-10">
      <h1 className="text-2xl text-center font-techno text-primary font-bold tracking-widest">
        Voici des exemples interactifs pour comprendre le fonctionnement des transactions et de la blockchain !
      </h1>

      <TransactionDemo />

      <MiningSimulator />
    </div>
  );
}
