// src/pages/SettingsPage.jsx
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api";
import { User, Settings, Bell } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function SettingsPage() {
  const { user } = useAuth();

  const [settings, setSettings] = useState({
    name: "",
    email: "",
    currency: "USD",
    language: "en",
    theme: "light",
    notifications: {
      emailUpdates: true,
      budgetAlerts: true,
    },
  });

  const [loading, setLoading] = useState(false);
  const [initialSettings, setInitialSettings] = useState(null);

  useEffect(() => {
    if (user) {
      setSettings((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
      }));
    }
    fetchSettings();
  }, [user]);

  const fetchSettings = async () => {
    try {
      const res = await api.get("/settings");
      if (res.data) {
        const data = res.data;

        setSettings((prev) => ({
          ...prev,
          ...data,
          name: user?.name || prev.name,
          email: user?.email || prev.email,
        }));

        setInitialSettings({
          ...data,
          name: user?.name || "",
          email: user?.email || "",
        });
      }
    } catch (err) {
      console.error("❌ Error fetching settings:", err);
      toast.error("Failed to load settings.");
    }
  };

  const handleChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value ?? "",
    }));
  };

  const handleNotificationChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value,
      },
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { name, email, ...rest } = settings;
      await api.put("/settings", rest);
      setInitialSettings(settings);
      toast.success("Settings updated!");
    } catch (err) {
      console.error("❌ Error saving settings:", err);
      toast.error("Failed to save settings.");
    } finally {
      setLoading(false);
    }
  };

  const isChanged =
    JSON.stringify(settings) !== JSON.stringify(initialSettings);

  return (
    <div className="min-h-screen bg-[#F0F2F5] text-[#3B4A54] py-12 px-6 md:px-12">
      <div className="max-w-5xl mx-auto space-y-12">
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-[#111B21]">Settings</h1>
          <p className="text-[#667781] text-sm">
            Manage your account, preferences, and notifications
          </p>
        </header>

        <SectionCard
          icon={<User className="text-[#24D366]" />}
          title="User Profile"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              value={settings.name || ""}
              className="bg-white border border-[#E6E6E6] h-12 rounded-xl px-3 text-[#111B21] w-full"
              disabled
            />
            <input
              type="email"
              value={settings.email || ""}
              className="bg-white border border-[#E6E6E6] h-12 rounded-xl px-3 text-[#111B21] w-full"
              disabled
            />
          </div>
        </SectionCard>

        <SectionCard
          icon={<Settings className="text-blue-500" />}
          title="App Preferences"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SettingSelect
              label="Currency"
              value={settings.currency}
              onChange={(v) => handleChange("currency", v)}
              options={[{ value: "INR", label: "INR (₹)" }]}
            />

            <SettingSelect
              label="Language"
              value={settings.language}
              onChange={(v) => handleChange("language", v)}
              options={[{ value: "en", label: "English" }]}
            />

            <SettingSelect
              label="Theme"
              value={settings.theme}
              onChange={(v) => handleChange("theme", v)}
              options={[{ value: "light", label: "Light" }]}
            />
          </div>
        </SectionCard>

        <SectionCard
          icon={<Bell className="text-yellow-500" />}
          title="Notifications"
        >
          <div className="space-y-4">
            <ToggleSwitch
              label="Email Updates"
              checked={settings.notifications.emailUpdates}
              onChange={(v) => handleNotificationChange("emailUpdates", v)}
            />
            <ToggleSwitch
              label="Budget Alerts"
              checked={settings.notifications.budgetAlerts}
              onChange={(v) => handleNotificationChange("budgetAlerts", v)}
            />
          </div>
        </SectionCard>

        <div className="flex justify-center pt-6">
          <button
            onClick={handleSave}
            disabled={loading || !isChanged}
            className={`${
              isChanged
                ? "bg-[#24D366] text-white"
                : "bg-[#DCDCDC] text-[#667781] cursor-not-allowed"
            } font-semibold py-3 px-10 rounded-full shadow transition-all`}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------
   REUSABLE COMPONENTS (no longer dimmed)
---------------------------------------------- */

const SectionCard = ({ icon, title, children }) => (
  <div className="bg-white border border-[#E6E6E6] rounded-2xl shadow p-6">
    <div className="flex items-center gap-2 pb-4 border-b border-[#E6E6E6]">
      {icon}
      <h2 className="text-lg font-semibold text-[#111B21]">{title}</h2>
    </div>
    <div className="pt-4 space-y-4">{children}</div>
  </div>
);

const SettingSelect = ({ label, value, onChange, options }) => (
  <div className="w-full">
    <label className="text-sm text-[#667781] mb-2 block">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-white border border-[#E6E6E6] rounded-xl h-12 w-full px-3 text-[#111B21]"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

const ToggleSwitch = ({ label, checked, onChange }) => (
  <div className="flex items-center justify-between w-full">
    <span className="text-[#3B4A54]">{label}</span>
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={!!checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <div className="w-11 h-6 bg-[#DCDCDC] rounded-full peer peer-checked:bg-[#24D366]
      peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] 
      after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
    </label>
  </div>
);
