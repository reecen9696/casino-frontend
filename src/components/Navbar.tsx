import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  // const { connected, publicKey } = useWallet();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isActive = (path: string) => {
    if (path === "/explore") {
      return location.pathname === "/" || location.pathname === "/explore";
    }
    if (path === "/test") {
      return (
        location.pathname === "/test" || location.pathname.startsWith("/test/")
      );
    }
    if (path === "/verify") {
      return location.pathname === "/verify";
    }
    return location.pathname === path;
  };

  return (
    <nav className="w-full bg-casino-bg border-b border-casino-border">
      <div className="max-w-19xl mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-20">
          {/* Left Section - Logo + Navigation Links */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link
                to="/"
                className="text-white hover:opacity-80 transition-opacity"
              >
                <img
                  src="/atomicnetwork.png"
                  alt="Atomiq Network"
                  className="w-28 object-contain"
                />
              </Link>
            </div>

            {/* Desktop Navigation - Aligned to the left next to logo */}
            <div className="hidden md:block">
              <div className="flex items-baseline space-x-6">
                <Link
                  to="/about"
                  className={`py-1 text-base font-aeonik font-medium transition-colors ${
                    isActive("/about")
                      ? "text-white border-b-2 border-white"
                      : "text-white hover:text-gray-300"
                  }`}
                >
                  About
                </Link>
                <Link
                  to="/"
                  className={`py-1 text-base font-aeonik font-medium transition-colors ${
                    isActive("/explore")
                      ? "text-white border-b-2 border-white"
                      : "text-white hover:text-gray-300"
                  }`}
                >
                  Explore
                </Link>
                <Link
                  to="/test"
                  className={`py-1 text-base font-aeonik font-medium transition-colors ${
                    isActive("/test")
                      ? "text-white border-b-2 border-white"
                      : "text-white hover:text-gray-300"
                  }`}
                >
                  Test
                </Link>
                <Link
                  to="/verify"
                  className={`py-1 text-base font-aeonik font-medium transition-colors ${
                    isActive("/verify")
                      ? "text-white border-b-2 border-white"
                      : "text-white hover:text-gray-300"
                  }`}
                >
                  Verify
                </Link>
              </div>
            </div>
          </div>

          {/* Desktop Right Section - Social Icons + Connect Button */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Social Icons */}
            <div className="flex items-center space-x-3">
              {/* X (Twitter) Icon */}
              <a
                href="#"
                className="text-white hover:text-gray-300 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* Telegram Icon */}
              <a
                href="#"
                className="text-white hover:text-gray-300 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
              </a>
            </div>

            {/* Connect Wallet Button */}
            <WalletMultiButton className="!bg-white !text-casino-bg !px-8 !py-3 !rounded-full !font-aeonik !font-medium hover:!bg-gray-200 !transition-colors" />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-white hover:text-gray-300 inline-flex items-center justify-center p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {!isMobileMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-casino-bg">
          {/* Close button */}
          <div className="flex justify-end p-4">
            <button
              onClick={toggleMobileMenu}
              className="text-white hover:text-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
            >
              <svg
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Menu content */}
          <div className="flex flex-col h-full px-6 py-8">
            {/* Navigation Links */}
            <div className="space-y-8 mb-auto">
              <Link
                to="/about"
                onClick={closeMobileMenu}
                className={`block text-2xl font-aeonik font-medium ${
                  isActive("/about")
                    ? "text-white"
                    : "text-white/70 hover:text-white"
                }`}
              >
                About
              </Link>
              <Link
                to="/"
                onClick={closeMobileMenu}
                className={`block text-2xl font-aeonik font-medium ${
                  isActive("/explore")
                    ? "text-white"
                    : "text-white/70 hover:text-white"
                }`}
              >
                Explore
              </Link>
              <Link
                to="/test"
                onClick={closeMobileMenu}
                className={`block text-2xl font-aeonik font-medium ${
                  isActive("/test")
                    ? "text-white"
                    : "text-white/70 hover:text-white"
                }`}
              >
                Test
              </Link>
              <Link
                to="/verify"
                onClick={closeMobileMenu}
                className={`block text-2xl font-aeonik font-medium ${
                  isActive("/verify")
                    ? "text-white"
                    : "text-white/70 hover:text-white"
                }`}
              >
                Verify
              </Link>
            </div>

            {/* Bottom section with social and connect button */}
            <div className="space-y-6">
              {/* Social Icons */}
              <div className="flex items-center space-x-6">
                {/* X (Twitter) Icon */}
                <a
                  href="#"
                  className="text-white hover:text-gray-300 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>

                {/* Telegram Icon */}
                <a
                  href="#"
                  className="text-white hover:text-gray-300 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                  </svg>
                </a>
              </div>

              {/* Connect Wallet Button */}
              <WalletMultiButton className="!w-full !bg-white !text-casino-bg !px-8 !py-4 !rounded-full !font-aeonik !font-medium hover:!bg-gray-200 !transition-colors !text-lg" />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
