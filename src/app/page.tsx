"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  TonConnectButton,
  TonConnectUIProvider,
  useTonConnectUI,
  useTonWallet,
} from "@tonconnect/ui-react";
import SignalCellularAltIcon from "@mui/icons-material/SignalCellularAlt";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import SwapCallsIcon from "@mui/icons-material/SwapCalls";
import CreditScore from "@/components/CreditScore/page";
import CCIPUI from "@/components/Synthetic/page";
import Bridge from "@/components/Bridge/page";
import Collateral from "@/components/Collateral/page";
import bridgeImage from "@/app/_assets/bridge.png";
import { log } from "console";
import WebApp from "@twa-dev/sdk";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const Home = () => {
  const [activeView, setActiveView] = useState("creditScore");
  // const wallet = useTonWallet();

  const handleViewChange = (view: string) => {
    setActiveView(view);
  };
  const [name, setName] = useState<string | null>("User");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const firstName = WebApp.initDataUnsafe.user?.first_name || "";
      const lastName = WebApp.initDataUnsafe.user?.last_name || "";
      const full_name = `${firstName} ${lastName}`.trim();
      setName(full_name || "User");
    }
  }, []);
  return (
    <>
      <TonConnectUIProvider manifestUrl="https://blush-major-turkey-395.mypinata.cloud/ipfs/QmetdVVHN5ttyi4tv4yGb3u6ugAihfu6ZjHUUfHhJz1ko7">
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 overflow-x-hidden">
          {/* Top Bar Section */}
          <div className="glass-effect flex flex-col sm:flex-row justify-between items-center p-3 sm:p-4 animate-fade-in space-y-2 sm:space-y-0">
            <div className="text-lg sm:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Hey,{name}
            </div>
            <div className="w-full sm:w-auto flex justify-center">
              <TonConnectButton className="ton-connect-button hover-scale transform-none sm:transform" />
            </div>
           c <div className="ml-auto flex items-center ">
              <ConnectButton accountStatus={"avatar"} chainStatus={"icon"} />
            </div>
          </div>

          {/* Middle View Section */}
          <div className="flex-grow px-3 sm:px-6 py-4 sm:py-6 gap-4 sm:gap-8 animate-slide-up overflow-y-auto pb-32">
            {activeView === "creditScore" && (
              <div className="flex flex-col justify-between items-center space-y-4 sm:space-y-6">
                <div className="w-full glass-effect p-4 sm:p-6 rounded-xl sm:rounded-2xl hover-scale">
                  <CreditScore />
                </div>
                <div className="w-full glass-effect p-4 sm:p-6 rounded-xl sm:rounded-2xl hover-scale">
                  <Collateral />
                </div>
              </div>
            )}
            {activeView === "exchange" && (
              <div className="w-full glass-effect p-4 sm:p-6 rounded-xl sm:rounded-2xl hover-scale">
                <CCIPUI />
              </div>
            )}
            {activeView === "swap" && (
              <div className="w-full glass-effect p-4 sm:p-6 rounded-xl sm:rounded-2xl hover-scale">
                <Bridge />
              </div>
            )}
          </div>

          {/* Bottom Navigation Section */}
          <div className="fixed bottom-4 sm:bottom-8 left-0 right-0 flex flex-col items-center animate-fade-in px-3 sm:px-0">
            <div className="glass-effect w-full sm:w-[92%] max-w-md p-3 sm:p-4 rounded-2xl shadow-lg">
              <div className="flex justify-between items-center space-x-2 sm:space-x-4">
                <button
                  className={`flex-1 text-center py-2.5 sm:py-3 px-2 sm:px-4 rounded-xl transition-all duration-300 ease-in-out hover-scale
                ${
                  activeView === "creditScore"
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg"
                    : "bg-gray-800/50 hover:bg-gray-700/50"
                }`}
                  onClick={() => handleViewChange("creditScore")}
                >
                  <SignalCellularAltIcon className="text-white text-xl sm:text-2xl" />
                </button>
                <button
                  className={`flex-1 text-center py-2.5 sm:py-3 px-2 sm:px-4 rounded-xl transition-all duration-300 ease-in-out hover-scale
                ${
                  activeView === "exchange"
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg"
                    : "bg-gray-800/50 hover:bg-gray-700/50"
                }`}
                  onClick={() => handleViewChange("exchange")}
                >
                  <SwapCallsIcon className="text-white text-xl sm:text-2xl" />
                </button>
                <button
                  className={`flex-1 text-center py-2.5 sm:py-3 px-2 sm:px-4 rounded-xl transition-all duration-300 ease-in-out hover-scale
                ${
                  activeView === "swap"
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg"
                    : "bg-gray-800/50 hover:bg-gray-700/50"
                }`}
                  onClick={() => handleViewChange("swap")}
                >
                  <div className="flex items-center justify-center">
                    <Image
                      src={bridgeImage}
                      alt="bridge"
                      className="w-6 h-6 sm:w-8 sm:h-8 transition-transform hover:scale-110"
                    />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </TonConnectUIProvider>
    </>
  );
};

export default Home;
