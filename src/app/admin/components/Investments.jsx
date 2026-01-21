"use client";

import React, { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import Cookies from "js-cookie";

const ITEMS_PER_PAGE = 10;
const API_URL = "https://treazoxbe.vercel.app/api/investment/";

const Investments = () => {
  const [pending, setPending] = useState([]);
  const [approved, setApproved] = useState([]);
  const [rejected, setRejected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchEmail, setSearchEmail] = useState("");
  const [activeTab, setActiveTab] = useState("pending");
  const [page, setPage] = useState(1);

  const token = Cookies.get("token");

  // =========================
  // Fetch all investments
  // =========================
  const fetchInvestments = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        const pendingData = data.investments.filter(i => i.status === "pending");
        const approvedData = data.investments.filter(i => i.status === "approved");
        const rejectedData = data.investments.filter(i => i.status === "rejected");

        setPending(pendingData);
        setApproved(approvedData);
        setRejected(rejectedData);
      } else {
        toast.error(data.message || "Failed to fetch investments");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error fetching investments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvestments();
  }, []);

  // =========================
  // Update status
  // =========================
const handleStatusUpdate = async (invId, status) => {
  try {
    const res = await fetch(`${API_URL}status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id: invId, status }), // <-- send id here
    });

    const data = await res.json();
    if (res.ok) {
      toast.success(`Investment ${status} successfully`);
      fetchInvestments(); // Refresh data
    } else {
      toast.error(data.message || "Failed to update status");
    }
  } catch (err) {
    console.error(err);
    toast.error("Error updating status");
  }
};

  const dataMap = {
    pending,
    approved,
    rejected,
  };

  const data = dataMap[activeTab] || [];
  const filtered = data.filter(inv =>
    inv.user?.email?.toLowerCase().includes(searchEmail.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="sm:p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Investments</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-4 flex-wrap">
        {["pending", "approved", "rejected"].map(tab => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setPage(1); }}
            className={`px-4 py-2 rounded ${
              activeTab === tab
                ? tab === "approved"
                  ? "bg-green-600 text-white"
                  : tab === "rejected"
                  ? "bg-red-600 text-white"
                  : "bg-blue-600 text-white"
                : "bg-gray-300 dark:bg-gray-700 dark:text-white"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by email..."
        value={searchEmail}
        onChange={(e) => setSearchEmail(e.target.value)}
        className="mb-4 w-full sm:w-1/3 px-4 py-2 border rounded-md dark:bg-gray-800 dark:text-white"
      />

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow-lg bg-white dark:bg-gray-800">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr className="dark:text-white">
              <th className="px-4 py-2 text-left text-xs font-medium uppercase">User</th>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase">Email</th>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase">Amount</th>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase">Daily Earning</th>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase">Deposit Exchange</th>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase">Trx Id</th>
              <th className="px-4 py-2 text-center text-xs font-medium uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center dark:text-white py-4">Loading investments...</td>
              </tr>
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center dark:text-white py-4">No data</td>
              </tr>
            ) : (
              paginated.map(inv => (
                <tr key={inv._id}>
                  <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{inv.user?.fullName}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{inv.user?.email}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">${inv.price}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">${inv.dailyEarning}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{inv.exchange}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{inv.trxId}</td>
                  <td className="px-4 py-2 text-center flex justify-center gap-2">
                    {activeTab === "pending" ? (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(inv._id, "approved")}
                          className="px-2 py-1 bg-green-500 text-white rounded"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(inv._id, "rejected")}
                          className="px-2 py-1 bg-red-500 text-white rounded"
                        >
                          Reject
                        </button>
                      </>
                    ) : activeTab === "approved" ? (
                      <span className="text-green-500 font-semibold">Approved</span>
                    ) : (
                      <span className="text-red-500 font-semibold">Rejected</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4 gap-2 flex-wrap">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 rounded ${page === i + 1 ? "bg-blue-600 text-white" : "bg-gray-300 dark:bg-gray-700 dark:text-white"}`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Investments;
