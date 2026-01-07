import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import type { BetRecord } from '../types/api';
import { CheckIcon, CancelIcon, WarningIcon } from '../components/StatusIcons';
import { 
  verifyVRF, 
  type VRFValidationResult, 
  getStatusColor, 
  getStatusIcon 
} from '../utils/vrfVerification';

const Verify: React.FC = () => {
  const { transactionId } = useParams<{ transactionId: string }>();
  const [betData, setBetData] = useState<BetRecord | null>(null);
  const [verification, setVerification] = useState<VRFValidationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function to render status icons
  const renderStatusIcon = (iconType: string, className: string = "") => {
    switch (iconType) {
      case 'check':
        return <CheckIcon className={`text-green-400 ${className}`} size={20} />;
      case 'cancel':
        return <CancelIcon className={`text-red-400 ${className}`} size={20} />;
      case 'warning':
        return <WarningIcon className={`text-yellow-400 ${className}`} size={20} />;
      default:
        return <WarningIcon className={`text-gray-400 ${className}`} size={20} />;
    }
  };

  useEffect(() => {
    if (transactionId) {
      loadBetData(transactionId);
    }
  }, [transactionId]);

  const loadBetData = async (txHash: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // For now, we'll fetch from the bets endpoint and find the matching transaction
      // In a real implementation, you'd have a specific endpoint for single bet lookup
      const betsData = await api.getBets(100, 0); // Get recent bets
      const bet = betsData.bets.find(b => b.tx_hash === txHash);
      
      if (!bet) {
        setError('Transaction not found');
        return;
      }
      
      setBetData(bet);
      
      // Perform verification
      const verificationResult = await verifyVRF({
        vrf_output: bet.vrf_output,
        vrf_proof: bet.vrf_proof,
        vrf_public_key: bet.vrf_public_key, // This field is optional
        tx_hash: bet.tx_hash,
        game_type: bet.game_type,
        result: bet.result,
        block: bet.block,
        timestamp: bet.timestamp
      });
      
      setVerification(verificationResult);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load bet data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-white opacity-70">Loading bet verification...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Verification Error</h1>
          <p className="text-white opacity-80 mb-4">{error}</p>
          <Link 
            to="/explore" 
            className="inline-block bg-white text-black px-4 py-2 rounded hover:bg-gray-100 transition-colors"
          >
            Back to Explore
          </Link>
        </div>
      </div>
    );
  }

  if (!betData || !verification) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center text-white opacity-70">
          <p>No bet data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <Link 
          to="/explore" 
          className="text-white/70 hover:text-white mb-4 inline-flex items-center gap-2"
        >
          ← Back to Explore
        </Link>
        <h1 className="text-3xl font-bold text-white mb-2">Bet Verification</h1>
        <p className="text-white/70">Transaction: {transactionId}</p>
      </div>

      {/* Overall Status */}
      <div className="bg-casino-card border border-casino-border rounded-lg p-6 mb-8">
        <div className="flex items-center gap-3 mb-4">
          {renderStatusIcon(getStatusIcon(verification.overallStatus))}
          <div>
            <h2 className={`text-xl font-bold ${getStatusColor(verification.overallStatus)}`}>
              {verification.overallStatus.toUpperCase()}
            </h2>
            <p className="text-white/80">{verification.message}</p>
          </div>
        </div>
      </div>

      {/* Bet Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-casino-card border border-casino-border rounded-lg p-6">
          <h3 className="text-lg font-bold text-white mb-4">Bet Information</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-white/70">Game Type:</span>
              <span className="text-white">{betData.game_type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Result:</span>
              <span className="text-white">{betData.result}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Amount Wagered:</span>
              <span className="text-white">{(betData.amount_wagered / 1e9).toFixed(4)} SOL</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Payout:</span>
              <span className="text-white">{(betData.payout / 1e9).toFixed(4)} SOL</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Block Height:</span>
              <span className="text-white">{betData.block}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Timestamp:</span>
              <span className="text-white">{new Date(betData.timestamp * 1000).toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="bg-casino-card border border-casino-border rounded-lg p-6">
          <h3 className="text-lg font-bold text-white mb-4">VRF Data</h3>
          <div className="space-y-3">
            <div>
              <span className="text-white/70 block">VRF Output:</span>
              <span className="text-white font-mono text-xs break-all">
                {betData.vrf_output || 'Not available'}
              </span>
            </div>
            <div>
              <span className="text-white/70 block">VRF Proof:</span>
              <span className="text-white font-mono text-xs break-all">
                {betData.vrf_proof || 'Not available'}
              </span>
            </div>
            <div>
              <span className="text-white/70 block">Transaction Hash:</span>
              <span className="text-white font-mono text-xs break-all">
                {betData.tx_hash}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Verification Details */}
      <div className="space-y-6">
        {/* Data Presence Check */}
        <div className="bg-casino-card border border-casino-border rounded-lg p-6">
          <h3 className="text-lg font-bold text-white mb-4">
            1. Data Presence Check
            <span className="ml-2">
              {verification.dataPresence.status === 'Complete' ? 
                <CheckIcon className="text-green-400 inline" size={16} /> : 
                verification.dataPresence.status === 'Partial' ? 
                <WarningIcon className="text-yellow-400 inline" size={16} /> : 
                <CancelIcon className="text-red-400 inline" size={16} />
              }
            </span>
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left py-2 text-white/70">Component</th>
                  <th className="text-left py-2 text-white/70">Status</th>
                </tr>
              </thead>
              <tbody className="space-y-2">
                <tr>
                  <td className="py-2 text-white">VRF Output</td>
                  <td className="py-2">
                    <span className="flex items-center gap-2">
                      {verification.dataPresence.vrfOutput ? 
                        <><CheckIcon className="text-green-400" size={16} /> Present</> : 
                        <><CancelIcon className="text-red-400" size={16} /> Missing</>
                      }
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-2 text-white">VRF Proof</td>
                  <td className="py-2">
                    <span className="flex items-center gap-2">
                      {verification.dataPresence.vrfProof ? 
                        <><CheckIcon className="text-green-400" size={16} /> Present</> : 
                        <><CancelIcon className="text-red-400" size={16} /> Missing</>
                      }
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-2 text-white">Transaction Hash</td>
                  <td className="py-2">
                    <span className="flex items-center gap-2">
                      {verification.dataPresence.txHash ? 
                        <><CheckIcon className="text-green-400" size={16} /> Present</> : 
                        <><CancelIcon className="text-red-400" size={16} /> Missing</>
                      }
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-2 text-white">Game Result</td>
                  <td className="py-2">
                    <span className="flex items-center gap-2">
                      {verification.dataPresence.gameResult ? 
                        <><CheckIcon className="text-green-400" size={16} /> Present</> : 
                        <><CancelIcon className="text-red-400" size={16} /> Missing</>
                      }
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Result Derivation */}
        <div className="bg-casino-card border border-casino-border rounded-lg p-6">
          <h3 className="text-lg font-bold text-white mb-4">
            2. Result Derivation Validation
            {verification.resultDerivation.supported && (
              <span className="ml-2">
                {verification.resultDerivation.matches ? 
                  <CheckIcon className="text-green-400 inline" size={16} /> : 
                  <CancelIcon className="text-red-400 inline" size={16} />
                }
              </span>
            )}
          </h3>

          {!verification.resultDerivation.supported ? (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded p-4">
              <p className="text-yellow-400 flex items-center gap-2">
                <WarningIcon size={16} /> {verification.resultDerivation.error || 'Verification not supported for this game type'}
              </p>
            </div>
          ) : verification.resultDerivation.error ? (
            <div className="bg-red-500/10 border border-red-500/20 rounded p-4">
              <p className="text-red-400 flex items-center gap-2">
                <CancelIcon size={16} /> {verification.resultDerivation.error}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Result Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/5 rounded p-4">
                  <h4 className="text-white/70 mb-2">Calculated Result</h4>
                  <p className="text-white font-bold">{verification.resultDerivation.calculatedResult?.toUpperCase()}</p>
                </div>
                <div className="bg-white/5 rounded p-4">
                  <h4 className="text-white/70 mb-2">Actual Result</h4>
                  <p className="text-white font-bold">{verification.resultDerivation.actualResult?.toUpperCase()}</p>
                </div>
              </div>

              {/* Match Status */}
              <div className={`p-4 rounded border ${verification.resultDerivation.matches ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                <p className={`flex items-center gap-2 ${verification.resultDerivation.matches ? 'text-green-400' : 'text-red-400'}`}>
                  {verification.resultDerivation.matches ? 
                    <><CheckIcon size={16} /> MATCH - Result verification successful</> : 
                    <><CancelIcon size={16} /> MISMATCH - Results do not match</>
                  }
                </p>
              </div>

              {/* Process Steps */}
              {verification.resultDerivation.process && (
                <div className="bg-white/5 rounded p-4">
                  <h4 className="text-white mb-3 font-semibold">Derivation Process:</h4>
                  <ol className="space-y-1 text-sm">
                    {verification.resultDerivation.process.map((step, index) => (
                      <li key={index} className="text-white/80 font-mono">
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Verify;