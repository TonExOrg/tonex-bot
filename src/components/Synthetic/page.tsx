"use client";
import React, { useState, useEffect } from "react";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import data from "../tokenlist.json";
import { get } from "http";
import { fromNano } from '@ton/core';
// import { JettonMinter, mintBody } from '../../../../Ton-Contracts/wrappers/JettonMinter';
import { JettonMinter } from './wrappers/JettonMinter';
import '../../../../Ton-Contracts/scripts/deployMint'
// import { JettonMinter } from "../../../../Ton-Contracts/wrappers/JettonMinter";
import {
  SendTransactionRequest,
  TonConnect,
  TonConnectUI,
  TonConnectUIProvider,
  useTonAddress,
  useTonConnectUI,
  useTonWallet,
} from "@tonconnect/ui-react";
import {
  Address,
  beginCell,
  OpenedContract,
  Sender,
  SenderArguments,
  storeStateInit,
  toNano,
  TonClient,
} from "@ton/ton";
import { Wallet } from "ethers";
import { useTonConnect } from "@/hooks/useTonConnect";
import { useAsyncInitialize } from "@/hooks/useAsyncInitialize";
import { useTonClient } from "@/hooks/useTonClient";

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

const chainData = data as unknown as ChainData[];

// Define TON chain data
const tonChainData = {
  chainID: "ton",
  chainName: "TON",
  img: "https://cryptologos.cc/logos/toncoin-ton-logo.svg?v=035", // Make sure to add TON logo to public folder
  tokens: [
    {
      name: "TONex",
      ticker: "TONex",      
      address: "0x...",
    },
  ],
};

const tokenAddressMap: { [key: string]: string } = {
  "eth": "EQBd-WK72MdjLDMg0-19vXo0CYnFoXHcMSdUWj45TrzA3CDg",
  "key2": "value2",
  "key3": "value3"
};

const contractAddress = Address.parse('EQBd-WK72MdjLDMg0-19vXo0CYnFoXHcMSdUWj45TrzA3CDg');
  
const getCounterInstance = async () => {
  const client = new TonClient({
    endpoint: "https://testnet.toncenter.com/api/v2/jsonRPC",
  });

  // const c = client.provider();
  // OR you can use createApi from @ton-community/assets-sdk
  // import {
  //   createApi,
  // } from "@ton-community/assets-sdk";

  // const NETWORK = "testnet";
  // const client = await createApi(NETWORK);


  // const address = Address.parse(CONTRACT_ADDRESS);
  // run(client);
    // const provider = new TonConnectUI();
// // create a new instance of TonConnectProvider;
  // const sender = new TonConnectUIProvider(provider);
  client.isContractDeployed(contractAddress).then((res) => {
    console.log(`Contract is deployed: ${res}`);
  });
  const counterInstance = client.open(JettonMinter.createFromAddress(contractAddress) as any,
    );

  return counterInstance;     
};

const Synthetic = () => {
  const [fromChain, setFromChain] = useState<string>(chainData[0].chainName);`  `
  const [fromToken, setFromToken] = useState<string>(
    chainData[0].tokens[0].ticker
  );
  const [amount, setAmount] = useState<string>("");
  const [fromTokens, setFromTokens] = useState<Token[]>(chainData[0].tokens);
  const [synTokenName, setSynTokenName] = useState<string>("---");
  const [isLoading, setIsLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
const [tonconnect] = useTonConnectUI();
  const getUsdValue = (amt: string): number => {
    const value = parseFloat(amt || "0") * 100;
    return isNaN(value) ? 0 : value;
  };
  const client = useTonClient();
  const {sender} = useTonConnect();
  // const getTokenName = () => {
  //   if (fromToken === "WETH") setSynTokenName("TnWETH");
  //   else if (fromToken === "ETH") setSynTokenName("TnETH");
  //   else if (fromToken === "USDC") setSynTokenName("TnUSDC");
  //   else if (fromToken === "WBTC") setSynTokenName("TnWBTC");
  //   else if (fromToken === "USDT") setSynTokenName("TnUSDT");
  //   else setSynTokenName("---");
  //   return synTokenName;
  // }

  const handleFromChainChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const chain = e.target.value;
    const chainData = data.find((c) => c.chainName === chain);

    if (!chainData) return;

    setFromChain(chain);
    setFromTokens(chainData.tokens);
    if (chainData.tokens.length > 0) {
      setFromToken(chainData.tokens[0].ticker);
    }
  };

  const handleMaxAmount = () => {
    setAmount("1000");
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const getChainImage = (chainName: string): string => {
    if (chainName === "TON") return tonChainData.img;
    const chain = data.find((c) => c.chainName === chainName);
    return (
      chain?.img ||
      "https://e7.pngegg.com/pngimages/944/167/png-clipart-blockchain-computer-icons-blockchain-miscellaneous-angle-thumbnail.png"
    );
  };

  const isFormValid = (): boolean => {
    const amountNum = parseFloat(amount);
    return (
      amount !== "" && !isNaN(amountNum) && amountNum > 0 && fromToken !== ""
    );
  };

  const wallet = useTonWallet();
    
  const handleSynthesize = async () => {
    if (!isFormValid()) return;
    
    let address = wallet?.account?.address as string;
    let senderAddress = Address.parse(address);
    console.log(`address ${address} ${senderAddress}`);
    // let senderAddress = senderAddress; // Modify this to another address if you want to mint to someone else
    let mintAmount = 1;
    const jettonMinter = await getCounterInstance();  
    if(!jettonMinter) return;
    const supplyBefore = await jettonMinter.getTotalSupply();
    const nanoMint = toNano(mintAmount);

    console.log("Sending transaction. Approve in your wallet...");
    const res = await jettonMinter.sendMint(sender, contractAddress, senderAddress, nanoMint, toNano('0.05'), toNano('0.1'));
    
    // const tx: SendTransactionRequest = {
    //   validUntil: Date.now() + 5 * 60 * 1000,
    //   messages: [
    //     {
    //       address: contractAddress.toString(),
    //       amount: toNano(0.04).toString(),
    //       stateInit: undefined,
    //       payload: mintBody(senderAddress, nanoMint, toNano(0.02), 0)
    //         .toBoc()
    //         .toString("base64"),
    //     },
    //   ],
    // };

    // await tonconnect.sendTransaction(tx);
    
    console.log("Sent transaction");

    console.log("Minting ${mintAmount} tokens to ${senderAddress} and waiting 20s...");

    await new Promise((resolve) => setTimeout(resolve, 20000));
    const supplyAfter = await jettonMinter.getTotalSupply();

    if (supplyAfter == supplyBefore + nanoMint) {
        const totalSupply = Number(fromNano(supplyAfter));
        console.log('Mint successful!');  
        // console.log(`Current supply: ${totalSupply} tokens (${totalSupply} ETH ≈ $${(totalSupply * ethPrice).toFixed(2)})`);
    } else {
        console.log('Mint failed!');
    }
    
    //TODO: Add EVM provider for token collection
    // const wallet = useTonWallet();
    // const provider = wallet?.provider;
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Show success message or handle next steps
    }, 2000);
  };

  return (
    <div className="synthetic-container w-full max-w-xl mx-auto p-4 sm:p-6 rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 shadow-2xl transition-all duration-300">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">
              Synthetic Token
            </h1>
            <p className="text-gray-400 text-sm">
              Convert tokens to TONex synthetic tokens
            </p>
          </div>
          <div className="relative">
            <button
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className="p-2 rounded-full hover:bg-gray-700/50 transition-colors"
            >
              <InfoOutlinedIcon className="text-gray-400 hover:text-white transition-colors" />
            </button>
            {showTooltip && (
              <div className="absolute right-0 mt-2 p-2 bg-gray-800 text-sm text-gray-300 rounded-lg shadow-xl z-10 w-64">
                Create synthetic tokens on TON blockchain representing tokens
                from other chains
              </div>
            )}
          </div>
        </div>
      </div>

      {/* From Section */}
      <div className="bg-gray-800/50 p-4 rounded-lg mb-2 hover:bg-gray-800/60 transition-colors">
        <div className="flex justify-between mb-2">
          <span className="text-gray-400 text-sm">From</span>
          <button
            onClick={handleMaxAmount}
            className="flex items-center space-x-1 text-blue-400 text-sm hover:text-blue-300 transition-colors"
          >
            <AccountBalanceWalletOutlinedIcon className="w-4 h-4" />
            <span>Balance: 1,000</span>
          </button>
        </div>

        <div className="flex gap-2 flex-col sm:flex-row">
          <div className="flex-1">
            <div className="relative group">
              <select
                value={fromChain}
                onChange={handleFromChainChange}
                className="w-full pl-10 pr-8 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-gray-500 transition-colors"
              >
                {chainData.map((chain) => (
                  <option key={chain.chainID} value={chain.chainName}>
                    {chain.chainName}
                  </option>
                ))}
              </select>
              <ArrowDropDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-white transition-colors" />
              <img
                src={getChainImage(fromChain)}
                alt=""
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full"
              />
            </div>
          </div>

          <div className="flex-1">
            <div className="relative group">
              <select
                value={fromToken}
                onChange={(e) => setFromToken(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-gray-500 transition-colors"
              >
                {fromTokens.map((token) => (
                  <option key={token.ticker} value={token.ticker}>
                    {token.ticker}
                  </option>
                ))}
              </select>
              <ArrowDropDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-white transition-colors" />
            </div>
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
            {/* ≈ ${getUsdValue(amount).toLocaleString()} */}
          </div>
        </div>
      </div>

      {/* Arrow Icon */}
      <div className="relative h-12 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-700"></div>
        </div>
        <div className="relative z-10 bg-gray-800 p-2 rounded-full">
          <SwapVertIcon className="text-blue-400 w-6 h-6" />
        </div>
      </div>

      {/* To Section (Fixed TON) */}
      <div className="bg-gray-800/50 p-4 rounded-lg mt-2 hover:bg-gray-800/60 transition-colors">
        <div className="mb-2">
          <span className="text-gray-400 text-sm">To</span>
        </div>

        <div className="flex gap-2 flex-col sm:flex-row">
          <div className="flex-1">
            <div className="relative">
              <div className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white cursor-not-allowed">
                TON
              </div>
              <img
                src={getChainImage("TON")}
                alt="TON"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full"
              />
            </div>
          </div>

          <div className="flex-1">
            <div className="relative">
              <div className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white cursor-not-allowed">
                Tn{fromToken || "0.0"}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3">
          <div className="text-2xl text-white">{amount || "0.0"}</div>
          <div className="text-gray-400 text-sm mt-1">
            {/* ≈ ${getUsdValue(amount).toLocaleString()} */}
          </div>
        </div>
      </div>

      {/* Synthesize Button */}
      <button
        onClick={handleSynthesize}
        disabled={!isFormValid() || isLoading}
        className="w-full mt-6 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden"
      >
        {isLoading ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin" />
            <span>Processing...</span>
          </div>
        ) : (
          "Create Synthetic Token"
        )}
      </button>
    </div>
  );
};

export default Synthetic;
