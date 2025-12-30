"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import { Copy, FileText, Wallet, Gift } from "lucide-react";
import Cookies from "js-cookie";

const BASE_URL = "https://treazoxbackend.vercel.app/api";

const Dashboard = () => {
  const router = useRouter();
  const token = Cookies.get("token");

  const [activeTab, setActiveTab] = useState("account");

  const [dashboard, setDashboard] = useState({
    totalAssets: 0,
    availableBalance: 0,
    dailyIncome: 0,
  });

  const [commissionBalance, setCommissionBalance] = useState(0);
  const [referralCode, setReferralCode] = useState("");

  const [accountHistory, setAccountHistory] = useState([]);
  const [withdrawHistory, setWithdrawHistory] = useState([]);
  const [luckyHistory, setLuckyHistory] = useState([]);
  // const [referralHistory, setReferralHistory] = useState([]);

  const referralLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/signup?ref=${referralCode}`
      : "";

  /* ================= FETCH USER ================= */
  useEffect(() => {
    if (!token) return;

    const fetchMe = async () => {
      try {
        const res = await fetch(`${BASE_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        setDashboard({
          totalAssets: data.user.totalAssets || 0,
          availableBalance: data.user.balance || 0,
          dailyIncome: data.user.dailyIncome || 0,
        });

        setCommissionBalance(data.user.commissionBalance || 0);
        setReferralCode(data.user.referralCode || "");
      } catch (err) {
        toast.error(err.message || "Failed to load user");
      }
    };

    fetchMe();
  }, [token]);

  /* ================= FETCH REFERRALS ================= */
  // useEffect(() => {
  //   if (!token) return;

  //   const fetchReferrals = async () => {
  //     try {
  //       const res = await fetch(`${BASE_URL}/users/referrals`, {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });
  //       const data = await res.json();
  //       if (!res.ok) throw new Error(data.message);
  //       setReferralHistory(data.users || []);
  //     } catch (err) {
  //       toast.error(err.message || "Failed to load referrals");
  //     }
  //   };

  //   fetchReferrals();
  // }, [token]);

  /* ================= HISTORY FETCHERS ================= */
  const fetchAccountHistory = async () => {
    const res = await fetch(`${BASE_URL}/accounthistory`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setAccountHistory(data.history || []);
  };

  const fetchWithdrawHistory = async () => {
    const res = await fetch(`${BASE_URL}/withdraw/history`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setWithdrawHistory(data.withdraws || []);
  };

  const fetchLuckyHistory = async () => {
    const res = await fetch(`${BASE_URL}/luckydraw/wins`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setLuckyHistory(data.wins || []);
  };

  /* ================= TAB CHANGE ================= */
  useEffect(() => {
    if (!token) return;

    if (activeTab === "account") fetchAccountHistory();
    if (activeTab === "withdraw") fetchWithdrawHistory();
    if (activeTab === "lucky") fetchLuckyHistory();
  }, [activeTab, token]);

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success("Referral link copied!");
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
      <Toaster position="top-right" />

      <div className="max-w-[1170px] mx-auto p-4 sm:p-6">
        <h1 className="text-3xl font-bold mb-6 text-primary dark:text-white">
          Assets
        </h1>

        {/* ================= ASSETS ================= */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-8">
          <p className="text-gray-500">Total Assets</p>
          <h2 className="text-3xl font-bold text-green-600 mb-6">
            ${dashboard.availableBalance + commissionBalance}
          </h2>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Available Balance</p>
              <p className="font-semibold text-green-500">
                ${dashboard.availableBalance}
              </p>
            </div>

            <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Team Income</p>
              <p className="font-semibold text-green-500">
                ${commissionBalance}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => router.push("/deposit")}
              className="w-full py-3 bg-green-600 text-white rounded-lg"
            >
              Deposit
            </button>
            <button
              onClick={() => router.push("/withdraw")}
              className="w-full py-3 bg-blue-600 text-white rounded-lg"
            >
              Withdraw
            </button>
          </div>
        </div>

        {/* ================= TABS ================= */}
       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-6">
  {[
    { id: "account", label: "Account History", icon: FileText },
    { id: "withdraw", label: "Withdraw History", icon: Wallet },
    { id: "lucky", label: "Treasure Gift Cards", icon: Gift },
    // { id: "referral", label: "Referral History", icon: Copy },
  ].map(({ id, label, icon: Icon }) => (
    <button
      key={id}
      onClick={() => setActiveTab(id)}
      className={`p-4 rounded-lg shadow flex flex-col items-center gap-1 transition-colors duration-200 
        ${
          activeTab === id
            ? "border border-green-300 text-green-500 bg-white dark:bg-gray-800"
            : "bg-white dark:bg-gray-800 text-primary dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
        }
      `}
    >
      <Icon className="w-5 h-5 text-blue-600" />
      <span className="text-sm text-center">{label}</span>
    </button>
  ))}
</div>

        {/* ================= TABLE ================= */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          {activeTab === "account" && (
            <HistoryTable
              title="Account History"
              data={accountHistory}
              activeTab={activeTab}
            />
          )}
          {activeTab === "withdraw" && (
            <HistoryTable
              title="Withdraw History"
              data={withdrawHistory}
              activeTab={activeTab}
            />
          )}
          {activeTab === "lucky" && (
            <HistoryTable
              title="Lucky Draw Wins"
              data={luckyHistory}
              activeTab={activeTab}
            />
          )}
          {activeTab === "referral" && (
            <ReferralTable data={referralHistory} />
          )}
        </div>

        {/* ================= REFERRAL ================= */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mt-8">
          <p className="text-sm text-gray-500 mb-1">Your Referral Code</p>
          <p className="font-mono text-green-500 mb-4">{referralCode}</p>

          <div className="flex gap-2">
            <input
              readOnly
              value={referralLink}
              className="flex-1 p-3 text-green-500 bg-gray-100 dark:bg-gray-900 rounded text-sm"
            />
            <button
              onClick={copyReferralLink}
              className="p-3 bg-blue-600 text-white rounded-lg"
            >
              <Copy />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ================= TABLE ================= */
const HistoryTable = ({ title, data, activeTab }) => (
  <div className="p-4 sm:p-6">
    <h2 className="text-lg font-semibold mb-4 text-primary dark:text-white">
      {title}
    </h2>

    <table className="w-full text-sm">
      <thead>
        <tr className="border-b text-primary dark:text-white">
          <th className="text-left py-2">Type</th>
          <th className="text-left">Amount</th>
          <th className="text-left">Status</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, i) => {
          const status = item.status?.toLowerCase();

          return (
            <tr key={i}>
              <td className="py-3 text-primary dark:text-white">
                {activeTab === "account"
                  ? item.type
                  : activeTab === "withdraw"
                  ? "Withdraw"
                  : "Lucky Draw"}
              </td>

              <td className="text-primary dark:text-white">
                ${item.amount}
              </td>

              <td>
                <span
                  className={`text-xs font-semibold
                    ${
                      ["completed", "success", "approved"].includes(status)
                        ? "text-green-500"
                        : ["pending", "processing"].includes(status)
                        ? "text-orange-500"
                        : "text-red-500"
                    }`}
                >
                  {item.status}
                </span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

/* ================= REFERRAL TABLE ================= */
// const ReferralTable = ({ data }) => (
//   <div className="p-4 sm:p-6">
//     <h2 className="text-lg font-semibold mb-4 text-primary dark:text-white">
//       Referral History
//     </h2>

//     <table className="w-full text-sm">
//       <thead>
//         <tr className="border-b text-primary dark:text-white">
//           <th className="text-left py-2">Name</th>
//           <th className="text-left">Email</th>
//           <th className="text-left">Joined At</th>
//           <th className="text-left">Commission Earned</th>
//         </tr>
//       </thead>
//       <tbody>
//         {data.map((item, i) => (
//           <tr key={i}>
//             <td className="text-primary dark:text-white">{item.fullName}</td>
//             <td className="text-primary dark:text-white">{item.email}</td>
//             <td className="text-primary dark:text-white">
//               {new Date(item.createdAt).toLocaleDateString()}
//             </td>
//             <td className="text-green-500 font-semibold">
//               ${item.commissionEarned || 0}
//             </td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   </div>
// );

export default Dashboard;
