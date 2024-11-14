import React, { useState } from "react";
import data from "../tokenlist.json";
const SyntheticWallet = () => {
  const [fromChain, setFromChain] = useState(data[0].chainName);
  const [fromToken, setFromToken] = useState(data[0].tokens[0].name);
  const [toChain, setToChain] = useState(data[1].chainName);
  const [toToken, setToToken] = useState(data[1].tokens[0].name);
  const [amount, setAmount] = useState(500);
  const [amountInUsd, setAmountInUsd] = useState(50000);

  const [tokensForSelectedChain, setTokensForSelectedChain] = useState<
    string[]
  >(data[0].tokens.map((token) => token.ticker));

  const handleSwap = () => {
    setFromChain(toChain);
    setFromToken(toToken);
    // TON and TONex are fixed
  };

  const handleMaxClick = () => {
    setAmount(1000);
    setAmountInUsd(50000);
  };

  const handleChainChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedChain = e.target.value;
    setFromChain(selectedChain);

    // Find the selected chain and set its tokens
    const selectedChainData = data.find(
      (chain) => chain.chainName === selectedChain
    );
    if (selectedChainData) {
      setTokensForSelectedChain(
        selectedChainData.tokens.map((token) => token.ticker)
      ); // Assuming `ticker` is the token identifier
    }
    setFromToken(""); // Reset the token selection when the chain changes
  };
  const handleAmountChange = (value: string) => {
    setAmount(parseInt(value));
    setAmountInUsd(parseInt(value) * 100);
  };

  return (
    <div className="p-6 bg-gradient-to-r from-[#1f2937] to-[#334155] rounded-lg shadow-lg max-w-lg mx-auto text-white">
      <h2 className="text-3xl font-semibold mb-4">Bridge</h2>

      <div className="flex flex-col items-center space-y-4 mb-4">
        {/* From Chain and Token Selection */}
        <div className="flex space-x-4 w-full">
          <div className="flex-1 relative">
            {/* Chain Icon and Select */}
            <img
              src={
                data.find((chain) => chain.chainName === fromChain)?.img ||
                data[0].img
              }
              alt={`${fromChain} icon`}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 w-6 h-6"
            />
            <select
              className="w-full pl-10 p-2 border border-gray-500 rounded-md bg-gray-700 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={fromChain}
              onChange={handleChainChange}
            >
              {data.map((chain) => (
                <option key={chain.chainID} value={chain.chainName}>
                  {chain.chainName}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1 relative">
            {/* Token Select */}
            <select
              className="w-full pl-10 p-2 border border-gray-500 rounded-md bg-gray-700 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={fromToken}
              onChange={(e) => setFromToken(e.target.value)}
            >
              {tokensForSelectedChain.map((tokenTicker) => (
                <option key={tokenTicker} value={tokenTicker}>
                  {tokenTicker}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Swap Button */}
        <button
          onClick={handleSwap}
          className="py-2 px-4 bg-gray-700 text-gray-300 rounded-full hover:bg-gray-600 transition"
        >
          ⇅
        </button>

        {/* To Chain and Token Selection */}
        <div className="flex space-x-4 w-full">
          <div className="flex-1 relative">
            {/* Chain Icon and Select */}
            <img
              src={
                data.find((chain) => chain.chainName === toChain)?.img ||
                data[0].img
              }
              alt={`${toChain} icon`}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 w-6 h-6"
            />
            <select
              className="w-full pl-10 p-2 border border-gray-500 rounded-md bg-gray-700 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={toChain}
              onChange={handleChainChange}
            >
              {data.map((chain) => (
                <option key={chain.chainID} value={chain.chainName}>
                  {chain.chainName}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1 relative">
            {/* Token Select */}
            <select
              className="w-full pl-10 p-2 border border-gray-500 rounded-md bg-gray-700 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={toToken}
              onChange={(e) => setToToken(e.target.value)}
            >
              {tokensForSelectedChain.map((tokenTicker) => (
                <option key={tokenTicker} value={tokenTicker}>
                  {tokenTicker}
                </option>
              ))}
            </select>
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

        <div className="relative flex items-center space-x-2">
          <span className="absolute left-2 text-gray-300">$</span>
          <input
            type="text"
            className="pl-6 flex-1 p-2 border border-gray-500 rounded-md bg-gray-700 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Amount in USD"
            value={amountInUsd.toLocaleString()}
            readOnly
          />
        </div>
        <button className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
          Exchange
        </button>
      </div>
    </div>
  );
};

export default SyntheticWallet;
