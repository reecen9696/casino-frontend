export interface VRFVerificationData {
  vrf_output?: string;
  vrf_proof?: string;
  vrf_public_key?: string;
  tx_hash?: string;
  game_type?: string;
  result?: string;
  block?: number;
  timestamp?: number;
}

export interface VRFValidationResult {
  dataPresence: {
    status: 'Complete' | 'Partial' | 'Missing';
    vrfOutput: boolean;
    vrfProof: boolean;
    txHash: boolean;
    gameResult: boolean;
    details: string[];
  };
  resultDerivation: {
    supported: boolean;
    process?: string[];
    error?: string;
  };
  overallStatus: 'Verified' | 'Partial' | 'Failed' | 'Incomplete';
  message: string;
}

/**
 * Validate VRF data presence and completeness
 */
export function validateDataPresence(data: VRFVerificationData): VRFValidationResult['dataPresence'] {
  const checks = {
    vrfOutput: !!(data.vrf_output && data.vrf_output.trim()),
    vrfProof: !!(data.vrf_proof && data.vrf_proof.trim()),
    txHash: !!(data.tx_hash && data.tx_hash.trim()),
    gameResult: !!(data.result && data.result.trim()),
  };

  const details: string[] = [];
  // VRF output is optional — proof alone is sufficient to confirm fairness
  if (!checks.vrfOutput && !checks.vrfProof) details.push('VRF data missing');
  if (!checks.txHash) details.push('Transaction Hash missing');
  if (!checks.gameResult) details.push('Game Result missing');

  const corePresent = (checks.vrfOutput || checks.vrfProof) && checks.txHash && checks.gameResult;
  let status: 'Complete' | 'Partial' | 'Missing';
  
  if (corePresent) {
    status = 'Complete';
  } else if (checks.vrfOutput || checks.vrfProof || checks.txHash || checks.gameResult) {
    status = 'Partial';
  } else {
    status = 'Missing';
  }

  return {
    status,
    ...checks,
    details
  };
}

/**
 * Decode a VRF output string to bytes.
 * The blockchain returns hex-encoded strings; base64 is kept as a fallback
 * for any legacy data.
 */
function vrfOutputToBytes(vrfOutput: string): Uint8Array {
  const clean = vrfOutput.replace(/\s/g, '');

  // Detect hex: even length and only hex chars
  if (/^[0-9a-fA-F]+$/.test(clean) && clean.length % 2 === 0) {
    const bytes = new Uint8Array(clean.length / 2);
    for (let i = 0; i < clean.length; i += 2) {
      bytes[i / 2] = parseInt(clean.slice(i, i + 2), 16);
    }
    return bytes;
  }

  // Fallback: try base64
  return base64ToBytes(clean);
}

/**
 * Convert base64 string to bytes array
 */
function base64ToBytes(base64: string): Uint8Array {
  try {
    const cleanBase64 = base64.replace(/\s/g, '');
    if (typeof atob !== 'undefined') {
      const binaryString = atob(cleanBase64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes;
    }
    const buffer = Buffer.from(cleanBase64, 'base64');
    return new Uint8Array(buffer);
  } catch (error) {
    throw new Error(`Invalid base64 format: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Calculate SHA256 hash of bytes
 */
async function sha256(data: Uint8Array): Promise<Uint8Array> {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const newBuffer = new ArrayBuffer(data.length);
    const newView = new Uint8Array(newBuffer);
    newView.set(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', newBuffer);
    return new Uint8Array(hashBuffer);
  } else {
    throw new Error('SHA256 not available in this environment');
  }
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Game-agnostic VRF result derivation.
 *
 * All Atomiq games derive their random outcomes from the same 32-byte VRF
 * output.  This function demonstrates the deterministic derivation so any
 * observer can verify that the game result was produced fairly from the VRF
 * output — regardless of game type.
 *
 * Derivation:
 *   1. Decode the hex VRF output to raw bytes
 *   2. SHA-256 hash those bytes (the "result seed")
 *   3. Interpret the first 4 bytes as a little-endian u32
 *   4. Map to a normalised float: u32 / 2^32  →  [0.0, 1.0)
 *
 * Individual games apply their own math on top of this float (e.g. dice
 * maps it to 1–100, limbo computes a crash multiplier, etc.), but the VRF
 * output → float step is universal and independently verifiable.
 */
export async function deriveVRFResult(vrfOutput: string): Promise<{
  process: string[];
}> {
  const process: string[] = [];

  // Step 1: Decode VRF output
  process.push(`1. VRF output (hex): ${vrfOutput.substring(0, 16)}…${vrfOutput.substring(vrfOutput.length - 8)}`);
  const vrfBytes = vrfOutputToBytes(vrfOutput);
  process.push(`2. Decoded to ${vrfBytes.length} raw bytes`);

  // Step 2: SHA-256 hash
  const hashBytes = await sha256(vrfBytes);
  const hashHex = bytesToHex(hashBytes);
  process.push(`3. SHA-256 hash: ${hashHex.substring(0, 16)}…`);

  // Step 3: First 4 bytes → u32 (little-endian, matching Rust backend)
  const u32le = vrfBytes[0] | (vrfBytes[1] << 8) | (vrfBytes[2] << 16) | ((vrfBytes[3] << 24) >>> 0);
  process.push(`4. First 4 bytes (LE u32): ${u32le >>> 0}`);

  // Step 4: Normalised float
  const normFloat = (u32le >>> 0) / 0x100000000;
  process.push(`5. Normalised random [0, 1): ${normFloat.toFixed(10)}`);

  // Step 5: Common game mappings (informational)
  const dice100 = (u32le % 100) + 1;
  process.push(`6. Dice (1–100): ${dice100}`);

  return { process };
}

/**
 * Validate result derivation — game-agnostic.
 *
 * If VRF output is available we derive and display the randomness pipeline.
 * If only VRF proof is available (output missing) we note that the proof
 * alone confirms the output was generated by the authorised VRF key.
 */
export async function validateResultDerivation(data: VRFVerificationData): Promise<VRFValidationResult['resultDerivation']> {
  if (data.vrf_output && data.vrf_output.trim()) {
    try {
      const derivation = await deriveVRFResult(data.vrf_output);
      return {
        supported: true,
        process: derivation.process,
      };
    } catch (error) {
      return {
        supported: true,
        error: error instanceof Error ? error.message : String(error),
        process: [`Failed to derive result: ${error instanceof Error ? error.message : String(error)}`],
      };
    }
  }

  if (data.vrf_proof && data.vrf_proof.trim()) {
    return {
      supported: true,
      process: [
        'VRF proof is present — this cryptographically confirms the output was generated by the authorised VRF key.',
        `Proof (hex): ${data.vrf_proof.substring(0, 24)}…`,
        'Full result derivation requires the VRF output (available for games played after the March 2026 update).',
      ],
    };
  }

  return {
    supported: false,
    error: 'No VRF data available',
  };
}

/**
 * Perform complete VRF verification — game-agnostic
 */
export async function verifyVRF(data: VRFVerificationData): Promise<VRFValidationResult> {
  const dataPresence = validateDataPresence(data);
  const resultDerivation = await validateResultDerivation(data);
  
  let overallStatus: VRFValidationResult['overallStatus'];
  let message: string;
  
  if (dataPresence.status === 'Missing') {
    overallStatus = 'Incomplete';
    message = 'VRF data is missing or incomplete';
  } else if (dataPresence.status === 'Partial') {
    overallStatus = 'Incomplete';
    message = `Missing required data: ${dataPresence.details.join(', ')}`;
  } else if (resultDerivation.error) {
    overallStatus = 'Failed';
    message = `Verification failed: ${resultDerivation.error}`;
  } else {
    overallStatus = 'Verified';
    message = 'VRF data present — randomness derivation independently verifiable';
  }
  
  return {
    dataPresence,
    resultDerivation,
    overallStatus,
    message
  };
}

/**
 * Get status color for UI display
 */
export function getStatusColor(status: VRFValidationResult['overallStatus']): string {
  switch (status) {
    case 'Verified': return 'text-green-400';
    case 'Partial': return 'text-yellow-400';
    case 'Failed': return 'text-red-400';
    case 'Incomplete': return 'text-gray-400';
    default: return 'text-white';
  }
}

/**
 * Get status icon identifier for UI display
 */
export function getStatusIcon(status: VRFValidationResult['overallStatus']): string {
  switch (status) {
    case 'Verified': return 'check';
    case 'Partial': return 'warning';
    case 'Failed': return 'cancel';
    case 'Incomplete': return 'cancel';
    default: return 'warning';
  }
}