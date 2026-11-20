import React from "react";
import ResultCard from "../components/ResultCard.jsx";

export default function CheckerPage({ checkFood, checkResult, foodText, loading, setFoodText }) {
  return (
    <section className="panel checker-panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Food checker</p>
          <h2>Enter Food or Ingredients</h2>
        </div>
      </div>
      <form onSubmit={checkFood} className="checker-form">
        <textarea
          value={foodText}
          onChange={(event) => setFoodText(event.target.value)}
          placeholder="Example: chocolate bar with milk, peanut oil, sugar, cocoa"
          required
        />
        <button className="primary-button" disabled={loading}>Check Food</button>
      </form>
      {checkResult && <ResultCard checkResult={checkResult} />}
    </section>
  );
}
