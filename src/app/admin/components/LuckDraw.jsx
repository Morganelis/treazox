"use client";

import React, { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import Cookies from "js-cookie";

const LuckDraw = () => {
  const [luckyDraws, setLuckyDraws] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [formData, setFormData] = useState({
    buyPrice: "",
    winningPrice: "",
    participants: "",
    winner: "",
  });
  const LUCKYDRAW_URL = "https://treazoxbackend.vercel.app/api/luckydraw/";

  const token = Cookies.get("token");

  /* ================= FETCH ALL LUCKY DRAWS ================= */
  const fetchLuckyDraws = async () => {
    try {
      const res = await fetch(`${LUCKYDRAW_URL}admin`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setLuckyDraws(data.draws || []);
    } catch (err) {
      toast.error(err.message || "Failed to load lucky draws");
    }
  };

  useEffect(() => {
    fetchLuckyDraws();
  }, []);

  /* ================= INPUT HANDLER ================= */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* ================= CREATE / UPDATE ================= */
  const handleSubmit = async () => {
    const { buyPrice, winningPrice, participants, winner } = formData;

    if (!buyPrice || !winningPrice || !participants) {
      toast.error("All required fields must be filled");
      return;
    }

    try {
      const body = {
        buyPrice,
        winningPrice,
        participantsLimit: participants,
        winnersCount: winner || 1,
        endDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // default 24h
      };

      const res = await fetch(LUCKYDRAW_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success("Lucky Draw created");
      resetForm();
      fetchLuckyDraws();
    } catch (err) {
      toast.error(err.message || "Failed to create lucky draw");
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this lucky draw?")) return;

    try {
      const res = await fetch(`${LUCKYDRAW_URL}${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success("Lucky Draw deleted");
      fetchLuckyDraws();
    } catch (err) {
      toast.error(err.message || "Delete failed");
    }
  };

  /* ================= RESET ================= */
  const resetForm = () => {
    setFormData({ buyPrice: "", winningPrice: "", participants: "", winner: "" });
    setEditIndex(null);
    setShowModal(false);
  };

  return (
    <div className="sm:p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Lucky Draws
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Create Lucky Draw
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow-lg bg-white dark:bg-gray-800">
        <table className="min-w-[700px] w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr className="dark:text-white">
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">Buy Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">Winning Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">Participants</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">Winners</th>
              <th className="px-6 py-3 text-center text-xs font-medium uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {luckyDraws.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">
                  No Lucky Draw Found
                </td>
              </tr>
            ) : (
              luckyDraws.map((item) => (
                <tr key={item._id} className="dark:text-white">
                  <td className="px-6 py-4">{item.buyPrice}</td>
                  <td className="px-6 py-4">{item.winningPrice}</td>
                  <td className="px-6 py-4">
                    {item.participants.length}/{item.participantsLimit}
                  </td>
                  <td className="px-6 py-4">{item.winnersCount}</td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-3">
          <div className="bg-white dark:bg-gray-800 p-5 rounded w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Create Lucky Draw
            </h2>

            <div className="space-y-3">
              <input type="number" name="buyPrice" placeholder="Buy Price" className="w-full px-3 py-2 border rounded" value={formData.buyPrice} onChange={handleChange} />
              <input type="number" name="winningPrice" placeholder="Winning Price" className="w-full px-3 py-2 border rounded" value={formData.winningPrice} onChange={handleChange} />
              <input type="number" name="participants" placeholder="Participants Limit" className="w-full px-3 py-2 border rounded" value={formData.participants} onChange={handleChange} />
              <input type="number" name="winner" placeholder="Number of Winners" className="w-full px-3 py-2 border rounded" value={formData.winner} onChange={handleChange} />
            </div>

            <div className="flex justify-end gap-3 mt-5">
              <button onClick={resetForm} className="px-4 py-2 bg-gray-400 text-white rounded">
                Cancel
              </button>
              <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded">
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LuckDraw;
