import { ShieldCheck } from "lucide-react";
import React from "react";

export default function HeroPanel() {
  return (
    <section className="intro-panel">
      <div>
        <ShieldCheck size={40} />
        <h2>Eat Smarter with Allergy-Aware Guidance</h2>
        <p>Build your allergy profile, check ingredients, and make safer everyday food choices.</p>
      </div>
      <p className="disclaimer">
        General guidance only. Always check product labels and speak with a medical professional for severe allergies.
      </p>
    </section>
  );
}
