"use client";
import React, { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import Cookies from "js-cookie";

const LuckyDraw = () => {
  const [draws, setDraws] = useState([]);
  const [loading, setLoading] = useState(true);
  const [participating, setParticipating] = useState(false);
 const LUCKYDRAW_URL = "https://treazoxbackend.vercel.app/api/luckydraw/";
  const token = Cookies.get("token");
  const userId = Cookies.get("userId");

  // ------------------ Fetch Draws ------------------
  const fetchDraws = async () => {
    try {
      setLoading(true);

      const res = await fetch(LUCKYDRAW_URL,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch draws");
      }

      setDraws(data.draws || []);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ------------------ Participate ------------------
  const participate = async (drawId) => {
    try {
      setParticipating(true);

      const res = await fetch(
        `${LUCKYDRAW_URL}participate/${drawId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Participation failed");
      }

      toast.success("Participation successful!");
      fetchDraws(); // refresh draw state
    } catch (error) {
      toast.error(error.message);
    } finally {
      setParticipating(false);
    }
  };

  useEffect(() => {
    fetchDraws();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
        Loading lucky draws...
      </div>
    );

  return (
    <section className="py-16 md:py-20 min-h-screen bg-gray-100 dark:bg-gray-900">
      <Toaster position="top-right" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-primary dark:text-white">
            Lucky Draw
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Participate in Treazox Lucky Draw and get a chance to win exciting
            cash prizes and rewards.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {draws.length === 0 && <p>No active draws right now.</p>}

          {draws.map((draw) => {
            const now = new Date();
            const ended = now > new Date(draw.endDate);
            const full =
              draw.participants.length >= draw.participantsLimit;
            const joined = draw.participants.some(
              (p) => p.userId?._id === userId
            );
            const won = draw.winners?.some(
              (w) => w.userId?._id === userId
            );

            return (
              <div
                key={draw._id}
                className="p-6 sm:p-8 rounded-2xl bg-gray-50 dark:bg-gray-800 shadow-md"
              >
                <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-primary dark:text-white">
                  Lucky Draw – ${draw.winningPrice} Prize
                </h3>

                <p className="text-gray-600 mb-2">
                  Entry Fee: ${draw.buyPrice} | Participants:{" "}
                  {draw.participants.length}/{draw.participantsLimit}
                </p>

                <p className="text-gray-600 mb-2">
                  Ends: {new Date(draw.endDate).toLocaleString()}
                </p>

                <button
                  className={`w-full px-6 py-3 mt-4 rounded-lg text-white font-semibold ${
                    ended || full || joined
                      ? "bg-primary/70 dark:bg-gray-700 cursor-not-allowed"
                      : "bg-primary hover:opacity-90"
                  }`}
                  disabled={
                    ended || full || joined || participating
                  }
                  onClick={() => participate(draw._id)}
                >
                  {won
                    ? "You Won!"
                    : ended
                    ? "Draw Ended"
                    : full
                    ? "Full"
                    : joined
                    ? "Joined"
                    : "Participate"}
                </button>

                {draw.winners?.length > 0 && (
                  <div className="mt-6 p-4 bg-green-100 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">
                      Winners
                    </h4>
                    <ul className="text-green-700">
                      {draw.winners.map((w, idx) => (
                        <li key={idx}>
                          {w.userId?.fullName || "User"} won $
                          {(draw.winningPrice /
                            draw.winnersCount).toFixed(2)}
                        </li>
                      ))}
                    </ul>
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
