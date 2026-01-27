"use client";

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import {
  FaUsers,
  FaDollarSign,
  FaCheckCircle,
  FaMagic,
  FaSyncAlt,
} from "react-icons/fa";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalInvestments: 0,
    activeUsers: 0,
    luckyDraws: 0,
  });

  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState("");

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const token = Cookies.get("token");

        const res = await fetch(
          "https://treazoxbe.vercel.app/api/users/admin/dashboardOverview",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (data.success) {
          setStats({
            totalUsers: data.totalUsers,
            totalInvestments: data.totalInvestments,
            activeUsers: data.activeUsers,
            luckyDraws: data.luckyDraws,
          });

          const now = new Date();
          setLastUpdated(now.toLocaleString());
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, []);

  const cards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: <FaUsers className="w-7 h-7" />,
      color: "from-blue-500 to-indigo-500",
    },
    {
      title: "Total Investments",
      value: `$${stats.totalInvestments.toLocaleString()}`,
      icon: <FaDollarSign className="w-7 h-7" />,
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Active Users",
      value: stats.activeUsers,
      icon: <FaCheckCircle className="w-7 h-7" />,
      color: "from-yellow-400 to-yellow-600",
    },
    {
      title: "Lucky Draw Participation",
      value: stats.luckyDraws,
      icon: <FaMagic className="w-7 h-7" />,
      color: "from-purple-500 to-pink-500",
    },
  ];

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Admin Dashboard
        </h1>

        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Last updated: {lastUpdated || "Loading..."}
          </span>
          <FaSyncAlt className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`p-6 rounded-xl shadow-lg text-white bg-gradient-to-r ${card.color} hover:scale-[1.02] transition transform`}
          >
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium">{card.title}</h2>
              <div className="p-2 bg-white/20 rounded-full">
                {card.icon}
              </div>
            </div>

            <p className="mt-6 text-3xl font-bold">
              {loading ? "Loading..." : card.value}
            </p>

            <div className="mt-4 text-sm text-white/80">
              <span className="inline-block px-2 py-1 bg-white/20 rounded-full">
                Updated just now
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
