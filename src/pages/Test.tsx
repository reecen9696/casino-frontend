import React from "react";
import { Link } from "react-router-dom";

const Test: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-left mb-8">
        <h1 className="text-3xl font-bold font-aeonik text-white mb-2">Test</h1>
        <p className="text-base font-aeonik text-white opacity-70">
          Try our games in test mode before playing with real cryptocurrency.
        </p>
      </div>

      {/* Test Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1 - Coin Flip */}
        <Link to="/test/coinflip" className="block">
          <div className="bg-casino-card rounded-3xl aspect-square transition-transform duration-300 ease-in-out hover:-translate-y-2 cursor-pointer overflow-hidden">
            <img
              src="/coinflip.png"
              alt="Coin Flip"
              className="w-full h-full object-cover"
            />
          </div>
        </Link>

        {/* Card 2 - Slots */}
        <div className="bg-casino-card rounded-3xl aspect-square transition-transform duration-300 ease-in-out hover:-translate-y-2 cursor-pointer overflow-hidden">
          <img
            src="/locked.png"
            alt="Coming Soon"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Card 3 */}
        <div className="bg-casino-card rounded-3xl aspect-square transition-transform duration-300 ease-in-out hover:-translate-y-2 cursor-pointer overflow-hidden">
          <img
            src="/locked.png"
            alt="Coming Soon"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Card 4 */}
        <div className="bg-casino-card rounded-3xl aspect-square transition-transform duration-300 ease-in-out hover:-translate-y-2 cursor-pointer overflow-hidden">
          <img
            src="/locked.png"
            alt="Coming Soon"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Test;
