import { Routes, Route } from "react-router-dom";
import { ToastProvider } from "./components/ToastProvider";
import { WalletContextProvider } from "./contexts/WalletContext";
import Navbar from "./components/Navbar";
import About from "./pages/About";
import Test from "./pages/Test";
import CoinFlip from "./pages/games/CoinFlip";
import Slots from "./pages/games/Slots";
import ProvablyFair from "./pages/ProvablyFair";
import Explore from "./components/Explore";
import Verify from "./pages/Verify";

function App() {
  return (
    <WalletContextProvider>
      <ToastProvider>
        <div className="min-h-screen bg-casino-bg text-white">
          <Navbar />
          <Routes>
            <Route path="/" element={<Explore />} />
            <Route path="/about" element={<About />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/test" element={<Test />} />
            <Route path="/test/coinflip" element={<CoinFlip />} />
            <Route path="/test/slots" element={<Slots />} />
            <Route path="/verify" element={<ProvablyFair />} />
            <Route path="/verify/:transactionId" element={<Verify />} />
          </Routes>
        </div>
      </ToastProvider>
    </WalletContextProvider>
  );
}

export default App;
