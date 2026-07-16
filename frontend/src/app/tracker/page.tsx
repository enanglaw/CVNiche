"use client";

import React, { useState } from "react";
import { 
  Trophy, 
  Plus, 
  Briefcase, 
  MapPin, 
  TrendingUp, 
  ChevronRight, 
  AlertCircle,
  FileText
} from "lucide-react";

export default function TrackerPage() {
  const [columns, setColumns] = useState([
    {
      id: "WISHLIST",
      title: "Wishlist",
      count: 2,
      color: "border-t-zinc-500",
      items: [
        { id: "app-1", title: "Senior Systems Engineer", company: "Uber", location: "San Francisco, CA", salary: "$160k - $210k", match: 84 },
        { id: "app-2", title: "DevOps Engineer", company: "HashiCorp", location: "Remote", salary: "$140k - $180k", match: 72 },
      ]
    },
    {
      id: "APPLIED",
      title: "Applied",
      count: 2,
      color: "border-t-blue-500",
      items: [
        { id: "app-3", title: "Node.js Developer", company: "Netflix", location: "Los Gatos, CA", salary: "$180k - $240k", match: 89 },
        { id: "app-4", title: "Full Stack Engineer", company: "Retool", location: "San Francisco, CA", salary: "$150k - $190k", match: 91 },
      ]
    },
    {
      id: "INTERVIEWING",
      title: "Interviewing",
      count: 2,
      color: "border-t-green-500",
      items: [
        { id: "app-5", title: "Senior Backend Engineer", company: "Stripe", location: "Remote", salary: "$170k - $220k", match: 94 },
        { id: "app-6", title: "Software Engineer", company: "Linear", location: "Remote", salary: "$160k - $200k", match: 92 },
      ]
    },
    {
      id: "OFFERED",
      title: "Offered",
      count: 1,
      color: "border-t-[var(--accent-color)]",
      items: [
        { id: "app-7", title: "Backend Engineer", company: "Vercel", location: "Remote", salary: "$175k - $215k", match: 95 },
      ]
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCompany, setNewCompany] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const handleAddApplication = () => {
    if (!newTitle || !newCompany) return;
    
    // Add mock item to Wishlist
    const newItem = {
      id: `app-${Date.now()}`,
      title: newTitle,
      company: newCompany,
      location: newLocation || "Remote",
      salary: "$130k - $185k",
      match: Math.floor(Math.random() * 20) + 75 // Mock matching score 75-95
    };

    setColumns(prev => prev.map(col => {
      if (col.id === "WISHLIST") {
        return {
          ...col,
          count: col.count + 1,
          items: [...col.items, newItem]
        };
      }
      return col;
    }));

    // Reset form
    setNewTitle("");
    setNewCompany("");
    setNewLocation("");
    setNewDesc("");
    setShowAddForm(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
            <Trophy className="h-6 w-6 text-theme-accent" />
            Job Application Tracker
          </h1>
          <p className="text-sm text-zinc-500">Organize your pipeline, evaluate match rates, and forecast interview likelihood.</p>
        </div>
        
        <button 
          onClick={() => setShowAddForm(true)}
          className="bg-theme-btn text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 shadow-lg shadow-theme-btn"
        >
          <Plus className="h-4.5 w-4.5" />
          Add Application
        </button>
      </div>

      {/* Add application modal popup mock */}
      {showAddForm && (
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-4 max-w-xl animate-in fade-in zoom-in-95 duration-200">
          <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wider">New Application details</h3>
          
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Job Title</label>
              <input 
                type="text" 
                placeholder="e.g. Senior Backend Engineer" 
                className="w-full bg-zinc-950 border border-zinc-850 rounded-lg px-3 py-2 text-xs focus:outline-none border-theme-accent-focus text-zinc-300"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Company</label>
              <input 
                type="text" 
                placeholder="e.g. Stripe" 
                className="w-full bg-zinc-950 border border-zinc-850 rounded-lg px-3 py-2 text-xs focus:outline-none border-theme-accent-focus text-zinc-300"
                value={newCompany}
                onChange={(e) => setNewCompany(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Location / Workspace</label>
            <input 
              type="text" 
              placeholder="e.g. Remote / New York" 
              className="w-full bg-zinc-950 border border-zinc-850 rounded-lg px-3 py-2 text-xs focus:outline-none border-theme-accent-focus text-zinc-300"
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Job Description (For AI Match Scans)</label>
            <textarea 
              rows={4} 
              placeholder="Paste raw requirements text to run automatic resume matching..." 
              className="w-full bg-zinc-950 border border-zinc-850 rounded-lg p-3 text-xs focus:outline-none border-theme-accent-focus text-zinc-300 placeholder:text-zinc-700"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3.5 pt-2">
            <button 
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 border border-zinc-800 rounded-lg text-xs text-zinc-400 hover:bg-zinc-850 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleAddApplication}
              className="bg-theme-btn text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-lg shadow-theme-btn"
            >
              Add & Auto-Score
            </button>
          </div>
        </div>
      )}

      {/* Kanban Pipeline Board */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {columns.map((col) => (
          <div key={col.id} className="bg-zinc-900/10 border border-zinc-850 rounded-2xl p-4 flex flex-col space-y-4 min-h-[500px]">
            {/* Column Header */}
            <div className={`border-t-2 ${col.color} pt-2.5 flex justify-between items-center`}>
              <span className="font-bold text-xs text-zinc-200 uppercase tracking-wider">{col.title}</span>
              <span className="h-5 w-5 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-bold flex items-center justify-center text-zinc-400">
                {col.count}
              </span>
            </div>

            {/* Application cards in column */}
            <div className="flex-1 space-y-3.5 overflow-y-auto">
              {col.items.map((item) => (
                <div 
                  key={item.id}
                  className="bg-zinc-900/40 hover:bg-zinc-900/60 border border-zinc-850 hover:border-zinc-800 p-4 rounded-xl space-y-3.5 cursor-grab active:cursor-grabbing transition-all duration-200 shadow-sm relative group"
                >
                  <div className="space-y-1">
                    <span className="block text-xs font-bold text-zinc-200 group-hover:text-theme-accent transition-colors leading-tight">{item.title}</span>
                    <span className="block text-[10px] text-zinc-500">{item.company}</span>
                  </div>

                  <div className="space-y-1 border-t border-zinc-900/60 pt-2 text-[10px] text-zinc-500">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{item.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Briefcase className="h-3.5 w-3.5" />
                      <span>{item.salary}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center border-t border-zinc-900/60 pt-2.5">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full bg-theme-accent-bg text-theme-accent border border-theme-accent-border`}>
                      Match: {item.match}%
                    </span>
                    <button className="text-zinc-650 hover:text-zinc-450 p-0.5"><ChevronRight className="h-4 w-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
