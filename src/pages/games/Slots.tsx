import React, { useState } from "react";
import { useBetting } from "../../hooks/useApi";
import { api } from "../../services/api";

interface BetResult {
  amount: number;
  profit: number;
  vrfHash: string;
  txHash: string;
  responseTime: number;
  timestamp: number;
}

const Slots: React.FC = () => {
  const { playSlots, loading } = useBetting();

  // Game state
  const [betAmount, setBetAmount] = useState("0.01");
  const [profit, setProfit] = useState(0);
  const [betHistory, setBetHistory] = useState<BetResult[]>([]);

  // Handle bet amount change with validation
  const handleBetAmountChange = (value: string) => {
    const numValue = parseFloat(value);
    if (numValue > 1) {
      setBetAmount("1");
    } else {
      setBetAmount(value);
    }
  };

  // Get last 23 response times for chart
  // const responseTimes = betHistory.slice(-23).map((bet) => bet.responseTime);
  // const maxResponseTime = Math.max(...responseTimes, 100);

  const handleSpin = async () => {
    const startTime = Date.now();
    try {
      const wallet = api.generateDemoWallet();
      const amountLamports = Math.floor(parseFloat(betAmount) * 1000000000);
      const result = await playSlots(wallet, amountLamports, 1);

      const responseTime = Date.now() - startTime;
      const betProfit = result.won
        ? (result.payout - amountLamports) / 1000000000
        : -parseFloat(betAmount);

      // Update profit
      setProfit((prev) => prev + betProfit);

      // Add to history
      const newBet: BetResult = {
        amount: parseFloat(betAmount),
        profit: betProfit,
        vrfHash: (result as any).vrf_hash || "N/A",
        txHash: (result as any).tx_hash || "N/A",
        responseTime,
        timestamp: Date.now(),
      };

      setBetHistory((prev) => [...prev, newBet]);
    } catch (error) {
      // Error handled by hook
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
          {/* Betting Panel */}
          <div className="lg:w-1/3">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-aeonik font-medium mb-6">
                Place Your Bet
              </h2>

              {/* Bet Amount Section */}
              <div className="mb-6">
                <label className="block text-sm font-aeonik font-medium mb-2 text-gray-300">
                  Bet Amount
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={betAmount}
                    onChange={(e) => handleBetAmountChange(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white font-aeonik 
                             focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                             placeholder-gray-400"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    max="1"
                    disabled={loading}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <defs>
                        <linearGradient
                          id="solana-gradient"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor="#0DF2A9" />
                          <stop offset="100%" stopColor="#D725FD" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M2.5 11.5L13.5 3.5M13.5 3.5L9.5 7.5M13.5 3.5L10.5 1.5"
                        stroke="url(#solana-gradient)"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="text-gray-400 font-aeonik text-sm">
                      SOL
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1 font-aeonik">
                  Maximum bet: 1 SOL
                </p>
              </div>

              {/* Profit Section */}
              <div className="mb-6">
                <label className="block text-sm font-aeonik font-medium mb-2 text-gray-300">
                  Profit
                </label>
                <div className="relative">
                  <div className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white font-aeonik">
                    {profit.toFixed(4)}
                  </div>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <defs>
                        <linearGradient
                          id="solana-gradient-2"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor="#0DF2A9" />
                          <stop offset="100%" stopColor="#D725FD" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M2.5 11.5L13.5 3.5M13.5 3.5L9.5 7.5M13.5 3.5L10.5 1.5"
                        stroke="url(#solana-gradient-2)"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="text-gray-400 font-aeonik text-sm">
                      SOL
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSpin}
                disabled={loading || !betAmount || parseFloat(betAmount) <= 0}
                className={`w-full py-4 bg-purple-600 text-white rounded-lg font-aeonik font-medium
                           hover:bg-purple-700 transition-colors
                           disabled:cursor-not-allowed
                           ${loading ? "opacity-80" : "opacity-100"}`}
              >
                Spin
              </button>
            </div>

            {/* Performance Analytics - Desktop */}
            <div className="hidden lg:block mt-6">
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-aeonik font-medium mb-4">
                  Performance Analytics
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400 font-aeonik">
                      Average Response Time
                    </span>
                    <span className="text-white font-aeonik">23ms</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400 font-aeonik">
                      Total Bets
                    </span>
                    <span className="text-white font-aeonik">
                      {betHistory.length}
                    </span>
                  </div>
                  {betHistory.length > 0 && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400 font-aeonik">
                          Last VRF
                        </span>
                        <span className="text-white font-aeonik text-xs">
                          {betHistory[betHistory.length - 1].vrfHash.slice(
                            0,
                            8
                          )}
                          ...
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400 font-aeonik">
                          Last TX Hash
                        </span>
                        <span className="text-white font-aeonik text-xs">
                          {betHistory[betHistory.length - 1].txHash.slice(0, 8)}
                          ...
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Game Area */}
          <div className="lg:w-2/3">
            <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 h-full">
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <div className="grid grid-cols-3 gap-6 mb-8">
                    <div className="w-24 h-24 bg-gray-700 rounded-lg flex items-center justify-center border border-gray-600">
                      <span className="text-3xl">🍒</span>
                    </div>
                    <div className="w-24 h-24 bg-gray-700 rounded-lg flex items-center justify-center border border-gray-600">
                      <span className="text-3xl">🍋</span>
                    </div>
                    <div className="w-24 h-24 bg-gray-700 rounded-lg flex items-center justify-center border border-gray-600">
                      <span className="text-3xl">🍊</span>
                    </div>
                  </div>
                  <p className="text-gray-400 font-aeonik">
                    Click Spin to play!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Analytics - Mobile */}
        <div className="lg:hidden mt-6">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-aeonik font-medium mb-4">
              Performance Analytics
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400 font-aeonik">
                  Average Response Time
                </span>
                <span className="text-white font-aeonik">23ms</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400 font-aeonik">Total Bets</span>
                <span className="text-white font-aeonik">
                  {betHistory.length}
                </span>
              </div>
              {betHistory.length > 0 && (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400 font-aeonik">Last VRF</span>
                    <span className="text-white font-aeonik text-xs">
                      {betHistory[betHistory.length - 1].vrfHash.slice(0, 8)}...
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400 font-aeonik">
                      Last TX Hash
                    </span>
                    <span className="text-white font-aeonik text-xs">
                      {betHistory[betHistory.length - 1].txHash.slice(0, 8)}...
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Slots;
