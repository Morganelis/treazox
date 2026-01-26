"use client";

import React, { useEffect, useState } from "react";
import Withdraw from "../components/Withdraw";

const Page = () => {
  const BACKEND_URL =
    "https://treazoxbe.vercel.app/api/withdraw/admin/dashboard/stats";

  const [withdrawStats, setWithdrawStats] = useState({
    totalBalance: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  const [loading, setLoading] = useState(true);

  // Get token from JS cookies
  const getCookie = (name) => {
    if (typeof document === "undefined") return null;
    const cookies = document.cookie.split("; ");
    const cookie = cookies.find((row) => row.startsWith(name + "="));
    return cookie ? cookie.split("=")[1] : null;
  };

  useEffect(() => {
    const fetchWithdrawStats = async () => {
      try {
        const token = getCookie("token");

        const res = await fetch(BACKEND_URL, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (data.success) {
          setWithdrawStats({
            totalBalance: data.totalWithdrawAmount,
            pending: data.pendingWithdraws,
            approved: data.approvedWithdraws,
            rejected: data.rejectedWithdraws,
          });
        }
      } catch (err) {
        console.error("Withdraw stats error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWithdrawStats();
  }, []);

  const cards = [
    {
      title: "Total Balance",
      value: `$${withdrawStats.totalBalance.toLocaleString()}`,
      color: "bg-blue-600",
    },
    {
      title: "Pending Withdraw",
      value: `$${withdrawStats.pending.toLocaleString()}`,
      color: "bg-yellow-600",
    },
    {
      title: "Approved Withdraw",
      value: `$${withdrawStats.approved.toLocaleString()}`,
      color: "bg-green-600",
    },
    {
      title: "Rejected Withdraw",
      value: `$${withdrawStats.rejected.toLocaleString()}`,
      color: "bg-red-600",
    },
  ];

  return (
    <div className="p-4 sm:p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Withdraw Overview
      </h1>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

      {/* Withdraw Table */}
      <Withdraw />
    </div>
  );
};

export default Page;
