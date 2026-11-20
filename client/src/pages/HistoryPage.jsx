import React from "react";

export default function HistoryPage({ history, loadHistory }) {
  return (
    <section className="panel">
      <div className="section-heading">
        <h2>Recent Checks</h2>
        <button className="secondary-button" onClick={loadHistory}>Refresh</button>
      </div>
      <div className="history-list">
        {history.length === 0 && <p>No checks yet.</p>}
        {history.map((item) => (
          <article key={item._id}>
            <span className={`status-pill ${item.result}`}>{item.result}</span>
            <p>{item.inputText}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
