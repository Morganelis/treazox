"use client";

import React, { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import Cookies from "js-cookie";

const AdminDepositPage = () => {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");
const DEPOSIT_URL = "https://treazoxbe.vercel.app/api/deposit/";

  const token = Cookies.get("token");

  // ================= FETCH DEPOSITS =================
  const fetchDeposits = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const res = await fetch(DEPOSIT_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch deposits");

      setDeposits(data.deposits);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to load deposits");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeposits();
  }, []);

  // ================= UPDATE STATUS =================
  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`${DEPOSIT_URL}${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");

      toast.success(`Deposit ${newStatus} successfully`);
      fetchDeposits(); // refresh list
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to update deposit");
    }
  };

  const filteredDeposits = deposits.filter(
    (d) => d.status === activeTab
  );

  return (
    <div className="sm:p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <Toaster position="top-right" />

      <h1 className="text-sm sm:text-3xl font-bold mb-4 text-gray-900 dark:text-white">
        Admin Deposit Management
      </h1>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {["pending", "approved", "rejected"].map((status) => (
          <button
            key={status}
            onClick={() => setActiveTab(status)}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              activeTab === status
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow-lg bg-white dark:bg-gray-800">
        <table className="min-w-[max-content] w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr className="text-primary dark:text-white">
              <th className="px-4 py-2 text-left text-xs uppercase">User</th>
              <th className="px-4 py-2 text-left text-xs uppercase">Email</th>
              <th className="px-4 py-2 text-left text-xs uppercase">Exchange</th>
              <th className="px-4 py-2 text-left text-xs uppercase">Amount</th>
              <th className="px-4 py-2 text-left text-xs uppercase">Address</th>
              <th className="px-4 py-2 text-left text-xs uppercase">Trx ID</th>
              <th className="px-4 py-2 text-left text-xs uppercase">Status</th>
              <th className="px-4 py-2 text-center text-xs uppercase">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center py-4">
                  Loading deposits...
                </td>
              </tr>
            ) : filteredDeposits.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-4">
                  No deposits found
                </td>
              </tr>
            ) : (
              filteredDeposits.map((item, index) => (
                <tr key={item._id} className="text-primary dark:text-white">
                  <td className="px-4 py-2">{item.user?.fullName}</td>
                  <td className="px-4 py-2">{item.user?.email}</td>
                  <td className="px-4 py-2">
                    {item.exchange.name} ({item.exchange.network})
                  </td>
                  <td className="px-4 py-2 font-semibold">
                    ${item.amount}
                  </td>
                  <td className="px-4 py-2 font-mono text-xs">
                    {item.exchange.address}
                  </td>
                  <td className="px-4 py-2 text-xs truncate max-w-[200px]">
                    {item.trxId}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-3 py-1 rounded text-xs font-medium ${
                        item.status === "approved"
                          ? "bg-green-700 text-white"
                          : item.status === "rejected"
                          ? "bg-red-600 text-white"
                          : "bg-yellow-400 text-black"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <select
                      value={item.status}
                      onChange={(e) =>
                        handleStatusChange(item._id, e.target.value)
                      }
                      className="px-3 py-1 border rounded bg-white dark:bg-gray-700"
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approve</option>
                      <option value="rejected">Reject</option>
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

export default AdminDepositPage;
