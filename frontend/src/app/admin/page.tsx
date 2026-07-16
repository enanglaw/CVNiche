"use client";

import React, { useState, useEffect } from "react";
import { 
  Users, 
  CreditCard, 
  Activity, 
  LifeBuoy, 
  TrendingUp, 
  DollarSign, 
  Check, 
  UserMinus, 
  UserPlus, 
  AlertCircle,
  Loader2
} from "lucide-react";

interface UserItem {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
  plan: string;
  createdAt: string;
}

interface PaymentItem {
  id: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  user: {
    email: string;
    firstName: string | null;
    lastName: string | null;
  };
}

interface TicketItem {
  id: string;
  userEmail: string;
  subject: string;
  status: string;
  category: string;
  createdAt: string;
}

interface Metrics {
  totalUsers: number;
  activeSubscribers: number;
  mrr: number;
  totalRevenue: number;
  churnRate: number;
  conversionRate: number;
}

export default function AdminConsole() {
  const [activeTab, setActiveTab] = useState<"users" | "payments" | "support" | "campaigns">("users");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Data States
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [campaignAnalytics, setCampaignAnalytics] = useState<any[]>([]);
  
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchAdminData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Authorization": token ? `Bearer ${token}` : "",
        "Content-Type": "application/json"
      };

      // Fetch all administrative resources
      const [mRes, uRes, pRes, tRes, cRes, aRes] = await Promise.all([
        fetch("http://localhost:5001/api/admin/metrics", { headers }),
        fetch("http://localhost:5001/api/admin/users", { headers }),
        fetch("http://localhost:5001/api/admin/payments", { headers }),
        fetch("http://localhost:5001/api/admin/support-tickets", { headers }),
        fetch("http://localhost:5001/api/campaigns", { headers }),
        fetch("http://localhost:5001/api/campaigns/analytics", { headers })
      ]);

      if (!mRes.ok || !uRes.ok || !pRes.ok || !tRes.ok || !cRes.ok || !aRes.ok) {
        throw new Error("Failed to load administrative resources. Insufficient permissions.");
      }

      const mData = await mRes.json();
      const uData = await uRes.json();
      const pData = await pRes.json();
      const tData = await tRes.json();
      const cData = await cRes.json();
      const aData = await aRes.json();

      setMetrics(mData);
      setUsers(uData);
      setPayments(pData);
      setTickets(tData);
      setCampaigns(cData);
      setCampaignAnalytics(aData);
    } catch (err: any) {
      setError(err.message || "Failed to load administrative logs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  // Action: Override User plan
  const handleOverridePlan = async (userId: string, targetPlan: "FREE" | "PRO") => {
    setActionLoadingId(userId);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5001/api/admin/users/override-plan", {
        method: "POST",
        headers: {
          "Authorization": token ? `Bearer ${token}` : "",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ userId, plan: targetPlan })
      });

      if (!res.ok) {
        throw new Error("Failed to override plan");
      }

      // Re-fetch users and metrics
      await fetchAdminData();
    } catch (err: any) {
      alert(err.message || "Plan override failed");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Action: Resolve Support Ticket
  const handleResolveTicket = async (ticketId: string) => {
    setActionLoadingId(ticketId);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5001/api/admin/support-tickets/${ticketId}/resolve`, {
        method: "POST",
        headers: {
          "Authorization": token ? `Bearer ${token}` : ""
        }
      });

      if (!res.ok) {
        throw new Error("Failed to resolve ticket");
      }

      await fetchAdminData();
    } catch (err: any) {
      alert(err.message || "Resolve support ticket failed");
    } finally {
      setActionLoadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="h-[50vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 text-theme-accent animate-spin" />
        <span className="text-zinc-400 text-xs font-semibold">Loading Admin Dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-950/20 border border-red-500/20 rounded-2xl p-6 max-w-xl mx-auto space-y-4 text-center mt-12 animate-in fade-in duration-300">
        <AlertCircle className="h-10 w-10 text-red-500 mx-auto" />
        <h2 className="text-lg font-bold text-red-400">Access Restricted</h2>
        <p className="text-xs text-zinc-400 leading-relaxed">{error}</p>
        <button 
          onClick={fetchAdminData}
          className="bg-red-900/30 hover:bg-red-900/50 border border-red-500/20 text-red-400 px-4 py-2 rounded-xl text-xs font-semibold transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
          <Activity className="h-6 w-6 text-theme-accent" />
          Admin Management Console
        </h1>
        <p className="text-sm text-zinc-500">Monitor transaction records, override subscriber quotas, and manage support tickets.</p>
      </div>

      {/* BI Metrics Cards */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* MRR Card */}
          <div className="bg-zinc-900/40 border border-zinc-850 rounded-xl p-5 hover:border-zinc-800 transition-all">
            <div className="flex items-center justify-between text-zinc-500 uppercase tracking-wider text-[10px] font-bold">
              <span>Monthly Recurring Rev</span>
              <DollarSign className="h-4 w-4 text-theme-accent" />
            </div>
            <div className="mt-3 flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-zinc-100">${metrics.mrr.toFixed(2)}</span>
              <span className="text-[10px] text-green-400 font-semibold tracking-wide">MRR</span>
            </div>
          </div>

          {/* Subscribers Card */}
          <div className="bg-zinc-900/40 border border-zinc-850 rounded-xl p-5 hover:border-zinc-800 transition-all">
            <div className="flex items-center justify-between text-zinc-500 uppercase tracking-wider text-[10px] font-bold">
              <span>Active Subscribers</span>
              <Users className="h-4 w-4 text-theme-accent" />
            </div>
            <div className="mt-3 flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-zinc-100">{metrics.activeSubscribers}</span>
              <span className="text-[10px] text-green-400 font-semibold tracking-wide">Users</span>
            </div>
          </div>

          {/* Conversion Rate Card */}
          <div className="bg-zinc-900/40 border border-zinc-850 rounded-xl p-5 hover:border-zinc-800 transition-all">
            <div className="flex items-center justify-between text-zinc-500 uppercase tracking-wider text-[10px] font-bold">
              <span>Conversion Rate</span>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
            <div className="mt-3 flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-zinc-100">{metrics.conversionRate}%</span>
              <span className="text-[10px] text-zinc-500 font-medium">Free to Pro</span>
            </div>
          </div>

          {/* Churn Rate Card */}
          <div className="bg-zinc-900/40 border border-zinc-850 rounded-xl p-5 hover:border-zinc-800 transition-all">
            <div className="flex items-center justify-between text-zinc-500 uppercase tracking-wider text-[10px] font-bold">
              <span>Monthly Churn</span>
              <Activity className="h-4 w-4 text-red-500" />
            </div>
            <div className="mt-3 flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-zinc-100">{metrics.churnRate}%</span>
              <span className="text-[10px] text-zinc-500 font-medium">industry low</span>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-zinc-800 gap-6">
        <button 
          onClick={() => setActiveTab("users")}
          className={`pb-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
            activeTab === "users" ? "border-theme-accent text-theme-accent" : "border-transparent text-zinc-500 hover:text-zinc-300"
          }`}
        >
          User Override Manager
        </button>
        <button 
          onClick={() => setActiveTab("payments")}
          className={`pb-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
            activeTab === "payments" ? "border-theme-accent text-theme-accent" : "border-transparent text-zinc-500 hover:text-zinc-300"
          }`}
        >
          Payment Transactions
        </button>
        <button 
          onClick={() => setActiveTab("support")}
          className={`pb-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
            activeTab === "support" ? "border-theme-accent text-theme-accent" : "border-transparent text-zinc-500 hover:text-zinc-300"
          }`}
        >
          Support Requests
        </button>
        <button 
          onClick={() => setActiveTab("campaigns")}
          className={`pb-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
            activeTab === "campaigns" ? "border-theme-accent text-theme-accent" : "border-transparent text-zinc-500 hover:text-zinc-300"
          }`}
        >
          Ad Campaigns & ROI
        </button>
      </div>

      {/* Tab Panels */}
      <div className="bg-zinc-900/20 border border-zinc-850 rounded-2xl overflow-hidden p-6">
        
        {/* TAB 1: User Manager */}
        {activeTab === "users" && (
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-500 font-semibold uppercase tracking-wider">
                    <th className="py-3 px-4">User Email</th>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Tier Plan</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900/60">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-zinc-900/10 text-zinc-300">
                      <td className="py-3.5 px-4 font-medium text-zinc-200">{u.email}</td>
                      <td className="py-3.5 px-4">{u.firstName ? `${u.firstName} ${u.lastName || ""}` : "-"}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          u.role === "ADMIN" ? "bg-red-900/20 text-red-400 border border-red-500/10" : "bg-zinc-800 text-zinc-400"
                        }`}>{u.role}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          u.plan === "PRO" ? "bg-theme-accent-bg text-theme-accent border border-theme-accent-border" : "bg-zinc-800 text-zinc-500"
                        }`}>{u.plan}</span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {actionLoadingId === u.id ? (
                          <Loader2 className="h-4.5 w-4.5 text-zinc-500 animate-spin ml-auto" />
                        ) : (
                          <div className="flex gap-2 justify-end">
                            {u.plan === "FREE" ? (
                              <button 
                                onClick={() => handleOverridePlan(u.id, "PRO")}
                                className="bg-theme-accent-bg text-theme-accent border border-theme-accent-border px-2.5 py-1 rounded-lg hover:bg-theme-accent-bg/80 flex items-center gap-1 font-semibold transition-all"
                              >
                                <UserPlus className="h-3.5 w-3.5" />
                                Grant PRO
                              </button>
                            ) : (
                              <button 
                                onClick={() => handleOverridePlan(u.id, "FREE")}
                                className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700/60 text-zinc-400 px-2.5 py-1 rounded-lg flex items-center gap-1 font-semibold transition-all"
                              >
                                <UserMinus className="h-3.5 w-3.5" />
                                Revoke PRO
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: Payment Transactions */}
        {activeTab === "payments" && (
          <div className="space-y-4">
            {payments.length === 0 ? (
              <div className="py-12 text-center text-zinc-500 text-xs">
                No subscription receipts have been generated in this session yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-zinc-800 text-zinc-500 font-semibold uppercase tracking-wider">
                      <th className="py-3 px-4">Receipt ID</th>
                      <th className="py-3 px-4">User</th>
                      <th className="py-3 px-4">Billing Plan</th>
                      <th className="py-3 px-4">Total Price</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4 text-right">Invoice</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900/60">
                    {payments.map((p) => (
                      <tr key={p.id} className="hover:bg-zinc-900/10 text-zinc-300">
                        <td className="py-3.5 px-4 font-mono text-zinc-400">{p.id.slice(0, 8)}...</td>
                        <td className="py-3.5 px-4">{p.user.email}</td>
                        <td className="py-3.5 px-4">Pro Plan</td>
                        <td className="py-3.5 px-4 font-bold text-white">${p.amount.toFixed(2)}</td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            p.status === "succeeded" ? "bg-green-950/20 text-green-400 border border-green-500/10" : "bg-red-950/20 text-red-400"
                          }`}>{p.status}</span>
                        </td>
                        <td className="py-3.5 px-4 text-zinc-500">{new Date(p.createdAt).toLocaleDateString()}</td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => window.open(`http://localhost:5001/api/payment/invoice/${p.id}`, '_blank')}
                            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 px-2 py-1 rounded font-semibold text-[10px] transition-colors"
                          >
                            View Invoice
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Support Inquiries */}
        {activeTab === "support" && (
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-500 font-semibold uppercase tracking-wider">
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">User Email</th>
                    <th className="py-3 px-4">Subject</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900/60">
                  {tickets.map((t) => (
                    <tr key={t.id} className="hover:bg-zinc-900/10 text-zinc-300">
                      <td className="py-3.5 px-4 font-bold text-zinc-400">{t.category}</td>
                      <td className="py-3.5 px-4">{t.userEmail}</td>
                      <td className="py-3.5 px-4 text-zinc-200">{t.subject}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          t.status === "RESOLVED" ? "bg-green-950/20 text-green-400 border border-green-500/10" : "bg-yellow-950/20 text-yellow-400 border border-yellow-500/10"
                        }`}>{t.status}</span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {t.status === "OPEN" ? (
                          actionLoadingId === t.id ? (
                            <Loader2 className="h-4 w-4 text-zinc-500 animate-spin ml-auto" />
                          ) : (
                            <button 
                              onClick={() => handleResolveTicket(t.id)}
                              className="bg-green-950/40 text-green-400 hover:bg-green-900/50 border border-green-500/20 px-2.5 py-1 rounded-lg flex items-center gap-1 font-semibold transition-all ml-auto"
                            >
                              <Check className="h-3.5 w-3.5" />
                              Mark Resolved
                            </button>
                          )
                        ) : (
                          <span className="text-[10px] text-zinc-500 italic">Resolved</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: Ad Campaigns & ROI */}
        {activeTab === "campaigns" && (
          <div className="space-y-8">
            {/* ROI Grouped Analytics Grid */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Marketing Conversion Attribution</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {campaignAnalytics.map((c) => (
                  <div key={c.channel} className="bg-zinc-950/40 border border-zinc-850 p-4 rounded-xl">
                    <div className="flex justify-between items-center text-xs font-bold text-zinc-300">
                      <span>{c.channel}</span>
                      <span className="text-theme-accent">{c.conversionRate}% ROI</span>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] text-zinc-500">
                      <div>Clicks: <span className="text-zinc-300 font-semibold">{c.clicks}</span></div>
                      <div>Signups: <span className="text-zinc-300 font-semibold">{c.signups}</span></div>
                      <div>Pro Sub: <span className="text-zinc-300 font-semibold">{c.conversions}</span></div>
                      <div>Revenue: <span className="text-green-400 font-bold">${c.revenue.toFixed(2)}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Broadcast Ad Form & Campaigns Logs Split */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form: Broadcast New Ad */}
              <div className="bg-zinc-950/20 border border-zinc-850 p-5 rounded-xl space-y-4 h-fit">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">Broadcast Social Campaign</h3>
                <p className="text-[11px] text-zinc-500">Simulate broadcasting an ad copy to social platform APIs with UTM landing tags.</p>
                
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  const target = e.target as any;
                  const title = target.campaignTitle.value;
                  const channel = target.campaignChannel.value;
                  const adCopy = target.campaignCopy.value;
                  
                  if (!title || !adCopy) return alert("Fields are required.");
                  
                  setActionLoadingId("broadcast");
                  try {
                    const token = localStorage.getItem("token");
                    const res = await fetch("http://localhost:5001/api/campaigns/broadcast", {
                      method: "POST",
                      headers: {
                        "Authorization": token ? `Bearer ${token}` : "",
                        "Content-Type": "application/json"
                      },
                      body: JSON.stringify({ title, channel, adCopy })
                    });
                    if (!res.ok) throw new Error("Failed to broadcast ad");
                    
                    target.reset();
                    await fetchAdminData();
                    alert("Ad campaign successfully simulated and broadcast!");
                  } catch (err: any) {
                    alert(err.message || "Broadcast failed");
                  } finally {
                    setActionLoadingId(null);
                  }
                }} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block text-zinc-400 mb-1 font-semibold">Ad Campaign Title</label>
                    <input name="campaignTitle" type="text" placeholder="e.g. Summer Promo 2026" className="w-full bg-zinc-900 border border-zinc-800 p-2.5 rounded-lg text-white font-medium" />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1 font-semibold">Social Network Channel</label>
                    <select name="campaignChannel" className="w-full bg-zinc-900 border border-zinc-800 p-2.5 rounded-lg text-white font-medium">
                      <option value="facebook">Facebook Ads</option>
                      <option value="x">X / Twitter Ads</option>
                      <option value="tiktok">TikTok Ads</option>
                      <option value="linkedin">LinkedIn Ads</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1 font-semibold">Creative Ad Copy</label>
                    <textarea name="campaignCopy" rows={3} placeholder="Write creative ad copywriting..." className="w-full bg-zinc-900 border border-zinc-800 p-2.5 rounded-lg text-white font-medium" />
                  </div>
                  <button
                    type="submit"
                    disabled={actionLoadingId === "broadcast"}
                    className="w-full bg-theme-btn text-white py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-theme-btn flex items-center justify-center gap-1.5 hover:-translate-y-0.5 duration-200 cursor-pointer"
                  >
                    {actionLoadingId === "broadcast" ? "Broadcasting..." : "Broadcast Ad Creative"}
                  </button>
                </form>
              </div>

              {/* Active Campaigns Log */}
              <div className="lg:col-span-2 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">Active Ad Campaigns</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-[11px]">
                    <thead>
                      <tr className="border-b border-zinc-800 text-zinc-500 font-semibold uppercase tracking-wider">
                        <th className="py-2.5 px-3">Title</th>
                        <th className="py-2.5 px-3">Channel</th>
                        <th className="py-2.5 px-3">Clicks</th>
                        <th className="py-2.5 px-3">Signups</th>
                        <th className="py-2.5 px-3">Revenue</th>
                        <th className="py-2.5 px-3 text-right">Attribution Link</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900/60 text-zinc-400">
                      {campaigns.map((c) => (
                        <tr key={c.id} className="hover:bg-zinc-900/10">
                          <td className="py-3 px-3 font-semibold text-zinc-200">{c.title}</td>
                          <td className="py-3 px-3 uppercase text-[9px] font-bold text-theme-accent">{c.channel}</td>
                          <td className="py-3 px-3">{c.clicks}</td>
                          <td className="py-3 px-3">{c.signups}</td>
                          <td className="py-3 px-3 text-green-400 font-semibold">${c.revenue.toFixed(2)}</td>
                          <td className="py-3 px-3 text-right">
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(c.targetUrl);
                                alert("Attribution URL copied to clipboard!");
                              }}
                              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 px-2 py-1 rounded font-semibold text-[9px] transition-all cursor-pointer"
                            >
                              Copy URL
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
