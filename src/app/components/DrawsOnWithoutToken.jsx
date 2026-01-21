"use client";
import React, { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";

const LUCKYDRAW_URL =
  "https://treazoxbe.vercel.app/api/luckydraw/withoutlogin";

const DrawsOnWithoutToken = () => {
  const [draws, setDraws] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= Fetch All Lucky Draws ================= */
  const fetchDraws = async () => {
    try {
      setLoading(true);

      const res = await fetch(LUCKYDRAW_URL);
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to fetch draws");

      setDraws(data.draws || []);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDraws();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-primary dark:bg-gray-900 dark:text-white">
        Loading lucky draws...
      </div>
    );
  }

  return (
    <section className=" py-10 bg-gray-100 dark:bg-gray-900">
      <Toaster position="top-right" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary dark:text-white">
            Lucky Draw
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            View all active lucky draws 🎉
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {draws.length === 0 && (
            <p className="text-center text-gray-500 col-span-full">
              No lucky draws available
            </p>
          )}

          {draws.map((draw) => {
            const ended = new Date() > new Date(draw.endDate);
            const full =
              draw.participants.length >= draw.participantsLimit;

            const winner = draw.winners?.[0];

            return (
              <div
                key={draw._id}
                className="rounded-2xl p-6 bg-white dark:bg-gray-800
                           ring-1 ring-gray-200 dark:ring-gray-700
                           shadow-[0_20px_40px_rgba(0,0,0,0.12)]
                           dark:shadow-[0_20px_40px_rgba(0,0,0,0.45)]"
              >
                <h3 className="text-xl font-bold text-primary dark:text-white mb-3">
                  🎁 Prize: ${draw.winningPrice}
                </h3>

                <p className="text-gray-600 dark:text-gray-300 text-sm mb-1">
                  Entry Fee:{" "}
                  <span className="font-semibold">
                    ${draw.buyPrice}
                  </span>
                </p>

                <p className="text-gray-600 dark:text-gray-300 text-sm mb-1">
                  Participants:{" "}
                  {draw.participantsLimit}
                </p>

                {/* <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  Ends at:{" "}
                  {new Date(draw.endDate).toLocaleString()}
                </p> */}

                {/* STATUS BUTTON */}
                {/* <button
                  disabled
                  className={`w-full py-3 rounded-xl font-semibold text-white
                    ${
                      ended
                        ? "bg-red-500"
                        : full
                        ? "bg-yellow-500"
                        : "bg-primary"
                    }`}
                >
                  {ended ? "Draw Ended" : full ? "Full" : "Active"}
                </button> */}

                {/* WINNER INFO */}
                {winner && (
                  <div className="mt-6 p-4 rounded-xl bg-green-100 dark:bg-green-900/30">
                    <p className="text-green-700 dark:text-green-400 font-semibold">
                      Winner
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

export default DrawsOnWithoutToken;
