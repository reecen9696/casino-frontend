import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

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
                <svg width="32" height="32" viewBox="0 0 119 119" fill="none">
                  <path
                    d="M90.7029 21.2861L85.3181 26.6709L79.9334 21.2861C79.4733 20.8253 78.9269 20.4597 78.3253 20.2102C77.7238 19.9607 77.079 19.8323 76.4278 19.8323C75.7766 19.8323 75.1318 19.9607 74.5303 20.2102C73.9288 20.4597 73.3824 20.8253 72.9223 21.2861L66.7293 27.4791C62.0395 25.7106 57.0698 24.8002 52.0576 24.7917C28.8229 24.7917 9.91675 43.6978 9.91675 66.9375C9.91675 90.1772 28.8229 109.083 52.0576 109.083C75.2924 109.083 94.2035 90.1772 94.2035 66.9375C94.2006 62.4649 93.4791 58.0218 92.0664 53.7781L98.7403 47.1042C99.2012 46.6441 99.5668 46.0977 99.8163 45.4961C100.066 44.8946 100.194 44.2498 100.194 43.5986C100.194 42.9474 100.066 42.3026 99.8163 41.7011C99.5668 41.0996 99.2012 40.5532 98.7403 40.0931L92.3292 33.682L97.7338 28.2774C98.8692 27.1419 101.924 24.7917 104.125 24.7917H109.083V14.875H104.125C97.1834 14.875 91.3127 20.6614 90.7029 21.2861ZM52.0576 49.5833C47.4216 49.5833 43.0682 51.3882 39.7857 54.6656C38.1708 56.2744 36.8906 58.1872 36.0191 60.2935C35.1477 62.3999 34.7022 64.658 34.7084 66.9375H24.7917C24.7917 59.6587 27.623 52.8112 32.7697 47.6595C35.2962 45.1177 38.302 43.1025 41.6128 41.7305C44.9236 40.3585 48.4738 39.657 52.0576 39.6667V49.5833Z"
                    fill="white"
                  />
                  <path
                    d="M68 60.5C68 72.6503 58.1503 82.5 46 82.5C33.8497 82.5 24 72.6503 24 60.5C24 48.3497 33.8497 38.5 46 38.5C58.1503 38.5 68 48.3497 68 60.5Z"
                    fill="white"
                  />
                </svg>
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
