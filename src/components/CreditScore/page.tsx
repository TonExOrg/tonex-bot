import { Gauge, gaugeClasses } from "@mui/x-charts";
import React, { useState } from "react";
import axios from "axios";
import { ethers } from 'ethers';
import "./style.css";

const CreditScore: React.FC = () => {
  const maxScore = 1000;
  const [account, setAccount] = useState<string | null>(null);
  const [creditScore, setCreditScore] = useState(0);
  const [percentage, setPercentage] = useState(0);

  const accessToken = '2a316b0f55fabc65873eeeec5ebf30fa846fa617'
  // const accessToken = process.env.REACT_APP_CRED_API_TOKEN
  const accountAddressExample = '0xB1A296a720D9AAF5c5e9F805d8095e6d94882eE1'

  async function getCreditScore(accountAddress: string): Promise<number> {
    const url = `https://beta.credprotocol.com/api/score/address/${accountAddress}/`;

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Token ${accessToken}`,
        },
      });

      console.log("Credit Score:", response.data);
      // Return the score if found, otherwise return 0
      return response.data.value || 0;  
    } catch (error) {
      console.error("Error fetching credit score:", error);
      return 0;
    }
  }

  // const getAddress = async () => {
	// 	let userAddress = "";
	// 	if (typeof window.ethereum !== 'undefined') {
	// 		await window.ethereum.request({ method: 'eth_requestAccounts' });
	// 		const provider = new ethers.(window.ethereum);
	// 		await provider.send("eth_requestAccounts", []);
	// 		const signer = await provider.getSigner();
	// 		 userAddress = await signer.getAddress();
	// 	}
	// 	return userAddress
	// }

  const handleCalculate = async () => {
    // const newScore = Math.floor(Math.random() * (maxScore + 1));
    const newScore = await getCreditScore(accountAddressExample);
    console.log(newScore)
    setCreditScore(newScore);

    let startPercentage = 0;
    const endPercentage = (newScore / maxScore) * 100;

    const interval = setInterval(() => {
      if (startPercentage < endPercentage) {
        startPercentage += 1;
        setPercentage(startPercentage);
      } else {
        clearInterval(interval);
      }
    }, 10);
  };

  return (
    <div className="p-4 bg-gray-800 rounded-lg shadow-lg text-white flex flex-col items-center">
      <div className="flex items-center justify-between mb-4 w-full">
        <h2 className="text-2xl font-semibold">Credit Score</h2>
        <button
          onClick={handleCalculate}
          className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Calculate
        </button>
      </div>

      <div className="flex justify-center items-center">
        <Gauge
          width={300}
          height={250} // Ensure this is a perfect circle
          value={percentage}
          startAngle={-110}
          endAngle={110}
          className={gaugeClasses.root}
          cornerRadius="50%"
          sx={(theme) => ({
            [`& .${gaugeClasses.valueArc}`]: {
              fill:
                percentage <= 33
                  ? "#FF7F7F"
                  : percentage <= 66
                  ? "#FFD580"
                  : "#80C1FF",
            },
            [`& .${gaugeClasses.referenceArc}`]: {
              fill: theme.palette.text.disabled,
            },
            [`& .${gaugeClasses.valueText}`]: {
              fontSize: 36,
              transform: "translate(0px, 38px)", 
              color: "white !important",
            },
            [`& .${gaugeClasses.valueText} text`]: {
              fill: "#3b82f6" // <-- change text color
            },
          })}
          text={`${creditScore} / ${maxScore}`}
        />
      </div>
      <p className="text-lg font-semibold text-white p-3 rounded-lg shadow-lg inline-block">
        Health Factor: <span className="font-bold text-xl">1.46</span>
      </p>
    </div>
  );
};

export default CreditScore;
