'use client';

interface TonPriceResponse {
  rates: {
    TON: {
      prices: {
        USD: number;
      };
    };
  };
}

export const fetchTonPrice = async ()=> {
  try {
    const response = await fetch('https://tonapi.io/v2/rates?tokens=ton&currencies=usd');
    if (!response.ok) {
      throw new Error('Failed to fetch TON price');
    }
    const data: TonPriceResponse = await response.json();
    return data?.rates?.TON?.prices?.USD;
  } catch (error) {
    console.error('Error fetching TON price:', error);
    throw error;
  }
};