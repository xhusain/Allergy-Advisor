import React from "react";
import allergyLogo from "../assets/allergy-logo.png";

export default function AuthPage({ authForm, authMode, loading, setAuthForm, setAuthMode, submitAuth }) {
  return (
    <section className="panel auth-panel">
      <div className="auth-brand">
        <img src={allergyLogo} alt="Allergy Advisor logo" />
        <div>
          <p className="eyebrow">Allergy Advisor</p>
          <h2>{authMode === "register" ? "Create your safety profile" : "Welcome back"}</h2>
        </div>
      </div>
      <div className="section-heading">
        <h2>{authMode === "register" ? "Create Account" : "Login"}</h2>
        <button className="link-button" onClick={() => setAuthMode(authMode === "register" ? "login" : "register")}>
          {authMode === "register" ? "Log in instead" : "Create account"}
        </button>
      </div>
      <form className="form-grid" onSubmit={submitAuth}>
        {authMode === "register" && (
          <label>
            Name
            <input value={authForm.name} onChange={(event) => setAuthForm({ ...authForm, name: event.target.value })} required />
          </label>
        )}
        <label>
          Email
          <input type="email" value={authForm.email} onChange={(event) => setAuthForm({ ...authForm, email: event.target.value })} required />
        </label>
        <label>
          Password
          <input type="password" value={authForm.password} onChange={(event) => setAuthForm({ ...authForm, password: event.target.value })} required />
        </label>
        <button className="primary-button" disabled={loading}>
          {loading ? "Please wait..." : authMode === "register" ? "Register" : "Login"}
        </button>
      </form>
    </section>
  );
}
