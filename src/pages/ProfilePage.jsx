import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { User, Mail, Settings, Bell, Save } from "lucide-react";

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    currency: "₹",
    categories: [],
    notifications: {
      budgetAlerts: true,
      upcomingBills: true,
      goalProgress: true,
    },
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/api/profile", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        const data = res.data;
        setProfile({
          name: data.name || "",
          email: data.email || "",
          currency: data.currency || "₹",
          categories: data.categories || [],
          notifications: data.notifications || {
            budgetAlerts: true,
            upcomingBills: true,
            goalProgress: true,
          },
        });
      } catch (err) {
        console.error(err);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (field, value) => {
    setProfile({ ...profile, [field]: value });
  };

  const handleCheckbox = (field) => {
    setProfile({
      ...profile,
      notifications: {
        ...profile.notifications,
        [field]: !profile.notifications[field],
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put("/api/profile", profile, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-96 text-slate-500 text-lg">
        Loading your profile...
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto mt-12 bg-gradient-to-br from-indigo-50 to-white shadow-xl rounded-3xl p-10 border border-slate-200">
      <h2 className="text-3xl font-bold text-indigo-700 flex items-center gap-3 mb-8">
        <User className="w-8 h-8 text-indigo-600" />
        Profile Settings
      </h2>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Personal Info */}
        <section className="space-y-4">
          <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
            <Mail className="w-5 h-5 text-indigo-500" /> Personal Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-slate-600 mb-2 font-medium">
                Name
              </label>
              <input
                type="text"
                placeholder="Your name"
                value={profile.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="border border-slate-300 rounded-xl px-4 py-2.5 w-full shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-600 mb-2 font-medium">
                Email
              </label>
              <input
                type="email"
                placeholder="Email address"
                value={profile.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="border border-slate-300 rounded-xl px-4 py-2.5 w-full shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none transition"
              />
            </div>
          </div>
        </section>

        {/* Financial Settings */}
        <section className="space-y-4">
          <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-500" /> Financial Settings
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-slate-600 mb-2 font-medium">
                Preferred Currency
              </label>
              <select
                value={profile.currency}
                onChange={(e) => handleChange("currency", e.target.value)}
                className="border border-slate-300 rounded-xl px-4 py-2.5 w-full shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none transition"
              >
                <option value="₹">₹ INR</option>
                <option value="$">$ USD</option>
                <option value="€">€ EUR</option>
                <option value="£">£ GBP</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-slate-600 mb-2 font-medium">
                Categories (comma-separated)
              </label>
              <input
                type="text"
                value={(profile.categories || []).join(", ")}
                onChange={(e) =>
                  handleChange(
                    "categories",
                    e.target.value.split(",").map((c) => c.trim())
                  )
                }
                className="border border-slate-300 rounded-xl px-4 py-2.5 w-full shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none transition"
              />
            </div>
          </div>
        </section>

        {/* Notification Preferences */}
        <section className="space-y-4">
          <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
            <Bell className="w-5 h-5 text-indigo-500" /> Notification
            Preferences
          </h3>
          <div className="flex flex-col gap-4 bg-indigo-50 p-5 rounded-2xl border border-indigo-100">
            {Object.keys(profile.notifications).map((key) => (
              <label
                key={key}
                className="flex items-center justify-between cursor-pointer"
              >
                <span className="text-slate-700 font-medium capitalize">
                  {key.replace(/([A-Z])/g, " $1")}
                </span>
                <input
                  type="checkbox"
                  checked={profile.notifications[key]}
                  onChange={() => handleCheckbox(key)}
                  className="w-5 h-5 accent-indigo-600 rounded-md"
                />
              </label>
            ))}
          </div>
        </section>

        <div className="pt-6 border-t border-slate-200 flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
          >
            <Save className="w-5 h-5" />
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
