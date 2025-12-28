// //Frontend\src\pages\Goals.jsx
// import React, { useContext, useState, useEffect } from "react";
// import { AppContext } from "../context/AppContext";
// import api from "../api";
// import { motion } from "framer-motion";
// import { Plus, Trash2, Edit, RefreshCw } from "lucide-react";

// export default function GoalsPage() {
//   const { goals, refreshData } = useContext(AppContext);
//   const [form, setForm] = useState({
//     name: "",
//     target: "",
//     saved: "",
//     category: "",
//     startDate: "",
//     endDate: "",
//   });
//   const [editingId, setEditingId] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async () => {
//     if (!form.name || !form.target) return alert("Enter goal name and target");

//     try {
//       setLoading(true);
//       if (editingId) {
//         //  FIXED: remove duplicate `/api`
//         await api.put(`/goals/${editingId}`, form);
//       } else {
//         // FIXED: remove duplicate `/api`
//         await api.post("/goals", form);
//       }

//       setForm({
//         name: "",
//         target: "",
//         saved: "",
//         category: "",
//         startDate: "",
//         endDate: "",
//       });
//       setEditingId(null);

//       refreshData();
//       localStorage.setItem("goals_updated", Date.now().toString());
//     } catch (err) {
//       console.error("Goal save error:", err.response?.data || err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (goal) => {
//     setEditingId(goal._id);
//     setForm({
//       name: goal.name,
//       target: goal.target,
//       saved: goal.saved,
//       category: goal.category || "",
//       startDate: goal.startDate ? goal.startDate.split("T")[0] : "",
//       endDate: goal.endDate ? goal.endDate.split("T")[0] : "",
//     });
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Delete this goal?")) return;
//     try {
//       //  FIXED: remove duplicate `/api`
//       await api.delete(`/goals/${id}`);
//       refreshData();
//       localStorage.setItem("goals_updated", Date.now().toString());
//     } catch (err) {
//       console.error("Goal delete error:", err.response?.data || err.message);
//     }
//   };

//   useEffect(() => {
//     refreshData();
//   }, []);

//   return (
//     <div className="min-h-screen p-8 bg-[#F0F2F5] text-[#3B4A54]">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-semibold text-[#111B21]">Goals</h1>
//         <button
//           onClick={refreshData}
//           className="px-4 py-2 bg-[#24D366] hover:bg-[#1EC85A] text-white rounded-lg flex items-center gap-2 text-sm"
//         >
//           <RefreshCw size={16} /> Refresh
//         </button>
//       </div>

//       {/* ADD GOAL FORM */}
//       <div className="bg-white p-6 rounded-2xl border border-[#E6E6E6] shadow-sm mb-8">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
//           <input
//             name="name"
//             placeholder="Goal Name"
//             value={form.name}
//             onChange={handleChange}
//             className="bg-white text-[#111B21] p-3 rounded-lg border border-[#DCDCDC] outline-none"
//           />

//           <input
//             name="target"
//             type="number"
//             placeholder="Target Amount (₹)"
//             value={form.target}
//             onChange={handleChange}
//             className="bg-white text-[#111B21] p-3 rounded-lg border border-[#DCDCDC] outline-none"
//           />

//           <input
//             name="saved"
//             type="number"
//             placeholder="Saved Amount (₹)"
//             value={form.saved}
//             onChange={handleChange}
//             className="bg-white text-[#111B21] p-3 rounded-lg border border-[#DCDCDC] outline-none"
//           />

//           <input
//             name="category"
//             placeholder="Category (optional)"
//             value={form.category}
//             onChange={handleChange}
//             className="bg-white text-[#111B21] p-3 rounded-lg border border-[#DCDCDC] outline-none"
//           />

//           <div className="flex flex-col">
//             <label className="text-sm font-medium">From</label>
//             <input
//               name="startDate"
//               type="date"
//               value={form.startDate}
//               onChange={handleChange}
//               className="bg-white text-[#111B21] p-3 rounded-lg border border-[#DCDCDC] outline-none"
//             />
//           </div>

//           <div className="flex flex-col">
//             <label className="text-sm font-medium">To</label>
//             <input
//               name="endDate"
//               type="date"
//               value={form.endDate}
//               onChange={handleChange}
//               className="bg-white text-[#111B21] p-3 rounded-lg border border-[#DCDCDC] outline-none"
//             />
//           </div>
//         </div>

//         <button
//           onClick={handleSubmit}
//           disabled={loading}
//           className="px-4 py-2 bg-[#24D366] hover:bg-[#1EC85A] text-white rounded-lg flex items-center gap-2 text-sm"
//         >
//           <Plus size={16} />
//           {editingId ? "Update Goal" : "Add Goal"}
//         </button>
//       </div>

//       {/* GOAL CARDS */}
//       <div className="space-y-4">
//         {goals.length === 0 ? (
//           <p className="text-[#667781]">No goals yet.</p>
//         ) : (
//           goals.map((g) => {
//             const progress = g.target
//               ? Math.min(((g.saved || 0) / g.target) * 100, 100).toFixed(1)
//               : 0;

//             return (
//               <motion.div
//                 key={g._id}
//                 whileHover={{ scale: 1.02 }}
//                 className="bg-white p-5 rounded-2xl border border-[#E6E6E6] shadow-sm"
//               >
//                 <div className="flex justify-between items-center mb-2">
//                   <h3 className="font-medium text-[#111B21]">{g.name}</h3>
//                   <div className="flex gap-3">
//                     <button
//                       onClick={() => handleEdit(g)}
//                       className="text-blue-500 hover:text-blue-600"
//                     >
//                       <Edit size={18} />
//                     </button>
//                     <button
//                       onClick={() => handleDelete(g._id)}
//                       className="text-red-500 hover:text-red-600"
//                     >
//                       <Trash2 size={18} />
//                     </button>
//                   </div>
//                 </div>

//                 {/* PROGRESS BAR */}
//                 <div className="w-full bg-[#DCDCDC] h-2 rounded-full overflow-hidden mb-2">
//                   <div
//                     className="bg-[#24D366] h-2 rounded-full transition-all duration-300"
//                     style={{ width: `${progress}%` }}
//                   ></div>
//                 </div>

//                 {/* AMOUNTS */}
//                 <div className="text-sm text-[#3B4A54] flex justify-between">
//                   <span>Saved: ₹{g.saved?.toLocaleString() || 0}</span>
//                   <span>Target: ₹{g.target?.toLocaleString() || 0}</span>
//                   <span>{progress}%</span>
//                 </div>

//                 <div className="border rounded-xl px-4 py-2 bg-white flex items-center gap-6 w-fit mt-3">
//                   {/* FROM (read-only) */}
//                   <div className="flex items-center gap-2 text-sm">
//                     <span className="text-gray-600 font-medium">From</span>
//                     <div className="px-2 py-1 w-32 rounded-lg border border-gray-300 bg-gray-50 text-gray-700 text-sm">
//                       {g.startDate
//                         ? new Date(g.startDate).toLocaleDateString()
//                         : "—"}
//                     </div>
//                   </div>

//                   {/* TO (read-only) */}
//                   <div className="flex items-center gap-2 text-sm">
//                     <span className="text-gray-600 font-medium">To</span>
//                     <div className="px-2 py-1 w-32 rounded-lg border border-gray-300 bg-gray-50 text-gray-700 text-sm">
//                       {g.endDate
//                         ? new Date(g.endDate).toLocaleDateString()
//                         : "—"}
//                     </div>
//                   </div>
//                 </div>
//               </motion.div>
//             );
//           })
//         )}
//       </div>
//     </div>
//   );
// }










// import React, { useContext, useState, useEffect } from "react";
// import { AppContext } from "../context/AppContext";
// import api from "../api";
// import { motion } from "framer-motion";
// import { Plus, Trash2, Edit, RefreshCw } from "lucide-react";

// export default function GoalsPage() {
//   const { goals, refreshData } = useContext(AppContext);

//   const [form, setForm] = useState({
//     name: "",
//     target: "",
//     saved: "",
//     category: "",
//     startDate: "",
//     endDate: "",
//   });

//   const [editingId, setEditingId] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   // ✅ MAIN LOGIC: ADD OR INCREMENT GOAL
//   const handleSubmit = async () => {
//     if (!form.name || !form.target) {
//       alert("Enter goal name and target");
//       return;
//     }

//     try {
//       setLoading(true);

//       // 🔍 Check if goal already exists by NAME (case-insensitive)
//       const existingGoal = goals.find(
//         (g) => g.name.toLowerCase() === form.name.toLowerCase()
//       );

//       if (existingGoal) {
//         // ➕ Increment saved amount
//         const updatedSaved =
//           Number(existingGoal.saved || 0) + Number(form.saved || 0);

//         await api.put(`/goals/${existingGoal._id}`, {
//           ...existingGoal,
//           saved: updatedSaved,
//         });
//       } else {
//         // 🆕 Create new goal
//         await api.post("/goals", {
//           ...form,
//           target: Number(form.target),
//           saved: Number(form.saved || 0),
//         });
//       }

//       // 🔄 Reset form
//       setForm({
//         name: "",
//         target: "",
//         saved: "",
//         category: "",
//         startDate: "",
//         endDate: "",
//       });

//       setEditingId(null);
//       refreshData();
//       localStorage.setItem("goals_updated", Date.now().toString());
//     } catch (err) {
//       console.error("Goal save error:", err.response?.data || err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (goal) => {
//     setEditingId(goal._id);
//     setForm({
//       name: goal.name,
//       target: goal.target,
//       saved: goal.saved,
//       category: goal.category || "",
//       startDate: goal.startDate ? goal.startDate.split("T")[0] : "",
//       endDate: goal.endDate ? goal.endDate.split("T")[0] : "",
//     });
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Delete this goal?")) return;
//     try {
//       await api.delete(`/goals/${id}`);
//       refreshData();
//       localStorage.setItem("goals_updated", Date.now().toString());
//     } catch (err) {
//       console.error("Goal delete error:", err.response?.data || err.message);
//     }
//   };

//   useEffect(() => {
//     refreshData();
//   }, []);

//   return (
//     <div className="min-h-screen p-8 bg-[#F0F2F5] text-[#3B4A54]">
//       {/* HEADER */}
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-semibold text-[#111B21]">Goals</h1>
//         <button
//           onClick={refreshData}
//           className="px-4 py-2 bg-[#24D366] hover:bg-[#1EC85A] text-white rounded-lg flex items-center gap-2 text-sm"
//         >
//           <RefreshCw size={16} /> Refresh
//         </button>
//       </div>

//       {/* ADD GOAL FORM */}
//       <div className="bg-white p-6 rounded-2xl border border-[#E6E6E6] shadow-sm mb-8">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
//           <input
//             name="name"
//             placeholder="Goal Name"
//             value={form.name}
//             onChange={handleChange}
//             className="p-3 rounded-lg border"
//           />

//           <input
//             name="target"
//             type="number"
//             placeholder="Target Amount (₹)"
//             value={form.target}
//             onChange={handleChange}
//             className="p-3 rounded-lg border"
//           />

//           <input
//             name="saved"
//             type="number"
//             placeholder="Add Savings (₹)"
//             value={form.saved}
//             onChange={handleChange}
//             className="p-3 rounded-lg border"
//           />

//           <input
//             name="category"
//             placeholder="Category (optional)"
//             value={form.category}
//             onChange={handleChange}
//             className="p-3 rounded-lg border"
//           />

//           <input
//             name="startDate"
//             type="date"
//             value={form.startDate}
//             onChange={handleChange}
//             className="p-3 rounded-lg border"
//           />

//           <input
//             name="endDate"
//             type="date"
//             value={form.endDate}
//             onChange={handleChange}
//             className="p-3 rounded-lg border"
//           />
//         </div>

//         <button
//           onClick={handleSubmit}
//           disabled={loading}
//           className="px-4 py-2 bg-[#24D366] hover:bg-[#1EC85A] text-white rounded-lg flex items-center gap-2 text-sm"
//         >
//           <Plus size={16} />
//           {editingId ? "Update Goal" : "Add Goal"}
//         </button>
//       </div>

//       {/* GOAL CARDS */}
//       <div className="space-y-4">
//         {goals.length === 0 ? (
//           <p className="text-[#667781]">No goals yet.</p>
//         ) : (
//           goals.map((g) => {
//             const progress = g.target
//               ? Math.min(((g.saved || 0) / g.target) * 100, 100).toFixed(1)
//               : 0;

//             return (
//               <motion.div
//                 key={g._id}
//                 whileHover={{ scale: 1.02 }}
//                 className="bg-white p-5 rounded-2xl border shadow-sm"
//               >
//                 <div className="flex justify-between items-center mb-2">
//                   <h3 className="font-medium text-[#111B21]">{g.name}</h3>
//                   <div className="flex gap-3">
//                     <button
//                       onClick={() => handleEdit(g)}
//                       className="text-blue-500"
//                     >
//                       <Edit size={18} />
//                     </button>
//                     <button
//                       onClick={() => handleDelete(g._id)}
//                       className="text-red-500"
//                     >
//                       <Trash2 size={18} />
//                     </button>
//                   </div>
//                 </div>

//                 {/* PROGRESS BAR */}
//                 <div className="w-full bg-[#DCDCDC] h-2 rounded-full mb-2">
//                   <div
//                     className="bg-[#24D366] h-2 rounded-full"
//                     style={{ width: `${progress}%` }}
//                   />
//                 </div>

//                 <div className="text-sm flex justify-between">
//                   <span>Saved: ₹{g.saved?.toLocaleString() || 0}</span>
//                   <span>Target: ₹{g.target?.toLocaleString() || 0}</span>
//                   <span>{progress}%</span>
//                 </div>
//               </motion.div>
//             );
//           })
//         )}
//       </div>
//     </div>
//   );
// }









// import React, { useContext, useState, useEffect } from "react";
// import { AppContext } from "../context/AppContext";
// import api from "../api";
// import { motion } from "framer-motion";
// import { Plus, Trash2, Edit, RefreshCw } from "lucide-react";

// export default function GoalsPage() {
//   const { goals, refreshData } = useContext(AppContext);

//   const [form, setForm] = useState({
//     name: "",
//     target: "",
//     saved: "",
//     category: "",
//     startDate: "",
//     endDate: "",
//   });

//   const [editingId, setEditingId] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // 🔹 Normalize helper
//   const normalize = (str) => str.trim().toLowerCase();

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   // ✅ MAIN LOGIC
//   const handleSubmit = async () => {
//     if (!form.name || !form.target) {
//       return alert("Goal name and target are required");
//     }

//     try {
//       setLoading(true);

//       const normalizedName = normalize(form.name);

//       const existingGoal = goals.find(
//         (g) => normalize(g.name) === normalizedName
//       );

//       if (existingGoal && !editingId) {
//         // ➕ ADD MONEY TO EXISTING GOAL
//         await api.put(`/goals/${existingGoal._id}`, {
//           saved:
//             Number(existingGoal.saved || 0) +
//             Number(form.saved || 0),
//         });
//       } else if (editingId) {
//         // ✏️ EDIT MODE
//         await api.put(`/goals/${editingId}`, {
//           ...form,
//           saved: Number(form.saved || 0),
//         });
//       } else {
//         // 🆕 CREATE NEW GOAL
//         await api.post("/goals", {
//           ...form,
//           saved: Number(form.saved || 0),
//         });
//       }

//       // Reset form
//       setForm({
//         name: "",
//         target: "",
//         saved: "",
//         category: "",
//         startDate: "",
//         endDate: "",
//       });

//       setEditingId(null);
//       refreshData();
//       localStorage.setItem("goals_updated", Date.now().toString());
//     } catch (err) {
//       console.error("Goal save error:", err.response?.data || err.message);
//       alert("Failed to save goal");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (goal) => {
//     setEditingId(goal._id);
//     setForm({
//       name: goal.name,
//       target: goal.target,
//       saved: goal.saved,
//       category: goal.category || "",
//       startDate: goal.startDate?.split("T")[0] || "",
//       endDate: goal.endDate?.split("T")[0] || "",
//     });
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Delete this goal?")) return;
//     await api.delete(`/goals/${id}`);
//     refreshData();
//   };

//   useEffect(() => {
//     refreshData();
//   }, []);

//   return (
//     <div className="min-h-screen p-8 bg-[#F0F2F5]">
//       <div className="flex justify-between mb-6">
//         <h1 className="text-3xl font-semibold">Goals</h1>
//         <button
//           onClick={refreshData}
//           className="bg-[#24D366] text-white px-4 py-2 rounded-lg flex items-center gap-2"
//         >
//           <RefreshCw size={16} /> Refresh
//         </button>
//       </div>

//       {/* FORM */}
//       <div className="bg-white p-6 rounded-xl mb-8">
//         <p className="text-sm text-gray-500 mb-2">
//           {editingId ? "Editing goal" : "Add money or create a new goal"}
//         </p>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
//           <input name="name" placeholder="Goal Name" value={form.name} onChange={handleChange} className="border p-3 rounded" />
//           <input name="target" type="number" placeholder="Target ₹" value={form.target} onChange={handleChange} className="border p-3 rounded" />
//           <input name="saved" type="number" placeholder="Add Amount ₹" value={form.saved} onChange={handleChange} className="border p-3 rounded" />
//         </div>

//         <button
//           onClick={handleSubmit}
//           disabled={loading}
//           className="bg-[#24D366] text-white px-4 py-2 rounded-lg flex items-center gap-2"
//         >
//           <Plus size={16} />
//           {editingId ? "Update Goal" : "Save Goal"}
//         </button>
//       </div>

//       {/* GOAL LIST */}
//       <div className="space-y-4">
//         {goals.map((g) => {
//           const progress = ((g.saved || 0) / g.target) * 100;

//           return (
//             <motion.div
//               key={g._id}
//               whileHover={{ scale: 1.02 }}
//               className="bg-white p-5 rounded-xl"
//             >
//               <div className="flex justify-between mb-2">
//                 <h3 className="font-medium">{g.name}</h3>
//                 <div className="flex gap-3">
//                   <Edit onClick={() => handleEdit(g)} className="cursor-pointer text-blue-500" />
//                   <Trash2 onClick={() => handleDelete(g._id)} className="cursor-pointer text-red-500" />
//                 </div>
//               </div>

//               <div className="h-2 bg-gray-200 rounded">
//                 <div className="h-2 bg-[#24D366]" style={{ width: `${Math.min(progress, 100)}%` }}></div>
//               </div>

//               <p className="text-sm mt-2">
//                 Saved ₹{g.saved} / Target ₹{g.target}
//               </p>
//             </motion.div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }







import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import api from "../api";
import { motion } from "framer-motion";
import { Plus, Trash2, Edit, RefreshCw } from "lucide-react";

export default function GoalsPage() {
  const { goals, refreshData } = useContext(AppContext);

  const [form, setForm] = useState({
    name: "",
    target: "",
    saved: "",
    category: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const normalize = (v) => v.trim().toLowerCase();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // ✅ ADD / UPDATE LOGIC
  const handleSubmit = async () => {
    if (!form.name || !form.target)
      return alert("Goal name & target required");

    try {
      setLoading(true);

      const existing = goals.find(
        (g) => normalize(g.name) === normalize(form.name)
      );

      if (existing && !editingId) {
        // ➕ ADD TO EXISTING GOAL
        await api.put(`/goals/${existing._id}`, {
          saved: Number(existing.saved || 0) + Number(form.saved || 0),
        });
      } else if (editingId) {
        // ✏️ EDIT GOAL
        await api.put(`/goals/${editingId}`, {
          ...form,
          saved: Number(form.saved || 0),
        });
      } else {
        // 🆕 CREATE NEW
        await api.post("/goals", {
          ...form,
          saved: Number(form.saved || 0),
        });
      }

      setForm({ name: "", target: "", saved: "", category: "" });
      setEditingId(null);
      refreshData();
      localStorage.setItem("goals_updated", Date.now().toString());
    } catch (err) {
      console.error(err);
      alert("Failed to save goal");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (g) => {
    setEditingId(g._id);
    setForm({
      name: g.name,
      target: g.target,
      saved: g.saved,
      category: g.category || "",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this goal?")) return;
    await api.delete(`/goals/${id}`);
    refreshData();
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <div className="min-h-screen p-8 bg-[#F0F2F5] text-[#111B21]">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Goals</h1>

        <button
          onClick={refreshData}
          className="px-4 py-2 bg-[#24D366] hover:bg-[#1EC85A] text-white rounded-lg flex items-center gap-2 text-sm"
        >
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {/* FORM */}
      <div className="bg-white p-6 rounded-2xl border border-[#E6E6E6] shadow-sm mb-8">
        <p className="text-sm text-[#667781] mb-3">
          Add money to existing goal or create a new one
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <input
            name="name"
            placeholder="Goal Name"
            value={form.name}
            onChange={handleChange}
            className="p-3 rounded-lg border border-[#E6E6E6]"
          />

          <input
            name="target"
            type="number"
            placeholder="Target ₹"
            value={form.target}
            onChange={handleChange}
            className="p-3 rounded-lg border border-[#E6E6E6]"
          />

          <input
            name="saved"
            type="number"
            placeholder="Add Amount ₹"
            value={form.saved}
            onChange={handleChange}
            className="p-3 rounded-lg border border-[#E6E6E6]"
          />

          <input
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
            className="p-3 rounded-lg border border-[#E6E6E6]"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-5 py-2 bg-[#24D366] hover:bg-[#1EC85A] text-white rounded-lg flex items-center gap-2 text-sm"
        >
          <Plus size={16} />
          {editingId ? "Update Goal" : "Save Goal"}
        </button>
      </div>

      {/* GOALS LIST */}
      <div className="space-y-4">
        {goals.length === 0 ? (
          <p className="text-[#667781]">No goals yet</p>
        ) : (
          goals.map((g) => {
            const percent = Math.min(
              ((g.saved || 0) / g.target) * 100,
              100
            );

            return (
              <motion.div
                key={g._id}
                whileHover={{ scale: 1.02 }}
                className="bg-white p-5 rounded-2xl border border-[#E6E6E6] shadow-sm"
              >
                <div className="flex justify-between mb-2">
                  <h3 className="font-medium">{g.name}</h3>

                  <div className="flex gap-3">
                    <Edit
                      onClick={() => handleEdit(g)}
                      className="text-blue-500 cursor-pointer"
                      size={18}
                    />
                    <Trash2
                      onClick={() => handleDelete(g._id)}
                      className="text-red-500 cursor-pointer"
                      size={18}
                    />
                  </div>
                </div>

                {/* PROGRESS BAR */}
                <div className="w-full bg-[#E6E6E6] h-2 rounded-full mb-2">
                  <div
                    className="bg-[#24D366] h-2 rounded-full"
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <div className="text-sm text-[#667781] flex justify-between">
                  <span>Saved ₹{g.saved}</span>
                  <span>Target ₹{g.target}</span>
                  <span>{percent.toFixed(1)}%</span>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
