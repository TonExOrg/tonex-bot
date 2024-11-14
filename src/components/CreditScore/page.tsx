import { Gauge, gaugeClasses } from "@mui/x-charts";
import React, { useState } from "react";
import "./style.css";

const CreditScore: React.FC = () => {
  const maxScore = 1000;
  const [creditScore, setCreditScore] = useState(0);
  const [percentage, setPercentage] = useState(0);

  const handleCalculate = () => {
    const newScore = Math.floor(Math.random() * (maxScore + 1));
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
    <div className="p-4 bg-gradient-to-r from-[#1f2937] to-[#334155] rounded-lg shadow-lg text-white flex flex-col items-center">
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
