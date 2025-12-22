import React from "react";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-medium font-aeonik mb-4">
          Welcome to Blockchain Casino
        </h1>
        <p className="text-lg font-aeonik text-gray-300 mb-8">
          The future of decentralized gaming
        </p>

        {/* Demo content */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <Link
              to="/about"
              className="bg-casino-card border border-casino-border rounded-xl p-6 cursor-pointer hover:border-gray-600 transition-colors block"
            >
              <h3 className="text-xl font-medium font-aeonik mb-3">About</h3>
              <p className="text-gray-400 font-aeonik">
                Discover the revolutionary world of blockchain-powered casino
                games.
              </p>
            </Link>

            <Link
              to="/explore"
              className="bg-casino-card border border-casino-border rounded-xl p-6 cursor-pointer hover:border-gray-600 transition-colors block"
            >
              <h3 className="text-xl font-medium font-aeonik mb-3">Explore</h3>
              <p className="text-gray-400 font-aeonik">
                Browse our collection of provably fair games and experiences.
              </p>
            </Link>

            <Link
              to="/test"
              className="bg-casino-card border border-casino-border rounded-xl p-6 cursor-pointer hover:border-gray-600 transition-colors block"
            >
              <h3 className="text-xl font-medium font-aeonik mb-3">Test</h3>
              <p className="text-gray-400 font-aeonik">
                Try our games in test mode before playing with real
                cryptocurrency.
              </p>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
