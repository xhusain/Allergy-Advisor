import React from "react";

export default function DashboardPage({ allergies, lastCheck, selectedCount, setActiveTab, user, weatherData }) {
  return (
    <section className="panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h2>Hello, {user.name}</h2>
        </div>
      </div>
      <div className="stat-grid">
        <article>
          <strong>{selectedCount}</strong>
          <span>Saved allergies</span>
        </article>
        <article>
          <strong>{allergies.length}</strong>
          <span>Knowledge items</span>
        </article>
        <article>
          <strong>{lastCheck?.result || "none"}</strong>
          <span>Last check</span>
        </article>
        <article>
          <strong>{weatherData?.weather?.temperature ?? "--"}{weatherData?.weather ? "C" : ""}</strong>
          <span>{weatherData?.location?.name || "Weather fallback"}</span>
        </article>
      </div>
      <div className="quick-actions">
        <button className="primary-button" onClick={() => setActiveTab("checker")}>Check Food</button>
        <button className="secondary-button" onClick={() => setActiveTab("profile")}>Edit Profile</button>
        <button className="secondary-button" onClick={() => setActiveTab("weather")}>Weather Advice</button>
      </div>
    </section>
  );
}
