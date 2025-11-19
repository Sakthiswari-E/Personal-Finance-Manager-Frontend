// // src/pages/SettingsPage.jsx
// import React, { useEffect, useState } from "react";
// import toast from "react-hot-toast";
// import api from "../api";
// import { User, Settings, Bell } from "lucide-react";
// import { useAuth } from "../context/AuthContext";

// export default function SettingsPage() {
//   const { user } = useAuth();

//   const [settings, setSettings] = useState({
//     name: "",
//     email: "",
//     currency: "USD",
//     language: "en",
//     theme: "light",
//     notifications: {
//       emailUpdates: true,
//       budgetAlerts: true,
//     },
//   });

//   const [loading, setLoading] = useState(false);
//   const [initialSettings, setInitialSettings] = useState(null);

//   //  Load settings + prefill user info
//   useEffect(() => {
//     if (user) {
//       setSettings((prev) => ({
//         ...prev,
//         name: user.name || prev.name,
//         email: user.email || prev.email,
//       }));
//     }
//     fetchSettings();
//   }, [user]);

//   //  Fetch settings from backend
//   const fetchSettings = async () => {
//     try {
//       const res = await api.get("/settings"); // baseURL already has /api
//       if (res.data) {
//         const data = res.data;
//         setSettings((prev) => ({
//           ...prev,
//           ...data,
//           name: user?.name || prev.name,
//           email: user?.email || prev.email,
//         }));
//         setInitialSettings({
//           ...data,
//           name: user?.name || "",
//           email: user?.email || "",
//         });
//       }
//     } catch (err) {
//       console.error("❌ Error fetching settings:", err);
//       toast.error("Failed to load settings. Please check your connection.");
//     }
//   };

//   const handleChange = (key, value) => {
//     setSettings((prev) => ({
//       ...prev,
//       [key]: value ?? "",
//     }));
//   };

//   const handleNotificationChange = (key, value) => {
//     setSettings((prev) => ({
//       ...prev,
//       notifications: {
//         ...prev.notifications,
//         [key]: value,
//       },
//     }));
//   };

//   const handleSave = async () => {
//     setLoading(true);
//     try {
//       const { name, email, ...rest } = settings;
//       await api.put("/settings", rest);
//       setInitialSettings(settings);
//       toast.success("✅ Settings updated successfully!");
//     } catch (err) {
//       console.error("❌ Error saving settings:", err);
//       toast.error("Failed to save settings. Try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const isChanged =
//     JSON.stringify(settings) !== JSON.stringify(initialSettings);

//   //   return (
//   //     <div className="min-h-screen bg-gradient-to-br from-[#0b1120] via-[#0f172a] to-[#111827] text-gray-100 py-12 px-6 md:px-12">
//   //       <div className="max-w-5xl mx-auto space-y-12">
//   //         <header className="text-center space-y-3">
//   //           <h1 className="text-4xl font-bold text-teal-400 tracking-wide">
//   //             Settings
//   //           </h1>
//   //           <p className="text-gray-400 text-sm">
//   //             Manage your account, preferences, and notifications
//   //           </p>
//   //         </header>

//   //         {/* USER PROFILE */}
//   //         <SectionCard icon={<User className="text-teal-400" />} title="User Profile">
//   //           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//   //             <input
//   //               type="text"
//   //               placeholder="Full Name"
//   //               value={settings.name || ""}
//   //               onChange={(e) => handleChange("name", e.target.value)}
//   //               className="bg-gray-900/60 border border-gray-700 h-12 rounded-xl px-3 text-gray-100 w-full focus:ring-2 focus:ring-teal-500"
//   //               disabled // handled by profile
//   //             />
//   //             <input
//   //               type="email"
//   //               placeholder="Email"
//   //               value={settings.email || ""}
//   //               onChange={(e) => handleChange("email", e.target.value)}
//   //               className="bg-gray-900/60 border border-gray-700 h-12 rounded-xl px-3 text-gray-100 w-full focus:ring-2 focus:ring-teal-500"
//   //               disabled // handled by auth
//   //             />
//   //           </div>
//   //         </SectionCard>

//   //         {/* APP PREFERENCES */}
//   //         <SectionCard icon={<Settings className="text-blue-400" />} title="App Preferences">
//   //           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//   //             <SettingSelect
//   //               label="Currency"
//   //               value={settings.currency}
//   //               onChange={(v) => handleChange("currency", v)}
//   //               options={[
//   //                 { value: "INR", label: "INR (₹)" },
//   //               ]}
//   //             />
//   //             <SettingSelect
//   //               label="Language"
//   //               value={settings.language}
//   //               onChange={(v) => handleChange("language", v)}
//   //               options={[
//   //                 { value: "en", label: "English" },
//   //               ]}
//   //             />
//   //             <SettingSelect
//   //               label="Theme"
//   //               value={settings.theme}
//   //               onChange={(v) => handleChange("theme", v)}
//   //               options={[
//   //                 { value: "dark", label: "Dark" },
//   //               ]}
//   //             />
//   //           </div>
//   //         </SectionCard>

//   //         {/* NOTIFICATIONS */}
//   //         <SectionCard icon={<Bell className="text-yellow-400" />} title="Notifications">
//   //           <div className="space-y-4">
//   //             <ToggleSwitch
//   //               label="Email Updates"
//   //               checked={settings.notifications?.emailUpdates}
//   //               onChange={(val) => handleNotificationChange("emailUpdates", val)}
//   //             />
//   //             <ToggleSwitch
//   //               label="Budget Alerts"
//   //               checked={settings.notifications?.budgetAlerts}
//   //               onChange={(val) => handleNotificationChange("budgetAlerts", val)}
//   //             />
//   //           </div>
//   //         </SectionCard>

//   //         {/* SAVE BUTTON */}
//   //         <div className="flex justify-center pt-6">
//   //           <button
//   //             onClick={handleSave}
//   //             disabled={loading || !isChanged}
//   //             className={`${
//   //               isChanged
//   //                 ? "bg-gradient-to-r from-teal-500 to-emerald-400 text-black"
//   //                 : "bg-gray-700 text-gray-400 cursor-not-allowed"
//   //             } font-semibold py-3 px-10 rounded-full shadow-lg transition-all`}
//   //           >
//   //             {loading ? "Saving..." : "Save Changes"}
//   //           </button>
//   //         </div>
//   //       </div>
//   //     </div>
//   //   );
//   // }

//   // /*  Reusable Components */
//   // const SectionCard = ({ icon, title, children }) => (
//   //   <div className="bg-white/5 border border-white/10 rounded-2xl shadow-xl p-6">
//   //     <div className="flex items-center gap-2 pb-4 border-b border-white/10">
//   //       {icon}
//   //       <h2 className="text-lg font-semibold text-gray-100">{title}</h2>
//   //     </div>
//   //     <div className="pt-4 space-y-4">{children}</div>
//   //   </div>
//   // );

//   // const SettingSelect = ({ label, value, onChange, options }) => (
//   //   <div className="w-full">
//   //     <label className="text-sm text-gray-400 mb-2 block">{label}</label>
//   //     <select
//   //       value={value}
//   //       onChange={(e) => onChange(e.target.value)}
//   //       className="bg-gray-900/60 border border-gray-700 rounded-xl h-12 w-full px-3 text-gray-100 focus:ring-2 focus:ring-teal-500"
//   //     >
//   //       {options.map((opt) => (
//   //         <option key={opt.value} value={opt.value}>
//   //           {opt.label}
//   //         </option>
//   //       ))}
//   //     </select>
//   //   </div>
//   // );

//   // const ToggleSwitch = ({ label, checked, onChange }) => (
//   //   <div className="flex items-center justify-between w-full">
//   //     <span className="text-gray-300">{label}</span>
//   //     <label className="relative inline-flex items-center cursor-pointer">
//   //       <input
//   //         type="checkbox"
//   //         className="sr-only peer"
//   //         checked={!!checked}
//   //         onChange={(e) => onChange(e.target.checked)}
//   //       />
//   //       <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
//   //     </label>
//   //   </div>
//   // );

//   return (
//     <div className="min-h-screen bg-[#F0F2F5] text-[#3B4A54] py-12 px-6 md:px-12">
//       <div className="max-w-5xl mx-auto space-y-12">
//         {/* HEADER */}
//         <header className="text-center space-y-2">
//           <h1 className="text-4xl font-bold text-[#111B21]">Settings</h1>
//           <p className="text-[#667781] text-sm">
//             Manage your account, preferences, and notifications
//           </p>
//         </header>

//         {/* USER PROFILE */}
//         <SectionCard
//           icon={<User className="text-[#24D366]" />}
//           title="User Profile"
//         >
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <input
//               type="text"
//               placeholder="Full Name"
//               value={settings.name || ""}
//               onChange={(e) => handleChange("name", e.target.value)}
//               className="bg-white border border-[#E6E6E6] h-12 rounded-xl px-3 text-[#111B21] w-full"
//               disabled
//             />
//             <input
//               type="email"
//               placeholder="Email"
//               value={settings.email || ""}
//               onChange={(e) => handleChange("email", e.target.value)}
//               className="bg-white border border-[#E6E6E6] h-12 rounded-xl px-3 text-[#111B21] w-full"
//               disabled
//             />
//           </div>
//         </SectionCard>

//         {/* APP PREFERENCES */}
//         <SectionCard
//           icon={<Settings className="text-blue-500" />}
//           title="App Preferences"
//         >
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <SettingSelect
//               label="Currency"
//               value={settings.currency}
//               onChange={(v) => handleChange("currency", v)}
//               options={[{ value: "INR", label: "INR (₹)" }]}
//             />
//             <SettingSelect
//               label="Language"
//               value={settings.language}
//               onChange={(v) => handleChange("language", v)}
//               options={[{ value: "en", label: "English" }]}
//             />
//             <SettingSelect
//               label="Theme"
//               value={settings.theme}
//               onChange={(v) => handleChange("theme", v)}
//               options={[{ value: "light", label: "Light" }]}
//             />
//           </div>
//         </SectionCard>

//         {/* NOTIFICATIONS */}
//         <SectionCard
//           icon={<Bell className="text-yellow-500" />}
//           title="Notifications"
//         >
//           <div className="space-y-4">
//             <ToggleSwitch
//               label="Email Updates"
//               checked={settings.notifications?.emailUpdates}
//               onChange={(val) => handleNotificationChange("emailUpdates", val)}
//             />
//             <ToggleSwitch
//               label="Budget Alerts"
//               checked={settings.notifications?.budgetAlerts}
//               onChange={(val) => handleNotificationChange("budgetAlerts", val)}
//             />
//           </div>
//         </SectionCard>

//         {/* SAVE BUTTON */}
//         <div className="flex justify-center pt-6">
//           <button
//             onClick={handleSave}
//             disabled={loading || !isChanged}
//             className={`${
//               isChanged
//                 ? "bg-[#24D366] text-white"
//                 : "bg-[#DCDCDC] text-[#667781] cursor-not-allowed"
//             } font-semibold py-3 px-10 rounded-full shadow transition-all`}
//           >
//             {loading ? "Saving..." : "Save Changes"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );

//   /*  --- Reusable Components --- */
//   const SectionCard = ({ icon, title, children }) => (
//     <div className="bg-white border border-[#E6E6E6] rounded-2xl shadow p-6">
//       <div className="flex items-center gap-2 pb-4 border-b border-[#E6E6E6]">
//         {icon}
//         <h2 className="text-lg font-semibold text-[#111B21]">{title}</h2>
//       </div>
//       <div className="pt-4 space-y-4">{children}</div>
//     </div>
//   );

//   const SettingSelect = ({ label, value, onChange, options }) => (
//     <div className="w-full">
//       <label className="text-sm text-[#667781] mb-2 block">{label}</label>
//       <select
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         className="bg-white border border-[#E6E6E6] rounded-xl h-12 w-full px-3 text-[#111B21]"
//       >
//         {options.map((opt) => (
//           <option key={opt.value} value={opt.value}>
//             {opt.label}
//           </option>
//         ))}
//       </select>
//     </div>
//   );

//   const ToggleSwitch = ({ label, checked, onChange }) => (
//     <div className="flex items-center justify-between w-full">
//       <span className="text-[#3B4A54]">{label}</span>
//       <label className="relative inline-flex items-center cursor-pointer">
//         <input
//           type="checkbox"
//           className="sr-only peer"
//           checked={!!checked}
//           onChange={(e) => onChange(e.target.checked)}
//         />
//         <div
//           className="w-11 h-6 bg-[#DCDCDC] rounded-full peer peer-checked:bg-[#24D366] 
//       peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] 
//       after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"
//         ></div>
//       </label>
//     </div>
//   );
// }

























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
