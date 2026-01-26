"use client";

import React, { useEffect, useState } from "react";
import DepositPage from "../components/DepositPage";

const page = () => {
  const BACKEND_URL =
    "https://treazoxbe.vercel.app/api/deposit/admin/dashboard/stats";

  const [depositStats, setDepositStats] = useState({
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
    const fetchDepositStats = async () => {
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
          setDepositStats({
            totalBalance: data.totalDepositAmount,
            pending: data.pendingDeposits,
            approved: data.approvedDeposits,
            rejected: data.rejectedDeposits,
          });
        }
      } catch (err) {
        console.error("Deposit stats error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDepositStats();
  }, []);

  const cards = [
    {
      title: "Total Balance",
      value: `$${depositStats.totalBalance.toLocaleString()}`,
      color: "bg-blue-600",
    },
    {
      title: "Pending Deposits",
      value: `$${depositStats.pending.toLocaleString()}`,
      color: "bg-yellow-600",
    },
    {
      title: "Approved Deposits",
      value: `$${depositStats.approved.toLocaleString()}`,
      color: "bg-green-600",
    },
    {
      title: "Rejected Deposits",
      value: `$${depositStats.rejected.toLocaleString()}`,
      color: "bg-red-600",
    },
  ];

  return (
    <div className="p-4 sm:p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Deposit Overview
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

      {/* Deposit Table */}
      <DepositPage />
    </div>
  );
};

export default page;
