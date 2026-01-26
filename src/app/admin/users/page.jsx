"use client";

import React, { useEffect, useState } from "react";
import Allusers from "../components/Allusers";

const Page = () => {
  const BACKEND_URL =
    "https://treazoxbe.vercel.app/api/users/admin/dashboard/stats";

  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    activeInvestmentUsers: 0,
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
    const fetchUserStats = async () => {
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
          setUserStats({
            totalUsers: data.totalUsers,
            activeUsers: data.activeUsers,
            inactiveUsers: data.inactiveUsers,
            activeInvestmentUsers: data.usersWithActiveInvestments,
          });
        }
      } catch (err) {
        console.error("User stats error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserStats();
  }, []);

  const cards = [
    { title: "Total Users", value: userStats.totalUsers, color: "bg-blue-600" },
    { title: "Active Users", value: userStats.activeUsers, color: "bg-green-600" },
    { title: "Inactive Users", value: userStats.inactiveUsers, color: "bg-yellow-600" },
    { title: "Users with Active Investments", value: userStats.activeInvestmentUsers, color: "bg-purple-600" },
  ];

  return (
    <div className="p-4 sm:p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Admin Users
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
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

      <Allusers />
    </div>
  );
};

export default Page;
