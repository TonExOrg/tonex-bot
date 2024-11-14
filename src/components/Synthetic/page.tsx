import React, { useState } from "react";

const SyntheticWallet = () => {
  const [fromChain, setFromChain] = useState("Solana");
  const [fromToken, setFromToken] = useState("SOL");
  const [toChain, setToChain] = useState("TON");
  const [toToken, setToToken] = useState("TONex");
  const [amount, setAmount] = useState(500);
  const [amountInUsd, setAmountInUsd] = useState(50000);

  const handleSwap = () => {
    setFromChain(toChain);
    setFromToken(toToken);
    // TON and TONex are fixed
  };

  const handleMaxClick = () => {
    setAmount(1000);
    setAmountInUsd(50000);
  };

  const handleAmountChange = (value: string) => {
    setAmount(parseInt(value));
    setAmountInUsd(parseInt(value) * 100);
  };

  return (
    <div className="p-6 bg-gradient-to-r from-[#1f2937] to-[#334155] rounded-lg shadow-lg max-w-lg mx-auto text-white">
      <h2 className="text-3xl font-semibold mb-4">Synthetic tokens</h2>

      <div className="flex items-center space-x-4 mb-4">
        <div className="flex-1">
          <select
            className="w-full p-2 border border-gray-500 rounded-md bg-gray-700 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
            value={fromChain}
            onChange={(e) => setFromChain(e.target.value)}
          >
            <option value="Solana">Solana</option>
            <option value="Ethereum">Ethereum</option>
            <option value="Bitcoin">Bitcoin</option>
          </select>

          <select
            className="w-full p-2 border border-gray-500 rounded-md bg-gray-700 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={fromToken}
            onChange={(e) => setFromToken(e.target.value)}
          >
            <option value="SOL">SOL</option>
            <option value="ETH">ETH</option>
            <option value="BTC">BTC</option>
          </select>
        </div>

        <button
          onClick={handleSwap}
          className="py-2 px-4 bg-gray-700 text-gray-300 rounded-full hover:bg-gray-600 transition"
        >
          ⇅
        </button>

        <div className="flex-1">
          <div className="w-full p-2 border border-gray-500 rounded-md bg-gray-700 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <div className="flex items-center justify-between">
              <span>TON </span>
              <span className="text-gray-400">TONex</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4 space-y-2">
        <div className="relative">
          <input
            type="number"
            className="w-full p-2 border border-gray-500 rounded-md bg-gray-700 text-2xl font-medium text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Amount"
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
          />
          <button
            onClick={handleMaxClick}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 text-sm focus:outline-none"
          >
            Max
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="text"
            className="flex-1 p-2 border border-gray-500 rounded-md bg-gray-700 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Amount in USD"
            value={amountInUsd.toLocaleString()}
            readOnly
          />
        </div>
        <button
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            Exchange
          </button>
      </div>
    </div>
  );
};

export default SyntheticWallet;
