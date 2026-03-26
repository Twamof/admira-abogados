"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ChevronLeft, ChevronRight, CheckCircle, Lock, Calendar,
  Phone, Mail, MapPin, Clock, ArrowRight, Star, Shield,
  Users, Briefcase, Scale, Globe, FileText, Heart, CreditCard,
} from "lucide-react";
import { createAppointment, SERVICE_TYPES, TIME_SLOTS, getArticles } from "@/lib/data";

// Base path for images — matches next.config.ts basePath for GitHub Pages
const BASE_PATH = process.env.NODE_ENV === "production" ? "/admira-abogados" : "";

// ── helpers ──────────────────────────────────────────────────────────────────
const M_ES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const M_AR = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
const D_ES = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const D_AR = ["اثن", "ثلا", "أرب", "خمي", "جمع", "سبت", "أحد"];
const BOOKED: Record<string, string[]> = {
  "2026-03-28": ["09:00", "11:00", "14:00"],
  "2026-03-30": ["10:00", "16:00"],
  "2026-04-02": ["09:30", "13:00", "17:00"],
};

const SERVICES = [
  { icon: Globe, name: "Extranjería", nameAr: "الهجرة والإقامة", desc: "Visados, residencia, reagrupación familiar y nacionalidad.", descAr: "التأشيرات والإقامة ولمّ الشمل والجنسية.", price: "Consulta gratuita" },
  { icon: Heart, name: "Derecho de Familia", nameAr: "قانون الأسرة", desc: "Divorcios, custodias, pensiones y acuerdos de separación.", descAr: "الطلاق والحضانة والنفقة وعقود الفراق.", price: "Desde €600" },
  { icon: FileText, name: "Derecho Civil", nameAr: "القانون المدني", desc: "Contratos, herencias, reclamaciones y derechos del consumidor.", descAr: "العقود والإرث والمطالبات وحقوق المستهلك.", price: "Consulta gratuita" },
  { icon: Briefcase, name: "Derecho Mercantil", nameAr: "القانون التجاري", desc: "Constitución de sociedades, fusiones y asesoría empresarial.", descAr: "تأسيس الشركات والاندماجات والاستشارات.", price: "Desde €25/mes" },
  { icon: Users, name: "Derecho Laboral", nameAr: "قانون العمل", desc: "Despidos, reclamaciones y derechos de trabajadores extranjeros.", descAr: "الفصل التعسفي ومطالبات حقوق العمال.", price: "Consulta gratuita" },
  { icon: Shield, name: "Derecho Penal", nameAr: "القانون الجنائي", desc: "Defensa en causas penales y situaciones de especial urgencia.", descAr: "الدفاع في القضايا الجنائية والطارئة.", price: "Según caso" },
];

const ARTICLE_ICONS: Record<string, string> = {
  "Derecho de Familia": "👨‍👩‍👧", "Derecho Laboral": "💼", "Derecho Bancario": "💰", "Extranjería": "🌍", "Derecho Mercantil": "🏢", "Derecho Civil": "⚖️",
};

const STATS = [
  { n: "4,968", l: "Casos Resueltos", lAr: "قضية محلولة" },
  { n: "10+", l: "Años Experiencia", lAr: "سنوات خبرة" },
  { n: "98%", l: "Satisfacción", lAr: "رضا العملاء" },
  { n: "4.9★", l: "Google Rating", lAr: "تقييم جوجل" },
];

export default function HomePage() {
  const [lang, setLang] = useState<"es" | "ar">("es");
  const [calMonth, setCalMonth] = useState(new Date(2026, 2, 1));
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", email: "", service: "", notes: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const articles = getArticles(true).slice(0, 3);
  const isAr = lang === "ar";

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) setVisibleSections(prev => new Set([...prev, e.target.id])); }),
      { threshold: 0.15 }
    );
    document.querySelectorAll("[data-animate]").forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const y = calMonth.getFullYear(), m = calMonth.getMonth();
  const firstDay = (new Date(y, m, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const today = new Date(); today.setHours(0, 0, 0, 0);

  function ds(d: number) { return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`; }
  function isWeekend(d: number) { const w = new Date(y, m, d).getDay(); return w === 0 || w === 6; }
  function isPast(d: number) { return new Date(y, m, d) < today; }
  function slotStatus(slot: string): "available" | "booked" | "selected" {
    if (slot === selectedTime) return "selected";
    if (selectedDate && BOOKED[selectedDate]?.includes(slot)) return "booked";
    return "available";
  }

  async function handleConfirm() {
    if (!form.name || !form.email || !form.service || !selectedDate || !selectedTime) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    createAppointment({
      clientName: form.name, clientEmail: form.email, clientPhone: form.phone,
      serviceType: form.service, date: selectedDate, time: selectedTime, status: "pending", notes: form.notes
    });
    setLoading(false); setSubmitted(true);
  }

  const canConfirm = !!(form.name && form.email && form.service && selectedDate && selectedTime);
  const selDateDisplay = selectedDate
    ? new Date(selectedDate + "T12:00:00").toLocaleDateString(isAr ? "ar-MA" : "es-ES", { weekday: "long", day: "2-digit", month: "long" })
    : null;

  // ── submitted ──────────────────────────────────────────────────────────────
  if (submitted) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F8F8F8", padding: 24 }}>
      <div style={{ background: "white", borderRadius: 24, padding: "52px 44px", maxWidth: 500, width: "100%", boxShadow: "0 24px 64px rgba(0,0,0,0.12)", textAlign: "center" }}>
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg,#16A34A,#22C55E)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", boxShadow: "0 8px 24px rgba(22,163,74,0.3)" }}>
          <CheckCircle size={38} color="white" />
        </div>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, color: "#1C1C1E", marginBottom: 8 }}>{isAr ? "تم تأكيد طلبك!" : "¡Consulta Confirmada!"}</h2>
        <p style={{ color: "#8E8E93", fontSize: 14.5, marginBottom: 28, lineHeight: 1.7 }}>{isAr ? "سيتواصل معك فريقنا القانوني خلال 24 ساعة لتأكيد التفاصيل." : "Te contactaremos en menos de 24 horas para confirmar los detalles."}</p>
        <div style={{ background: "#F8F8F8", borderRadius: 14, padding: "18px 22px", textAlign: "left", fontSize: 13.5, marginBottom: 28 }}>
          {[[isAr ? "العميل" : "Cliente", form.name], [isAr ? "الخدمة" : "Servicio", form.service], [isAr ? "التاريخ" : "Fecha", selDateDisplay || ""], [isAr ? "الوقت" : "Hora", selectedTime || ""]].map(([l, v]) => (
            <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #EEEEEF" }}>
              <span style={{ color: "#8E8E93" }}>{l}</span><strong style={{ color: "#1C1C1E" }}>{v}</strong>
            </div>
          ))}
        </div>
        <button onClick={() => { setSubmitted(false); setSelectedDate(null); setSelectedTime(null); setForm({ name: "", phone: "", email: "", service: "", notes: "" }); }}
          style={{ background: "#8B0000", color: "white", border: "none", borderRadius: 12, padding: "14px 32px", fontWeight: 700, fontSize: 14, cursor: "pointer", boxShadow: "0 4px 16px rgba(139,0,0,0.3)" }}>
          {isAr ? "حجز موعد آخر" : "Reservar otra cita"}
        </button>
      </div>
    </div>
  );

  return (
    <div dir={isAr ? "rtl" : "ltr"} style={{ fontFamily: "Inter, sans-serif", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,700&family=Inter:wght@300;400;500;600;700;800;900&family=Amiri:wght@400;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::placeholder{color:rgba(255,255,255,0.28)!important;}
        ::-webkit-scrollbar{width:5px;}
        ::-webkit-scrollbar-thumb{background:#8B0000;border-radius:3px;}
        @keyframes spin{to{transform:rotate(360deg);}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(32px);}to{opacity:1;transform:translateY(0);}}
        @keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
        @keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.5;}}
        @keyframes shimmer{0%{background-position:-200% 0;}100%{background-position:200% 0;}}
        @keyframes floatY{0%,100%{transform:translateY(0);}50%{transform:translateY(-8px);}}
        .anim-up{animation:fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) forwards;}
        .anim-in{animation:fadeIn 0.5s ease forwards;}
        .inp-dark{width:100%;padding:11px 14px;border-radius:9px;border:1.5px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.07);color:white;font-size:14px;outline:none;font-family:Inter,sans-serif;transition:border-color 0.2s;}
        .inp-dark:focus{border-color:#B22222;background:rgba(255,255,255,0.1);}
        .inp-dark option{background:#1C1C1E;color:white;}
        .cal-day-cell{aspect-ratio:1;display:flex;align-items:center;justify-content:center;border-radius:8px;font-size:13px;cursor:pointer;transition:all 0.15s;font-weight:500;user-select:none;}
        .cal-day-cell:hover:not(.dis){background:rgba(178,34,34,0.15);color:#B22222;}
        .cal-day-cell.sel{background:#8B0000!important;color:white!important;box-shadow:0 3px 10px rgba(139,0,0,0.45);font-weight:700;}
        .cal-day-cell.dis{color:rgba(255,255,255,0.18);cursor:not-allowed;}
        .cal-day-cell.tod{color:#E57373;font-weight:700;}
        .slot-btn{padding:9px 4px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;border:1.5px solid;text-align:center;display:flex;align-items:center;justify-content:center;gap:3px;transition:all 0.15s;}
        .slot-btn.av{border-color:rgba(134,239,172,0.5);background:rgba(240,253,244,0.08);color:#86EFAC;}
        .slot-btn.av:hover{background:rgba(134,239,172,0.15);border-color:#86EFAC;}
        .slot-btn.bk{border-color:rgba(255,255,255,0.1);background:rgba(255,255,255,0.03);color:rgba(255,255,255,0.2);cursor:not-allowed;}
        .slot-btn.st{border-color:#8B0000;background:#8B0000;color:white;box-shadow:0 3px 10px rgba(139,0,0,0.4);}
        .svc-card{background:white;border-radius:16px;padding:28px 24px;border:1px solid #EEEEEF;transition:all 0.3s cubic-bezier(0.16,1,0.3,1);cursor:pointer;position:relative;overflow:hidden;}
        .svc-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,#8B0000,#B22222);transform:scaleX(0);transform-origin:left;transition:transform 0.3s;}
        .svc-card:hover::before{transform:scaleX(1);}
        .svc-card:hover{transform:translateY(-5px);box-shadow:0 16px 40px rgba(0,0,0,0.12);border-color:rgba(139,0,0,0.18);}
        .svc-card:hover .svc-icon{background:#8B0000;color:white;}
        .svc-icon{width:54px;height:54px;border-radius:12px;background:#FFF5F5;border:1px solid rgba(139,0,0,0.12);display:flex;align-items:center;justify-content:center;color:#8B0000;margin-bottom:18px;transition:all 0.3s;}
        .art-card{background:white;border-radius:16px;overflow:hidden;border:1px solid #EEEEEF;transition:all 0.3s cubic-bezier(0.16,1,0.3,1);display:flex;flex-direction:column;}
        .art-card:hover{transform:translateY(-5px);box-shadow:0 16px 40px rgba(0,0,0,0.12);border-color:rgba(139,0,0,0.15);}
        .nav-lnk{padding:7px 15px;border-radius:7px;color:rgba(255,255,255,0.6);font-size:14px;font-weight:500;text-decoration:none;transition:all 0.2s;}
        .nav-lnk:hover{color:white;background:rgba(255,255,255,0.08);}
        .confirm-btn{padding:16px 48px;background:#8B0000;color:white;border:none;border-radius:13px;font-size:15px;font-weight:800;letter-spacing:0.3px;cursor:pointer;display:flex;align-items:center;gap:10px;transition:all 0.2s;box-shadow:0 6px 24px rgba(139,0,0,0.4);}
        .confirm-btn:hover:not(:disabled){background:#A00000;transform:translateY(-1px);box-shadow:0 8px 28px rgba(139,0,0,0.5);}
        .confirm-btn:disabled{background:rgba(255,255,255,0.08);color:rgba(255,255,255,0.25);cursor:not-allowed;box-shadow:none;}
      `}</style>

      {/* ── NAV ─────────────────────────────────────────────────────────────── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 300, height: 68,
        background: scrolled ? "rgba(14,14,16,0.98)" : "rgba(14,14,16,0.85)",
        backdropFilter: "blur(20px) saturate(180%)",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
        transition: "all 0.4s", display: "flex", alignItems: "center"
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", width: "100%", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 11, textDecoration: "none" }}>
            <div style={{ width: 40, height: 40, background: "linear-gradient(135deg,#8B0000,#5C0000)", borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, boxShadow: "0 3px 10px rgba(139,0,0,0.4)" }}>⚖️</div>
            <div>
              <div style={{ fontFamily: "'Playfair Display',serif", color: "white", fontSize: 17, lineHeight: 1.1, fontWeight: 600 }}>Admira Abogados</div>
              <div style={{ fontSize: 9.5, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "1.8px" }}>Madrid · Puerta del Sol</div>
            </div>
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
            {(isAr ? ["الرئيسية", "الخدمات", "المقالات", "التواصل"] : ["Inicio", "Servicios", "Insights", "Contacto"]).map((l, i) => (
              <a key={i} href={["#inicio", "#servicios", "#insights", "#contacto"][i]} className="nav-lnk">{l}</a>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ display: "flex", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 999, padding: 3 }}>
              {(["ES", "عر"] as const).map((lbl, i) => {
                const lv = i === 0 ? "es" : "ar";
                return <button key={lbl} onClick={() => setLang(lv)} style={{ padding: "4px 12px", borderRadius: 999, fontSize: 12, fontWeight: 700, border: "none", cursor: "pointer", transition: "all 0.15s", background: lang === lv ? "#8B0000" : "transparent", color: lang === lv ? "white" : "rgba(255,255,255,0.4)" }}>{lbl}</button>;
              })}
            </div>
            <Link href="/login" style={{ background: "linear-gradient(135deg,#8B0000,#B22222)", color: "white", padding: "9px 20px", borderRadius: 9, fontSize: 13, fontWeight: 700, textDecoration: "none", boxShadow: "0 3px 12px rgba(139,0,0,0.4)", letterSpacing: "0.2px" }}>
              {isAr ? "لوحة الإدارة" : "Client Login"}
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section id="inicio" style={{ minHeight: "100vh", paddingTop: 68, background: "#0E0E10", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        {/* Background image with overlay */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: `url('${BASE_PATH}/hero-bg.png')`, backgroundSize: "cover", backgroundPosition: "center", opacity: 0.2 }} />
        {/* Gradient overlays */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,rgba(14,14,16,0.96) 0%,rgba(14,14,16,0.6) 50%,rgba(139,0,0,0.15) 100%)" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 200, background: "linear-gradient(to top,#0E0E10,transparent)" }} />
        {/* Grid pattern */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)", backgroundSize: "60px 60px", opacity: 0.6 }} />
        {/* Glow accents */}
        <div style={{ position: "absolute", top: "20%", right: "10%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(139,0,0,0.12) 0%,transparent 70%)", filter: "blur(40px)" }} />

        <div style={{ maxWidth: 1280, margin: "0 auto", width: "100%", padding: "80px 32px 60px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", zIndex: 1 }}>
          {/* Eyebrow */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "3px", color: "rgba(255,255,255,0.35)", marginBottom: 20 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#B22222", display: "inline-block", animation: "pulse 2s infinite" }} />
            {isAr ? "استشارة قانونية فورية · مدريد" : "Consultoría Jurídica de Élite · Madrid"}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
            {/* LEFT — Hero text */}
            <div>
              <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(40px,4.5vw,62px)", color: "white", lineHeight: 1.08, marginBottom: 22, fontWeight: 700 }}>
                {isAr ? <>احجز <em style={{ color: "#E57373", fontStyle: "italic" }}>استشارتك</em><br />القانونية<br />فوراً</> : <>Justicia con<br /><em style={{ color: "#E57373", fontStyle: "italic" }}>Excelencia</em><br />y Dedicación.</>}
              </h1>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 16.5, lineHeight: 1.8, marginBottom: 36, maxWidth: 460 }}>
                {isAr ? "مكتب أدميرا للمحاماة في قلب مدريد. خبرة قانونية متخصصة لخدمة الجاليات العربية والإسبانية."
                  : "Admira Abogados, en el corazón de Puerta del Sol. Expertos en derecho español para comunidades árabes e hispanas."}
              </p>
              {/* Stats row */}
              <div style={{ display: "flex", alignItems: "center", gap: 32, paddingTop: 28, borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                {STATS.map((s, i) => (
                  <div key={i} style={{ textAlign: "center" }}>
                    <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, color: "white", fontWeight: 700, lineHeight: 1 }}>{s.n}</div>
                    <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.35)", marginTop: 3, textTransform: "uppercase", letterSpacing: "0.6px" }}>{isAr ? s.lAr : s.l}</div>
                  </div>
                )).reduce((prev: React.ReactNode[], curr, i) => [
                  ...prev,
                  i > 0 ? <div key={`d${i}`} style={{ width: 1, height: 32, background: "rgba(255,255,255,0.08)" }} /> : null,
                  curr
                ], [])}
              </div>
            </div>

            {/* RIGHT — Booking Widget Glass Card */}
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 24, overflow: "hidden", backdropFilter: "blur(24px)", boxShadow: "0 32px 80px rgba(0,0,0,0.4)" }}>
              {/* Widget header */}
              <div style={{ padding: "22px 28px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "2px", color: "#E57373", marginBottom: 3 }}>📅 {isAr ? "حجز موعد" : "Reservar Cita"}</div>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, color: "white", fontWeight: 600 }}>{isAr ? "اختر تاريخًا ووقتًا" : "Elige fecha y hora"}</div>
                </div>
                {selectedDate && selectedTime && (
                  <div style={{ padding: "6px 12px", background: "rgba(139,0,0,0.2)", border: "1px solid rgba(139,0,0,0.35)", borderRadius: 8, fontSize: 12, color: "#E57373", fontWeight: 700 }}>
                    ✓ {selectedTime}
                  </div>
                )}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                {/* Calendar */}
                <div style={{ padding: "22px 24px", borderRight: "1px solid rgba(255,255,255,0.07)" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                    <button onClick={() => setCalMonth(new Date(y, m - 1, 1))} style={{ width: 28, height: 28, borderRadius: 6, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.5)" }}>
                      <ChevronLeft size={13} />
                    </button>
                    <span style={{ fontFamily: "'Playfair Display',serif", color: "white", fontSize: 14, fontWeight: 600 }}>{(isAr ? M_AR : M_ES)[m]} {y}</span>
                    <button onClick={() => setCalMonth(new Date(y, m + 1, 1))} style={{ width: 28, height: 28, borderRadius: 6, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.5)" }}>
                      <ChevronRight size={13} />
                    </button>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 1, marginBottom: 4 }}>
                    {(isAr ? D_AR : D_ES).map(d => (
                      <div key={d} style={{ textAlign: "center", fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.25)", textTransform: "uppercase", padding: "4px 0" }}>{d}</div>
                    ))}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 1 }}>
                    {Array(firstDay).fill(null).map((_, i) => <div key={i} />)}
                    {Array(daysInMonth).fill(null).map((_, i) => {
                      const d = i + 1, dateStr = ds(d), dis = isPast(d) || isWeekend(d);
                      const isSel = selectedDate === dateStr;
                      const isToday = (new Date(y, m, d).toDateString() === today.toDateString());
                      return (
                        <div key={d} onClick={() => !dis && (setSelectedDate(dateStr), setSelectedTime(null))}
                          className={`cal-day-cell ${dis ? "dis" : ""} ${isSel ? "sel" : ""} ${isToday && !isSel ? "tod" : ""}`}
                          style={{ color: dis ? "rgba(255,255,255,0.18)" : isSel ? "white" : isToday ? "#E57373" : "rgba(255,255,255,0.75)", fontSize: 11 }}>
                          {d}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Time Slots */}
                <div style={{ padding: "22px 20px" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", color: "rgba(255,255,255,0.35)", marginBottom: 10 }}>
                    🕐 {isAr ? "الأوقات المتاحة" : "Horarios"}
                  </div>
                  {selectedDate ? (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5 }}>
                      {TIME_SLOTS.map(slot => {
                        const st = slotStatus(slot);
                        return (
                          <button key={slot} disabled={st === "booked"}
                            onClick={() => st !== "booked" && setSelectedTime(slot === selectedTime ? null : slot)}
                            className={`slot-btn ${st === "selected" ? "st" : st === "booked" ? "bk" : "av"}`}>
                            {st === "booked" && <Lock size={8} />}{slot}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 160, color: "rgba(255,255,255,0.2)", textAlign: "center", gap: 8 }}>
                      <Calendar size={28} style={{ opacity: 0.3 }} />
                      <span style={{ fontSize: 12 }}>{isAr ? "اختر يوماً أولاً" : "Elige una fecha"}</span>
                    </div>
                  )}
                  {selectedDate && (
                    <div style={{ display: "flex", gap: 8, marginTop: 10, fontSize: 10, color: "rgba(255,255,255,0.3)", flexWrap: "wrap" }}>
                      <span><span style={{ width: 7, height: 7, borderRadius: "50%", display: "inline-block", background: "#86EFAC", marginRight: 4 }} />{isAr ? "متاح" : "Libre"}</span>
                      <span><span style={{ width: 7, height: 7, borderRadius: "50%", display: "inline-block", background: "rgba(255,255,255,0.15)", marginRight: 4 }} />{isAr ? "محجوز" : "Ocupado"}</span>
                      <span><span style={{ width: 7, height: 7, borderRadius: "50%", display: "inline-block", background: "#8B0000", marginRight: 4 }} />{isAr ? "مختار" : "Elegido"}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Form fields — compact */}
              <div style={{ padding: "20px 28px 24px" }}>
                {selectedTime && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 13px", background: "rgba(139,0,0,0.12)", border: "1px solid rgba(139,0,0,0.25)", borderRadius: 8, marginBottom: 16, fontSize: 13, color: "#E57373", fontWeight: 600 }}>
                    <Calendar size={13} /> {selDateDisplay} · {selectedTime}
                  </div>
                )}
                {!selectedTime && (
                  <div style={{ textAlign: "center", padding: "8px 0 12px", color: "rgba(255,255,255,0.3)", fontSize: 13 }}>
                    {isAr ? "اختر تاريخًا ووقتًا لملء البيانات 👆" : "Selecciona fecha y hora para continuar 👆"}
                  </div>
                )}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10, opacity: selectedTime ? 1 : 0.3, pointerEvents: selectedTime ? "all" : "none", transition: "opacity 0.3s" }}>
                  <input className="inp-dark" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder={isAr ? "الاسم الكامل *" : "Nombre completo *"} />
                  <input className="inp-dark" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Email *" type="email" />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16, opacity: selectedTime ? 1 : 0.3, pointerEvents: selectedTime ? "all" : "none", transition: "opacity 0.3s" }}>
                  <input className="inp-dark" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder={isAr ? "رقم الهاتف" : "Teléfono"} />
                  <select className="inp-dark" value={form.service} onChange={e => setForm({ ...form, service: e.target.value })} style={{ cursor: "pointer" }}>
                    <option value="" style={{ background: "#1C1C1E" }}>{isAr ? "نوع الخدمة *" : "Servicio legal *"}</option>
                    {SERVICE_TYPES.map(s => <option key={s} value={s} style={{ background: "#1C1C1E" }}>{s}</option>)}
                  </select>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                  <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", gap: 5 }}>
                    🔒 {isAr ? "بياناتك محمية" : "Datos confidenciales"}
                  </div>
                  <button onClick={handleConfirm} disabled={!canConfirm || loading} className="confirm-btn">
                    {loading
                      ? <><span style={{ width: 17, height: 17, border: "2.5px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" }} />{isAr ? "جارٍ الإرسال…" : "Enviando…"}</>
                      : <><CheckCircle size={18} />{isAr ? "✓ تأكيد الحجز" : "✓ CONFIRMAR CITA"}</>}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES ─────────────────────────────────────────────────────────── */}
      <section id="servicios" style={{ background: "#F8F8F8", padding: "96px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "2.5px", color: "#8B0000", marginBottom: 12 }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#8B0000" }} />
              {isAr ? "خدماتنا القانونية" : "Nuestras Especialidades"}
            </div>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(28px,3.5vw,42px)", color: "#1C1C1E", marginBottom: 14 }}>
              {isAr ? "خدمات قانونية متكاملة" : "Cobertura Legal Completa"}
            </h2>
            <div style={{ width: 48, height: 3, background: "linear-gradient(90deg,#8B0000,#B22222)", borderRadius: 2, margin: "0 auto 16px" }} />
            <p style={{ color: "#8E8E93", fontSize: 15.5, maxWidth: 500, margin: "0 auto", lineHeight: 1.75 }}>
              {isAr ? "نغطي جميع مجالات القانون للأفراد والشركات في إسبانيا بأعلى معايير المهنية."
                : "Representación legal integral para individuos y empresas a través de toda España."}
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
            {SERVICES.map((svc, i) => {
              const Icon = svc.icon;
              return (
                <div key={i} className="svc-card">
                  <div className="svc-icon"><Icon size={23} /></div>
                  <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, color: "#1C1C1E", marginBottom: 8 }}>{isAr ? svc.nameAr : svc.name}</h3>
                  <p style={{ fontSize: 13.5, color: "#8E8E93", lineHeight: 1.65, marginBottom: 14 }}>{isAr ? svc.descAr : svc.desc}</p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#8B0000", background: "#FFF5F5", padding: "3px 10px", borderRadius: 999 }}>{svc.price}</span>
                    <a href="#inicio" style={{ fontSize: 12.5, fontWeight: 700, color: "#8B0000", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
                      {isAr ? "احجز" : "Cita"} <ArrowRight size={12} />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── LAWYER BANNER ───────────────────────────────────────────────────── */}
      <section style={{ background: "linear-gradient(135deg,#0E0E10 0%,#1C1C1E 60%,rgba(139,0,0,0.15) 100%)", padding: "80px 32px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "40%", backgroundImage: `url('${BASE_PATH}/aziza.png')`, backgroundSize: "cover", backgroundPosition: "center top", opacity: 0.35 }} />
        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "50%", background: "linear-gradient(to right,#1C1C1E,transparent)" }} />
        <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: 580 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "2.5px", color: "rgba(255,255,255,0.35)", marginBottom: 16 }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#B22222" }} />
              {isAr ? "عن مكتبنا" : "Sobre Nosotros"}
            </div>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(28px,3vw,44px)", color: "white", marginBottom: 20, lineHeight: 1.15 }}>
              {isAr ? <>أزيزة مغني<br /><em style={{ color: "#E57373", fontStyle: "italic" }}>محامية متخصصة</em></> : <>Aziza Maghni<br /><em style={{ color: "#E57373", fontStyle: "italic" }}>Abogada Especialista</em></>}
            </h2>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 15.5, lineHeight: 1.8, marginBottom: 32 }}>
              {isAr ? "أكثر من 10 سنوات من الخبرة في القانون الإسباني. متخصصة في خدمة الجالية العربية والمغربية في مدريد. أول استشارة مجانية."
                : "Más de 10 años de experiencia en el derecho español. Especializada en la comunidad árabe y marroquí residente en Madrid. Primera consulta gratuita."}
            </p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 32 }}>
              {["🇪🇸 Español", "🇲🇦 العربية", "🇫🇷 Français", "🇬🇧 English"].map(l => (
                <div key={l} style={{ padding: "7px 14px", borderRadius: 999, background: "rgba(139,0,0,0.1)", border: "1px solid rgba(139,0,0,0.2)", fontSize: 12, fontWeight: 700, color: "#E57373" }}>{l}</div>
              ))}
            </div>
            <a href="#inicio" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#8B0000", color: "white", padding: "13px 28px", borderRadius: 11, fontWeight: 700, fontSize: 14, textDecoration: "none", boxShadow: "0 6px 20px rgba(139,0,0,0.4)" }}>
              <Calendar size={16} />{isAr ? "احجز استشارة مجانية" : "Consulta Gratuita"}
            </a>
          </div>
        </div>
      </section>

      {/* ── INSIGHTS / ARTICLES ─────────────────────────────────────────────── */}
      <section id="insights" style={{ background: "white", padding: "96px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "2.5px", color: "#8B0000", marginBottom: 12 }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#8B0000" }} />
              {isAr ? "القانون والأخبار" : "Artículos & Insights"}
            </div>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(26px,3vw,40px)", color: "#1C1C1E", marginBottom: 12 }}>
              {isAr ? "مقالات قانونية متخصصة" : "Legal Insights & Recursos"}
            </h2>
            <div style={{ width: 48, height: 3, background: "linear-gradient(90deg,#8B0000,#B22222)", borderRadius: 2, margin: "0 auto" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
            {articles.map(art => (
              <div key={art.id} className="art-card">
                <div style={{ height: 210, position: "relative", overflow: "hidden", background: "#1C1C1E" }}>
                  {art.imageUrl
                    ? <img src={`${BASE_PATH}${art.imageUrl}`} alt={art.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.4s" }}
                      onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
                      onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")} />
                    : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 54 }}>{ARTICLE_ICONS[art.category] ?? "⚖️"}</div>
                  }
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(0,0,0,0.1) 0%,rgba(0,0,0,0.55) 100%)" }} />
                  <div style={{ position: "absolute", bottom: 14, left: 16, fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "1.5px", color: "white", background: "rgba(139,0,0,0.85)", backdropFilter: "blur(4px)", padding: "4px 10px", borderRadius: 6 }}>
                    {art.category}
                  </div>
                </div>
                <div style={{ padding: "20px 22px 16px", flex: 1 }}>
                  <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, color: "#1C1C1E", marginBottom: 10, lineHeight: 1.35 }}>{isAr ? art.titleAr : art.title}</h3>
                  <p style={{ fontSize: 13.5, color: "#8E8E93", lineHeight: 1.65, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" }}>{isAr ? art.summaryAr : art.summary}</p>
                </div>
                <div style={{ padding: "12px 22px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #F8F8F8" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#AEAEB2" }}>
                    <span style={{ width: 20, height: 20, borderRadius: "50%", background: "linear-gradient(135deg,#8B0000,#B22222)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9 }}>⚖</span>
                    {art.author} · {new Date(art.createdAt).toLocaleDateString("es-ES", { day: "2-digit", month: "short" })}
                  </div>
                  <a href="#" style={{ fontSize: 13, fontWeight: 700, color: "#8B0000", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
                    {isAr ? "اقرأ أكثر" : "Leer más"} <ArrowRight size={12} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ──────────────────────────────────────────────────────────── */}
      <section id="contacto" style={{ background: "#0E0E10", padding: "96px 32px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle,rgba(139,0,0,0.06) 0%,transparent 70%)", filter: "blur(60px)" }} />
        <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 1 }}>

          {/* Section header */}
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "2.5px", color: "rgba(255,255,255,0.3)", marginBottom: 12 }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#B22222" }} />{isAr ? "تواصل معنا" : "Contacto"}
            </div>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(26px,3vw,40px)", color: "white", marginBottom: 12, lineHeight: 1.15 }}>
              {isAr ? "نحن هنا من أجلك" : "Estamos aquí para usted"}
            </h2>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 15, lineHeight: 1.75, maxWidth: 480, margin: "0 auto" }}>
              {isAr ? "أول استشارة مجانية تماماً. فريقنا جاهز للإجابة على جميع استفساراتك القانونية."
                : "Primera consulta completamente gratuita. Nuestro equipo está listo para sus consultas legales."}
            </p>
          </div>

          {/* 3-column grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.1fr 1fr", gap: 28, alignItems: "start" }}>

            {/* COL 1 — Contact info */}
            <div>
              {[
                { icon: <Phone size={15} />, label: isAr ? "الهاتف" : "Teléfono", t: "+34 917 957 957" },
                { icon: <Phone size={15} />, label: isAr ? "الجوال" : "Móvil", t: "+34 687 610 986" },
                { icon: <Mail size={15} />, label: "Email", t: "Aziza.m@admiraabogados.com" },
                { icon: <MapPin size={15} />, label: isAr ? "العنوان" : "Dirección", t: "Plaza Puerta del Sol 4, 2D · Madrid 28013" },
                { icon: <Clock size={15} />, label: isAr ? "أوقات العمل" : "Horario", t: "Lun–Vie  9:00–14:00 · 16:00–19:00" },
              ].map((it, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 13, padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(139,0,0,0.12)", display: "flex", alignItems: "center", justifyContent: "center", color: "#E57373", flexShrink: 0 }}>
                    {it.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "rgba(255,255,255,0.25)", marginBottom: 3 }}>{it.label}</div>
                    <div style={{ fontSize: 13.5, color: "rgba(255,255,255,0.65)", lineHeight: 1.5 }}>{it.t}</div>
                  </div>
                </div>
              ))}
              {/* Lang pills */}
              <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginTop: 20 }}>
                {["🇪🇸 Español", "🇲🇦 العربية", "🇫🇷 Français", "🇬🇧 English"].map(l => (
                  <div key={l} style={{ padding: "6px 12px", borderRadius: 999, background: "rgba(139,0,0,0.1)", border: "1px solid rgba(139,0,0,0.2)", fontSize: 11.5, fontWeight: 700, color: "#E57373" }}>{l}</div>
                ))}
              </div>
            </div>

            {/* COL 2 — Google Maps embed */}
            <div style={{ borderRadius: 18, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)", position: "relative", boxShadow: "0 24px 60px rgba(0,0,0,0.5)" }}>
              {/* map header badge */}
              <div style={{
                position: "absolute", top: 14, left: "50%", transform: "translateX(-50%)", zIndex: 10,
                background: "rgba(14,14,16,0.92)", backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.1)", borderRadius: 999,
                padding: "7px 16px", display: "flex", alignItems: "center", gap: 7,
                fontSize: 12, fontWeight: 700, color: "white", whiteSpace: "nowrap"
              }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#E57373", animation: "pulse 2s infinite" }} />
                Admira Abogados · Puerta del Sol
              </div>
              <iframe
                title="Admira Abogados ubicación"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3037.392928258267!2d-3.7037663!3d40.4168166!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd4228907e2a7b5f%3A0xf60b18a0b9ab28ae!2sPuerta%20del%20Sol%2C%20Madrid%2C%20Spain!5e0!3m2!1sen!2ses!4v1711450000000!5m2!1sen!2ses"
                width="100%"
                height="360"
                style={{ border: 0, display: "block", filter: "invert(90%) hue-rotate(180deg) saturate(0.85) brightness(0.92)" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              {/* bottom bar */}
              <div style={{ background: "rgba(14,14,16,0.95)", backdropFilter: "blur(8px)", padding: "12px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "rgba(255,255,255,0.55)" }}>
                  <MapPin size={14} color="#E57373" />
                  Plaza Puerta del Sol 4, 2D · 28013 Madrid
                </div>
                <a href="https://maps.google.com/?q=Puerta+del+Sol+4+Madrid" target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: 12, fontWeight: 700, color: "#E57373", textDecoration: "none", display: "flex", alignItems: "center", gap: 4, padding: "5px 10px", background: "rgba(139,0,0,0.1)", borderRadius: 7, border: "1px solid rgba(139,0,0,0.25)" }}>
                  <Globe size={12} /> {isAr ? "افتح الخريطة" : "Ver mapa"}
                </a>
              </div>
            </div>

            {/* COL 3 — Message form */}
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 28, backdropFilter: "blur(12px)" }}>
              <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 19, color: "#E57373", marginBottom: 20 }}>{isAr ? "أرسل لنا رسالة" : "Envíanos un Mensaje"}</h3>
              {[
                { l: isAr ? "الاسم" : "Nombre", t: "text", p: isAr ? "اسمك الكامل" : "Nombre completo" },
                { l: isAr ? "البريد" : "Email", t: "email", p: "email@ejemplo.com" },
              ].map((f, i) => (
                <div key={i} style={{ marginBottom: 13 }}>
                  <label style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.6px", color: "rgba(255,255,255,0.3)", display: "block", marginBottom: 5 }}>{f.l}</label>
                  <input type={f.t} placeholder={f.p} className="inp-dark" />
                </div>
              ))}
              <div style={{ marginBottom: 18 }}>
                <label style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.6px", color: "rgba(255,255,255,0.3)", display: "block", marginBottom: 5 }}>{isAr ? "الرسالة" : "Mensaje"}</label>
                <textarea rows={4} placeholder={isAr ? "كيف يمكننا مساعدتك؟" : "¿Cómo podemos ayudarle?"} className="inp-dark" style={{ resize: "vertical", minHeight: 96 }} />
              </div>
              <button style={{ width: "100%", padding: "13px", background: "linear-gradient(135deg,#8B0000,#B22222)", color: "white", border: "none", borderRadius: 11, fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "0 6px 20px rgba(139,0,0,0.35)", transition: "all 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-1px)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}>
                <Mail size={15} />{isAr ? "إرسال الرسالة" : "Enviar Mensaje"}
              </button>
              <div style={{ marginTop: 14, fontSize: 11.5, color: "rgba(255,255,255,0.2)", textAlign: "center" }}>
                🔒 {isAr ? "بياناتك محمية تماماً" : "Tus datos están protegidos"}
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ── FOOTER ───────────────────────────────────────────────────────────── */}
      <footer style={{ background: "#070709", borderTop: "1px solid rgba(255,255,255,0.04)", padding: "28px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, background: "linear-gradient(135deg,#8B0000,#5C0000)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>⚖️</div>
            <span style={{ fontFamily: "'Playfair Display',serif", color: "rgba(255,255,255,0.5)", fontSize: 14, fontWeight: 600 }}>Admira Abogados</span>
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.2)", textAlign: "center" }}>
            © {new Date().getFullYear()} Aziza Maghni · Admira Abogados · Plaza Puerta del Sol 4, 2D · Madrid
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "rgba(255,200,50,0.85)" }}>
            <Star size={12} fill="currentColor" /> <strong>4.9</strong> <span style={{ color: "rgba(255,255,255,0.25)" }}>Google Reviews</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
