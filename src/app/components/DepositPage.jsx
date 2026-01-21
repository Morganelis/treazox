"use client";

import { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import Cookies from "js-cookie";

const DEPOSIT_OPTIONS = [10, 20, 30, 40, 50];

const EXCHANGES = [
  { name: "Binance", address: "0xc732ad129d6c1b8cba7e104281e0b213b3253262", network: "BEP20" },
  { name: "Wallet", address: "0xEB35dCBE0C60b309Bb89E32E7B83910338B0e07B", network: "BEP20" },
  // { name: "Bitget", address: "bitget1xyzabc123", network: "TRC20" },
];

const DEPOSIT_FEE_PERCENT = 5;

const DepositPage = () => {
  const [assets, setAssets] = useState(0);
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState("");
  const [selectedExchange, setSelectedExchange] = useState(EXCHANGES[0]);
  const [trxId, setTrxId] = useState("");
  const [token, setToken] = useState("");
const BALANCE_URL = "https://treazoxbe.vercel.app/api/users/me";
const DEPOSIT_URL = "https://treazoxbe.vercel.app/api/deposit/";



  const [loadingAssets, setLoadingAssets] = useState(true);

  // Fetch user balance/assets
  const fetchAssets = async () => {
    
    const userToken = Cookies.get("token");
    if (!userToken) return;

    setToken(userToken);
    try {
      const res = await fetch(BALANCE_URL, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch balance");

      setAssets(data.user.balance);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to fetch balance");
    } finally {
      setLoadingAssets(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const amount = selectedAmount || Number(customAmount || 0);
  const fee = amount ? Number(((amount * DEPOSIT_FEE_PERCENT) / 100).toFixed(2)) : 0;
  const total = amount ? Number((amount + fee).toFixed(2)) : 0;

  const handleDeposit = async () => {
    if (!amount || amount <= 0) return toast.error("Please select or enter deposit amount");
    if (!trxId) return toast.error("Please enter transaction ID");

    try {
      const res = await fetch(DEPOSIT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount,
          exchange: JSON.stringify(selectedExchange),
          trxId,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Deposit failed");

      toast.success("Deposit submitted successfully! Waiting for admin approval");
      setSelectedAmount(null);
      setCustomAmount("");
      setTrxId("");

      // Optionally refresh assets after some time or when admin approves
      fetchAssets();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Deposit failed");
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen p-4 sm:p-6">
      <Toaster position="top-right" />

      <div className="max-w-[1170px] mx-auto ">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Deposit Funds
        </h1>

        {/* Assets */}
        <div className="bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500
      transition-all duration-700 ease-out dark:bg-gray-800 rounded-xl shadow p-6 mb-6">
          <p className="text-gray-500">Current Assets</p>
          <h2 className="text-3xl font-bold text-green-600">
            {loadingAssets ? "Loading..." : `$${assets}`}
          </h2>
        </div>

        {/* Amount */}
        <div className="bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500
      transition-all duration-700 ease-out dark:bg-gray-800 rounded-xl shadow p-6 mb-6">
          <p className="text-gray-500 mb-2">Select Deposit Amount</p>

          <div className="flex flex-wrap gap-3 mb-4">
            {DEPOSIT_OPTIONS.map((amt) => (
              <button
                key={amt}
                onClick={() => {
                  setSelectedAmount(amt);
                  setCustomAmount("");
                }}
                className={`px-4 py-2 rounded-lg border ${
                  selectedAmount === amt
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white"
                }`}
              >
                ${amt}
              </button>
            ))}
          </div>

          <input
            type="number"
            placeholder="Or enter custom amount"
            value={customAmount}
            onChange={(e) => {
              setCustomAmount(e.target.value);
              setSelectedAmount(null);
            }}
            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Fee Preview */}
        {amount > 0 && (
          <div className="bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500
      transition-all duration-700 ease-out dark:bg-gray-800 rounded-xl p-4 mb-6">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
              <span>Deposit Amount</span>
              <span>${amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mt-1">
              <span>Deposit Fee ({DEPOSIT_FEE_PERCENT}%)</span>
              <span>${fee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg text-gray-800 dark:text-white mt-2">
              <span>Total Payable</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        )}

        {/* Exchange */}
        <div className="bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500
      transition-all duration-700 ease-out dark:bg-gray-800 rounded-xl shadow p-6 mb-6">
          <p className="text-primary mb-2">Select Exchange / Chain</p>

          <div className="flex flex-wrap gap-3 mb-4">
            {EXCHANGES.map((ex) => (
              <button
                key={ex.name}
                onClick={() => setSelectedExchange(ex)}
                className={`px-4 py-2 rounded-lg border ${
                  selectedExchange.name === ex.name
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white"
                }`}
              >
                {ex.name}
              </button>
            ))}
          </div>

          <div className="bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-400
     
      transition-all duration-700 ease-out
       dark:bg-gray-900 p-4 rounded-lg mb-4">
            <p className="text-sm text-primary mb-1">Address</p>
            <p className="font-mono text-gray-700 dark:text-green-500 break-all">
              {selectedExchange.address}
            </p>
            <p className="text-sm text-primary mt-2">Network</p>
            <p className="font-semibold text-gray-700 dark:text-green-500">
             Binance Smart Chain {selectedExchange.network}
            </p>
          </div>

          <input
            type="text"
            placeholder="Enter transaction ID (trxId)"
            value={trxId}
            onChange={(e) => setTrxId(e.target.value)}
            className="w-full px-4  py-2 border rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleDeposit}
          className="w-full px-6 py-3  bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500
      hover:from-cyan-500 hover:via-teal-500 hover:to-emerald-400 duration-700 ease-out
      hover:-translate-y-2 hover:shadow-xl text-white rounded-lg hover:bg-green-700 transition"
        >
          Confirm Deposit
        </button>
      </div>
    </div>
  );
};

export default DepositPage;
