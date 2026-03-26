"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, Scale, ArrowRight, CheckCircle, Shield, Users, Clock } from "lucide-react";
import { login, isAuthenticated } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) router.replace("/dashboard");
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise(r => setTimeout(r, 750));
    const ok = login(email, password);
    setLoading(false);
    if (ok) router.replace("/dashboard");
    else setError("Credenciales incorrectas. Verifica tu email y contraseña.");
  }

  return (
    <div className="login-page">
      {/* LEFT – Branding Panel */}
      <div className="login-left">
        <div className="login-left-bg" />
        <div style={{ position: "relative", zIndex: 1, maxWidth: "420px", textAlign: "center" }}>
          {/* Logo */}
          <div style={{ marginBottom: "40px" }}>
            <div style={{ width: "72px", height: "72px", background: "var(--crimson)", borderRadius: "18px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", margin: "0 auto 20px", boxShadow: "var(--shadow-crimson)" }}>⚖️</div>
            <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "32px", color: "white", marginBottom: "8px" }}>Admira Abogados</h1>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "14px" }}>Panel de Administración Legal</p>
          </div>

          {/* Features */}
          <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "40px" }}>
            {[
              { icon: <CheckCircle size={16} />, t: "Gestión completa de citas", sub: "Crea, edita y confirma consultas" },
              { icon: <Scale size={16} />, t: "Administración de servicios", sub: "Dos idiomas: Español y Árabe" },
              { icon: <Shield size={16} />, t: "Panel seguro y privado", sub: "Acceso restringido a administradores" },
            ].map((f, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "12px", textAlign: "left", padding: "14px 16px", borderRadius: "10px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div style={{ width: "30px", height: "30px", borderRadius: "7px", background: "rgba(155,28,46,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--crimson-light)", flexShrink: 0 }}>
                  {f.icon}
                </div>
                <div>
                  <div style={{ color: "white", fontSize: "13.5px", fontWeight: "600" }}>{f.t}</div>
                  <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px", marginTop: "2px" }}>{f.sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Stat chips */}
          <div style={{ display: "flex", justifyContent: "center", gap: "14px", flexWrap: "wrap" }}>
            {[{ n: "4,968", l: "Casos" }, { n: "500+", l: "Clientes" }, { n: "10+", l: "Años" }].map((s, i) => (
              <div key={i} style={{ textAlign: "center", padding: "10px 18px", borderRadius: "8px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "20px", color: "var(--crimson-light)", fontWeight: "700" }}>{s.n}</div>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", marginTop: "2px" }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT – Login Form */}
      <div className="login-right">
        <div className="login-card">
          <div className="login-logo-icon">⚖️</div>
          <h2 className="login-title">Bienvenida, Aziza</h2>
          <p className="login-subtitle">Inicia sesión para acceder al panel de administración</p>

          <div className="login-hint">
            🔑 <strong>Demo:</strong> aziza@admiraabogados.com / Admira2026!
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Correo Electrónico</label>
              <div style={{ position: "relative" }}>
                <Mail size={15} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--gray-400)", pointerEvents: "none" }} />
                <input id="email" className="form-input" type="email" value={email}
                  onChange={e => setEmail(e.target.value)} placeholder="correo@admiraabogados.com"
                  required style={{ paddingLeft: "38px" }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Contraseña</label>
              <div style={{ position: "relative" }}>
                <Lock size={15} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--gray-400)", pointerEvents: "none" }} />
                <input id="password" className="form-input"
                  type={showPassword ? "text" : "password"}
                  value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" required
                  style={{ paddingLeft: "38px", paddingRight: "40px" }} />
                <button type="button" onClick={() => setShowPassword(v => !v)}
                  style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--gray-400)", padding: "4px" }}>
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="login-error">
                <Lock size={14} /> {error}
              </div>
            )}

            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}
              style={{ justifyContent: "center", width: "100%", marginTop: "4px", opacity: loading ? 0.8 : 1 }}>
              {loading ? (
                <>
                  <span style={{ width: "16px", height: "16px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" }} />
                  Verificando...
                </>
              ) : (
                <><ArrowRight size={17} />Iniciar Sesión</>
              )}
            </button>
          </form>

          <div style={{ marginTop: "24px", paddingTop: "20px", borderTop: "1px solid var(--gray-200)", textAlign: "center" }}>
            <a href="/" style={{ fontSize: "13px", color: "var(--gray-400)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "5px" }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "var(--crimson)")}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "var(--gray-400)")}>
              ← Volver al Sitio Web
            </a>
          </div>
        </div>

        <style jsx global>{`
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    </div>
  );
}
