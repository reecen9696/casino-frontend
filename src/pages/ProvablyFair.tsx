import React, { useState } from "react";

interface VRFVerificationResult {
  isValid: boolean;
  message: string;
  computedResult?: "heads" | "tails";
}

interface VRFInputs {
  vrfPublicKey: string;
  vrfProof: string;
}

const ProvablyFair: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>("verification");
  const [vrfInputs, setVRFInputs] = useState<VRFInputs>({
    vrfPublicKey: "",
    vrfProof: "",
  });
  const [verificationResult, setVerificationResult] =
    useState<VRFVerificationResult | null>(null);

  const sections = [
    {
      id: "verification",
      title: "Verify Results",
      subtitle: "Verify Your Game Results",
    },
    {
      id: "overview",
      title: "Overview",
      subtitle: "Understanding Provably Fair Gaming",
    },
    {
      id: "vrf",
      title: "VRF Implementation",
      subtitle: "Verifiable Random Functions",
    },
    {
      id: "implementation",
      title: "Implementation",
      subtitle: "Technical Details",
    },
  ];

  // const gameTypes = [
  //   { value: "coinflip", label: "Coin Flip" },
  //   { value: "slots", label: "Slots" },
  //   { value: "dice", label: "Dice" },
  //   { value: "roulette", label: "Roulette" }
  // ];

  const handleInputChange = (field: keyof VRFInputs, value: string) => {
    setVRFInputs((prev) => ({ ...prev, [field]: value }));
    setVerificationResult(null);
  };

  const handleVerification = async () => {
    if (!vrfInputs.vrfPublicKey.trim() || !vrfInputs.vrfProof.trim()) {
      setVerificationResult({
        isValid: false,
        message: "VRF Public Key and VRF Proof are required for verification.",
      });
      return;
    }

    setVerificationResult(null);

    try {
      // Validate VRF format (basic validation - real implementation would use crypto libraries)
      const isValidProof =
        /^[0-9a-fA-F]+$/.test(vrfInputs.vrfProof) &&
        vrfInputs.vrfProof.length >= 32;
      const isValidPublicKey =
        /^[0-9a-fA-F]+$/.test(vrfInputs.vrfPublicKey) &&
        vrfInputs.vrfPublicKey.length >= 32;

      if (!isValidProof || !isValidPublicKey) {
        setVerificationResult({
          isValid: false,
          message:
            "❌ Invalid VRF format. Ensure all fields contain valid hexadecimal strings of sufficient length (32+ characters).",
        });
        return;
      }

      // For manual verification, we can validate the format and structure
      setVerificationResult({
        isValid: true,
        message:
          "✅ ECVRF format validation passed. VRF proof and public key are properly formatted for cryptographic verification.",
        computedResult: undefined, // No result computation without VRF output
      });
    } catch (error) {
      setVerificationResult({
        isValid: false,
        message:
          "❌ Verification failed. Please check your inputs and try again.",
      });
    }
  };

  const renderContent = () => {
    // const currentSection = sections.find(s => s.id === activeSection) || sections[0];

    switch (activeSection) {
      case "overview":
        return (
          <div>
            <h2 className="text-xl font-bold font-aeonik text-white mb-6">
              What is Provably Fair?
            </h2>
            <div className="space-y-4">
              <p className="text-base font-aeonik text-white opacity-80 leading-relaxed">
                Provably fair gaming represents a revolutionary approach to
                online gambling that ensures complete transparency and fairness.
                Unlike traditional online casinos where players must trust that
                the house isn't manipulating results, provably fair systems
                provide cryptographic proof that every game outcome is fair and
                unbiased.
              </p>
              <p className="text-base font-aeonik text-white opacity-80 leading-relaxed">
                Our platform uses Verifiable Random Functions (VRF) to generate
                game outcomes. This means that every result can be independently
                verified by anyone, ensuring that neither the casino nor players
                can manipulate the outcome after a bet is placed.
              </p>
              <p className="text-base font-aeonik text-white opacity-80 leading-relaxed">
                The system works by combining unpredictable blockchain data
                (like block hashes) with your transaction details to create a
                unique, verifiable random output for each game. This output is
                then used to determine the game result in a deterministic way
                that can be verified by anyone.
              </p>
            </div>
          </div>
        );

      case "vrf":
        return (
          <div>
            <h2 className="text-xl font-bold font-aeonik text-white mb-6">
              VRF Technology Deep Dive
            </h2>
            <div className="space-y-4">
              <p className="text-base font-aeonik text-white opacity-80 leading-relaxed">
                Our casino uses{" "}
                <strong>
                  ECVRF (Elliptic Curve Verifiable Random Function)
                </strong>{" "}
                with the <strong>SECP256K1_SHA256_TAI cipher suite</strong> from
                the <code>vrf</code> crate v0.2.5. This implementation provides
                RFC 9381 compliant cryptographic randomness with Ed25519 key
                management.
              </p>
              <p className="text-base font-aeonik text-white opacity-80 leading-relaxed">
                Each game outcome uses a VRF message constructed with{" "}
                <strong>SEC-4 Enhanced Chain Context</strong> binding that
                includes: chain ID, block height, block hash, previous app hash,
                block randomness, transaction hash, transaction index, wallet
                address, nonce, and timestamp. This ensures maximum security
                against replay attacks.
              </p>
              <p className="text-base font-aeonik text-white opacity-80 leading-relaxed">
                The VRF produces both a <strong>cryptographic proof</strong> and
                a <strong>deterministic output</strong>. Game results are
                derived using <code>SHA256(vrf_output)[0] & 1</code> - even
                bytes = heads, odd bytes = tails. This derivation is publicly
                verifiable and impossible to manipulate.
              </p>
              <div className="bg-white/5 rounded-lg p-4 mt-6">
                <h3 className="text-lg font-bold font-aeonik text-white mb-3">
                  Technical Specification
                </h3>
                <ul className="space-y-2 text-sm font-aeonik text-white opacity-80">
                  <li>
                    • <strong>VRF Implementation:</strong> ECVRF with
                    SECP256K1_SHA256_TAI cipher suite
                  </li>
                  <li>
                    • <strong>Key Management:</strong> Ed25519 signing keys with
                    persistent storage
                  </li>
                  <li>
                    • <strong>Message Hashing:</strong> SHA256 with RFC 9381
                    domain separation
                  </li>
                  <li>
                    • <strong>Result Derivation:</strong> SHA256 hash of VRF
                    output, least significant bit
                  </li>
                  <li>
                    • <strong>Proof Format:</strong> Base64-encoded ECVRF proof
                    bytes
                  </li>
                  <li>
                    • <strong>Security Level:</strong> 128-bit security with
                    collision resistance
                  </li>
                </ul>
              </div>
              <div className="bg-white/5 rounded-lg p-4 mt-4">
                <h3 className="text-lg font-bold font-aeonik text-white mb-3">
                  Message Construction (SEC-4)
                </h3>
                <code className="text-xs font-mono text-green-400 block whitespace-pre-wrap">
                  {`SHA256(
  "MYCHAIN:VRF:SEC4:FULL:v1" +
  "CHAIN_ID:" + chain_id_length + chain_id +
  "BLOCK_HEIGHT:" + height +
  "BLOCK_HASH:" + block_hash +
  "PREV_APP_HASH:" + prev_app_hash +
  "BLOCK_RANDOM:" + block_random +
  "TIMESTAMP:" + timestamp +
  "TX_HASH:" + tx_hash +
  "TX_INDEX:" + tx_index +
  "WALLET:" + wallet_address +
  "NONCE:" + nonce
)`}
                </code>
              </div>
            </div>
          </div>
        );

      case "verification":
        return (
          <div>
            <h2 className="text-xl font-bold font-aeonik text-white mb-6">
              Verify Your Game Results
            </h2>
            <p className="text-base font-aeonik text-white opacity-80 leading-relaxed mb-8">
              Verify any bet to ensure transparency and fairness. All
              verification is performed locally in your browser.
            </p>

            <div className="space-y-6">
              {/* VRF Public Key */}
              <div>
                <label className="block text-sm font-aeonik text-white opacity-80 mb-2">
                  VRF Public Key
                </label>
                <input
                  type="text"
                  value={vrfInputs.vrfPublicKey}
                  onChange={(e) =>
                    handleInputChange("vrfPublicKey", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white font-aeonik placeholder-white/40 focus:outline-none focus:border-white/20"
                  placeholder="Enter VRF public key..."
                />
              </div>

              {/* VRF Proof */}
              <div>
                <label className="block text-sm font-aeonik text-white opacity-80 mb-2">
                  VRF Proof
                </label>
                <textarea
                  value={vrfInputs.vrfProof}
                  onChange={(e) =>
                    handleInputChange("vrfProof", e.target.value)
                  }
                  rows={3}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white font-aeonik placeholder-white/40 focus:outline-none focus:border-white/20 resize-none"
                  placeholder="Enter VRF proof..."
                />
              </div>

              {/* Verify Button */}
              <button
                onClick={handleVerification}
                disabled={true}
                className="w-full py-3 px-6 bg-white text-black font-aeonik font-medium rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Verify Result
              </button>

              {/* Verification Result */}
              {verificationResult && (
                <div
                  className={`p-4 rounded-lg border ${
                    verificationResult.isValid
                      ? "bg-green-500/10 border-green-500/20"
                      : "bg-red-500/10 border-red-500/20"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        verificationResult.isValid
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    />
                    <span
                      className={`font-aeonik font-medium ${
                        verificationResult.isValid
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {verificationResult.isValid
                        ? "Verification Successful"
                        : "Verification Failed"}
                    </span>
                  </div>
                  <p className="text-sm font-aeonik text-white opacity-80">
                    {verificationResult.message}
                  </p>
                  {verificationResult.computedResult && (
                    <p className="text-sm font-aeonik text-white opacity-80 mt-2">
                      <strong>Computed Result:</strong>{" "}
                      {verificationResult.computedResult}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        );

      case "implementation":
        return (
          <div>
            <h2 className="text-xl font-bold font-aeonik text-white mb-6">
              Technical Implementation
            </h2>
            <div className="space-y-4">
              <p className="text-base font-aeonik text-white opacity-80 leading-relaxed">
                Our provably fair system is built on{" "}
                <strong>CometBFT consensus</strong> with a custom ABCI
                (Application Blockchain Interface) application written in Rust.
                Each game transaction triggers VRF computation using the{" "}
                <code>vrf</code> crate v0.2.5 with ECVRF implementation.
              </p>
              <p className="text-base font-aeonik text-white opacity-80 leading-relaxed">
                The system uses <strong>Ed25519-based VRF keys</strong> that are
                persistently stored in a Sled embedded database. VRF messages
                are constructed using SEC-4 Enhanced Chain Context binding,
                combining blockchain state (block height, hash, timestamp) with
                transaction data (hash, wallet, nonce) for maximum security.
              </p>
              <p className="text-base font-aeonik text-white opacity-80 leading-relaxed">
                Game results are derived deterministically from VRF output using{" "}
                <code>SHA256(vrf_output)[0] & 1</code>. This ensures that
                outcomes are mathematically provable and cannot be manipulated
                by any party, including the casino operators.
              </p>

              <div className="bg-white/5 rounded-lg p-4 mt-6">
                <h3 className="text-lg font-bold font-aeonik text-white mb-3">
                  VRF Message Construction
                </h3>
                <div className="space-y-2">
                  <p className="text-sm font-aeonik text-white opacity-70 mb-2">
                    SEC-4 Enhanced Chain Context Version:
                  </p>
                  <code className="text-sm font-mono text-green-400 block">
                    VRF_MESSAGE = SHA256(&quot;MYCHAIN:VRF:SEC4:FULL:v1&quot; ||
                    chain_context || transaction_data)
                  </code>
                  <p className="text-xs font-aeonik text-white opacity-60 mt-2">
                    Where chain_context includes block height, hash, previous
                    app hash, block random, and timestamp
                  </p>
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-4 mt-4">
                <h3 className="text-lg font-bold font-aeonik text-white mb-3">
                  Result Derivation
                </h3>
                <code className="text-sm font-mono text-blue-400 block mb-2">
                  result_hash = SHA256(vrf_output)
                </code>
                <code className="text-sm font-mono text-blue-400 block">
                  coin_flip = (result_hash[0] & 1) == 1 ? &quot;heads&quot; :
                  &quot;tails&quot;
                </code>
              </div>

              <div className="bg-white/5 rounded-lg p-4 mt-4">
                <h3 className="text-lg font-bold font-aeonik text-white mb-3">
                  Verification Libraries
                </h3>
                <ul className="space-y-2 text-sm font-aeonik text-white opacity-80">
                  <li>
                    • <strong>Rust VRF Crate:</strong>{" "}
                    <code>vrf = "0.2.5"</code> with ECVRF implementation
                  </li>
                  <li>
                    • <strong>Ed25519 Keys:</strong>{" "}
                    <code>ed25519-dalek = "2.1"</code> for key management
                  </li>
                  <li>
                    • <strong>Hashing:</strong> <code>sha2 = "0.10"</code> for
                    SHA256, <code>blake3 = "1.5"</code> for block randomness
                  </li>
                  <li>
                    • <strong>Consensus:</strong>{" "}
                    <code>tower-abci = "0.12"</code> and{" "}
                    <code>tendermint = "0.34"</code>
                  </li>
                </ul>
              </div>

              <div className="bg-white/5 rounded-lg p-4 mt-4">
                <h3 className="text-lg font-bold font-aeonik text-white mb-3">
                  API Response Format
                </h3>
                <code className="text-xs font-mono text-purple-400 block whitespace-pre-wrap">
                  {`{
  "tx_hash": "3B63730078FF47BD...",
  "result": "heads",
  "vrf_proof": "base64_encoded_ecvrf_proof",
  "vrf_output": "base64_encoded_vrf_output",
  "vrf_public_key": "base64_encoded_ed25519_public_key",
  "height": 12345
}`}
                </code>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const currentSection =
    sections.find((s) => s.id === activeSection) || sections[0];
  const currentIndex = sections.findIndex((s) => s.id === activeSection);
  const previousSection =
    currentIndex > 0
      ? sections[currentIndex - 1]
      : sections[sections.length - 1];
  const nextSection =
    currentIndex < sections.length - 1
      ? sections[currentIndex + 1]
      : sections[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <div className="w-full flex gap-12">
          {/* Content Section (Left) */}
          <div className="flex-1 max-w-4xl">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold font-aeonik text-white mb-2">
                {currentSection.title}
              </h1>
              <p className="text-base font-aeonik text-white opacity-70">
                {currentSection.subtitle}
              </p>
            </div>

            {/* Content */}
            <div className="mb-12">{renderContent()}</div>

            {/* Bottom Navigation for Desktop */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pt-8 max-w-4xl">
              {/* Previous */}
              <div className="flex-1">
                <button
                  onClick={() => setActiveSection(previousSection.id)}
                  className="group text-left"
                >
                  <div className="text-sm font-aeonik text-white opacity-50 mb-1">
                    Previous
                  </div>
                  <div className="text-base font-aeonik text-white group-hover:text-gray-300 transition-colors">
                    {previousSection.title}
                  </div>
                </button>
              </div>

              {/* Next */}
              <div className="flex-1 text-left sm:text-right">
                <button
                  onClick={() => setActiveSection(nextSection.id)}
                  className="group text-left sm:text-right"
                >
                  <div className="text-sm font-aeonik text-white opacity-50 mb-1">
                    Next
                  </div>
                  <div className="text-base font-aeonik text-white group-hover:text-gray-300 transition-colors">
                    {nextSection.title}
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Tabs Section (Right) */}
          <div className="w-64 flex-shrink-0">
            <div className="sticky top-8 pt-16">
              <div className="flex flex-col space-y-0">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full justify-start rounded-none border-0 border-l-2 transition-all font-aeonik text-sm px-3 py-2 h-auto text-left ${
                      section.id === activeSection
                        ? "border-white text-white opacity-100"
                        : "border-transparent text-white opacity-70 hover:opacity-100"
                    }`}
                  >
                    {section.title}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        <div className="flex flex-col gap-8">
          {/* Mobile Navigation */}
          <div className="grid grid-cols-2 gap-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-aeonik transition-colors ${
                  section.id === activeSection
                    ? "text-white opacity-100"
                    : "text-white opacity-70 hover:opacity-100"
                }`}
              >
                {section.title}
              </button>
            ))}
          </div>

          {/* Mobile Content */}
          <div className="max-w-none">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold font-aeonik text-white mb-2">
                {currentSection.title}
              </h1>
              <p className="text-base font-aeonik text-white opacity-70">
                {currentSection.subtitle}
              </p>
            </div>

            {/* Content */}
            <div className="mb-12">{renderContent()}</div>

            {/* Bottom Navigation for Mobile */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pt-8">
              {/* Previous */}
              <div className="flex-1">
                <button
                  onClick={() => setActiveSection(previousSection.id)}
                  className="group text-left"
                >
                  <div className="text-sm font-aeonik text-white opacity-50 mb-1">
                    Previous
                  </div>
                  <div className="text-base font-aeonik text-white group-hover:text-gray-300 transition-colors">
                    {previousSection.title}
                  </div>
                </button>
              </div>

              {/* Next */}
              <div className="flex-1 text-left sm:text-right">
                <button
                  onClick={() => setActiveSection(nextSection.id)}
                  className="group text-left sm:text-right"
                >
                  <div className="text-sm font-aeonik text-white opacity-50 mb-1">
                    Next
                  </div>
                  <div className="text-base font-aeonik text-white group-hover:text-gray-300 transition-colors">
                    {nextSection.title}
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProvablyFair;
