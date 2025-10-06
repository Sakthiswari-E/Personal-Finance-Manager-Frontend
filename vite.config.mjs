// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";

// const apiBaseUrl = process.env.VITE_API_BASE_URL || "http://localhost:5001";

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     port: 5173,
//     proxy: {
//       "/api": apiBaseUrl,
//     },
//   },
// });


import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  define: {
    // Makes the environment variable safe for build
    "import.meta.env.VITE_API_BASE_URL":
      JSON.stringify(process.env.VITE_API_BASE_URL || "http://localhost:5001"),
  },
  server: {
    port: 5173,
  },
});
