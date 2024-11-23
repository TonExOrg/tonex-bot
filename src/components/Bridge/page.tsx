"use client";
import React, { useState, useEffect } from 'react';
import SwapVertIcon from "@mui/icons-material/SwapVert";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import data from "../tokenlist.json";
import "buffer";
// import { SendTon } from './SendTon';
// import {SendTon} from  "../../../../Ton-Contracts/wrappers/SendTon";
import {run} from "../../../../Ton-Contracts/scripts/sendTon"
import {ST1} from "../../../../Ton-Contracts/build/ST1/tact_ST1"
import {
  TonConnectUI,
  useTonConnectUI,
  useTonWallet,
} from "@tonconnect/ui-react";
import {
  Address,
  beginCell,
  Sender,
  SenderArguments,
  storeStateInit,
  toNano,
  TonClient,
} from "@ton/ton";
import { TonClient4 } from 'ton';
// import { useGetSender } from '@/hooks/useTonClient';

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

class TonConnectProvider implements Sender {
  /**
   * The TonConnect UI instance.
   * @private
   */
  private readonly provider: TonConnectUI;

  /**
   * The address of the current account.
   */
  public get address(): Address | undefined {
    const address = this.provider.account?.address;
    return address ? Address.parse(address) : undefined;
  }

  /**
   * Creates a new TonConnectProvider.
   * @param provider
   */
  public constructor(provider: TonConnectUI) {
    this.provider = provider;
  }

  /**
   * Sends a message using the TonConnect UI.
   * @param args
   */
  public async send(args: SenderArguments): Promise<void> {
    // The transaction is valid for 10 minutes.
    const validUntil = Math.floor(Date.now() / 1000) + 600;

    // The address of the recipient, should be in bounceable format for all smart contracts.
    const address = args.to.toString({ urlSafe: true, bounceable: true });

    // The address of the sender, if available.
    const from = this.address?.toRawString();

    // The amount to send in nano tokens.
    const amount = args.value.toString();

    // The state init cell for the contract.
    let stateInit: string | undefined;
    if (args.init) {
      // State init cell for the contract.
      const stateInitCell = beginCell()
        .store(storeStateInit(args.init))
        .endCell();
      // Convert the state init cell to boc base64.
      stateInit = stateInitCell.toBoc().toString("base64");
    }

    // The payload for the message.
    let payload: string | undefined;
    if (args.body) {
      // Convert the message body to boc base64.
      payload = args.body.toBoc().toString("base64");
    }

    // Send the message using the TonConnect UI and wait for the message to be sent.
    await this.provider.sendTransaction({
      validUntil: validUntil,
      from: from,
      messages: [
        {
          address: address,
          amount: amount,
          stateInit: stateInit,
          payload: payload,
        },
      ],
    });
  }
}


const CONTRACT_ADDRESS = "EQCqFVMpbj-IfUUteW_ZZ57PQ2BFWb4IsCqz52G-t8ebicjO";

const getCounterInstance = async () => {
  const client = new TonClient({
    endpoint: "https://testnet.toncenter.com/api/v2/jsonRPC",
  });
  // OR you can use createApi from @ton-community/assets-sdk
  // import {
  //   createApi,
  // } from "@ton-community/assets-sdk";

  // const NETWORK = "testnet";
  // const client = await createApi(NETWORK);


  const address = Address.parse(CONTRACT_ADDRESS);
  // run(client);
//   const provider = new TonConnectUI();
// // create a new instance of TonConnectProvider
//   const sender = new TonConnectProvider(provider);
  const counterInstance = client.open(ST1.fromAddress(
        Address.parse(CONTRACT_ADDRESS)
    ) as any);

  return counterInstance;     
};



const chainData = data as unknown as ChainData[];

const BridgeComponent = () => {
  const [tonConnectUI, setOptions] = useTonConnectUI();
  const wallet = useTonWallet();
  const [fromChain, setFromChain] = useState<string>(chainData[0].chainName);
  const [toChain, setToChain] = useState<string>(chainData[1].chainName);
  const [fromToken, setFromToken] = useState<string>(chainData[0].tokens[0].ticker);
  const [toToken, setToToken] = useState<string>(chainData[1].tokens[0].ticker);
  const [amount, setAmount] = useState<string>('');
  const [fromTokens, setFromTokens] = useState<Token[]>(chainData[0].tokens);
  const [toTokens, setToTokens] = useState<Token[]>(chainData[1].tokens);
  const [isLoading, setIsLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
    const [TonConnectUI] = useTonConnectUI();
function useConnection(): { sender: Sender } {

	return {
		sender: {
		  send: async (args: SenderArguments) => {
			TonConnectUI.sendTransaction({
			  messages: [
				{
				  address: args.to.toString(),
				  amount: args.value.toString(),
				  payload: args.body?.toBoc().toString("base64"),
				},
			  ],
			  validUntil: Date.now() + 6 * 60 * 1000, 
			});
		  },
		},
	  };
}
  const increaseCount = async (amount: String) => {
    const counterInstance = await getCounterInstance();
    const sender = new TonConnectProvider(tonConnectUI);
    const getSender =  useConnection();
    await counterInstance.send(
        useConnection().sender,
        {
            value: toNano(0.1), // toNano('0.1')  
        },
        {
            $$type: 'Withdraw',
            amount: toNano(amount.toString()),
        }
    );
    // await counterInstance.sendRequestTON(sender, toNano(amount.toString()));
  };

  const getCount = async () => {
    const counterInstance = await getCounterInstance();

    const count = await counterInstance.getBalance();
    console.log("count", count);
  };

  const getUsdValue = (amt: string): number => {
    const value = parseFloat(amt || '0') * 100;
    return isNaN(value) ? 0 : value;
  };

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

  const handleToChainChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const chain = e.target.value;
    const chainData = data.find((c) => c.chainName === chain);
    
    if (!chainData) return;
    
    setToChain(chain);
    setToTokens(chainData.tokens);
    if (chainData.tokens.length > 0) {
      setToToken(chainData.tokens[0].ticker);
    }
  };

  const handleSwap = () => {
    const currentFromChainData = data.find((c) => c.chainName === fromChain);
    const currentToChainData = data.find((c) => c.chainName === toChain);

    if (!currentFromChainData || !currentToChainData) return;

    // Add animation class
    const container = document.querySelector('.bridge-container');
    container?.classList.add('swap-animation');

    setTimeout(() => {
      setFromChain(toChain);
      setToChain(fromChain);
      setFromToken(toToken);
      setToToken(fromToken);
      setFromTokens(toTokens);
      setToTokens(fromTokens);
      
      // Remove animation class
      container?.classList.remove('swap-animation');
    }, 300);
  };

  const handleMaxAmount = () => {
    setAmount('1000');
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const getChainImage = (chainName: string): string => {
    const chain = data.find((c) => c.chainName === chainName);
    return chain?.img || 'https://e7.pngegg.com/pngimages/944/167/png-clipart-blockchain-computer-icons-blockchain-miscellaneous-angle-thumbnail.png';
  };

  const isFormValid = (): boolean => {
    const amountNum = parseFloat(amount);
    return amount !== '' && 
           !isNaN(amountNum) && 
           amountNum > 0 && 
           fromChain !== toChain &&
           fromToken !== '';
  };

  const handleBridge = async () => {
    if (!isFormValid()) return;

    getCount();
    increaseCount("0.5");

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Show success message or handle next steps
    }, 2000);
  };

  return (
    <div className="bridge-container w-full max-w-xl mx-auto p-4 sm:p-6 rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 shadow-2xl transition-all duration-300">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Bridge</h1>
            <p className="text-gray-400 text-sm">Transfer tokens across chains</p>
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
              <div className="absolute right-0 mt-2 p-2 bg-gray-800 text-sm text-gray-300 rounded-lg shadow-xl z-10 w-48">
                Bridge tokens securely across different chains
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
                {chainData.map(chain => (
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
                {fromTokens.map(token => (
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
            ≈ ${getUsdValue(amount).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Swap Button */}
      <div className="relative h-0">
        <button
          onClick={handleSwap}
          className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-all duration-300 border border-gray-600 z-10 hover:scale-110 active:scale-95"
        >
          <SwapVertIcon className="text-blue-400 hover:text-blue-300 transition-colors" />
        </button>
      </div>

      {/* To Section */}
      <div className="bg-gray-800/50 p-4 rounded-lg mt-2 hover:bg-gray-800/60 transition-colors">
        <div className="mb-2">
          <span className="text-gray-400 text-sm">To</span>
        </div>
        
        <div className="flex gap-2 flex-col sm:flex-row">
          <div className="flex-1">
            <div className="relative group">
              <select
                value={toChain}
                onChange={handleToChainChange}
                className="w-full pl-10 pr-8 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-gray-500 transition-colors"
              >
                {chainData.map(chain => (
                  <option key={chain.chainID} value={chain.chainName}>
                    {chain.chainName}
                  </option>
                ))}
              </select>
              <ArrowDropDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-white transition-colors" />
              <img
                src={getChainImage(toChain)}
                alt=""
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full"
              />
            </div>
          </div>
          
          <div className="flex-1">
            <div className="relative group">
              <select
                value={toToken}
                onChange={(e) => setToToken(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-gray-500 transition-colors"
              >
                {toTokens.map(token => (
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
          <div className="text-2xl text-white">
            {amount || '0.0'}
          </div>
          <div className="text-gray-400 text-sm mt-1">
            ≈ ${getUsdValue(amount).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Bridge Button */}
      <button 
        onClick={handleBridge}
        disabled={!isFormValid() || isLoading}
        className="w-full mt-6 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden"
      >
        {isLoading ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin" />
            <span>Processing...</span>
          </div>
        ) : (
          'Bridge Tokens'
        )}
      </button>
    </div>
  );
};

export default BridgeComponent;