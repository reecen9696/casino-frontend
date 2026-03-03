import React, { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSection {
  title: string;
  items: FAQItem[];
}

const faqSections: FAQSection[] = [
  {
    title: "The Problem & The Solution",
    items: [
      {
        question: "What problem does Atomiq solve for online gambling?",
        answer:
          "The online gambling market is limited by a single bottleneck: Trust. Players are tired of casinos where they must trust a brand's promise that odds aren't rigged and funds are safe. The industry is shifting from trust-based systems (brand promises) to proof-based systems (cryptographic evidence). Atomiq replaces trust with proof — every bet uses on-chain VRF (Verifiable Random Function), making outcome manipulation impossible. Settlement data is baked into the blockchain, allowing for real-time, independent auditing of every hand played.",
      },
      {
        question: "Why are most crypto casinos not truly provably fair?",
        answer:
          "Most crypto casinos today are black boxes. They ask players to deposit funds into smart contracts they can't read, run by centralized teams on congested general-purpose blockchains. Many rely on federated setups where a small set of insiders control critical components like randomness generation and execution, meaning the house can theoretically manipulate outcomes or freeze funds. Players are forced to trust the operator — defeating the core promise of crypto. Atomiq solves this by making every step fully on-chain and publicly verifiable, with no hidden processes or centralized control over randomness.",
      },
      {
        question: "How is Atomiq different from platforms like Luck.io or Proov Network?",
        answer:
          "Atomiq is the infrastructure layer that perfects what other platforms attempted. We don't just promise fairness — we mathematically prove it. Every bet uses on-chain VRF making outcome manipulation impossible (verifiable by default). Settlement data is baked into the blockchain for real-time, independent auditing (immutable audit trails). While competing platforms are applications built on general-purpose blockchains (inheriting their congestion and downtime risks), Atomiq is a sovereign blockchain optimized solely for gaming throughput — 80% faster than Solana for bet processing, with full public auditability in real time.",
      },
    ],
  },
  {
    title: "How Atomiq Works",
    items: [
      {
        question: "What is Atomiq Protocol and how does it work?",
        answer:
          "Atomiq Protocol is a dedicated, high-performance Layer 1 blockchain engineered specifically for on-chain gambling and betting. Unlike general-purpose blockchains, Atomiq is purpose-built for gaming throughput using BFT (Byzantine Fault Tolerance) consensus — the same approach used by Hyperliquid. It runs the game logic and VRF (Verifiable Random Function) layer natively, then settles outcomes on Solana for fast finality and full public auditability. Every bet, from the millisecond a user clicks 'wager' to funds landing back in their wallet, is recorded on-chain and publicly verifiable.",
      },
      {
        question: "How does BFT consensus work for on-chain gambling?",
        answer:
          "Atomiq uses an advanced Byzantine Fault Tolerance (BFT) consensus mechanism to validate every gambling transaction instantly. BFT consensus ensures that even if some validators are malicious or offline, the network reaches agreement on every bet outcome. This means the entire backend is fully transparent and immutable — there are no hidden steps, no optimistic assumptions, and no waiting. Every bet is BFT-validated in real time, making Atomiq's on-chain casino infrastructure faster and more trustworthy than application-layer casino solutions built on general-purpose chains.",
      },
      {
        question: "How does Solana settlement work with Atomiq's on-chain gambling?",
        answer:
          "Atomiq runs its game logic and VRF randomness layer on its own BFT-validated Layer 1 chain for maximum speed and gaming-specific throughput. Final outcomes are then settled on Solana, leveraging Solana's fast finality and deep liquidity for the payout layer. This hybrid architecture gives Atomiq the best of both worlds: a purpose-built gaming chain for speed and fairness, plus Solana's ecosystem for settlement, public auditability, and interoperability with the broader DeFi and GambleFi ecosystem.",
      },
    ],
  },
  {
    title: "Provably Fair & VRF",
    items: [
      {
        question: "What is provably fair gaming and how does VRF verification work?",
        answer:
          "Provably fair gaming uses cryptographic proofs to guarantee that every game outcome is fair and unbiased. Atomiq implements this using ECVRF (Elliptic Curve Verifiable Random Function) with the SECP256K1_SHA256_TAI cipher suite, providing RFC 9381 compliant cryptographic randomness. Each game outcome combines unpredictable blockchain data (block hashes, timestamps) with transaction details (wallet address, nonce) to produce a unique, verifiable random output. The VRF produces both a cryptographic proof and a deterministic output — anyone can independently verify that the result was not manipulated by any party, including the casino operators.",
      },
      {
        question: "How does Atomiq's non-custodial casino model protect players?",
        answer:
          "Atomiq is fully non-custodial, meaning players always retain control of their funds. Unlike traditional crypto casinos that require depositing into opaque smart contracts controlled by the operator, Atomiq's on-chain architecture ensures that funds are handled transparently through BFT-validated transactions. The VRF randomness layer is publicly auditable, settlement happens on Solana for fast finality, and no single party can freeze or redirect player funds. This eliminates the counterparty risk inherent in custodial gambling platforms.",
      },
      {
        question: "How can I verify that a bet on Atomiq was fair?",
        answer:
          "Every bet on Atomiq can be independently verified using the Atomiq Explorer. Navigate to the Verify page, enter the VRF public key and VRF proof from your bet transaction, and the system will cryptographically confirm the outcome was fair. The verification uses ECVRF with Ed25519 key management — the same cryptographic standard used in enterprise security. You can also browse all bets on the Explorer homepage and click any transaction to see its full VRF proof and on-chain verification data.",
      },
      {
        question: "What are immutable audit trails and why do they matter?",
        answer:
          "Every bet, outcome, and settlement on Atomiq is permanently recorded on the blockchain, creating an immutable audit trail that cannot be altered or deleted. This allows for real-time, independent auditing of every hand played. Casino operators can use this to create public audit logs proving their trustworthiness by displaying real-time RTP (Return to Player) and other key fairness metrics. For players, it means complete transparency — you can verify not just your own bets, but the entire history of the platform.",
      },
    ],
  },
];

const FAQ: React.FC = () => {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set(["0-0"]));

  const toggleItem = (sectionIdx: number, itemIdx: number) => {
    const key = `${sectionIdx}-${itemIdx}`;
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-3xl font-bold font-aeonik text-white mb-3">
          Frequently Asked Questions
        </h1>
        <p className="text-base font-aeonik text-white opacity-70 max-w-2xl">
          Everything you need to know about Atomiq's on-chain, provably fair
          gambling infrastructure — from how BFT consensus secures every bet to
          how VRF makes outcomes verifiable.
        </p>
      </div>

      {/* Trust vs Proof Banner */}
      <div className="mb-12 rounded-xl border border-casino-border bg-gradient-to-r from-white/[0.03] to-white/[0.01] p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 mt-1">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-bold font-aeonik text-white mb-2">
              From Trust to Proof
            </h2>
            <p className="text-sm font-aeonik text-white opacity-70 leading-relaxed">
              The online gambling market is shifting from trust-based systems
              (brand promises) to proof-based systems (cryptographic evidence).
              At Atomiq, we replace trust with proof — every bet uses on-chain
              VRF making outcome manipulation impossible, and immutable audit
              trails allow real-time independent verification of every hand
              played.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Sections */}
      <div className="space-y-10">
        {faqSections.map((section, sectionIdx) => (
          <div key={sectionIdx}>
            <h3 className="text-sm font-aeonik font-medium text-white/50 uppercase tracking-wider mb-4">
              {section.title}
            </h3>
            <div className="space-y-2">
              {section.items.map((item, itemIdx) => {
                const isOpen = openItems.has(`${sectionIdx}-${itemIdx}`);
                return (
                  <div
                    key={itemIdx}
                    className={`rounded-lg border transition-colors ${
                      isOpen
                        ? "border-white/15 bg-white/[0.03]"
                        : "border-casino-border hover:border-white/10"
                    }`}
                  >
                    <button
                      onClick={() => toggleItem(sectionIdx, itemIdx)}
                      className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors"
                    >
                      <span className="text-[15px] font-aeonik font-medium text-white pr-4">
                        {item.question}
                      </span>
                      <div
                        className={`flex-shrink-0 w-6 h-6 rounded-full border border-white/20 flex items-center justify-center transition-all ${
                          isOpen ? "bg-white/10 rotate-180" : ""
                        }`}
                      >
                        <svg
                          className="w-3 h-3 text-white opacity-60"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5">
                        <div className="border-t border-white/5 pt-4">
                          <p className="text-[15px] font-aeonik text-white/70 leading-relaxed">
                            {item.answer}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="mt-12 text-center">
        <p className="text-sm font-aeonik text-white/50 mb-4">
          Still have questions?
        </p>
        <a
          href="https://x.com/TheAtomiqChain"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg border border-casino-border text-sm font-aeonik font-medium text-white hover:bg-white/5 transition-colors"
        >
          Reach out on
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default FAQ;
