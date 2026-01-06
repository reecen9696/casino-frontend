import React, { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useBetting } from "../../hooks/useApi";
import { api } from "../../services/api";

interface BetResult {
  amount: number;
  profit: number;
  vrfHash: string;
  txHash: string;
  responseTime: number;
  timestamp: number;
  choice: "heads" | "tails";
  result: "heads" | "tails";
  won: boolean;
}

const CoinFlip: React.FC = () => {
  const { flipCoin, loading } = useBetting();
  const { connected, publicKey } = useWallet();

  // Game state
  const [betAmount, setBetAmount] = useState("0.01");
  const [profit, setProfit] = useState(0);
  const [betHistory, setBetHistory] = useState<BetResult[]>([]);
  const [isFlipping, setIsFlipping] = useState(false);
  const [coinResult, setCoinResult] = useState<"heads" | "tails" | null>(null);

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
  const responseTimes = betHistory.slice(-23).map((bet) => bet.responseTime);
  const maxResponseTime = Math.max(...responseTimes, 100);

  const handleBet = async (choice: "heads" | "tails") => {
    if (!connected || !publicKey) {
      return; // Should not happen as buttons are disabled
    }

    const startTime = Date.now();
    setIsFlipping(true);
    setCoinResult(null);

    try {
      // Use demo wallet for betting (but require real wallet connection)
      const walletAddress = api.generateDemoWallet();
      const amountLamports = Math.floor(parseFloat(betAmount) * 1000000000);
      const result = await flipCoin(walletAddress, amountLamports, choice);

      const responseTime = Date.now() - startTime;
      const betProfit = result.won
        ? (result.payout - amountLamports) / 1000000000
        : -parseFloat(betAmount);

      // Simulate coin flip result (heads = true, tails = false from VRF)
      const coinLanded = result.vrf_output.slice(-1) >= "8" ? "heads" : "tails";

      // Show result immediately
      setCoinResult(coinLanded);
      setIsFlipping(false);

      // Update profit
      setProfit((prev) => prev + betProfit);

      // Add to history
      const newBet: BetResult = {
        amount: parseFloat(betAmount),
        profit: betProfit,
        vrfHash: result.vrf_output,
        txHash: result.tx_hash,
        responseTime,
        timestamp: Date.now(),
        choice,
        result: coinLanded,
        won: result.won,
      };

      setBetHistory((prev) => [...prev, newBet]);
    } catch (error) {
      setIsFlipping(false);
      // Error handled by hook
    }
  };

  return (
    <div className="min-h-screen bg-casino-bg text-white">
      {/* Main Game Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-16">
        {/* Mobile: Game Screen First, Controls Below */}
        <div className="block lg:hidden">
          {/* Game Screen - Mobile */}
          <div className="bg-casino-card border border-casino-border rounded-lg p-8 mb-6">
            <div className="flex items-center justify-center min-h-[300px]">
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-4 flex items-center justify-center relative">
                  <div
                    className={`w-32 h-32 rounded-full border-4 border-[#7717FF] bg-gradient-to-br from-[#7717FF] to-[#6412E6] flex items-center justify-center text-white text-2xl font-bold shadow-lg ${
                      isFlipping && coinResult ? "animate-spin" : ""
                    }`}
                  >
                    {isFlipping ? (
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 119 119"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M90.7029 21.2861L85.3181 26.6709L79.9334 21.2861C79.4733 20.8253 78.9269 20.4597 78.3253 20.2102C77.7238 19.9607 77.079 19.8323 76.4278 19.8323C75.7766 19.8323 75.1318 19.9607 74.5303 20.2102C73.9288 20.4597 73.3824 20.8253 72.9223 21.2861L66.7293 27.4791C62.0395 25.7106 57.0698 24.8002 52.0576 24.7917C28.8229 24.7917 9.91675 43.6978 9.91675 66.9375C9.91675 90.1772 28.8229 109.083 52.0576 109.083C75.2924 109.083 94.2035 90.1772 94.2035 66.9375C94.2006 62.4649 93.4791 58.0218 92.0664 53.7781L98.7403 47.1042C99.2012 46.6441 99.5668 46.0977 99.8163 45.4961C100.066 44.8946 100.194 44.2498 100.194 43.5986C100.194 42.9474 100.066 42.3026 99.8163 41.7011C99.5668 41.0996 99.2012 40.5532 98.7403 40.0931L92.3292 33.682L97.7338 28.2774C98.8692 27.1419 101.924 24.7917 104.125 24.7917H109.083V14.875H104.125C97.1834 14.875 91.3127 20.6614 90.7029 21.2861ZM52.0576 49.5833C47.4216 49.5833 43.0682 51.3882 39.7857 54.6656C38.1708 56.2744 36.8906 58.1872 36.0191 60.2935C35.1477 62.3999 34.7022 64.658 34.7084 66.9375H24.7917C24.7917 59.6587 27.623 52.8112 32.7697 47.6595C35.2962 45.1177 38.302 43.1025 41.6128 41.7305C44.9236 40.3585 48.4738 39.657 52.0576 39.6667V49.5833Z"
                          fill="white"
                        />
                        <path
                          d="M68 60.5C68 72.6503 58.1503 82.5 46 82.5C33.8497 82.5 24 72.6503 24 60.5C24 48.3497 33.8497 38.5 46 38.5C58.1503 38.5 68 48.3497 68 60.5Z"
                          fill="white"
                        />
                      </svg>
                    ) : coinResult === "heads" ? (
                      "HEADS"
                    ) : coinResult === "tails" ? (
                      "TAILS"
                    ) : (
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 119 119"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M90.7029 21.2861L85.3181 26.6709L79.9334 21.2861C79.4733 20.8253 78.9269 20.4597 78.3253 20.2102C77.7238 19.9607 77.079 19.8323 76.4278 19.8323C75.7766 19.8323 75.1318 19.9607 74.5303 20.2102C73.9288 20.4597 73.3824 20.8253 72.9223 21.2861L66.7293 27.4791C62.0395 25.7106 57.0698 24.8002 52.0576 24.7917C28.8229 24.7917 9.91675 43.6978 9.91675 66.9375C9.91675 90.1772 28.8229 109.083 52.0576 109.083C75.2924 109.083 94.2035 90.1772 94.2035 66.9375C94.2006 62.4649 93.4791 58.0218 92.0664 53.7781L98.7403 47.1042C99.2012 46.6441 99.5668 46.0977 99.8163 45.4961C100.066 44.8946 100.194 44.2498 100.194 43.5986C100.194 42.9474 100.066 42.3026 99.8163 41.7011C99.5668 41.0996 99.2012 40.5532 98.7403 40.0931L92.3292 33.682L97.7338 28.2774C98.8692 27.1419 101.924 24.7917 104.125 24.7917H109.083V14.875H104.125C97.1834 14.875 91.3127 20.6614 90.7029 21.2861ZM52.0576 49.5833C47.4216 49.5833 43.0682 51.3882 39.7857 54.6656C38.1708 56.2744 36.8906 58.1872 36.0191 60.2935C35.1477 62.3999 34.7022 64.658 34.7084 66.9375H24.7917C24.7917 59.6587 27.623 52.8112 32.7697 47.6595C35.2962 45.1177 38.302 43.1025 41.6128 41.7305C44.9236 40.3585 48.4738 39.657 52.0576 39.6667V49.5833Z"
                          fill="white"
                        />
                        <path
                          d="M68 60.5C68 72.6503 58.1503 82.5 46 82.5C33.8497 82.5 24 72.6503 24 60.5C24 48.3497 33.8497 38.5 46 38.5C58.1503 38.5 68 48.3497 68 60.5Z"
                          fill="white"
                        />
                      </svg>
                    )}
                  </div>
                </div>
                <div className="h-8 flex items-center justify-center">
                  {coinResult && betHistory.length > 0 && (
                    <div
                      className={`text-2xl font-bold ${
                        betHistory[betHistory.length - 1]?.won
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {betHistory[betHistory.length - 1]?.won ? "WON" : "LOST"}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Controls - Mobile */}
          <div className="bg-casino-card border border-casino-border rounded-lg p-6 h-full">
            {/* Controls Content */}
            <div className="flex flex-col h-full space-y-6">
              {/* Bet Amount */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Bet Amount
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M15.9566 8.00028C15.9566 12.3953 12.3938 15.9582 7.99886 15.9582C3.60384 15.9582 0.0410156 12.3953 0.0410156 8.00028C0.0410156 3.60531 3.60384 0.0424805 7.99886 0.0424805C12.3938 0.0424805 15.9566 3.60531 15.9566 8.00028"
                        fill="url(#paint0_linear_mobile_bet)"
                      />
                      <path
                        d="M4.96221 9.88335C5.01652 9.82904 5.09119 9.79736 5.17039 9.79736H12.3525C12.4837 9.79736 12.5493 9.95576 12.4566 10.0485L11.0378 11.4673C10.9835 11.5216 10.9088 11.5533 10.8296 11.5533H3.64754C3.5163 11.5533 3.45067 11.3949 3.54345 11.3021L4.96221 9.88335Z"
                        fill="black"
                      />
                      <path
                        d="M4.96221 4.58599C5.01878 4.53168 5.09346 4.5 5.17039 4.5H12.3525C12.4837 4.5 12.5493 4.65839 12.4566 4.75117L11.0378 6.16993C10.9835 6.22424 10.9088 6.25592 10.8296 6.25592H3.64754C3.5163 6.25592 3.45067 6.09752 3.54345 6.00475L4.96221 4.58599Z"
                        fill="black"
                      />
                      <path
                        d="M11.0378 7.21733C10.9835 7.16303 10.9088 7.13135 10.8296 7.13135H3.64754C3.5163 7.13135 3.45067 7.28974 3.54345 7.38252L4.96221 8.80128C5.01652 8.85559 5.09119 8.88727 5.17039 8.88727H12.3525C12.4837 8.88727 12.5493 8.72887 12.4566 8.6361L11.0378 7.21733Z"
                        fill="black"
                      />
                      <defs>
                        <linearGradient
                          id="paint0_linear_mobile_bet"
                          x1="7.99882"
                          y1="0.0424805"
                          x2="7.99882"
                          y2="15.9582"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#0DF2A9" />
                          <stop offset="1" stopColor="#D725FD" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                  <input
                    type="number"
                    value={betAmount}
                    onChange={(e) => handleBetAmountChange(e.target.value)}
                    step="0.001"
                    min="0.001"
                    max="1"
                    className="w-full pl-9 pr-4 py-3 bg-casino-border border border-casino-border rounded text-white font-aeonik [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    disabled={loading || !connected}
                  />
                </div>
              </div>

              {/* Profit */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Profit
                </label>
                <div className="w-full px-4 py-3 bg-casino-background border border-casino-border rounded flex items-center gap-2">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15.9566 8.00028C15.9566 12.3953 12.3938 15.9582 7.99886 15.9582C3.60384 15.9582 0.0410156 12.3953 0.0410156 8.00028C0.0410156 3.60531 3.60384 0.0424805 7.99886 0.0424805C12.3938 0.0424805 15.9566 3.60531 15.9566 8.00028"
                      fill="url(#paint0_linear_mobile_profit)"
                    />
                    <path
                      d="M4.96221 9.88335C5.01652 9.82904 5.09119 9.79736 5.17039 9.79736H12.3525C12.4837 9.79736 12.5493 9.95576 12.4566 10.0485L11.0378 11.4673C10.9835 11.5216 10.9088 11.5533 10.8296 11.5533H3.64754C3.5163 11.5533 3.45067 11.3949 3.54345 11.3021L4.96221 9.88335Z"
                      fill="black"
                    />
                    <path
                      d="M4.96221 4.58599C5.01878 4.53168 5.09346 4.5 5.17039 4.5H12.3525C12.4837 4.5 12.5493 4.65839 12.4566 4.75117L11.0378 6.16993C10.9835 6.22424 10.9088 6.25592 10.8296 6.25592H3.64754C3.5163 6.25592 3.45067 6.09752 3.54345 6.00475L4.96221 4.58599Z"
                      fill="black"
                    />
                    <path
                      d="M11.0378 7.21733C10.9835 7.16303 10.9088 7.13135 10.8296 7.13135H3.64754C3.5163 7.13135 3.45067 7.28974 3.54345 7.38252L4.96221 8.80128C5.01652 8.85559 5.09119 8.88727 5.17039 8.88727H12.3525C12.4837 8.88727 12.5493 8.72887 12.4566 8.6361L11.0378 7.21733Z"
                      fill="black"
                    />
                    <defs>
                      <linearGradient
                        id="paint0_linear_mobile_profit"
                        x1="7.99882"
                        y1="0.0424805"
                        x2="7.99882"
                        y2="15.9582"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#0DF2A9" />
                        <stop offset="1" stopColor="#D725FD" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <span className="font-aeonik text-white">
                    {profit >= 0 ? "+" : ""}
                    {profit.toFixed(4)}
                  </span>
                </div>
              </div>

              {/* Bet Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleBet("heads")}
                  disabled={loading || !connected}
                  className={`px-6 py-3 bg-[#7717FF] hover:bg-[#6412E6] text-white rounded font-medium transition-all ${
                    loading || !connected
                      ? "opacity-50 cursor-not-allowed"
                      : "opacity-100"
                  }`}
                >
                  Heads
                </button>
                <button
                  onClick={() => handleBet("tails")}
                  disabled={loading || !connected}
                  className={`px-6 py-3 bg-[#7717FF] hover:bg-[#6412E6] text-white rounded font-medium transition-all ${
                    loading || !connected
                      ? "opacity-50 cursor-not-allowed"
                      : "opacity-100"
                  }`}
                >
                  Tails
                </button>
              </div>

              {/* Testnet Alert */}
              {betHistory.length === 0 && (
                <div className="w-full p-4 border border-[#1E2938] bg-[#6A14ED]/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <img
                      src="/alert.svg"
                      alt="Alert"
                      className="w-6 h-6 flex-shrink-0"
                    />
                    <div className="text-white text-sm font-aeonik">
                      {!connected
                        ? "Connect wallet"
                        : "Deposits disabled during testnet. Wagering defaults to Sol."}
                    </div>
                  </div>
                </div>
              )}

              {/* Performance Analytics */}
              {betHistory.length > 0 && (
                <div className="pt-6 mt-auto">
                  {/* Latest Bet Stats */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">VRF:</span>
                      <span className="font-mono text-sm text-white/90 truncate max-w-[200px]">
                        {betHistory[betHistory.length - 1]?.vrfHash}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">TX Hash:</span>
                      <span className="font-mono text-sm text-white/90 truncate max-w-[200px]">
                        {betHistory[betHistory.length - 1]?.txHash}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Result Speed:</span>
                      <span className="text-white/90">
                        {betHistory[betHistory.length - 1]?.responseTime}ms
                      </span>
                    </div>
                  </div>

                  {/* Response Time Chart */}
                  <div>
                    <div className="flex items-end gap-1 h-20">
                      {responseTimes.map((time, index) => (
                        <div
                          key={index}
                          className="bg-[#7717FF]/60 min-w-[8px]"
                          style={{
                            height: `${(time / maxResponseTime) * 100}%`,
                            minHeight: "4px",
                          }}
                          title={`${time}ms`}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between text-xs text-white/50 mt-2">
                      <span>0ms</span>
                      <span>{maxResponseTime}ms</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Desktop: Side by Side Layout */}
        <div className="hidden lg:flex lg:h-[600px]">
          {/* Left Side - Controls */}
          <div className="bg-casino-card border border-casino-border rounded-l-lg p-6 w-80 flex-shrink-0">
            <div className="flex flex-col h-full space-y-6">
              {/* Bet Amount */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Bet Amount
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M15.9566 8.00028C15.9566 12.3953 12.3938 15.9582 7.99886 15.9582C3.60384 15.9582 0.0410156 12.3953 0.0410156 8.00028C0.0410156 3.60531 3.60384 0.0424805 7.99886 0.0424805C12.3938 0.0424805 15.9566 3.60531 15.9566 8.00028"
                        fill="url(#paint0_linear_desktop_bet)"
                      />
                      <path
                        d="M4.96221 9.88335C5.01652 9.82904 5.09119 9.79736 5.17039 9.79736H12.3525C12.4837 9.79736 12.5493 9.95576 12.4566 10.0485L11.0378 11.4673C10.9835 11.5216 10.9088 11.5533 10.8296 11.5533H3.64754C3.5163 11.5533 3.45067 11.3949 3.54345 11.3021L4.96221 9.88335Z"
                        fill="black"
                      />
                      <path
                        d="M4.96221 4.58599C5.01878 4.53168 5.09346 4.5 5.17039 4.5H12.3525C12.4837 4.5 12.5493 4.65839 12.4566 4.75117L11.0378 6.16993C10.9835 6.22424 10.9088 6.25592 10.8296 6.25592H3.64754C3.5163 6.25592 3.45067 6.09752 3.54345 6.00475L4.96221 4.58599Z"
                        fill="black"
                      />
                      <path
                        d="M11.0378 7.21733C10.9835 7.16303 10.9088 7.13135 10.8296 7.13135H3.64754C3.5163 7.13135 3.45067 7.28974 3.54345 7.38252L4.96221 8.80128C5.01652 8.85559 5.09119 8.88727 5.17039 8.88727H12.3525C12.4837 8.88727 12.5493 8.72887 12.4566 8.6361L11.0378 7.21733Z"
                        fill="black"
                      />
                      <defs>
                        <linearGradient
                          id="paint0_linear_desktop_bet"
                          x1="7.99882"
                          y1="0.0424805"
                          x2="7.99882"
                          y2="15.9582"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#0DF2A9" />
                          <stop offset="1" stopColor="#D725FD" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                  <input
                    type="number"
                    value={betAmount}
                    onChange={(e) => handleBetAmountChange(e.target.value)}
                    step="0.001"
                    min="0.001"
                    max="1"
                    className="w-full pl-9 pr-4 py-3 bg-casino-border border border-casino-border rounded text-white font-aeonik [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Profit */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Profit
                </label>
                <div className="w-full px-4 py-3 bg-casino-background border border-casino-border rounded flex items-center gap-2">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15.9566 8.00028C15.9566 12.3953 12.3938 15.9582 7.99886 15.9582C3.60384 15.9582 0.0410156 12.3953 0.0410156 8.00028C0.0410156 3.60531 3.60384 0.0424805 7.99886 0.0424805C12.3938 0.0424805 15.9566 3.60531 15.9566 8.00028"
                      fill="url(#paint0_linear_desktop_profit)"
                    />
                    <path
                      d="M4.96221 9.88335C5.01652 9.82904 5.09119 9.79736 5.17039 9.79736H12.3525C12.4837 9.79736 12.5493 9.95576 12.4566 10.0485L11.0378 11.4673C10.9835 11.5216 10.9088 11.5533 10.8296 11.5533H3.64754C3.5163 11.5533 3.45067 11.3949 3.54345 11.3021L4.96221 9.88335Z"
                      fill="black"
                    />
                    <path
                      d="M4.96221 4.58599C5.01878 4.53168 5.09346 4.5 5.17039 4.5H12.3525C12.4837 4.5 12.5493 4.65839 12.4566 4.75117L11.0378 6.16993C10.9835 6.22424 10.9088 6.25592 10.8296 6.25592H3.64754C3.5163 6.25592 3.45067 6.09752 3.54345 6.00475L4.96221 4.58599Z"
                      fill="black"
                    />
                    <path
                      d="M11.0378 7.21733C10.9835 7.16303 10.9088 7.13135 10.8296 7.13135H3.64754C3.5163 7.13135 3.45067 7.28974 3.54345 7.38252L4.96221 8.80128C5.01652 8.85559 5.09119 8.88727 5.17039 8.88727H12.3525C12.4837 8.88727 12.5493 8.72887 12.4566 8.6361L11.0378 7.21733Z"
                      fill="black"
                    />
                    <defs>
                      <linearGradient
                        id="paint0_linear_desktop_profit"
                        x1="7.99882"
                        y1="0.0424805"
                        x2="7.99882"
                        y2="15.9582"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#0DF2A9" />
                        <stop offset="1" stopColor="#D725FD" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <span className="font-aeonik text-white">
                    {profit >= 0 ? "+" : ""}
                    {profit.toFixed(4)}
                  </span>
                </div>
              </div>

              {/* Bet Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleBet("heads")}
                  disabled={loading || !connected}
                  className={`px-6 py-3 bg-[#7717FF] hover:bg-[#6412E6] text-white rounded font-medium transition-all ${
                    loading || !connected
                      ? "opacity-50 cursor-not-allowed"
                      : "opacity-100"
                  }`}
                >
                  Heads
                </button>
                <button
                  onClick={() => handleBet("tails")}
                  disabled={loading || !connected}
                  className={`px-6 py-3 bg-[#7717FF] hover:bg-[#6412E6] text-white rounded font-medium transition-all ${
                    loading || !connected
                      ? "opacity-50 cursor-not-allowed"
                      : "opacity-100"
                  }`}
                >
                  Tails
                </button>
              </div>

              {/* Testnet Alert */}
              {betHistory.length === 0 && (
                <div className="w-full p-4 border border-[#1E2938] bg-[#6A14ED]/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <img
                      src="/alert.svg"
                      alt="Alert"
                      className="w-6 h-6 flex-shrink-0"
                    />
                    <div className="text-white text-sm font-aeonik">
                      {!connected
                        ? "Connect wallet"
                        : "Deposits disabled during Testnet. Wagering SOL."}
                    </div>
                  </div>
                </div>
              )}

              {/* Performance Analytics */}
              {betHistory.length > 0 && (
                <div className="pt-6 mt-auto">
                  {/* Latest Bet Stats */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">VRF:</span>
                      <span className="font-mono text-sm text-white/90 truncate max-w-[200px]">
                        {betHistory[betHistory.length - 1]?.vrfHash}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">TX Hash:</span>
                      <span className="font-mono text-sm text-white/90 truncate max-w-[200px]">
                        {betHistory[betHistory.length - 1]?.txHash}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Result Speed:</span>
                      <span className="text-white/90">
                        {betHistory[betHistory.length - 1]?.responseTime}ms
                      </span>
                    </div>
                  </div>

                  {/* Response Time Chart */}
                  <div>
                    <div className="flex items-end gap-1 h-20">
                      {responseTimes.map((time, index) => (
                        <div
                          key={index}
                          className="bg-[#7717FF]/60 min-w-[8px]"
                          style={{
                            height: `${(time / maxResponseTime) * 100}%`,
                            minHeight: "4px",
                          }}
                          title={`${time}ms`}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between text-xs text-white/50 mt-2">
                      <span>0ms</span>
                      <span>{maxResponseTime}ms</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Game Screen */}
          <div className="flex-1 border-t border-b border-r border-casino-border rounded-r-lg p-8">
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-48 h-48 mx-auto mb-6 flex items-center justify-center relative">
                  <div
                    className={`w-48 h-48 rounded-full border-4 border-[#7717FF] bg-gradient-to-br from-[#7717FF] to-[#6412E6] flex items-center justify-center text-white text-3xl font-bold shadow-lg ${
                      isFlipping && coinResult ? "animate-spin" : ""
                    }`}
                  >
                    {isFlipping ? (
                      <svg
                        width="36"
                        height="36"
                        viewBox="0 0 119 119"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M90.7029 21.2861L85.3181 26.6709L79.9334 21.2861C79.4733 20.8253 78.9269 20.4597 78.3253 20.2102C77.7238 19.9607 77.079 19.8323 76.4278 19.8323C75.7766 19.8323 75.1318 19.9607 74.5303 20.2102C73.9288 20.4597 73.3824 20.8253 72.9223 21.2861L66.7293 27.4791C62.0395 25.7106 57.0698 24.8002 52.0576 24.7917C28.8229 24.7917 9.91675 43.6978 9.91675 66.9375C9.91675 90.1772 28.8229 109.083 52.0576 109.083C75.2924 109.083 94.2035 90.1772 94.2035 66.9375C94.2006 62.4649 93.4791 58.0218 92.0664 53.7781L98.7403 47.1042C99.2012 46.6441 99.5668 46.0977 99.8163 45.4961C100.066 44.8946 100.194 44.2498 100.194 43.5986C100.194 42.9474 100.066 42.3026 99.8163 41.7011C99.5668 41.0996 99.2012 40.5532 98.7403 40.0931L92.3292 33.682L97.7338 28.2774C98.8692 27.1419 101.924 24.7917 104.125 24.7917H109.083V14.875H104.125C97.1834 14.875 91.3127 20.6614 90.7029 21.2861ZM52.0576 49.5833C47.4216 49.5833 43.0682 51.3882 39.7857 54.6656C38.1708 56.2744 36.8906 58.1872 36.0191 60.2935C35.1477 62.3999 34.7022 64.658 34.7084 66.9375H24.7917C24.7917 59.6587 27.623 52.8112 32.7697 47.6595C35.2962 45.1177 38.302 43.1025 41.6128 41.7305C44.9236 40.3585 48.4738 39.657 52.0576 39.6667V49.5833Z"
                          fill="white"
                        />
                        <path
                          d="M68 60.5C68 72.6503 58.1503 82.5 46 82.5C33.8497 82.5 24 72.6503 24 60.5C24 48.3497 33.8497 38.5 46 38.5C58.1503 38.5 68 48.3497 68 60.5Z"
                          fill="white"
                        />
                      </svg>
                    ) : coinResult === "heads" ? (
                      "HEADS"
                    ) : coinResult === "tails" ? (
                      "TAILS"
                    ) : (
                      <svg
                        width="36"
                        height="36"
                        viewBox="0 0 119 119"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M90.7029 21.2861L85.3181 26.6709L79.9334 21.2861C79.4733 20.8253 78.9269 20.4597 78.3253 20.2102C77.7238 19.9607 77.079 19.8323 76.4278 19.8323C75.7766 19.8323 75.1318 19.9607 74.5303 20.2102C73.9288 20.4597 73.3824 20.8253 72.9223 21.2861L66.7293 27.4791C62.0395 25.7106 57.0698 24.8002 52.0576 24.7917C28.8229 24.7917 9.91675 43.6978 9.91675 66.9375C9.91675 90.1772 28.8229 109.083 52.0576 109.083C75.2924 109.083 94.2035 90.1772 94.2035 66.9375C94.2006 62.4649 93.4791 58.0218 92.0664 53.7781L98.7403 47.1042C99.2012 46.6441 99.5668 46.0977 99.8163 45.4961C100.066 44.8946 100.194 44.2498 100.194 43.5986C100.194 42.9474 100.066 42.3026 99.8163 41.7011C99.5668 41.0996 99.2012 40.5532 98.7403 40.0931L92.3292 33.682L97.7338 28.2774C98.8692 27.1419 101.924 24.7917 104.125 24.7917H109.083V14.875H104.125C97.1834 14.875 91.3127 20.6614 90.7029 21.2861ZM52.0576 49.5833C47.4216 49.5833 43.0682 51.3882 39.7857 54.6656C38.1708 56.2744 36.8906 58.1872 36.0191 60.2935C35.1477 62.3999 34.7022 64.658 34.7084 66.9375H24.7917C24.7917 59.6587 27.623 52.8112 32.7697 47.6595C35.2962 45.1177 38.302 43.1025 41.6128 41.7305C44.9236 40.3585 48.4738 39.657 52.0576 39.6667V49.5833Z"
                          fill="white"
                        />
                        <path
                          d="M68 60.5C68 72.6503 58.1503 82.5 46 82.5C33.8497 82.5 24 72.6503 24 60.5C24 48.3497 33.8497 38.5 46 38.5C58.1503 38.5 68 48.3497 68 60.5Z"
                          fill="white"
                        />
                      </svg>
                    )}
                  </div>
                </div>
                <div className="h-10 flex items-center justify-center">
                  {coinResult && betHistory.length > 0 && (
                    <div
                      className={`text-3xl font-bold ${
                        betHistory[betHistory.length - 1]?.won
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {betHistory[betHistory.length - 1]?.won ? "WON" : "LOST"}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoinFlip;
