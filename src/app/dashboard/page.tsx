"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, FileText, Settings, ArrowRight, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { getStats, getAppointments } from "@/lib/data";

const STATUS_MAP = {
  pending: { label: "Pendiente", cls: "badge-yellow", icon: <AlertCircle size={11} /> },
  confirmed: { label: "Confirmada", cls: "badge-green", icon: <CheckCircle size={11} /> },
  cancelled: { label: "Cancelada", cls: "badge-red", icon: <XCircle size={11} /> },
};

export default function DashboardPage() {
  const [stats] = useState(() => getStats());
  const recentAppts = getAppointments().slice(0, 6);

  const statCards = [
    { label: "Total Citas", value: stats.totalAppointments, sub: `${stats.pendingAppointments} pendientes`, color: "red", icon: "📅" },
    { label: "Confirmadas", value: stats.confirmedAppointments, sub: "Listas para atender", color: "green", icon: "✅" },
    { label: "Artículos", value: stats.totalArticles, sub: `${stats.publishedArticles} publicados`, color: "blue", icon: "📄" },
    { label: "Servicios", value: stats.totalServices, sub: "Activos en web", color: "yellow", icon: "⚖️" },
  ];

  return (
    <div>
      {/* Welcome Banner */}
      <div className="welcome-banner" style={{ marginBottom: "24px" }}>
        <div>
          <div className="welcome-time">⚖️ Panel de Administración</div>
          <div className="welcome-name">Buenos días, Aziza 👩‍⚖️</div>
          <div className="welcome-sub">
            Tienes <strong style={{ color: "var(--crimson-light)" }}>{stats.pendingAppointments} citas pendientes</strong> de revisión
          </div>
        </div>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", position: "relative", zIndex: 1 }}>
          {[{ n: stats.casesHandled.toLocaleString(), l: "Casos Gestionados" }, { n: stats.casesWon.toLocaleString(), l: "Casos Resueltos" }].map((k, i) => (
            <div key={i} className="welcome-kpi">
              <div className="welcome-kpi-num">{k.n}</div>
              <div className="welcome-kpi-label">{k.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid-4" style={{ marginBottom: "24px" }}>
        {statCards.map((s, i) => (
          <div key={i} className={`stat-card ${s.color}`}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
                <div style={{ fontSize: "11.5px", color: "var(--gray-400)", marginTop: "5px" }}>{s.sub}</div>
              </div>
              <div style={{ fontSize: "26px" }}>{s.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Grid */}
      <div className="grid-2" style={{ alignItems: "start", gap: "20px" }}>
        {/* Quick Actions */}
        <div>
          <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: "17px", color: "var(--charcoal)", marginBottom: "14px" }}>
            Acciones Rápidas
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {[
              { href: "/dashboard/appointments", icon: "📅", label: "Gestionar Citas", sub: `${stats.pendingAppointments} pendientes de revisión`, iconBg: "rgba(155,28,46,0.08)", iconColor: "var(--crimson)" },
              { href: "/dashboard/articles", icon: "✍️", label: "Gestionar Artículos", sub: `${stats.totalArticles - stats.publishedArticles} borradores sin publicar`, iconBg: "rgba(37,99,235,0.08)", iconColor: "var(--info)" },
              { href: "/dashboard/services", icon: "⚖️", label: "Gestionar Servicios", sub: `${stats.totalServices} activos en el sitio web`, iconBg: "rgba(22,163,74,0.08)", iconColor: "var(--success)" },
            ].map((a, i) => (
              <Link key={i} href={a.href} className="quick-action">
                <div className="quick-action-icon" style={{ background: a.iconBg, fontSize: "22px" }}>
                  {a.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div className="quick-action-label">{a.label}</div>
                  <div className="quick-action-sub">{a.sub}</div>
                </div>
                <ArrowRight size={15} style={{ color: "var(--gray-300)" }} />
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Appointments */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
            <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: "17px", color: "var(--charcoal)" }}>
              Citas Recientes
            </h3>
            <Link href="/dashboard/appointments" style={{ fontSize: "12.5px", color: "var(--crimson)", textDecoration: "none", fontWeight: "700" }}>
              Ver todas →
            </Link>
          </div>

          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Servicio</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {recentAppts.map(apt => {
                  const s = STATUS_MAP[apt.status];
                  return (
                    <tr key={apt.id}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
                          <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--charcoal)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--crimson-light)", fontSize: "12px", fontWeight: "800", flexShrink: 0 }}>
                            {apt.clientName.charAt(0)}
                          </div>
                          <span style={{ fontWeight: "600", fontSize: "13px" }}>{apt.clientName}</span>
                        </div>
                      </td>
                      <td style={{ color: "var(--gray-500)", fontSize: "12.5px" }}>{apt.serviceType}</td>
                      <td style={{ color: "var(--gray-500)", fontSize: "12.5px", whiteSpace: "nowrap" }}>
                        {new Date(apt.date + "T12:00:00").toLocaleDateString("es-ES", { day: "2-digit", month: "short" })} · {apt.time}
                      </td>
                      <td>
                        <span className={`badge ${s.cls}`} style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                          {s.icon}{s.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
