import React from "react";
import { categories, categoryLabels, emptyKnowledgeForm } from "../constants/allergy.js";
import { toForm } from "../utils/knowledgeForm.js";

export default function KnowledgePage({
  allergies,
  deleteKnowledge,
  editingAllergyId,
  knowledgeForm,
  loading,
  saveKnowledge,
  setEditingAllergyId,
  setKnowledgeForm
}) {
  return (
    <section className="panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Knowledge base</p>
          <h2>{editingAllergyId ? "Edit allergy" : "Add allergy"}</h2>
        </div>
      </div>
      <form className="knowledge-form" onSubmit={saveKnowledge}>
        <label>
          Name
          <input value={knowledgeForm.name} onChange={(event) => setKnowledgeForm({ ...knowledgeForm, name: event.target.value })} required />
        </label>
        <label>
          Category
          <select value={knowledgeForm.category} onChange={(event) => setKnowledgeForm({ ...knowledgeForm, category: event.target.value })}>
            {categories.map((category) => <option key={category} value={category}>{categoryLabels[category] || category}</option>)}
          </select>
        </label>
        <label>
          Aliases
          <input value={knowledgeForm.aliases} onChange={(event) => setKnowledgeForm({ ...knowledgeForm, aliases: event.target.value })} placeholder="Comma separated" />
        </label>
        <label>
          Avoid ingredients
          <input value={knowledgeForm.avoidIngredients} onChange={(event) => setKnowledgeForm({ ...knowledgeForm, avoidIngredients: event.target.value })} placeholder="Comma separated" />
        </label>
        <label>
          Risky ingredients
          <input value={knowledgeForm.riskyIngredients} onChange={(event) => setKnowledgeForm({ ...knowledgeForm, riskyIngredients: event.target.value })} placeholder="Comma separated" />
        </label>
        <label>
          Safe alternatives
          <input value={knowledgeForm.safeAlternatives} onChange={(event) => setKnowledgeForm({ ...knowledgeForm, safeAlternatives: event.target.value })} placeholder="Comma separated" />
        </label>
        <label className="full-span">
          Advice
          <textarea value={knowledgeForm.advice} onChange={(event) => setKnowledgeForm({ ...knowledgeForm, advice: event.target.value })} />
        </label>
        <div className="form-actions">
          <button className="primary-button" disabled={loading}>{editingAllergyId ? "Update Allergy" : "Add Allergy"}</button>
          {editingAllergyId && (
            <button
              className="secondary-button"
              type="button"
              onClick={() => {
                setEditingAllergyId("");
                setKnowledgeForm(emptyKnowledgeForm);
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
      <div className="knowledge-list">
        {allergies.map((allergy) => (
          <article key={allergy._id}>
            <div>
              <strong>{allergy.name}</strong>
              <p>{categoryLabels[allergy.category] || allergy.category} - Avoid: {allergy.avoidIngredients?.slice(0, 4).join(", ") || "none listed"}</p>
            </div>
            <div className="row-actions">
              <button
                className="secondary-button"
                onClick={() => {
                  setEditingAllergyId(allergy._id);
                  setKnowledgeForm(toForm(allergy));
                }}
              >
                Edit
              </button>
              <button className="danger-button" onClick={() => deleteKnowledge(allergy._id)}>Delete</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
