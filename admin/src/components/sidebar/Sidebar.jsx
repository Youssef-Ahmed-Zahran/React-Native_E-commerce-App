import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    Package,
    Tag,
    ShoppingCart,
    Users,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

const NAV_ITEMS = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/products", icon: Package, label: "Products" },
    { to: "/categories", icon: Tag, label: "Categories" },
    { to: "/orders", icon: ShoppingCart, label: "Orders" },
    { to: "/customers", icon: Users, label: "Customers" },
];

function Sidebar({ isOpen, onToggle }) {
    return (
        <>
            {/* ── Mobile overlay ─────────────────────────────────────────── */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-20 bg-black/30 backdrop-blur-sm md:hidden"
                    onClick={onToggle}
                    aria-hidden="true"
                />
            )}

            {/* ── Sidebar panel ──────────────────────────────────────────── */}
            <aside
                className={[
                    // Base
                    "fixed top-0 left-0 z-30 h-screen bg-white border-r border-gray-100 shadow-lg",
                    "flex flex-col transition-all duration-300 ease-in-out overflow-hidden",
                    // Width driven by isOpen
                    isOpen ? "w-60" : "w-16",
                    // On mobile: slide in/out from the left
                    "translate-x-0",
                ].join(" ")}
                aria-label="Sidebar navigation"
            >
                {/* ── Logo / brand ─────────────────────────────────────────── */}
                <div className="flex items-center h-16 border-b border-gray-100 px-3 flex-shrink-0">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-9 h-9 flex-shrink-0 bg-indigo-600 rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold text-base">A</span>
                        </div>
                        <span
                            className={`text-base font-bold text-gray-900 whitespace-nowrap transition-all duration-200 ${isOpen ? "opacity-100 w-auto" : "opacity-0 w-0"
                                }`}
                        >
                            AdminPanel
                        </span>
                    </div>
                </div>

                {/* ── Nav items ────────────────────────────────────────────── */}
                <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto overflow-x-hidden">
                    {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            id={`sidebar-link-${label.toLowerCase()}`}
                            className={({ isActive }) =>
                                [
                                    "flex items-center gap-3 px-2.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group",
                                    isActive
                                        ? "bg-indigo-50 text-indigo-700"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                                ].join(" ")
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <Icon
                                        size={20}
                                        className={`flex-shrink-0 transition-colors ${isActive
                                                ? "text-indigo-600"
                                                : "text-gray-400 group-hover:text-gray-600"
                                            }`}
                                    />
                                    <span
                                        className={`whitespace-nowrap transition-all duration-200 ${isOpen ? "opacity-100 w-auto" : "opacity-0 w-0"
                                            }`}
                                    >
                                        {label}
                                    </span>
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* ── Toggle button ────────────────────────────────────────── */}
                <div className="px-2 py-3 border-t border-gray-100 flex-shrink-0">
                    <button
                        onClick={onToggle}
                        id="sidebar-toggle-btn"
                        className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-all duration-150"
                        aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
                    >
                        {isOpen ? (
                            <>
                                <ChevronLeft size={18} />
                                <span className="text-xs font-medium transition-all duration-200 opacity-100">
                                    Collapse
                                </span>
                            </>
                        ) : (
                            <ChevronRight size={18} />
                        )}
                    </button>
                </div>
            </aside>
        </>
    );
}

export default Sidebar;
