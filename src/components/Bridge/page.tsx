import React, { useState, useEffect } from 'react';
// import { ArrowUpDown, Wallet, ChevronDown } from 'lucide-react';

import SwapVertIcon from "@mui/icons-material/SwapVert";
import data from "../tokenlist.json";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
// Define proper types for our data structure
interface Token {
  name: string;
  ticker: string;
  address: string;
}

interface ChainData {
  chainID: string;
  chainName: string;
  tokens: Token[];
  img: string;
}

// Type assertion for imported data
const chainData = data as unknown as ChainData[];

const BridgeComponent = () => {
  const [fromChain, setFromChain] = useState<string>(chainData[0].chainName);
  const [toChain, setToChain] = useState<string>(chainData[1].chainName);
  const [fromToken, setFromToken] = useState<string>(chainData[0].tokens[0].ticker);
  const [toToken, setToToken] = useState<string>(chainData[1].tokens[0].ticker);
  const [amount, setAmount] = useState<string>('');
  const [fromTokens, setFromTokens] = useState<Token[]>(chainData[0].tokens);
  const [toTokens, setToTokens] = useState<Token[]>(chainData[1].tokens);

  // Calculate USD value based on a mock price (in reality, you'd fetch this)
  const getUsdValue = (amt: string): number => {
    const value = parseFloat(amt || '0') * 100; // Mock price of $100 per token
    return isNaN(value) ? 0 : value;
  };

  const handleFromChainChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const chain = e.target.value;
    const chainData = data.find((c) => c.chainName === chain);
    
    if (!chainData) {
      console.error(`Chain data not found for chain: ${chain}`);
      return;
    }
    
    setFromChain(chain);
    setFromTokens(chainData.tokens);
    // Safely set the first token if available, otherwise keep current
    if (chainData.tokens.length > 0) {
      setFromToken(chainData.tokens[0].ticker);
    }
  };

  const handleToChainChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const chain = e.target.value;
    const chainData = data.find((c) => c.chainName === chain);
    
    if (!chainData) {
      console.error(`Chain data not found for chain: ${chain}`);
      return;
    }
    
    setToChain(chain);
    setToTokens(chainData.tokens);
    // Safely set the first token if available, otherwise keep current
    if (chainData.tokens.length > 0) {
      setToToken(chainData.tokens[0].ticker);
    }
  };

  const handleSwap = () => {
    // Get current chain data for validation
    const currentFromChainData = data.find((c) => c.chainName === fromChain);
    const currentToChainData = data.find((c) => c.chainName === toChain);

    if (!currentFromChainData || !currentToChainData) {
      console.error('Invalid chain data during swap');
      return;
    }

    setFromChain(toChain);
    setToChain(fromChain);
    setFromToken(toToken);
    setToToken(fromToken);
    setFromTokens(toTokens);
    setToTokens(fromTokens);
  };

  const handleMaxAmount = () => {
    setAmount('1000'); // Mock maximum amount
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow valid numbers
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  // Get chain image safely
  const getChainImage = (chainName: string): string => {
    const chain = data.find((c) => c.chainName === chainName);
    return chain?.img || '/default-chain-icon.png'; // Provide a default image path
  };

  // Validate if the form is ready for submission
  const isFormValid = (): boolean => {
    const amountNum = parseFloat(amount);
    return amount !== '' && 
           !isNaN(amountNum) && 
           amountNum > 0 && 
           fromChain !== toChain &&
           fromToken !== '';
  };

  return (
    <div className="w-full max-w-xl mb-10 mx-auto p-6 rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 shadow-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Bridge</h1>
        <p className="text-gray-400 text-sm">Transfer tokens across chains</p>
      </div>

      {/* From Section */}
      <div className="bg-gray-800/50 p-4 rounded-lg mb-2">
        <div className="flex justify-between mb-2">
          <span className="text-gray-400 text-sm">From</span>
          <button 
            onClick={handleMaxAmount} 
            className="text-blue-400 text-sm hover:text-blue-300 transition-colors"
          >
            Balance: 1,000
          </button>
        </div>
        
        <div className="flex gap-2">
          <div className="flex-1">
            <div className="relative">
              <select
                value={fromChain}
                onChange={handleFromChainChange}
                className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {chainData.map(chain => (
                  <option key={chain.chainID} value={chain.chainName}>
                    {chain.chainName}
                  </option>
                ))}
              </select>
              <ArrowDropDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <img
                src={getChainImage(fromChain)}
                alt=""
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full"
              />
            </div>
          </div>
          
          <div className="flex-1">
            <select
              value={fromToken}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFromToken(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {fromTokens.map(token => (
                <option key={token.ticker} value={token.ticker}>
                  {token.ticker}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-3">
          <input
            type="text"
            value={amount}
            onChange={handleAmountChange}
            placeholder="0.0"
            className="w-full bg-transparent text-2xl text-white placeholder-gray-500 focus:outline-none"
          />
          <div className="text-gray-400 text-sm mt-1">
            ≈ ${getUsdValue(amount).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Swap Button */}
      <div className="relative h-0">
        <button
          onClick={handleSwap}
          className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors border border-gray-600 z-10"
        >
          <SwapVertIcon className="w-5 h-5 text-blue-400" />
        </button>
      </div>

      {/* To Section */}
      <div className="bg-gray-800/50 p-4 rounded-lg mt-2">
        <div className="mb-2">
          <span className="text-gray-400 text-sm">To</span>
        </div>
        
        <div className="flex gap-2">
          <div className="flex-1">
            <div className="relative">
              <select
                value={toChain}
                onChange={handleToChainChange}
                className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {chainData.map(chain => (
                  <option key={chain.chainID} value={chain.chainName}>
                    {chain.chainName}
                  </option>
                ))}
              </select>
              <ArrowDropDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <img
                src={getChainImage(toChain)}
                alt=""
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full"
              />
            </div>
          </div>
          
          <div className="flex-1">
            <select
              value={toToken}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setToToken(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {toTokens.map(token => (
                <option key={token.ticker} value={token.ticker}>
                  {token.ticker}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-3">
          <div className="text-2xl text-white">
            {amount || '0.0'}
          </div>
          <div className="text-gray-400 text-sm mt-1">
            ≈ ${getUsdValue(amount).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Exchange Button */}
      <button 
        className="w-full mt-6 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!isFormValid()}
      >
        Bridge Tokens
      </button>
    </div>
  );
};

export default BridgeComponent;