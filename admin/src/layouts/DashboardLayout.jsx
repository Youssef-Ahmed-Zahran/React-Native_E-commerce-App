import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import Sidebar from "../components/sidebar/Sidebar";

function DashboardLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const toggleSidebar = () => setSidebarOpen((prev) => !prev);

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* ── Sidebar ───────────────────────────────────────────────── */}
            <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

            {/* ── Main area (shifts right to accommodate sidebar) ────────── */}
            <div
                className={`flex flex-col flex-1 min-h-screen transition-all duration-300 ease-in-out ${sidebarOpen ? "md:ml-60" : "md:ml-16"
                    }`}
            >
                {/* ── Navbar (receives toggle for the hamburger button) ──── */}
                <Navbar onToggle={toggleSidebar} />

                {/* ── Page content ──────────────────────────────────────── */}
                <main className="flex-1 p-4 md:p-6 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default DashboardLayout;
