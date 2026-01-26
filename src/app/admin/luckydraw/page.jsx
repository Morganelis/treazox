"use client";

import React, { useEffect, useState } from "react";
import LuckDraw from "../components/LuckDraw";

const Page = () => {
  const BACKEND_URL =
    "https://treazoxbe.vercel.app/api/luckydraw/admin/dashboard/stats";

  const [stats, setStats] = useState({
    totalLuckyDraws: 0,
    activeLuckyDraws: 0,
    totalParticipants: 0,
    completedLuckyDraws: 0,
  });

  const [loading, setLoading] = useState(true);

  // ✅ Get token from JS cookies
  const getCookie = (name) => {
    if (typeof document === "undefined") return null;
    const cookies = document.cookie.split("; ");
    const cookie = cookies.find((row) => row.startsWith(name + "="));
    return cookie ? cookie.split("=")[1] : null;
  };

  useEffect(() => {
    const fetchStats = async () => {
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
          setStats({
            totalLuckyDraws: data.totalLuckyDraws,
            activeLuckyDraws: data.activeLuckyDraws,
            totalParticipants: data.totalParticipants,
            completedLuckyDraws: data.completedLuckyDraws,
          });
        }
      } catch (err) {
        console.error("Lucky draw stats error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const cards = [
    {
      title: "Total Lucky Draws",
      value: stats.totalLuckyDraws,
      color: "bg-purple-600",
    },
    {
      title: "Active Lucky Draws",
      value: stats.activeLuckyDraws,
      color: "bg-blue-600",
    },
    {
      title: "Participants",
      value: stats.totalParticipants,
      color: "bg-green-600",
    },
    {
      title: "Completed Draws",
      value: stats.completedLuckyDraws,
      color: "bg-gray-600",
    },
  ];

  return (
    <div className="p-4 sm:p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Admin Lucky Draw
      </h1>

      {/* Stats Cards */}
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

      {/* Lucky Draw List / Table */}
      <LuckDraw />
    </div>
  );
};

export default Page;
