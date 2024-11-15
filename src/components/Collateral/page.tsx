import React, { useState } from "react";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
const Collateral = () => {
  const [selectedChain, setSelectedChain] = useState("Ethereum");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const chains = ["Ethereum", "Avalanche", "Polygon", "Solana"];

  return (
    <div className="bg-gray-800 h-80 rounded-lg shadow-md flex flex-col justify-between p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-white font-bold">Borrow</h2>
        <div className="relative">
          <button
            className="bg-gray-700 text-white px-4 py-2 rounded-md flex items-center"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {selectedChain}
            <ArrowDropDownIcon className="ml-2 w-4 h-4" />
          </button>
          {isDropdownOpen && (
            <ul className="absolute top-full mt-2 bg-gray-700 text-white rounded-md overflow-hidden z-10">
              {chains.map((chain) => (
                <li
                  key={chain}
                  className="px-4 py-2 hover:bg-gray-600 cursor-pointer"
                  onClick={() => {
                    setSelectedChain(chain);
                    setIsDropdownOpen(false);
                  }}
                >
                  {chain}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="text-white text-center">
        <p>
          You borrowed on {selectedChain}{" "}
          <span className="text-4xl">500.00</span> TONEX
        </p>
      </div>
      <div className="flex justify-center space-x-4">
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md">
          BORROW
        </button>
        <button className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md">
          REPAY
        </button>
      </div>
    </div>
  );
};

export default Collateral;
