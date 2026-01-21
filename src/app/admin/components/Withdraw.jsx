"use client";

import React, { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import Cookies from "js-cookie";

const API_URL = "https://treazoxbe.vercel.app/api/withdraw/";

const WithdrawAdminPage = () => {
  const [withdraws, setWithdraws] = useState([]);
  const [searchEmail, setSearchEmail] = useState("");
  const [activeTab, setActiveTab] = useState("pending");

  const token = Cookies.get("token");

  // Fetch all withdraws
  const fetchWithdraws = async () => {
    try {
      const res = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setWithdraws(data.withdraws);
      else toast.error(data.message || "Failed to fetch withdraws");
    } catch (err) {
      console.error(err);
      toast.error("Error fetching withdraws");
    }
  };

  useEffect(() => {
    fetchWithdraws();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`${API_URL}status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Status updated");
        fetchWithdraws();
      } else toast.error(data.message || "Failed to update status");
    } catch (err) {
      console.error(err);
      toast.error("Error updating status");
    }
  };

  const filtered = withdraws.filter(
    (w) =>
      w.status === activeTab &&
      w.user?.email?.toLowerCase().includes(searchEmail.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Withdraw Requests</h1>

      <input
        type="text"
        placeholder="Search by email..."
        value={searchEmail}
        onChange={(e) => setSearchEmail(e.target.value)}
        className="w-full sm:w-1/3 px-4 py-2 border rounded-md mb-4 dark:bg-gray-800 dark:text-white"
      />

      <div className="flex gap-2 mb-4 flex-wrap">
        {["pending", "processing", "completed", "rejected"].map((status) => (
          <button
            key={status}
            onClick={() => setActiveTab(status)}
            className={`px-4 py-2 rounded-lg font-semibold ${
              activeTab === status
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-lg shadow-lg bg-white dark:bg-gray-800">
        <table className="min-w-[1100px] w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr className="text-primary dark:text-white">
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">User Email</th>
              <th className="px-4 py-2">Exchange</th>
              <th className="px-4 py-2">Network</th>
              <th className="px-4 py-2">Address</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-6 text-gray-500">
                  No withdraws in this tab
                </td>
              </tr>
            ) : (
              filtered.map((w, i) => (
                <tr key={w._id} className="text-primary dark:text-white">
                  <td className="px-4 py-2">{i + 1}</td>
                  <td className="px-4 py-2">{w.user?.email}</td>
                  <td className="px-4 py-2">{w.exchange}</td>
                  <td className="px-4 py-2">{w.network}</td>
                  <td className="px-4 py-2 truncate max-w-[220px]">{w.address}</td>
                  <td className="px-4 py-2 font-semibold">${w.netAmount}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-3 py-1 rounded text-xs font-medium ${
                        w.status === "completed"
                          ? "bg-green-800 text-white"
                          : w.status === "processing"
                          ? "bg-yellow-400 text-black"
                          : w.status === "rejected"
                          ? "bg-red-600 text-white"
                          : "bg-gray-400 text-white"
                      }`}
                    >
                      {w.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <select
                      value={w.status}
                      onChange={(e) => handleStatusChange(w._id, e.target.value)}
                      disabled={w.status === "completed"}
                      className="px-3 py-1 border rounded-md dark:bg-gray-700 dark:text-white"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="completed">Completed</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WithdrawAdminPage;
