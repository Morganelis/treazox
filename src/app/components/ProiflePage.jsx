"use client";

import React, { useEffect, useState } from "react";
import { Copy, Sun, Moon } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import Cookies from "js-cookie";
import avatar from "../../../public/avatar.png"
import Image from "next/image";

const BASE_URL = "https://treazoxbe.vercel.app/api";

const ProfilePage = () => {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState("light");
  const [user, setUser] = useState(null);
  const [referralLink, setReferralLink] = useState("");
  const [investments, setInvestments] = useState([]);

  useEffect(() => {
    setMounted(true);

    const savedTheme = Cookies.get("theme") || "light";
    setTheme(savedTheme);

    const token = Cookies.get("token");
    if (!token) return;

    const fetchUserAndInvestments = async () => {
      try {
        // Fetch user
        const resUser = await fetch(`${BASE_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const dataUser = await resUser.json();
        if (!resUser.ok) throw new Error(dataUser.message);

        setUser(dataUser.user);
        setReferralLink(`${window.location.origin}/signup?ref=${dataUser.user.referralCode}`);

        // Fetch investments
        const resInv = await fetch(`${BASE_URL}/users/myinvestments`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const dataInv = await resInv.json();
        if (!resInv.ok) throw new Error(dataInv.message);

        setInvestments(dataInv.investments || []);
      } catch (err) {
        toast.error(err.message || "Failed to load data");
      }
    };

    fetchUserAndInvestments();
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

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  if (!mounted || !user) {
  return (
    <div className="min-h-screen bg-primary flex items-center justify-center">
      <p className="text-white text-lg font-semibold">Loading...</p>
    </div>
  );
}

  const handleLogout = () => {
  Cookies.remove("token");   // remove auth token
  Cookies.remove("role");    // optional (if stored)

  window.location.href = "/login"; // redirect to login
};

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
       <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary dark:border-gray-600">
  <Image
    src={avatar}
    alt="User Avatar"
    width={80}
    height={80}
    className="object-cover w-full h-full"
    priority
  />
</div>
        <div>
          <h1 className="text-2xl font-bold text-primary dark:text-white">{user.fullName}</h1>
          {/* <p className="text-gray-500 dark:text-gray-300">User ID: {user._id}</p> */}
        </div>
      </div>

      {/* Assets Card */}
      <div className="max-w-[1170px] mx-auto bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500
      transition-all duration-700 ease-out dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Assets</h2>
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Total Assets</p>
            <p className="font-semibold text-green-500 text-lg">
              ${user.balance }
            </p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Available Balance</p>
            <p className="font-semibold text-green-500 text-lg">${user.balance || 0}</p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Commission Balance</p>
            <p className="font-semibold text-green-500 text-lg">${user.commissionBalance || 0}</p>
          </div>
        </div>
      </div>

      {/* Investments List */}
      <div className="max-w-[1170px] mx-auto bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500
      transition-all duration-700 ease-out dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">My Active Investments</h2>
        {investments.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-300">No active investments yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {investments.map((inv) => (
              <div key={inv._id} className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Plan Price: ${inv.price}</p>
                <p className="text-sm text-gray-500">Daily Earning: ${inv.dailyEarning}</p>
                <p className="text-sm text-red-400">Remaining Days: {inv.duration}</p>
                <p className="text-sm text-gray-500">Status: {inv.status}</p>
                {inv.plan && (
                  <p className="text-sm text-gray-500">
                    Plan Duration: {inv.plan.duration} days
                  </p>
                )}
                <p className="text-sm text-green-500">Total Earned: ${inv.dailyEarning * inv.duration}</p>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* Referral Card */}
      <div className="max-w-[1170px] mx-auto bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500
      transition-all duration-700 ease-out dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Referral Program</h2>
        <p className="text-gray-500 dark:text-gray-300 mb-1">Your Referral Code</p>
        <p className="font-mono text-primary font-semibold mb-4">{user.referralCode}</p>

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

      <div className="my-6 text-center block md:hidden">
  <button
    onClick={handleLogout}
    className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
  >
    Logout
  </button>
</div>
    </div>
  );
};

export default ProfilePage;
