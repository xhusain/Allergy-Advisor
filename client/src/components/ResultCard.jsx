import { AlertTriangle, CheckCircle2 } from "lucide-react";
import React from "react";

export default function ResultCard({ checkResult }) {
  return (
    <div className={`result-card ${checkResult.result}`}>
      <div className="result-title">
        {checkResult.result === "safe" ? <CheckCircle2 /> : <AlertTriangle />}
        <h3>{checkResult.result.toUpperCase()}</h3>
      </div>
      <p>{checkResult.summary}</p>
      {checkResult.recognizedFoods?.length > 0 && (
        <p className="notice compact">
          Recognized prepared food: {checkResult.recognizedFoods.join(", ")}
        </p>
      )}
      {checkResult.datasetMatch && (
        <p className="notice compact">
          Dataset match: {checkResult.datasetMatch.name} ({checkResult.datasetMatch.allergens.join(", ") || "no listed allergens"})
        </p>
      )}
      {checkResult.matches.length > 0 && (
        <div className="match-list">
          {checkResult.matches.map((match) => (
            <article key={match.allergy}>
              <strong>{match.allergy}</strong>
              <p>Matched: {[...match.avoidMatches, ...match.riskyMatches].join(", ")}</p>
              <p>{match.advice}</p>
              <small>Alternatives: {match.safeAlternatives.join(", ")}</small>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
