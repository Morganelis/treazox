"use client";
import React, { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import Cookies from "js-cookie";

const LUCKYDRAW_URL = "https://treazoxbackend.vercel.app/api/luckydraw/";

const LuckyDraw = () => {
  const [draws, setDraws] = useState([]);
  const [loading, setLoading] = useState(true);
  const [participatingId, setParticipatingId] = useState(null);

  const token = Cookies.get("token");
  const userId = Cookies.get("userId"); // must be stored at login

  /* ================= Fetch Active Draws ================= */
  const fetchDraws = async () => {
    try {
      setLoading(true);

      const res = await fetch(LUCKYDRAW_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch draws");

      setDraws(data.draws || []);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ================= Participate ================= */
  const participate = async (drawId) => {
    try {
      setParticipatingId(drawId);

      const res = await fetch(`${LUCKYDRAW_URL}participate/${drawId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success("Participation successful!");
      fetchDraws();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setParticipatingId(null);
    }
  };

  useEffect(() => {
    fetchDraws();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-primary dark:bg-primary dark:text-white">
        Loading lucky draws...
      </div>
    );
  }

  return (
    <section className="min-h-screen py-16 bg-gray-100 dark:bg-gray-900">
      <Toaster position="top-right" />

      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary dark:text-white">
            Lucky Draw
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Join a lucky draw using your balance and win big 🎉
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {draws.length === 0 && (
            <p className="text-center text-gray-500 col-span-full">
              No active lucky draws available
            </p>
          )}

          {draws.map((draw) => {
            const ended = new Date() > new Date(draw.endDate);
            const full = draw.participants.length >= draw.participantsLimit;

            // FIXED: correct joined check (supports both ObjectId and populated object)
          const joined = draw.participants.some((p) => {
              const participantId = p.userId;
              return participantId?.toString() === userId;
            });
            const winner = draw.winners?.[0];

            // FIXED: correct winner check (supports both ObjectId and populated object)
            const isWinner = winner
              ? (typeof winner.userId === "object"
                  ? winner.userId._id
                  : winner.userId
                ).toString() === userId
              : false;

            return (
              <div
                key={draw._id}
                className="rounded-2xl p-6 bg-white dark:bg-gray-800
                           ring-1 ring-gray-200 dark:ring-gray-700
                           shadow-[0_20px_40px_rgba(0,0,0,0.12)]
                           dark:shadow-[0_20px_40px_rgba(0,0,0,0.45)]
                           transition"
              >
                <h3 className="text-xl font-bold text-primary dark:text-white mb-3">
                  🎁 Prize: ${draw.winningPrice}
                </h3>

                <p className="text-gray-600 dark:text-gray-300 text-sm mb-1">
                  Entry Fee: <span className="font-semibold">${draw.buyPrice}</span>
                </p>

                <p className="text-gray-600 dark:text-gray-300 text-sm mb-1">
                  Participants:{" "}
                  {draw.participants.length}/{draw.participantsLimit}
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-1">
                 {participatingId}
                </p>

                <button
                  disabled={ended || full || joined || participatingId === draw._id}
                  onClick={() => participate(draw._id)}
                  className={`w-full py-3 rounded-xl font-semibold text-white
                    transition-all duration-300
                    ${
                      ended || full || joined
                        ? "bg-primary/60 cursor-not-allowed"
                        : "bg-primary shadow-lg shadow-primary/40 hover:shadow-xl hover:shadow-primary/60"
                    }`}
                >
                  {isWinner
                    ? "🎉 You Won!"
                    : ended
                    ? "Draw Ended"
                    : full
                    ? "Full"
                    : joined
                    ? "Joined"
                    : participatingId === draw._id
                    ? "Processing..."
                    : "Participate"}
                </button>

                {winner && (
                  <div className="mt-6 p-4 rounded-xl bg-green-100 dark:bg-green-900/30">
                    <p className="text-green-700 dark:text-green-400 font-semibold">
                      Winner:
                    </p>
                    <p className="text-green-800 dark:text-green-300">
                      {winner.userId?.fullName || "User"} won $
                      {winner.wonAmount}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default LuckyDraw;
