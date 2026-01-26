"use client";

import React, { useEffect, useState } from "react";
import Investments from "../components/Investments";
import Cookies from "js-cookie";

const Page = () => {
  const BACKEND_URL =
    "https://treazoxbe.vercel.app/api/investment/admin/dashboard/stats";

  const [stats, setStats] = useState({
    totalInvestmentAmount: 0,
    totalInvestments:0,
    activeInvestments: 0,
  });
    const token = Cookies.get("token");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(BACKEND_URL, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // add if needed
          },
        });

        const data = await res.json();

        if (data.success) {
          setStats({
            totalInvestmentAmount: data.totalInvestmentAmount,
            activeInvestments: data.activeInvestments,
          });
        }
      } catch (error) {
        console.error("Failed to fetch investment stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const cards = [
    {
      title: "Total Invested",
      value: `$${stats.totalInvestmentAmount.toLocaleString()}`,
      color: "bg-green-600",
    },
    {
      title: " totalInvestments",
      value: stats.totalInvestments,
      color: "bg-blue-400",
    },
    {
      title: "Active Investments",
      value: stats.activeInvestments,
      color: "bg-blue-600",
    },
  ];

  return (
    <div className="p-4 sm:p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Admin Investments
      </h1>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`p-6 rounded-xl shadow-lg text-white ${card.color}`}
          >
            <h2 className="text-sm uppercase tracking-wide opacity-90">
              {card.title}
            </h2>
            <p className="mt-3 text-2xl sm:text-3xl font-bold">
              {loading ? "Loading..." : card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Investments Table */}
      <Investments />
    </div>
  );
};

export default Page;
