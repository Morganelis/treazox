"use client";
import React, { useEffect, useState } from "react";

const BASE_URL = "https://treazoxbe.vercel.app/api/plans/withoutlogin";

const InvestmentPlans = () => {
  const [plansData, setPlansData] = useState([]);
  const [visiblePlans, setVisiblePlans] = useState(4);
  const [loading, setLoading] = useState(true);

  const handleViewMore = () => {
    setVisiblePlans(plansData.length);
  };

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await fetch(BASE_URL);
        const data = await res.json();

        // adjust this if your API response structure is different
        setPlansData(data?.plans || data);
      } catch (error) {
        console.error("Error fetching plans:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  if (loading) {
    return (
      <section className="pt-20 text-center text-primary font-semibold">
        Loading plans...
      </section>
    );
  }

  return (
    <section className="py-10 bg-gray-100 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary dark:text-white">
            Investment Plans
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choose an investment plan that fits your goals and start earning
            daily through our secure and transparent system.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {plansData.slice(0, visiblePlans).map((plan, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-800 shadow-[0_20px_40px_rgba(0,0,0,0.12)]
                           dark:shadow-[0_20px_40px_rgba(0,0,0,0.45)] transition"
            >
              <h3 className="text-xl font-semibold mb-4 text-primary dark:text-white">
                {plan.title}
              </h3>

              <div className="space-y-2 text-gray-600 text-sm">
                <p className="text-green-500">
                  <span className="font-medium text-primary dark:text-white">
                    Price:
                  </span>{" "}
                  ${plan.totalPrice}
                </p>

                <p className="text-green-500">
                  <span className="font-medium text-primary dark:text-white">
                    Daily Earning:
                  </span>{" "}
                  ${plan.dailyEarning} / day
                </p>

                <p className="text-green-500">
                  <span className="font-medium text-primary dark:text-white">
                    Duration:
                  </span>{" "}
                  {plan.duration} Days
                </p>
              </div>

              {/* <button className="mt-6 w-full py-2 rounded-lg bg-primary text-white hover:bg-primary/70 font-semibold transition">
                Invest Now
              </button> */}
            </div>
          ))}
        </div>

        {/* View More Button */}
        {visiblePlans < plansData.length && (
          <div className="mt-12 text-center">
            <button
              onClick={handleViewMore}
              className="px-8 py-3 rounded-lg border border-primary text-primary dark:border-white dark:text-white font-semibold hover:bg-primary hover:text-white transition"
            >
              View More
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default InvestmentPlans;
