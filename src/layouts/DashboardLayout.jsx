//frontend\src\layouts\DashboardLayout.jsx
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

export default function DashboardLayout({ children }) {
  return (
    <div className="relative min-h-screen flex">
      {/* glowing gradient background */}
      <div className="absolute top-40 right-40 w-96 h-96 bg-gradient-to-br from-purple-600/20 to-pink-500/20 rounded-full blur-3xl"></div>

      <Sidebar />
      <div className="flex-1 ml-0 md:ml-72">
        <Navbar />
        <main className="p-8 min-h-screen relative z-10">{children}</main>
      </div>
    </div>
  );
}
