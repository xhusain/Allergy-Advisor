import { LogOut, Moon, Sun } from "lucide-react";
import React from "react";
import allergyLogo from "../assets/allergy-logo.png";

export default function Topbar({ logout, setTheme, theme, user }) {
  return (
    <header className="topbar">
      <div className="brand-lockup">
        {user && <img src={allergyLogo} alt="Allergy Advisor logo" />}
        <div>
          <p className="eyebrow">Personalized food safety</p>
          <h1>Allergy Advisor</h1>
        </div>
      </div>
      <div className="topbar-actions">
        <button className="icon-button" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label="Toggle theme">
          {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        {user && (
          <button className="secondary-button" onClick={logout}>
            <LogOut size={18} />
            Logout
          </button>
        )}
      </div>
    </header>
  );
}
