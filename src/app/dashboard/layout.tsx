"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard, Calendar, FileText, Settings, LogOut,
  Bell, ExternalLink, ChevronRight, Search,
} from "lucide-react";
import { isAuthenticated, logout, getUser } from "@/lib/auth";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, badge: null },
  { href: "/dashboard/appointments", label: "Citas / Maweid", icon: Calendar, badge: "5" },
  { href: "/dashboard/articles", label: "Artículos", icon: FileText, badge: null },
  { href: "/dashboard/services", label: "Servicios", icon: Settings, badge: null },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) { router.replace("/login"); return; }
    setUser(getUser());
  }, [router]);

  if (!user) return null;

  const pageTitle = NAV.find(n => n.href === pathname)?.label ?? "Dashboard";

  return (
    <div className="dash-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        {/* Brand */}
        <div className="sidebar-top">
          <div className="sidebar-brand">
            <div className="sidebar-badge">⚖️</div>
            <div>
              <div className="sidebar-brand-name">Admira</div>
              <div className="sidebar-brand-sub">Panel Legal</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          <div className="sidebar-section-label">Gestión</div>
          {NAV.map(item => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}
                className={`nav-item ${isActive ? "active" : ""}`}>
                <Icon className="nav-item-icon" size={17} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="nav-item-badge">{item.badge}</span>
                )}
                {isActive && <ChevronRight size={13} style={{ marginLeft: "auto", opacity: 0.4 }} />}
              </Link>
            );
          })}

          <div className="sidebar-section-label" style={{ marginTop: "14px" }}>Sitio Web</div>
          <a href="/" target="_blank" rel="noopener noreferrer" className="nav-item">
            <ExternalLink className="nav-item-icon" size={17} />
            Ver Sitio Web
          </a>
        </nav>

        {/* User */}
        <div className="sidebar-user">
          <div className="user-card" style={{ marginBottom: "10px" }}>
            <div className="user-avatar">👩‍⚖️</div>
            <div>
              <div className="user-name">{user.name}</div>
              <div className="user-role">Administradora</div>
            </div>
          </div>
          <button
            className="nav-item"
            onClick={() => { logout(); router.replace("/login"); }}
            style={{ color: "rgba(220,38,38,0.6)", width: "100%" }}
          >
            <LogOut className="nav-item-icon" size={17} />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="dash-main">
        {/* Topbar */}
        <div className="dash-topbar">
          <div>
            <div className="topbar-title">{pageTitle}</div>
            <div className="topbar-sub">Panel de Administración · Admira Abogados</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {/* Search */}
            <div style={{ position: "relative", display: "none" }}>
              <Search size={14} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--gray-400)" }} />
              <input style={{ paddingLeft: "32px", paddingRight: "12px", padding: "7px 12px 7px 32px", border: "1px solid var(--gray-200)", borderRadius: "7px", fontSize: "13px", outline: "none", width: "220px" }} placeholder="Buscar..." />
            </div>

            {/* Bell */}
            <button style={{ width: "35px", height: "35px", border: "1px solid var(--gray-200)", borderRadius: "8px", background: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gray-500)", position: "relative" }}>
              <Bell size={15} />
              <span style={{ position: "absolute", top: "6px", right: "6px", width: "7px", height: "7px", background: "var(--crimson)", borderRadius: "50%", border: "2px solid white" }} />
            </button>

            {/* User chip */}
            <div style={{ padding: "6px 13px", background: "var(--crimson-pale)", border: "1px solid rgba(155,28,46,0.15)", borderRadius: "var(--r-full)", fontSize: "13px", color: "var(--crimson)", fontWeight: "700", display: "flex", alignItems: "center", gap: "6px" }}>
              👩‍⚖️ {user.name}
            </div>
          </div>
        </div>

        {/* Page content */}
        <div className="dash-content">{children}</div>
      </main>
    </div>
  );
}
