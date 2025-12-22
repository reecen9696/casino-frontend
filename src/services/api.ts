import type {
  StatsResponse,
  PaginatedBets,
  BetResponse,
  FlipRequest,
  BetRequest,
} from "../types/api";

// Configuration
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export class ApiError extends Error {
  public status?: number;
  public code?: string;

  constructor(message: string, status?: number, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

class BlockchainCasinoApi {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Generic request handler with error handling
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (response.status === 429) {
        throw new ApiError(
          "Too many requests. Please slow down and try again.",
          429,
          "RATE_LIMIT"
        );
      }

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

        try {
          const errorData = await response.text();
          if (errorData) {
            errorMessage = errorData;
          }
        } catch {
          // Ignore JSON parse errors for error messages
        }

        throw new ApiError(errorMessage, response.status);
      }

      const data = await response.json();
      return data as T;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new ApiError(
          "Network error: Unable to connect to the API server",
          0,
          "NETWORK_ERROR"
        );
      }

      throw new ApiError(
        error instanceof Error ? error.message : "An unknown error occurred",
        0,
        "UNKNOWN_ERROR"
      );
    }
  }

  /**
   * Check if the API server is healthy
   */
  async healthCheck(): Promise<string> {
    const response = await fetch(`${this.baseUrl}/health`);
    return response.text();
  }

  /**
   * Get casino statistics
   */
  async getStats(): Promise<StatsResponse> {
    return this.request<StatsResponse>("/v1/stats");
  }

  /**
   * Get paginated bet history
   */
  async getBets(
    limit: number = 20,
    offset: number = 0,
    wallet?: string
  ): Promise<PaginatedBets> {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
    });

    if (wallet) {
      params.append("wallet", wallet);
    }

    return this.request<PaginatedBets>(`/v1/bets?${params}`);
  }

  /**
   * Make a coin flip bet (legacy endpoint)
   */
  async flipCoin(request: FlipRequest): Promise<BetResponse> {
    return this.request<BetResponse>("/v1/flip", {
      method: "POST",
      body: JSON.stringify(request),
    });
  }

  /**
   * Make a multi-game bet
   */
  async placeBet(request: BetRequest): Promise<BetResponse> {
    return this.request<BetResponse>("/v1/bet", {
      method: "POST",
      body: JSON.stringify(request),
    });
  }

  /**
   * Helper method to make a coin flip bet using the universal bet endpoint
   */
  async flipCoinUniversal(
    wallet: string,
    amount: number,
    nonce: number,
    choice: "heads" | "tails"
  ): Promise<BetResponse> {
    return this.placeBet({
      wallet,
      amount,
      nonce,
      game_type: "coin_flip",
      choice,
    });
  }

  /**
   * Helper method to play slots
   */
  async playSlots(
    wallet: string,
    amount: number,
    nonce: number,
    lines: number = 1
  ): Promise<BetResponse> {
    return this.placeBet({
      wallet,
      amount,
      nonce,
      game_type: "slots",
      lines,
    });
  }

  /**
   * Generate a random wallet address for demo purposes
   */
  generateDemoWallet(): string {
    const randomBytes = new Uint8Array(32);
    crypto.getRandomValues(randomBytes);
    return Array.from(randomBytes, (byte) =>
      byte.toString(16).padStart(2, "0")
    ).join("");
  }

  /**
   * Generate a random nonce for transactions
   */
  generateNonce(): number {
    return Math.floor(Math.random() * 1000000) + Date.now();
  }
}

// Create and export a singleton instance
export const api = new BlockchainCasinoApi();
export default BlockchainCasinoApi;
