"use client";
import React, { useState } from "react";
import Image from "next/image";

import { TonConnectButton, TonConnectUIProvider } from "@tonconnect/ui-react";
import SignalCellularAltIcon from "@mui/icons-material/SignalCellularAlt";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import SwapCallsIcon from "@mui/icons-material/SwapCalls";
import CreditScore from "@/components/CreditScore/page";
import CCIPUI from "@/components/Synthetic/page";
import Bridge from "@/components/Bridge/page";
import Collateral from "@/components/Collateral/page";
import bridgeImage from "@/app/_assets/bridge.png";

const Home = () => {
  const [activeView, setActiveView] = useState("creditScore");

  const handleViewChange = (view: string) => {
    setActiveView(view);
  };

  return (
    <TonConnectUIProvider manifestUrl="https://blush-major-turkey-395.mypinata.cloud/ipfs/QmetdVVHN5ttyi4tv4yGb3u6ugAihfu6ZjHUUfHhJz1ko7">
      <div className="min-h-screen flex flex-col bg-gradient-to-r from-[#1f2937] to-[#334155] ">
        {/* Top Bar Section */}
        <div className="flex justify-between items-center bg-blue-500 text-white p-4">
          <div className="text-xl font-semibold">Host Name</div>
          <TonConnectButton className="ton-connect-button" />
        </div>

        {/* Middle View Section */}
        <div className="flex-grow p-6 gap-8">
          {activeView === "creditScore" && (
            <div className="flex flex-col justify-between items-center">
              <div>
                <CreditScore />
              </div>
              <div className="mt-2 mb-40">
                <Collateral />
              </div>
            </div>
          )}
          {activeView === "exchange" && (
            <div className="col-span-2">
              <CCIPUI />
            </div>
          )}
          {activeView === "swap" && (
            <div className="col-span-2">
              <Bridge />
            </div>
          )}
        </div>
        {/* Bottom Navigation Section */}
        <div className="fixed bottom-5 left-0 right-0 flex flex-col items-center">
          <div className="bg-gray-700 w-[92%] text-white p-4 rounded-xl shadow-lg flex justify-between space-x-4">
            <button
              className={`flex-1 text-center py-3 px-4 rounded-lg transition-all duration-300 ease-in-out ${
                activeView === "creditScore"
                  ? "bg-blue-500 scale-105"
                  : "bg-gray-600 hover:bg-gray-500"
              }`}
              onClick={() => handleViewChange("creditScore")}
            >
              <SignalCellularAltIcon />
            </button>
            <button
              className={`flex-1 text-center py-3 px-4 rounded-lg transition-all duration-300 ease-in-out ${
                activeView === "exchange"
                  ? "bg-blue-500 scale-105"
                  : "bg-gray-600 hover:bg-gray-500"
              }`}
              onClick={() => handleViewChange("exchange")}
            >
              <SwapCallsIcon />
            </button>
            <button
              className={`flex-1 text-center py-3 px-4 rounded-lg transition-all duration-300 ease-in-out ${
                activeView === "swap"
                  ? "bg-blue-500 scale-105"
                  : "bg-gray-600 hover:bg-gray-500"
              }`}
              onClick={() => handleViewChange("swap")}
            >
              <div className="flex items-center justify-center">
                <Image src={bridgeImage} alt="bridge" width={32} height={32} />
              </div>
            </button>
          </div>
        </div>
      </div>
    </TonConnectUIProvider>
  );
};

export default Home;
