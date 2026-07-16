"use client";

import React, { useState } from "react";
import { Check, ShieldCheck, HeartHandshake, Sparkles, AlertCircle } from "lucide-react";

export default function Pricing() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const plans = [
    {
      name: "Basic Access",
      price: "$0",
      desc: "Essential career building blocks for job seekers with zero budget.",
      features: [
        "1 Active Resume template",
        "1 ATS scan check per day",
        "2 AI Career Coach prompts daily",
        "Standard Web Portfolio layout",
        "Job Kanban tracker (up to 5 roles)"
      ],
      cta: "Current Plan",
      pro: false,
    },
    {
      name: "Pro Career Tier",
      price: "$3.99",
      period: "/month",
      desc: "Our affordable premium tier. Full AI access for less than a cup of coffee.",
      features: [
        "Unlimited Resumes & drafts",
        "Unlimited AI ATS keyword tailoring scans",
        "Unlimited AI NicheCoach chat sessions",
        "Complete LinkedIn SEO profile audit",
        "Portfolio custom subdomains & themes",
        "Semantic Job Board matches & interview forecasting"
      ],
      cta: "Upgrade to Pro",
      pro: true,
    }
  ];

  const handleUpgrade = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch dynamic JWT auth token from localStorage if logged in
      const token = localStorage.getItem("token");
      
      const res = await fetch("http://localhost:5000/api/payment/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : ""
        },
        body: JSON.stringify({ plan: "PRO" })
      });

      if (!res.ok) {
        throw new Error("Upgrade failed. Please ensure you are logged in.");
      }

      const data = await res.json();
      if (data.url) {
        // Redirect to Stripe checkout page (or mock payment success dashboard URL)
        window.location.href = data.url;
      }
    } catch (err: any) {
      setError(err.message || "Failed to initialize subscription upgrade.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto py-4">
      {/* Header text */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-1.5 bg-theme-accent-bg border border-theme-accent-border px-3 py-1 rounded-full text-xs font-semibold text-theme-accent">
          <HeartHandshake className="h-3.5 w-3.5" />
          <span>Democratizing Career Growth Tools</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          Accessible pricing. No compromises.
        </h1>
        <p className="text-zinc-400 max-w-xl mx-auto text-sm leading-relaxed">
          Job searching is already stressful. We keep our premium tools priced at just <span className="text-white font-semibold">$3.99/mo</span> to cover GPU costs, making premium AI guidance accessible to every graduate, student, and job seeker.
        </p>
      </div>

      {error && (
        <div className="bg-red-950/20 border border-red-500/20 rounded-xl p-4 flex items-center gap-3 text-red-400 text-xs max-w-xl mx-auto">
          <AlertCircle className="h-4.5 w-4.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Pricing Grids */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
        {plans.map((plan) => (
          <div 
            key={plan.name}
            className={`rounded-2xl border p-6 flex flex-col justify-between transition-all duration-300 relative overflow-hidden group ${
              plan.pro 
                ? "bg-zinc-900/50 border-theme-accent-border shadow-2xl shadow-theme-accent-bg/10" 
                : "bg-zinc-900/10 border-zinc-850 hover:border-zinc-800"
            }`}
          >
            {plan.pro && (
              <div className="absolute top-0 right-0 h-28 w-28 bg-gradient-to-bl from-theme-accent/10 to-transparent rounded-bl-full"></div>
            )}
            
            <div>
              <div className="flex justify-between items-center">
                <span className={`text-sm font-bold tracking-wide uppercase ${plan.pro ? "text-theme-accent" : "text-zinc-550"}`}>
                  {plan.name}
                </span>
                {plan.pro && (
                  <span className="bg-theme-accent-bg text-theme-accent text-[9px] font-extrabold px-2.5 py-0.5 rounded-full border border-theme-accent-border uppercase">
                    Best Value
                  </span>
                )}
              </div>

              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white">{plan.price}</span>
                {plan.period && <span className="text-zinc-500 text-sm font-medium">{plan.period}</span>}
              </div>

              <p className="mt-3 text-xs text-zinc-400 leading-relaxed">{plan.desc}</p>

              {/* Features list */}
              <div className="mt-6 border-t border-zinc-850 pt-5 space-y-3.5">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-2.5">
                    <Check className={`h-4 w-4 shrink-0 mt-0.5 ${plan.pro ? "text-theme-accent" : "text-zinc-500"}`} />
                    <span className="text-xs text-zinc-300 leading-normal">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Upgrade CTA */}
            <div className="mt-8">
              {plan.pro ? (
                <button
                  onClick={handleUpgrade}
                  disabled={loading}
                  className="w-full bg-theme-btn text-white py-3 rounded-xl text-xs font-bold transition-all shadow-lg shadow-theme-btn flex items-center justify-center gap-1.5 hover:-translate-y-0.5 duration-200"
                >
                  <Sparkles className="h-4 w-4" />
                  {loading ? "Initializing checkout..." : plan.cta}
                </button>
              ) : (
                <button
                  disabled
                  className="w-full bg-zinc-900 border border-zinc-800 text-zinc-500 py-3 rounded-xl text-xs font-bold"
                >
                  {plan.cta}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Trust banner */}
      <div className="max-w-2xl mx-auto rounded-2xl bg-zinc-950/30 border border-zinc-850 p-5 flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
        <ShieldCheck className="h-8 w-8 text-theme-accent shrink-0" />
        <div>
          <span className="block text-xs font-bold text-zinc-200">No Hidden Costs & Cancel Anytime</span>
          <span className="block text-[11px] text-zinc-500 mt-0.5 leading-normal">
            Pricing is calculated purely to cover the cloud compute charges for LLM analysis. You can cancel your subscription at any time with a single click.
          </span>
        </div>
      </div>
    </div>
  );
}
