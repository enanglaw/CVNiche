"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  FileText, 
  Globe, 
  Linkedin, 
  Trophy, 
  MessageSquare, 
  Search, 
  Bell, 
  User, 
  Sparkles,
  ChevronRight,
  TrendingUp
} from "lucide-react";

interface SidebarLayoutProps {
  children: React.ReactNode;
}

export default function SidebarLayout({ children }: SidebarLayoutProps) {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");

  const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Resumes", href: "/resumes", icon: FileText },
    { name: "Portfolio Website", href: "/portfolios", icon: Globe },
    { name: "LinkedIn Optimizer", href: "/linkedin", icon: Linkedin },
    { name: "Job Tracker", href: "/tracker", icon: Trophy },
    { name: "AI Career Coach", href: "/coach", icon: MessageSquare },
  ];

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-800 bg-zinc-900/50 backdrop-blur-xl flex flex-col justify-between shrink-0">
        <div>
          {/* Logo */}
          <div className="h-16 px-6 flex items-center gap-2 border-b border-zinc-800">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-lg bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">CVNiche</span>
              <span className="text-[10px] block text-violet-400 font-semibold tracking-wider uppercase">AI Career Platform</span>
            </div>
          </div>

          {/* Search bar */}
          <div className="p-4 border-b border-zinc-800/50">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
              <input 
                type="text" 
                placeholder="Search resumes, jobs..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-violet-500 text-zinc-300 transition-colors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Nav Links */}
          <nav className="p-4 space-y-1.5">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-violet-600/10 border border-violet-500/20 text-violet-400 shadow-sm"
                      : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200 border border-transparent"
                  }`}
                >
                  <Icon className={`h-4.5 w-4.5 ${isActive ? "text-violet-400" : "text-zinc-400"}`} />
                  <span className="flex-1">{item.name}</span>
                  {isActive && <ChevronRight className="h-3.5 w-3.5 text-violet-400/50" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User profile section in sidebar footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950/20">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center">
              <User className="h-5 w-5 text-zinc-300" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="block text-sm font-semibold truncate text-zinc-200">John Doe</span>
              <span className="block text-xs text-zinc-500 truncate">johndoe@gmail.com</span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-violet-600/20 text-violet-400 border border-violet-500/20 shadow-md">
              PRO
            </span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-zinc-800/60 bg-zinc-900/10 backdrop-blur-md flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-zinc-800/40 border border-zinc-700/30 px-3 py-1 rounded-full text-xs font-semibold text-zinc-400 shadow-inner">
              <TrendingUp className="h-3.5 w-3.5 text-green-500" />
              <span>Interview Likelihood:</span>
              <span className="text-green-400 font-bold">89%</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <button className="h-9 w-9 rounded-lg border border-zinc-800 bg-zinc-900/50 flex items-center justify-center hover:bg-zinc-800 transition-colors relative">
              <Bell className="h-4.5 w-4.5 text-zinc-400" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-violet-600 shadow shadow-violet-500"></span>
            </button>
            
            {/* Action Button */}
            <Link 
              href="/resumes" 
              className="bg-violet-600 text-white hover:bg-violet-500 px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 shadow-lg shadow-violet-600/20"
            >
              <Sparkles className="h-4 w-4" />
              Build Resume
            </Link>
          </div>
        </header>

        {/* Dynamic page content */}
        <main className="flex-1 overflow-y-auto bg-zinc-950 p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
