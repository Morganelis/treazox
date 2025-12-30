"use client";

import React, { useEffect, useState } from "react";
import { Copy, Sun, Moon, Wallet } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import Cookies from "js-cookie";

const BASE_URL = "https://treazoxbackend.vercel.app/api";

const ProfilePage = () => {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState("light");
  const [user, setUser] = useState(null);
  const [referralLink, setReferralLink] = useState("");

  useEffect(() => {
    setMounted(true);

    // Read theme from cookies, fallback to light
    const savedTheme = Cookies.get("theme") || "light";
    setTheme(savedTheme);

    // Fetch user from backend
    const token = Cookies.get("token");
    if (!token) return;

    const fetchUser = async () => {
      try {
        const res = await fetch(`${BASE_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        setUser(data.user);
        setReferralLink(`${window.location.origin}/signup?ref=${data.user.referralCode}`);
      } catch (err) {
        toast.error(err.message || "Failed to load user");
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (theme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");

    Cookies.set("theme", theme, { expires: 365 });
  }, [theme, mounted]);

  const copyReferralLink = () => {
    if (!mounted) return;
    navigator.clipboard.writeText(referralLink);
    toast.success("Referral link copied!");
  };

  const handleLogout = () => {
    if (!mounted) return;
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    toast.success("Logged out successfully!");
    window.location.href = "/login";
  };

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  if (!mounted || !user) return null;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 transition-colors duration-300">
      <Toaster position="top-right" />

      {/* Theme Toggle */}
      <div className="max-w-[1170px] mx-auto flex justify-end mb-4">
        <button
          onClick={toggleTheme}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white"
        >
          {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </button>
      </div>

      {/* Profile Header */}
      <div className="max-w-[1170px] mx-auto flex items-center gap-6 mb-6">
        <div className="w-20 h-20 rounded-full bg-primary dark:bg-gray-700 flex items-center justify-center text-2xl font-bold text-white">
          {user.fullName[0]}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-primary dark:text-white">{user.fullName}</h1>
          <p className="text-gray-500 dark:text-gray-300">User ID: {user._id}</p>
        </div>
      </div>

      {/* Assets Card */}
      <div className="max-w-[1170px] mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Assets</h2>
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Total Assets</p>
            <p className="font-semibold text-green-500 text-lg">
              ${user.balance + user.commissionBalance}
            </p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Available Balance</p>
            <p className="font-semibold text-green-500 text-lg">
              ${user.balance || 0}
            </p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Commission Balance</p>
            <p className="font-semibold text-green-500 text-lg">
              ${user.commissionBalance || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Referral Card */}
      <div className="max-w-[1170px] mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Referral Program</h2>
        <p className="text-gray-500 dark:text-gray-300 mb-1">Your Referral Code</p>
        <p className="font-mono text-green-500 font-semibold mb-4">{user.referralCode}</p>

        <p className="text-gray-500 dark:text-gray-300 mb-1">Your Referral Link</p>
        <div className="flex gap-2 items-center">
          <input
            readOnly
            value={referralLink}
            className="flex-1 p-3 rounded-lg text-green-500 bg-gray-100 dark:bg-gray-900 text-sm"
          />
          <button
            onClick={copyReferralLink}
            className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            title="Copy referral link"
          >
            <Copy className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="text-center md:hidden">
        <button
          onClick={handleLogout}
          className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
