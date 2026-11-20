import { BookOpen, ClipboardCheck, CloudSun, History, ShieldCheck, UserRound } from "lucide-react";
import React from "react";

const navItems = [
  ["dashboard", "Dashboard", ShieldCheck],
  ["profile", "Profile", UserRound],
  ["checker", "Checker", ClipboardCheck],
  ["weather", "Weather", CloudSun],
  ["history", "History", History],
  ["knowledge", "Knowledge", BookOpen]
];

export default function AppTabs({ activeTab, setActiveTab }) {
  return (
    <nav className="app-tabs" aria-label="Main sections">
      {navItems.map(([id, label, Icon]) => (
        <button key={id} className={activeTab === id ? "active" : ""} onClick={() => setActiveTab(id)}>
          <Icon size={17} />
          {label}
        </button>
      ))}
    </nav>
  );
}
