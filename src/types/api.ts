// API Types for Blockchain Casino Frontend

export interface StatsResponse {
  current_block: number;
  total_bets: number;
  total_wagered: number;
  total_won: number;
  gross_rtp: number;
  house_edge: number;
}

export interface BetRecord {
  tx_hash: string;
  block: number;
  amount_wagered: number;
  won: boolean;
  result: string;
  payout: number;
  timestamp: number;
  game_type: string;
  vrf_proof: string;
  vrf_output: string;
  vrf_public_key?: string; // Optional for backwards compatibility
}

export interface GameResult {
  CoinFlip?: {
    outcome: string;
    won: boolean;
  };
  Slots?: {
    reels: number[];
    matches: number[];
    multiplier: number;
  };
}

export interface PaginatedBets {
  bets: BetRecord[];
  total_count: number;
  has_more: boolean;
  page: number;
  per_page: number;
}

export interface BetResponse {
  tx_hash: string;
  height: number;
  result: string;
  won: boolean;
  payout: number;
  net_result: number;
  game_type: string;
  vrf_proof: string;
  vrf_output: string;
  vrf_public_key: string;
}

export interface FlipRequest {
  wallet: string;
  amount: number;
  nonce: number;
  choice: "heads" | "tails";
}

export interface BetRequest {
  wallet: string;
  amount: number;
  nonce: number;
  game_type: "coin_flip" | "slots";
  choice?: "heads" | "tails";
  lines?: number;
}

export interface ApiError {
  message: string;
  code?: number;
}

// Frontend display types
export interface DisplayBet {
  id: string;
  block: string;
  hash: string;
  token: string;
  wagered: number;
  won: number;
  net: number;
  date: string;
  isPositive: boolean;
  game_type: string;
  result: string;
  vrf_proof?: string;
  vrf_output?: string;
  vrf_hash?: string;
}
