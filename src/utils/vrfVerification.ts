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
    calculatedResult?: 'heads' | 'tails';
    actualResult?: string;
    matches?: boolean;
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
  if (!checks.vrfOutput) details.push('VRF Output missing');
  if (!checks.vrfProof) details.push('VRF Proof missing');
  if (!checks.txHash) details.push('Transaction Hash missing');
  if (!checks.gameResult) details.push('Game Result missing');

  const presentCount = Object.values(checks).filter(Boolean).length;
  let status: 'Complete' | 'Partial' | 'Missing';
  
  if (presentCount === 4) {
    status = 'Complete';
  } else if (presentCount > 0) {
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
 * Convert base64 string to bytes array
 */
function base64ToBytes(base64: string): Uint8Array {
  try {
    // Remove any whitespace
    const cleanBase64 = base64.replace(/\s/g, '');
    
    // Decode base64 in browser environment
    if (typeof atob !== 'undefined') {
      const binaryString = atob(cleanBase64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes;
    }
    
    // Fallback for Node.js environment (shouldn't be needed in browser)
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
    // Modern browser crypto API - create a new ArrayBuffer to ensure compatibility
    const newBuffer = new ArrayBuffer(data.length);
    const newView = new Uint8Array(newBuffer);
    newView.set(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', newBuffer);
    return new Uint8Array(hashBuffer);
  } else {
    // Fallback - this would need a crypto library in older browsers
    throw new Error('SHA256 not available in this environment');
  }
}

/**
 * Derive game result from VRF output for coin flip
 */
export async function deriveCoinFlipResult(vrfOutput: string): Promise<{
  result: 'heads' | 'tails';
  process: string[];
}> {
  const process: string[] = [];
  
  try {
    // Step 1: Decode base64 VRF output
    process.push(`1. Decode base64 VRF output: ${vrfOutput.substring(0, 20)}...`);
    const vrfBytes = base64ToBytes(vrfOutput);
    process.push(`2. Raw bytes length: ${vrfBytes.length}`);
    
    // Step 2: Calculate SHA256 hash
    process.push(`3. Calculate SHA256 hash of VRF output`);
    const hashBytes = await sha256(vrfBytes);
    const hashHex = Array.from(hashBytes).map(b => b.toString(16).padStart(2, '0')).join('');
    process.push(`4. SHA256 result: ${hashHex.substring(0, 16)}...`);
    
    // Step 3: Get first byte and check LSB
    const firstByte = hashBytes[0];
    process.push(`5. First byte: 0x${firstByte.toString(16).padStart(2, '0')} (${firstByte} decimal)`);
    
    const lsb = firstByte & 1;
    const result = lsb === 0 ? 'heads' : 'tails';
    process.push(`6. Least Significant Bit (LSB): ${lsb}`);
    process.push(`7. Result: ${lsb === 0 ? '0 (even) = HEADS' : '1 (odd) = TAILS'}`);
    
    return { result, process };
  } catch (error) {
    process.push(`Error: ${error instanceof Error ? error.message : String(error)}`);
    throw new Error(`Failed to derive result: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Validate result derivation for supported games
 */
export async function validateResultDerivation(data: VRFVerificationData): Promise<VRFValidationResult['resultDerivation']> {
  if (!data.vrf_output) {
    return {
      supported: false,
      error: 'VRF output not available'
    };
  }

  if (!data.game_type) {
    return {
      supported: false,
      error: 'Game type not specified'
    };
  }

  // Only support coin flip for now
  const gameType = data.game_type.toLowerCase();
  if (gameType === 'coin_flip' || gameType === 'coinflip') {
    try {
      const derivation = await deriveCoinFlipResult(data.vrf_output);
      const actualResult = data.result?.toLowerCase();
      
      return {
        supported: true,
        calculatedResult: derivation.result,
        actualResult: data.result,
        matches: derivation.result === actualResult,
        process: derivation.process
      };
    } catch (error) {
      return {
        supported: true,
        error: error instanceof Error ? error.message : String(error),
        process: [`Failed to derive result: ${error instanceof Error ? error.message : String(error)}`]
      };
    }
  }

  return {
    supported: false,
    error: `Game type "${data.game_type}" not supported for verification`
  };
}

/**
 * Perform complete VRF verification
 */
export async function verifyVRF(data: VRFVerificationData): Promise<VRFValidationResult> {
  // Check data presence
  const dataPresence = validateDataPresence(data);
  
  // Check result derivation
  const resultDerivation = await validateResultDerivation(data);
  
  // Determine overall status
  let overallStatus: VRFValidationResult['overallStatus'];
  let message: string;
  
  if (dataPresence.status === 'Missing') {
    overallStatus = 'Incomplete';
    message = 'VRF data is missing or incomplete';
  } else if (dataPresence.status === 'Partial') {
    overallStatus = 'Incomplete';
    message = `Missing required data: ${dataPresence.details.join(', ')}`;
  } else if (!resultDerivation.supported) {
    overallStatus = 'Partial';
    message = `Data present but verification not supported: ${resultDerivation.error || 'Unknown reason'}`;
  } else if (resultDerivation.error) {
    overallStatus = 'Failed';
    message = `Verification failed: ${resultDerivation.error}`;
  } else if (resultDerivation.matches === false) {
    overallStatus = 'Failed';
    message = `Result mismatch: Expected ${resultDerivation.actualResult}, calculated ${resultDerivation.calculatedResult}`;
  } else {
    overallStatus = 'Verified';
    message = 'All checks passed - result verified successfully';
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