import React from "react";
import { categoryLabels, severityOptions } from "../constants/allergy.js";

export default function ProfilePage({
  groupedAllergies,
  loading,
  saveProfile,
  selectedAllergies,
  setSelectedAllergies,
  toggleAllergy
}) {
  return (
    <section className="panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Profile</p>
          <h2>Your Allergies</h2>
        </div>
        <button className="primary-button" onClick={saveProfile} disabled={loading}>Save Profile</button>
      </div>
      <div className="allergy-groups">
        {Object.entries(groupedAllergies).map(([category, items]) => (
          <div key={category}>
            <h3>{categoryLabels[category] || category}</h3>
            <div className="chip-grid">
              {items.map((allergy) => (
                <div className={`allergy-chip ${selectedAllergies[allergy._id] ? "selected" : ""}`} key={allergy._id}>
                  <button type="button" onClick={() => toggleAllergy(allergy._id)}>{allergy.name}</button>
                  {selectedAllergies[allergy._id] && (
                    <select
                      value={selectedAllergies[allergy._id]}
                      onChange={(event) => setSelectedAllergies({ ...selectedAllergies, [allergy._id]: event.target.value })}
                    >
                      {severityOptions.map((severity) => (
                        <option key={severity} value={severity}>{severity}</option>
                      ))}
                    </select>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
