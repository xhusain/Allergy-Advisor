import React, { useEffect, useMemo, useState } from "react";
import { apiRequest } from "./api.js";
import AppTabs from "./components/AppTabs.jsx";
import Footer from "./components/Footer.jsx";
import HeroPanel from "./components/HeroPanel.jsx";
import Topbar from "./components/Topbar.jsx";
import { emptyKnowledgeForm } from "./constants/allergy.js";
import AuthPage from "./pages/AuthPage.jsx";
import CheckerPage from "./pages/CheckerPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import HistoryPage from "./pages/HistoryPage.jsx";
import KnowledgePage from "./pages/KnowledgePage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import WeatherPage from "./pages/WeatherPage.jsx";
import { toPayload } from "./utils/knowledgeForm.js";

function getSavedUser() {
  const saved = localStorage.getItem("allergyAdvisorUser");
  return saved ? JSON.parse(saved) : null;
}

export default function App() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [user, setUser] = useState(getSavedUser);
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState({ name: "", email: "", password: "" });
  const [allergies, setAllergies] = useState([]);
  const [selectedAllergies, setSelectedAllergies] = useState({});
  const [foodText, setFoodText] = useState("");
  const [checkResult, setCheckResult] = useState(null);
  const [weatherCity, setWeatherCity] = useState("Lahore");
  const [weatherData, setWeatherData] = useState(null);
  const [history, setHistory] = useState([]);
  const [knowledgeForm, setKnowledgeForm] = useState(emptyKnowledgeForm);
  const [editingAllergyId, setEditingAllergyId] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    loadAllergies();
    loadWeather("Lahore");
  }, []);

  useEffect(() => {
    if (!user?.allergies) return;

    const next = {};
    user.allergies.forEach((item) => {
      const allergyId = item.allergy?._id || item.allergy;
      next[allergyId] = item.severity || "moderate";
    });
    setSelectedAllergies(next);
    loadHistory();
  }, [user]);

  const groupedAllergies = useMemo(() => {
    return allergies.reduce((groups, allergy) => {
      groups[allergy.category] = groups[allergy.category] || [];
      groups[allergy.category].push(allergy);
      return groups;
    }, {});
  }, [allergies]);

  const selectedCount = Object.keys(selectedAllergies).length;
  const lastCheck = history[0];

  async function loadAllergies() {
    try {
      const data = await apiRequest("/allergies");
      setAllergies(data.allergies);
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function loadWeather(city = weatherCity) {
    try {
      const data = await apiRequest(`/weather/advice?city=${encodeURIComponent(city)}`);
      setWeatherData(data);
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function submitAuth(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const path = authMode === "register" ? "/auth/register" : "/auth/login";
      const payload =
        authMode === "register"
          ? authForm
          : { email: authForm.email, password: authForm.password };
      const data = await apiRequest(path, {
        method: "POST",
        body: JSON.stringify(payload)
      });

      localStorage.setItem("allergyAdvisorToken", data.token);
      localStorage.setItem("allergyAdvisorUser", JSON.stringify(data.user));
      setUser(data.user);
      setAuthForm({ name: "", email: "", password: "" });
      setActiveTab("dashboard");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function saveProfile() {
    setLoading(true);
    setMessage("");

    try {
      const payload = {
        allergies: Object.entries(selectedAllergies).map(([allergyId, severity]) => ({
          allergyId,
          severity
        }))
      };
      const data = await apiRequest("/profile/allergies", {
        method: "PUT",
        body: JSON.stringify(payload)
      });

      localStorage.setItem("allergyAdvisorUser", JSON.stringify(data.user));
      setUser(data.user);
      setMessage("Allergy profile saved.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function checkFood(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const data = await apiRequest("/checker", {
        method: "POST",
        body: JSON.stringify({ inputText: foodText })
      });
      setCheckResult(data);
      loadHistory();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function loadHistory() {
    if (!localStorage.getItem("allergyAdvisorToken")) return;

    try {
      const data = await apiRequest("/checker/history");
      setHistory(data.checks);
    } catch {
      setHistory([]);
    }
  }

  async function saveKnowledge(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const path = editingAllergyId ? `/allergies/${editingAllergyId}` : "/allergies";
      const data = await apiRequest(path, {
        method: editingAllergyId ? "PUT" : "POST",
        body: JSON.stringify(toPayload(knowledgeForm))
      });

      setAllergies((current) =>
        editingAllergyId
          ? current.map((item) => (item._id === editingAllergyId ? data.allergy : item))
          : [...current, data.allergy].sort((a, b) => a.name.localeCompare(b.name))
      );
      setKnowledgeForm(emptyKnowledgeForm);
      setEditingAllergyId("");
      setMessage(editingAllergyId ? "Allergy updated." : "Allergy added.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function deleteKnowledge(allergyId) {
    setLoading(true);
    setMessage("");

    try {
      await apiRequest(`/allergies/${allergyId}`, { method: "DELETE" });
      setAllergies((current) => current.filter((item) => item._id !== allergyId));
      setSelectedAllergies((current) => {
        const next = { ...current };
        delete next[allergyId];
        return next;
      });
      setMessage("Allergy deleted.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem("allergyAdvisorToken");
    localStorage.removeItem("allergyAdvisorUser");
    setUser(null);
    setCheckResult(null);
    setHistory([]);
    setActiveTab("dashboard");
  }

  function toggleAllergy(allergyId) {
    setSelectedAllergies((current) => {
      const next = { ...current };
      if (next[allergyId]) {
        delete next[allergyId];
      } else {
        next[allergyId] = "moderate";
      }
      return next;
    });
  }

  return (
    <div className="app-shell">
      <Topbar logout={logout} setTheme={setTheme} theme={theme} user={user} />

      <main className={`layout ${!user ? "auth-layout" : ""}`}>
        <HeroPanel />

        {!user ? (
          <AuthPage
            authForm={authForm}
            authMode={authMode}
            loading={loading}
            setAuthForm={setAuthForm}
            setAuthMode={setAuthMode}
            submitAuth={submitAuth}
          />
        ) : (
          <>
            <AppTabs activeTab={activeTab} setActiveTab={setActiveTab} />

            {activeTab === "dashboard" && (
              <DashboardPage
                allergies={allergies}
                lastCheck={lastCheck}
                selectedCount={selectedCount}
                setActiveTab={setActiveTab}
                user={user}
                weatherData={weatherData}
              />
            )}

            {activeTab === "profile" && (
              <ProfilePage
                groupedAllergies={groupedAllergies}
                loading={loading}
                saveProfile={saveProfile}
                selectedAllergies={selectedAllergies}
                setSelectedAllergies={setSelectedAllergies}
                toggleAllergy={toggleAllergy}
              />
            )}

            {activeTab === "checker" && (
              <CheckerPage
                checkFood={checkFood}
                checkResult={checkResult}
                foodText={foodText}
                loading={loading}
                setFoodText={setFoodText}
              />
            )}

            {activeTab === "weather" && (
              <WeatherPage
                loadWeather={loadWeather}
                loading={loading}
                setWeatherCity={setWeatherCity}
                weatherCity={weatherCity}
                weatherData={weatherData}
              />
            )}

            {activeTab === "history" && (
              <HistoryPage history={history} loadHistory={loadHistory} />
            )}

            {activeTab === "knowledge" && (
              <KnowledgePage
                allergies={allergies}
                deleteKnowledge={deleteKnowledge}
                editingAllergyId={editingAllergyId}
                knowledgeForm={knowledgeForm}
                loading={loading}
                saveKnowledge={saveKnowledge}
                setEditingAllergyId={setEditingAllergyId}
                setKnowledgeForm={setKnowledgeForm}
              />
            )}
          </>
        )}

        {message && <p className="toast">{message}</p>}
      </main>
      <Footer />
    </div>
  );
}
