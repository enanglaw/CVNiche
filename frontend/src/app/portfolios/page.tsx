"use client";

import React, { useState } from "react";
import { 
  Globe, 
  Sparkles, 
  ExternalLink, 
  Settings, 
  Layout, 
  Check, 
  Eye, 
  RefreshCw 
} from "lucide-react";

export default function PortfoliosPage() {
  const [slug, setSlug] = useState("johndoe");
  const [template, setTemplate] = useState("developer");
  const [isPublished, setIsPublished] = useState(false);
  const [customDomain, setCustomDomain] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);

  const templates = [
    { id: "minimal", name: "Minimal", desc: "Clean typography and spacious margins, tailored for writers and product designers." },
    { id: "developer", name: "Developer (Active)", desc: "GitHub project widgets, coding tags, and dark mode grid lines for developers." },
    { id: "creative", name: "Creative", desc: "Vibrant animations, media grids, and floating panels for artists and designers." },
    { id: "corporate", name: "Corporate", desc: "Structured summaries, enterprise histories, and formal case study layouts." },
  ];

  const handlePublish = () => {
    setIsPublished(!isPublished);
  };

  const handleSyncProfile = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
            <Globe className="h-6 w-6 text-theme-accent" />
            Portfolio Website Builder
          </h1>
          <p className="text-sm text-zinc-500">Build and host a professional digital presence synced directly with your profile.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleSyncProfile}
            disabled={isSyncing}
            className="bg-zinc-900 border border-zinc-850 hover:bg-zinc-800 text-zinc-300 px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isSyncing ? "animate-spin text-theme-accent" : ""}`} />
            {isSyncing ? "Syncing..." : "Sync from Profile"}
          </button>
          
          <button 
            onClick={handlePublish}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 shadow-lg ${
              isPublished 
                ? "bg-red-900/20 text-red-400 border border-red-500/20 hover:bg-red-900/35" 
                : "bg-theme-btn text-white shadow-theme-btn"
            }`}
          >
            {isPublished ? "Unpublish Website" : "Publish Portfolio"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Domain Setup */}
          <div className="bg-zinc-900/30 border border-zinc-800/60 rounded-2xl p-6 space-y-5">
            <h2 className="text-base font-bold text-zinc-200 flex items-center gap-2">
              <Settings className="h-4.5 w-4.5 text-theme-accent" />
              Domain & URL Settings
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">Subdomain URL</label>
                <div className="flex rounded-lg overflow-hidden border border-zinc-800 focus-within:border-theme-accent-border transition-colors">
                  <input 
                    type="text"
                    className="w-full bg-zinc-950 px-3 py-2 text-sm text-zinc-300 focus:outline-none"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                  />
                  <span className="bg-zinc-800 px-3 py-2 text-xs text-zinc-400 border-l border-zinc-800 flex items-center shrink-0">
                    .cvniche.com
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">Custom Domain</label>
                <input 
                  type="text"
                  placeholder="e.g. www.johndoe.me"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none border-theme-accent-focus text-zinc-300 transition-colors placeholder:text-zinc-655"
                  value={customDomain}
                  onChange={(e) => setCustomDomain(e.target.value)}
                />
              </div>
            </div>

            {isPublished && (
              <div className="flex items-center gap-2 text-xs text-zinc-400 bg-zinc-900/40 p-3 rounded-lg border border-zinc-850">
                <Check className="h-4 w-4 text-green-500" />
                <span>Your portfolio is live at:</span>
                <a 
                  href={`https://${slug}.cvniche.com`} 
                  target="_blank" 
                  className="text-theme-accent hover:underline font-semibold flex items-center gap-0.5"
                >
                  {slug}.cvniche.com
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}
          </div>

          {/* Template Selectors */}
          <div className="bg-zinc-900/30 border border-zinc-800/60 rounded-2xl p-6 space-y-5">
            <h2 className="text-base font-bold text-zinc-200 flex items-center gap-2">
              <Layout className="h-4.5 w-4.5 text-theme-accent" />
              Select Template Layout
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates.map((tmpl) => (
                <div 
                  key={tmpl.id}
                  onClick={() => setTemplate(tmpl.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                    template === tmpl.id 
                      ? "bg-theme-accent-bg border-theme-accent-border" 
                      : "bg-zinc-900/40 border-zinc-850 hover:border-zinc-800"
                  }`}
                >
                  <div>
                    <span className={`block font-bold text-sm mb-1.5 ${template === tmpl.id ? "text-theme-accent" : "text-zinc-200"}`}>
                      {tmpl.name}
                    </span>
                    <p className="text-xs text-zinc-500 leading-relaxed">{tmpl.desc}</p>
                  </div>
                  <div className="flex justify-end mt-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      template === tmpl.id ? "bg-theme-accent-bg text-theme-accent" : "bg-zinc-900 text-zinc-600"
                    }`}>
                      {template === tmpl.id ? "Selected" : "Select"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Live Preview frame */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
            <Eye className="h-4 w-4 text-theme-accent" />
            Website Preview
          </h3>

          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl overflow-hidden aspect-[3/4] flex flex-col shadow-xl">
            {/* Browser top-bar */}
            <div className="bg-zinc-900 px-4 py-2 border-b border-zinc-800/80 flex items-center gap-2 shrink-0">
              <div className="flex gap-1">
                <span className="h-2 w-2 rounded-full bg-red-500/80"></span>
                <span className="h-2 w-2 rounded-full bg-orange-500/80"></span>
                <span className="h-2 w-2 rounded-full bg-green-500/80"></span>
              </div>
              <div className="flex-1 max-w-xs mx-auto bg-zinc-950 border border-zinc-800 rounded px-2 py-0.5 text-[10px] text-zinc-500 text-center truncate">
                {slug}.cvniche.com
              </div>
            </div>

            {/* Render selected template mock layout */}
            <div className="flex-1 bg-zinc-950 p-6 overflow-y-auto font-sans text-xs space-y-4">
              <div className="text-center space-y-1">
                <div className="h-10 w-10 rounded-full bg-zinc-850 border border-zinc-800 mx-auto flex items-center justify-center font-bold text-zinc-400 text-sm">
                  JD
                </div>
                <h4 className="font-bold text-zinc-200">John Doe</h4>
                <p className="text-[10px] text-zinc-500">Senior Full-Stack Engineer</p>
              </div>

              <div className="border-t border-zinc-900 pt-3">
                <h5 className="font-semibold text-zinc-400 text-[10px] uppercase tracking-wider mb-1.5">About</h5>
                <p className="text-zinc-500 text-[11px] leading-relaxed">
                  Building microservices and low-latency API architectures with Node.js, Python and PostgreSQL.
                </p>
              </div>

              <div className="border-t border-zinc-900 pt-3">
                <h5 className="font-semibold text-zinc-400 text-[10px] uppercase tracking-wider mb-2">Projects</h5>
                <div className="space-y-2">
                  <div className="p-2.5 rounded bg-zinc-900 border border-zinc-850/60 space-y-1">
                    <span className="font-semibold text-zinc-300 block text-[11px]">Apollo Microservices Router</span>
                    <p className="text-zinc-500 text-[10px] leading-relaxed">High performance API routing server handling over 50k monthly queries.</p>
                  </div>
                  <div className="p-2.5 rounded bg-zinc-900 border border-zinc-850/60 space-y-1">
                    <span className="font-semibold text-zinc-300 block text-[11px]">CVNiche Application</span>
                    <p className="text-zinc-500 text-[10px] leading-relaxed">AI-powered dashboard built on Next.js and FastAPI services.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
