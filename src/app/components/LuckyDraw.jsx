"use client";
import React, { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import Cookies from "js-cookie";

const LuckyDraw = () => {
  const [draws, setDraws] = useState([]);
  const [loading, setLoading] = useState(true);
  const [participating, setParticipating] = useState(false);

  const token = Cookies.get("token"); // kept as requested
  const userId = Cookies.get("userId") || "1234567890abcdef";

  // Dummy data
  const dummyDraws = [
    {
      _id: "1",
      winningPrice: 500,
      buyPrice: 50,
      participants: [{ userId: { _id: "1234567890abcdef", fullName: "John Doe" } }],
      participantsLimit: 5,
      endDate: new Date(new Date().getTime() + 3600 * 1000).toISOString(), // 1 hour later
      winners: [],
      winnersCount: 1,
    },
    {
      _id: "2",
      winningPrice: 1000,
      buyPrice: 100,
      participants: [],
      participantsLimit: 10,
      endDate: new Date(new Date().getTime() + 7200 * 1000).toISOString(), // 2 hours later
      winners: [],
      winnersCount: 2,
    },
  ];

  const fetchDraws = () => {
    setLoading(true);
    // simulate fetching
    setTimeout(() => {
      setDraws(dummyDraws);
      setLoading(false);
    }, 500);
  };

  const participate = (drawId) => {
    setParticipating(true);
    // simulate participation
    setTimeout(() => {
      toast.success("Participation successful!");
      // update dummy draws state
      setDraws((prev) =>
        prev.map((d) =>
          d._id === drawId
            ? {
                ...d,
                participants: [...d.participants, { userId: { _id: userId, fullName: "You" } }],
              }
            : d
        )
      );
      setParticipating(false);
    }, 500);
  };

  useEffect(() => {
    fetchDraws();
  }, []);

  if (loading) return  <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      Loading lucky draws...
    </div>;

  return (
    <section className="py-16 md:py-20 bg-gray-100 dark:bg-gray-900">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-primary dark:text-white">
            Lucky Draw
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Participate in Treazox Lucky Draw and get a chance to win exciting cash prizes, bonuses, and exclusive rewards.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {draws.length === 0 && <p>No active draws right now.</p>}

          {draws.map((draw) => {
            const now = new Date();
            const ended = now > new Date(draw.endDate);
            const full = draw.participants.length >= draw.participantsLimit;
            const joined = draw.participants.some((p) => p.userId._id === userId);
            const won = draw.winners.some((w) => w.userId?._id === userId);

            return (
              <div key={draw._id} className="p-6 sm:p-8 rounded-2xl bg-gray-50 dark:bg-gray-800 shadow-md">
                <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-primary dark:text-white">
                  Lucky Draw - ${draw.winningPrice} Prize
                </h3>
                <p className="text-gray-600 mb-2">
                  Entry Fee: ${draw.buyPrice} | Participants: {draw.participants.length}/{draw.participantsLimit}
                </p>
                <p className="text-gray-600 mb-2">Ends: {new Date(draw.endDate).toLocaleString()}</p>

                <button
                  className={`w-full px-6 py-3 mt-4 rounded-lg text-white font-semibold ${
                    ended || full || joined
                      ? "bg-primary/70 dark:bg-gray-700 cursor-not-allowed"
                      : "bg-primary hover:opacity-90"
                  }`}
                  disabled={ended || full || joined || participating}
                  onClick={() => participate(draw._id)}
                >
                  {won ? "You Won!" : ended ? "Draw Ended" : full ? "Full" : joined ? "Joined" : "Participate"}
                </button>

                {draw.winners.length > 0 && (
                  <div className="mt-6 p-4 bg-green-100 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">Winners</h4>
                    <ul className="text-green-700">
                      {draw.winners.map((w, idx) => (
                        <li key={idx}>{w.userId?.fullName || "User"} won ${(draw.winningPrice / draw.winnersCount).toFixed(2)}</li>
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
