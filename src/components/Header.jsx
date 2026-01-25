import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="bg-white dark:bg-card shadow p-4">
      <nav className="flex gap-4 font-medium items-center">
        <Link to="/">Accueil</Link>
        <Link to="/learn">Comprendre</Link>
        <Link to="/interactive">Simulation</Link>
        <Link to="/survey">Sondage</Link>
        <Link to="/sources">Sources</Link>
        <Link to="/about">À propos</Link>
        <div className="ml-auto"><ThemeToggle /></div>
      </nav>
    </header>
  );
}
