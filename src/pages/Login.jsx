// // frontend/src/pages/Login.jsx
// import React, { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// export default function Login() {
//   const navigate = useNavigate();
//   const { login } = useAuth(); 
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       await login(email, password);
//       navigate("/dashboard", { replace: true });
//     } catch (err) {
//       console.error("❌ Login failed:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex justify-center items-center bg-gray-900 text-gray-200">
//       <form
//         onSubmit={handleLogin}
//         className="bg-gray-800 p-8 rounded-xl w-full max-w-md shadow-lg"
//       >
//         <h2 className="text-2xl font-semibold text-center text-teal-400 mb-6">
//           Login
//         </h2>

//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="w-full mb-4 p-3 rounded-lg bg-gray-700 text-white outline-none focus:ring-2 focus:ring-teal-500"
//           required
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="w-full mb-6 p-3 rounded-lg bg-gray-700 text-white outline-none focus:ring-2 focus:ring-teal-500"
//           required
//         />

//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full bg-teal-600 hover:bg-teal-700 transition py-3 rounded-lg font-medium disabled:opacity-50"
//         >
//           {loading ? "Logging in..." : "Login"}
//         </button>

//         <p className="text-sm text-center text-gray-400 mt-4">
//           Don't have an account?{" "}
//           <Link to="/register" className="text-teal-400 hover:underline">
//             Register
//           </Link>
//         </p>
//       </form>
//     </div>
//   );
// }








// frontend/src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error("❌ Login failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#F0F2F5]">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-2xl w-full max-w-md shadow border border-[#E6E6E6]"
      >
        <h2 className="text-2xl font-bold text-center text-[#111B21] mb-6">
          Login
        </h2>

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
          className="w-full bg-[#24D366] text-white py-3 rounded-xl font-semibold hover:brightness-110 transition disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-sm text-center text-[#667781] mt-4">
          Don't have an account?{" "}
          <Link to="/register" className="text-[#24D366] font-medium hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
