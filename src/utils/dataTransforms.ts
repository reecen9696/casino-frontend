import type { BetRecord, DisplayBet } from "../types/api";

/**
 * Format a large number with appropriate suffixes (K, M, B)
 */
export function formatNumber(num: number): string {
  if (num === 0) return "0";

  const absNum = Math.abs(num);
  const sign = num < 0 ? "-" : "";

  if (absNum >= 1_000_000_000) {
    return `${sign}${(absNum / 1_000_000_000).toFixed(1)}B`;
  } else if (absNum >= 1_000_000) {
    return `${sign}${(absNum / 1_000_000).toFixed(1)}M`;
  } else if (absNum >= 1_000) {
    return `${sign}${(absNum / 1_000).toFixed(1)}K`;
  }

  return `${sign}${absNum.toLocaleString()}`;
}

/**
 * Format a number with commas for thousands separator
 */
export function formatNumberWithCommas(num: number | undefined | null): string {
  if (num === undefined || num === null || isNaN(num)) {
    return "0";
  }
  return num.toLocaleString();
}

/**
 * Truncate a hash to show first 6 and last 4 characters
 */
export function truncateHash(hash: string): string {
  if (hash.length <= 10) return hash;
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
}

/**
 * Format a timestamp to a human-readable relative time
 */
export function formatRelativeTime(timestamp: number): string {
  const now = Math.floor(Date.now() / 1000);
  const diff = now - timestamp;

  if (diff < 60) {
    return `${diff}s ago`;
  } else if (diff < 3600) {
    return `${Math.floor(diff / 60)}m ago`;
  } else if (diff < 86400) {
    return `${Math.floor(diff / 3600)}h ago`;
  } else {
    return `${Math.floor(diff / 86400)}d ago`;
  }
}

/**
 * Format amount to display appropriate decimal places
 */
export function formatAmount(amount: number, decimals: number = 2): string {
  if (amount === 0) return "0";

  if (amount < 0.01) {
    return amount.toFixed(6);
  } else if (amount < 1) {
    return amount.toFixed(4);
  } else {
    return amount.toFixed(decimals);
  }
}

/**
 * Convert lamports to SOL
 */
export function lamportsToSol(lamports: number): number {
  return lamports / 1_000_000_000;
}

/**
 * Format lamports as SOL with appropriate decimal places
 */
export function formatSolAmount(lamports: number): string {
  const sol = lamportsToSol(lamports);
  return formatAmount(sol);
}

/**
 * Convert BetRecord from API to DisplayBet for UI
 */
export function transformBetRecord(bet: BetRecord): DisplayBet {
  // Ensure all required fields exist and have fallback values
  const amountLamports = bet.amount_wagered || 0;
  const payoutLamports = bet.payout || 0;
  const block = bet.block || 0;
  const timestamp = bet.timestamp || 0;

  // Convert to SOL for display
  const amountSol = lamportsToSol(amountLamports);
  const payoutSol = lamportsToSol(payoutLamports);
  const netSol = payoutSol - amountSol;

  return {
    id: bet.tx_hash || "unknown",
    block: formatNumberWithCommas(block),
    hash: truncateHash(bet.tx_hash || ""),
    token: "SOL",
    wagered: amountSol,
    won: payoutSol,
    net: Math.abs(netSol),
    date: formatRelativeTime(timestamp),
    isPositive: netSol >= 0,
    game_type: bet.game_type || "unknown",
    result: bet.result || "unknown",
    vrf_proof: bet.vrf_proof || "",
    vrf_output: bet.vrf_output || "",
    vrf_hash: bet.vrf_output ? truncateHash(bet.vrf_output) : "",
  };
}

/**
 * Calculate percentage with appropriate precision
 */
export function formatPercentage(value: number): string {
  if (value === 0) return "0%";

  // Backend already returns percentage (e.g., 100.0), not decimal (e.g., 1.0)
  // So we don't multiply by 100
  if (value < 1) {
    return `${value.toFixed(2)}%`;
  }

  return `${value.toFixed(1)}%`;
}

/**
 * Generate a color based on string hash (for consistent wallet colors)
 */
export function generateColorFromString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 70%, 60%)`;
}

/**
 * Debounce function for search and other inputs
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Create loading skeleton data
 */
export function createLoadingSkeleton(count: number = 12): any[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `loading-${i}`,
    loading: true,
  }));
}

/**
 * Copy text to clipboard and show feedback
 */
export async function copyToClipboard(
  text: string,
  showToast?: (message: string) => void
): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      // Use modern clipboard API if available
      await navigator.clipboard.writeText(text);
    } else {
      // Fallback for older browsers or non-secure contexts
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand("copy");
      textArea.remove();
    }

    if (showToast) {
      showToast("Copied to clipboard!");
    }
    return true;
  } catch (err) {
    console.error("Failed to copy to clipboard:", err);
    if (showToast) {
      showToast("Failed to copy to clipboard");
    }
    return false;
  }
}
