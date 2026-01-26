"use client";

import React, { useEffect, useState } from "react";
import Plans from "../components/Plans";

const Page = () => {
  const [stats, setStats] = useState({
    totalPlans: 0,
    activePlans: 0,
    inactivePlans: 0,
    totalInvestment: 0
  });

  const [loading, setLoading] = useState(true);
  const BACKEND_URL = "https://treazoxbe.vercel.app/api/plans/stats";

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(BACKEND_URL);
        const data = await res.json();
        if (data.success) setStats(data.stats);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { title: "Total Plans", value: stats.totalPlans, color: "bg-blue-500" },
    { title: "Active Plans", value: stats.activePlans, color: "bg-green-500" },
    { title: "Inactive Plans", value: stats.inactivePlans, color: "bg-gray-500" },
    { title: "Total Investment", value: `$${stats.totalInvestment}`, color: "bg-yellow-500" },
  ];

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Admin Plans
      </h1>

      <div className="grid grid-cols-1  sm:grid-cols-4 gap-6 mb-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`p-6 rounded-lg shadow-lg text-white ${card.color} flex flex-col justify-between`}
          >
            <h2 className="text-lg font-medium">{card.title}</h2>
            <p className="mt-4 text-2xl font-bold">
              {loading ? "Loading..." : card.value}
            </p>
          </div>
        ))}
      </div>

      <Plans />
    </div>
  );
};

export default Page;
