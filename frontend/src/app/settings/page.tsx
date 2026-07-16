"use client";

import React, { useState, useEffect } from "react";
import { 
  Settings as SettingsIcon, 
  Bell, 
  Mail, 
  Megaphone, 
  ShieldAlert, 
  CheckCircle2, 
  Loader2, 
  CreditCard 
} from "lucide-react";

interface Preferences {
  notifyJobAlerts: boolean;
  notifyMarketing: boolean;
  notifyPromos: boolean;
}

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  
  // Account Plan State
  const [userPlan, setUserPlan] = useState<"FREE" | "PRO" | "ENTERPRISE">("FREE");
  
  // Preferences State
  const [prefs, setPrefs] = useState<Preferences>({
    notifyJobAlerts: true,
    notifyMarketing: false,
    notifyPromos: false
  });

  const [payments, setPayments] = useState<any[]>([]);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const headers = { "Authorization": token ? `Bearer ${token}` : "" };
      
      // 1. Fetch Subscription Status
      const subRes = await fetch("http://localhost:5000/api/payment/subscription-status", { headers });
      if (subRes.ok) {
        const subData = await subRes.json();
        setUserPlan(subData.plan || "FREE");
      }

      // 2. Fetch User Preferences
      const prefRes = await fetch("http://localhost:5000/api/profile/preferences", { headers });
      if (prefRes.ok) {
        const prefData = await prefRes.json();
        setPrefs({
          notifyJobAlerts: prefData.notifyJobAlerts,
          notifyMarketing: prefData.notifyMarketing,
          notifyPromos: prefData.notifyPromos
        });
      }

      // 3. Fetch Payments History
      const payRes = await fetch("http://localhost:5000/api/payment/transactions", { headers });
      if (payRes.ok) {
        const payData = await payRes.json();
        setPayments(payData);
      }
    } catch (err) {
      console.error("Failed to load user settings", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleToggle = (key: keyof Preferences) => {
    setPrefs(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/profile/preferences", {
        method: "PUT",
        headers: {
          "Authorization": token ? `Bearer ${token}` : "",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(prefs)
      });

      if (!res.ok) throw new Error("Failed to save preferences.");
      
      setMessage({ type: "success", text: "Communication preferences updated successfully!" });
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to update preferences." });
    } finally {
      setSaving(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!window.confirm("Are you sure you want to cancel your Pro subscription? You will lose access to unlimited AI scans immediately.")) {
      return;
    }
    
    setCanceling(true);
    setMessage(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/payment/cancel-subscription", {
        method: "POST",
        headers: { "Authorization": token ? `Bearer ${token}` : "" }
      });

      if (!res.ok) throw new Error("Failed to cancel subscription.");

      setUserPlan("FREE");
      setMessage({ type: "success", text: "Pro subscription canceled successfully. Account downgraded to Free." });
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Subscription cancellation failed." });
    } finally {
      setCanceling(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[50vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 text-theme-accent animate-spin" />
        <span className="text-zinc-400 text-xs font-semibold">Loading settings...</span>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-300 py-4">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
          <SettingsIcon className="h-6 w-6 text-theme-accent" />
          Account Settings
        </h1>
        <p className="text-sm text-zinc-500">Manage billing subscriptions and control communication channels.</p>
      </div>

      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-3 border text-xs ${
          message.type === "success" 
            ? "bg-green-950/20 border-green-500/20 text-green-400" 
            : "bg-red-950/20 border-red-500/20 text-red-400"
        }`}>
          {message.type === "success" ? <CheckCircle2 className="h-4.5 w-4.5 shrink-0" /> : <ShieldAlert className="h-4.5 w-4.5 shrink-0" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* SECTION 1: Subscriptions & Billing */}
      <div className="bg-zinc-900/20 border border-zinc-850 rounded-2xl p-6 space-y-6">
        <div>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-theme-accent" />
            Billing & Subscription
          </h2>
          <p className="text-xs text-zinc-500 mt-1">Check your current plan tier or opt-out at any time.</p>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-zinc-950/20 border border-zinc-850 p-5 rounded-xl">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-400">Current Plan:</span>
              <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full border ${
                userPlan === "PRO" 
                  ? "bg-theme-accent-bg text-theme-accent border-theme-accent-border" 
                  : "bg-zinc-800 text-zinc-500 border-zinc-700"
              }`}>
                {userPlan} Plan
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 mt-2">
              {userPlan === "PRO" 
                ? "You have full access to unlimited resumes, custom portfolios, and ATS tailoring tools." 
                : "Upgrade to PRO for just $3.99/mo to unlock unlimited AI features and custom domains."}
            </p>
          </div>

          <div>
            {userPlan === "PRO" ? (
              <button
                onClick={handleCancelSubscription}
                disabled={canceling}
                className="bg-red-950/40 text-red-400 hover:bg-red-900/40 border border-red-500/20 px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                {canceling ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Cancel Pro Tier"}
              </button>
            ) : (
              <a
                href="/pricing"
                className="bg-theme-btn text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg shadow-theme-btn block hover:-translate-y-0.5"
              >
                Upgrade to Pro
              </a>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 2: Communication Preferences (Opt-in / Opt-out) */}
      <form onSubmit={handleSavePreferences} className="bg-zinc-900/20 border border-zinc-850 rounded-2xl p-6 space-y-6">
        <div>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Bell className="h-4 w-4 text-theme-accent" />
            Communication & Preferences
          </h2>
          <p className="text-xs text-zinc-500 mt-1">Choose what notifications, marketing campaigns, and adverts you receive.</p>
        </div>

        <div className="space-y-4">
          {/* Preference 1: Job Match Alerts */}
          <div className="flex items-start justify-between gap-4 p-4 rounded-xl border border-zinc-850 bg-zinc-950/10">
            <div className="flex items-start gap-3">
              <Bell className="h-5 w-5 text-theme-accent shrink-0 mt-0.5" />
              <div>
                <span className="block text-xs font-bold text-white">Job Match & ATS Alerts</span>
                <span className="block text-[11px] text-zinc-500 mt-1">Get immediate dashboard notifications when your resume matches target jobs.</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleToggle("notifyJobAlerts")}
              className={`w-10 h-6 rounded-full p-1 transition-colors duration-200 shrink-0 ${
                prefs.notifyJobAlerts ? "bg-theme-accent" : "bg-zinc-800"
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                prefs.notifyJobAlerts ? "translate-x-4" : "translate-x-0"
              }`} />
            </button>
          </div>

          {/* Preference 2: Email Campaigns */}
          <div className="flex items-start justify-between gap-4 p-4 rounded-xl border border-zinc-850 bg-zinc-950/10">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-theme-accent shrink-0 mt-0.5" />
              <div>
                <span className="block text-xs font-bold text-white">Email Campaigns & Newsletters</span>
                <span className="block text-[11px] text-zinc-500 mt-1">Receive weekly career progression updates, writing guides, and industry news.</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleToggle("notifyMarketing")}
              className={`w-10 h-6 rounded-full p-1 transition-colors duration-200 shrink-0 ${
                prefs.notifyMarketing ? "bg-theme-accent" : "bg-zinc-800"
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                prefs.notifyMarketing ? "translate-x-4" : "translate-x-0"
              }`} />
            </button>
          </div>

          {/* Preference 3: Promos & Adverts */}
          <div className="flex items-start justify-between gap-4 p-4 rounded-xl border border-zinc-850 bg-zinc-950/10">
            <div className="flex items-start gap-3">
              <Megaphone className="h-5 w-5 text-theme-accent shrink-0 mt-0.5" />
              <div>
                <span className="block text-xs font-bold text-white">Promos & Special Advertisements</span>
                <span className="block text-[11px] text-zinc-500 mt-1">Subscribe to coupon offers, partner promotions, and discounted advertisement deals.</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleToggle("notifyPromos")}
              className={`w-10 h-6 rounded-full p-1 transition-colors duration-200 shrink-0 ${
                prefs.notifyPromos ? "bg-theme-accent" : "bg-zinc-800"
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                prefs.notifyPromos ? "translate-x-4" : "translate-x-0"
              }`} />
            </button>
          </div>
        </div>

        {/* Form Submission */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-theme-btn text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg shadow-theme-btn flex items-center gap-1.5 hover:-translate-y-0.5"
          >
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Save Preferences"}
          </button>
        </div>
      </form>

      {/* SECTION 3: Billing History */}
      {payments.length > 0 && (
        <div className="bg-zinc-900/20 border border-zinc-850 rounded-2xl p-6 space-y-6">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-theme-accent" />
              Billing History & Receipts
            </h2>
            <p className="text-xs text-zinc-500 mt-1">Download or print invoices of your past payments.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-500 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">Receipt ID</th>
                  <th className="py-3 px-4">Billing Plan</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900/60">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-zinc-900/10 text-zinc-300">
                    <td className="py-3.5 px-4 font-mono text-zinc-400">{p.id.slice(0, 8).toUpperCase()}</td>
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
                        onClick={() => window.open(`http://localhost:5000/api/payment/invoice/${p.id}`, '_blank')}
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
        </div>
      )}
    </div>
  );
}
