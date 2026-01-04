"use client";

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { toast, Toaster } from "react-hot-toast";

const BASE_URL = "https://treazoxbackend.vercel.app/api";

const Team = () => {
  const [team, setTeam] = useState([]);
  const [activeTab, setActiveTab] = useState("0"); // default to Level 0
  const token = Cookies.get("token");

  useEffect(() => {
    if (!token) return;

    const fetchTeam = async () => {
      try {
        const res = await fetch(`${BASE_URL}/users/team`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        setTeam(data.team || []);
      } catch (err) {
        toast.error(err.message || "Failed to fetch team");
      }
    };

    fetchTeam();
  }, [token]);

  // Group members by level
  const levels = {};
  team.forEach((member) => {
    if (!levels[member.level]) levels[member.level] = [];
    levels[member.level].push(member);
  });

  const renderMember = (member) => (
    <div
      key={member.referralCode}
      className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-2"
    >
      <p className="text-gray-900 dark:text-white font-semibold">
        {member.fullName}
      </p>
      <p className="text-gray-500 dark:text-gray-400 text-sm">
        Email: {member.email} | Balance: ${member.balance}
      </p>
    </div>
  );

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
      <Toaster position="top-right" />
      <div className="max-w-[1170px] mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-primary dark:text-white text-center">
          My Team
        </h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {Object.keys(levels)
            .sort((a, b) => a - b)
            .map((lvl) => (
              <button
                key={lvl}
                onClick={() => setActiveTab(lvl)}
                className={`px-4 py-2 rounded-lg font-semibold ${
                  activeTab === lvl
                    ? "bg-primary text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
                }`}
              >
                Level {lvl}
              </button>
            ))}
        </div>

        {/* Tab content */}
        <div>
          {levels[activeTab] && levels[activeTab].map(renderMember)}
          {!levels[activeTab] && (
            <p className="text-gray-500 dark:text-gray-400">
              No members in this level
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Team;
