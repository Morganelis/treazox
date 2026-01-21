"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import Cookies from "js-cookie";

export default function PlanDetail() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const planId = searchParams.get("id");
  const price = Number(searchParams.get("price"));
  const duration = Number(searchParams.get("duration"));
  const dailyIncome = Number(searchParams.get("dailyIncome"));

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!planId) {
      toast.error("Invalid plan");
      return;
    }

    setLoading(true);
    const token = Cookies.get("token");

    try {
      const res = await fetch(
        "https://treazoxbe.vercel.app/api/investment/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            planId,
            exchange: "wallet",
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success("Investment created successfully");
        router.push("/dashboard");
      } else {
        toast.error(data.message || "Investment failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[90vh] flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <Toaster position="top-right" />

      <div
        className="w-full max-w-lg rounded-2xl
        bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500
      transition-all duration-700 ease-out dark:bg-gray-800
        p-6 space-y-6
        ring-1 ring-gray-200 dark:ring-gray-700
        shadow-[0_20px_40px_rgba(0,0,0,0.12)]
        dark:shadow-[0_20px_40px_rgba(0,0,0,0.45)]"
      >
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
          Confirm Investment
        </h1>

        {/* Plan Info */}
        <div className="grid grid-cols-3 gap-3 text-center">
          {[
            { label: "Price", value: `$${price}` },
            { label: "Duration", value: `${duration} Days` },
            { label: "Daily Income", value: `$${dailyIncome}` },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-gray-100 dark:bg-gray-900 rounded-xl p-4
              shadow-inner ring-1 ring-gray-200 dark:ring-gray-700"
            >
              <p className="text-xs text-gray-500">{item.label}</p>
              <p className="font-semibold text-green-600">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Wallet Info */}
        <div
          className="bg-green-50 dark:bg-green-900/20
          border border-green-300 dark:border-green-700
          rounded-xl p-4 text-sm text-green-700 dark:text-green-400"
        >
          💳 This investment amount will be deducted from your wallet balance.
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full py-3 rounded-xl text-white font-semibold
            transition-all duration-300
            ${
              loading
                ? "bg-primary/60 cursor-not-allowed"
                : "bg-primary shadow-lg shadow-primary/40 hover:shadow-xl hover:-translate-y-0.5"
            }`}
        >
          {loading ? "Processing..." : "Confirm Investment"}
        </button>
      </div>
    </div>
  );
}
