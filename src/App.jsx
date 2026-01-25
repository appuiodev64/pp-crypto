import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Learn from "./pages/Learn";
import Interactive from "./pages/Interactive";
import Survey from "./pages/Survey";
import Sources from "./pages/Sources";
import CryptoDetail from "./pages/CryptoDetail"
import About from "./pages/About";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-darkbg text-gray-900 dark:text-white">
        <Header />

        <main className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/interactive" element={<Interactive />} />
            <Route path="/survey" element={<Survey />} />
            <Route path="/sources" element={<Sources />} />
            <Route path="/crypto/:id" element={<CryptoDetail />} />
            <Route path="/about" element={<About />} />

          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}
