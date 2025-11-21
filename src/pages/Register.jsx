// frontend/src/pages/Register.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext"; 
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function Register() {
  const { register } = useAuth(); 
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(name, email, password);
      toast.success("Registration successful! Please log in.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#F0F2F5]">
      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded-2xl w-full max-w-md shadow border border-[#E6E6E6]"
      >
        <h2 className="text-2xl font-bold text-center text-[#111B21] mb-6">
          Create Account
        </h2>

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-4 p-3 rounded-xl bg-white border border-[#DCDCDC] text-[#111B21]"
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-3 rounded-xl bg-white border border-[#DCDCDC] text-[#111B21]"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 p-3 rounded-xl bg-white border border-[#DCDCDC] text-[#111B21]"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#24D366] text-white py-3 rounded-xl font-semibold hover:brightness-110 transition"
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="text-sm text-center text-[#667781] mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-[#24D366] font-medium hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
