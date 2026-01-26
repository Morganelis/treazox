"use client";

import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  Legend,
} from "recharts";

const AdminDashboard = () => {
  // Dummy state
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalInvestments: 0,
    activeUsers: 0,
    luckyDraws: 0,
  });

  // Dummy chart data
  const [investmentData, setInvestmentData] = useState([]);
  const [activeUserData, setActiveUserData] = useState([]);

  useEffect(() => {
    setStats({
      totalUsers: 1250,
      totalInvestments: 452000,
      activeUsers: 980,
      luckyDraws: 320,
    });

    // Dummy investment data
    setInvestmentData([
      { month: "Jan", investments: 40000 },
      { month: "Feb", investments: 32000 },
      { month: "Mar", investments: 50000 },
      { month: "Apr", investments: 45000 },
      { month: "May", investments: 60000 },
      { month: "Jun", investments: 70000 },
      { month: "Jul", investments: 80000 },
      { month: "Aug", investments: 65000 },
      { month: "Sep", investments: 72000 },
      { month: "Oct", investments: 90000 },
      { month: "Nov", investments: 85000 },
      { month: "Dec", investments: 95000 },
    ]);

    // Dummy active user data
    setActiveUserData([
      { month: "Jan", users: 650 },
      { month: "Feb", users: 700 },
      { month: "Mar", users: 750 },
      { month: "Apr", users: 800 },
      { month: "May", users: 820 },
      { month: "Jun", users: 850 },
      { month: "Jul", users: 870 },
      { month: "Aug", users: 900 },
      { month: "Sep", users: 920 },
      { month: "Oct", users: 940 },
      { month: "Nov", users: 960 },
      { month: "Dec", users: 980 },
    ]);
  }, []);

  const cards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      color: "bg-blue-500",
    },
    {
      title: "Total Investments",
      value: `$${stats.totalInvestments.toLocaleString()}`,
      color: "bg-green-500",
    },
    {
      title: "Active Users",
      value: stats.activeUsers,
      color: "bg-yellow-500",
    },
    {
      title: "Lucky Draw Participation",
      value: stats.luckyDraws,
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Admin Dashboard
      </h1>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`p-6 rounded-lg shadow-lg text-white ${card.color} flex flex-col justify-between`}
          >
            <h2 className="text-lg font-medium">{card.title}</h2>
            <p className="mt-4 text-2xl font-bold">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Line Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
          <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
            Investments Growth (Line Chart)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={investmentData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="investments" stroke="#1f2937" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
          <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
            Active Users (Bar Chart)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={activeUserData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="users" fill="#4b5563" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
