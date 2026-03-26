"use client";
import { useState } from "react";
import {
  ChevronLeft, ChevronRight, CheckCircle, Clock, User, Mail, Phone,
  FileText, Scale, Lock, Calendar, ChevronDown,
} from "lucide-react";
import { createAppointment, SERVICE_TYPES, TIME_SLOTS } from "@/lib/data";

interface Props { lang: "es" | "ar"; }

const DAYS_ES = ["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"];
const DAYS_AR = ["اثن","ثلا","أرب","خمي","جمع","سبت","أحد"];
const MONTHS_ES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const MONTHS_AR = ["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"];

// Simulate some booked slots
const BOOKED_SLOTS: Record<string, string[]> = {
  "2026-03-28": ["09:00","11:00","16:00"],
  "2026-03-29": ["10:00","12:00"],
  "2026-04-01": ["09:30","11:30","17:00"],
};

export default function BookingSection({ lang }: Props) {
  const isAr = lang === "ar";
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 2, 1));
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: "", notes: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const today = new Date(); today.setHours(0,0,0,0);

  const days = isAr ? DAYS_AR : DAYS_ES;
  const months = isAr ? MONTHS_AR : MONTHS_ES;

  function getCalData() {
    const y = currentMonth.getFullYear(), m = currentMonth.getMonth();
    const firstDay = (new Date(y, m, 1).getDay() + 6) % 7; // Mon=0
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    return { y, m, firstDay, daysInMonth };
  }

  function isWeekend(y: number, m: number, d: number) {
    const dow = new Date(y, m, d).getDay(); return dow === 0 || dow === 6;
  }
  function isPast(y: number, m: number, d: number) {
    return new Date(y, m, d) < today;
  }
  function getDateStr(y: number, m: number, d: number) {
    return `${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
  }
  function handleDayClick(y: number, m: number, d: number) {
    if (isPast(y,m,d) || isWeekend(y,m,d)) return;
    setSelectedDate(getDateStr(y,m,d));
    setSelectedTime(null);
  }

  function getSlotStatus(slot: string): "available" | "booked" | "selected" {
    if (slot === selectedTime) return "selected";
    if (selectedDate && BOOKED_SLOTS[selectedDate]?.includes(slot)) return "booked";
    return "available";
  }

  async function handleSubmit() {
    if (!form.name || !form.email || !form.service || !selectedDate || !selectedTime) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    createAppointment({ clientName: form.name, clientEmail: form.email, clientPhone: form.phone, serviceType: form.service, date: selectedDate, time: selectedTime, status: "pending", notes: form.notes });
    setLoading(false);
    setSubmitted(true);
  }

  const { y, m, firstDay, daysInMonth } = getCalData();
  const formReady = !!selectedDate && !!selectedTime;
  const canSubmit = formReady && form.name && form.email && form.service;

  const selectedDateDisplay = selectedDate
    ? new Date(selectedDate + "T12:00:00").toLocaleDateString(isAr ? "ar-MA" : "es-ES", { weekday: "long", day: "2-digit", month: "long" })
    : null;

  if (submitted) {
    return (
      <div className="booking-section">
        <div className="booking-hero-strip">
          <div style={{ position: "relative", zIndex: 1 }}>
            <div className="section-tag" style={{ justifyContent: "center", color: "rgba(255,255,255,0.5)", marginBottom: "12px" }}>
              <div className="section-tag-dot" style={{ background: "rgba(255,255,255,0.4)" }} />
              {isAr ? "استشارة مجانية" : "Consulta Gratuita"}
            </div>
            <h2 style={{ fontFamily: "'Playfair Display',serif", color: "white", fontSize: "clamp(26px,3vw,36px)" }}>
              {isAr ? "احجز استشارتك" : "Reserva Tu Consulta"}
            </h2>
          </div>
        </div>
        <div style={{ maxWidth: "560px", margin: "0 auto", padding: "60px 32px" }}>
          <div className="booking-success">
            <div className="success-check">
              <CheckCircle size={36} />
            </div>
            <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: "26px", color: "var(--charcoal)", marginBottom: "10px" }}>
              {isAr ? "✅ تم تأكيد موعدك!" : "¡Cita Confirmada! ✅"}
            </h3>
            <p style={{ color: "var(--gray-500)", fontSize: "14px", marginBottom: "24px" }}>
              {isAr ? "سيتم التواصل معك خلال 24 ساعة لتأكيد التفاصيل." : "Nos pondremos en contacto contigo en 24h para confirmar los detalles."}
            </p>
            <div style={{ background: "var(--gray-100)", borderRadius: "var(--r-md)", padding: "20px", textAlign: "left", marginBottom: "24px", fontSize: "13.5px", color: "var(--charcoal)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--gray-200)" }}>
                <span style={{ color: "var(--gray-500)" }}>{isAr ? "الاسم" : "Cliente"}</span>
                <strong>{form.name}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--gray-200)" }}>
                <span style={{ color: "var(--gray-500)" }}>{isAr ? "الخدمة" : "Servicio"}</span>
                <strong>{form.service}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--gray-200)" }}>
                <span style={{ color: "var(--gray-500)" }}>{isAr ? "التاريخ" : "Fecha"}</span>
                <strong>{selectedDateDisplay}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0" }}>
                <span style={{ color: "var(--gray-500)" }}>{isAr ? "الوقت" : "Hora"}</span>
                <strong>{selectedTime}</strong>
              </div>
            </div>
            <button className="btn btn-primary btn-lg" onClick={() => { setSubmitted(false); setSelectedDate(null); setSelectedTime(null); setForm({ name:"",email:"",phone:"",service:"",notes:"" }); }}>
              <Calendar size={17} />
              {isAr ? "حجز موعد آخر" : "Reservar otra cita"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-section" id="reservar">
      {/* Hero Strip */}
      <div className="booking-hero-strip">
        <div style={{ position: "relative", zIndex: 1 }}>
          <div className="section-tag" style={{ justifyContent: "center", color: "rgba(255,255,255,0.45)", marginBottom: "12px" }}>
            <div className="section-tag-dot" style={{ background: "rgba(155,28,46,0.6)" }} />
            {isAr ? "استشارة مجانية" : "Consulta Gratuita"}
          </div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", color: "white", fontSize: "clamp(26px,3vw,36px)", marginBottom: "10px" }}>
            {isAr ? "احجز استشارتك القانونية" : "Reserva Tu Consulta Legal"}
          </h2>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px" }}>
            {isAr ? "اختر التاريخ والوقت المناسبين لك" : "Elige la fecha y hora que mejor te convenga"}
          </p>
        </div>
      </div>

      {/* Main split */}
      <div className="booking-layout">
        {/* LEFT – Calendar + Slots */}
        <div className="booking-left">
          <div style={{ marginBottom: "24px" }}>
            <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: "18px", color: "var(--charcoal)", marginBottom: "4px" }}>
              {isAr ? "اختر التاريخ" : "Selecciona Fecha"}
            </h3>
            <p style={{ fontSize: "12.5px", color: "var(--gray-400)" }}>
              {isAr ? "متاح من الاثنين إلى الجمعة" : "Disponible de lunes a viernes"}
            </p>
          </div>

          {/* Calendar */}
          <div className="cal-header">
            <button className="cal-nav-btn" onClick={() => setCurrentMonth(new Date(y, m - 1, 1))}>
              <ChevronLeft size={15} />
            </button>
            <span className="cal-month">{months[m]} {y}</span>
            <button className="cal-nav-btn" onClick={() => setCurrentMonth(new Date(y, m + 1, 1))}>
              <ChevronRight size={15} />
            </button>
          </div>

          <div className="cal-days-grid">
            {days.map(d => <div key={d} className="cal-day-label">{d}</div>)}
            {Array(firstDay).fill(null).map((_, i) => <div key={`e-${i}`} />)}
            {Array(daysInMonth).fill(null).map((_, i) => {
              const day = i + 1;
              const dateStr = getDateStr(y, m, day);
              const past = isPast(y, m, day);
              const weekend = isWeekend(y, m, day);
              const isToday = dateStr === getDateStr(today.getFullYear(), today.getMonth(), today.getDate());
              const isSel = selectedDate === dateStr;
              const disabled = past || weekend;
              return (
                <div
                  key={day}
                  className={`cal-day ${isToday ? "today" : ""} ${isSel ? "selected" : ""} ${disabled ? (weekend ? "weekend" : "past") : ""}`}
                  onClick={() => handleDayClick(y, m, day)}
                >
                  {day}
                </div>
              );
            })}
          </div>

          {/* Time Slots */}
          {selectedDate && (
            <div className="time-slots-section" style={{ animation: "slideUp 0.2s var(--ease)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                <Clock size={14} style={{ color: "var(--gray-400)" }} />
                <span className="time-slots-label">
                  {isAr ? "الأوقات المتاحة" : "Horarios disponibles"}
                </span>
              </div>
              <div className="time-grid">
                {TIME_SLOTS.map(slot => {
                  const status = getSlotStatus(slot);
                  return (
                    <button
                      key={slot}
                      className={`time-slot ${status}`}
                      onClick={() => status !== "booked" && setSelectedTime(slot === selectedTime ? null : slot)}
                      disabled={status === "booked"}
                      title={status === "booked" ? (isAr ? "محجوز" : "Reservado") : undefined}
                    >
                      {status === "booked" && <Lock size={10} />}
                      {slot}
                    </button>
                  );
                })}
              </div>
              <div className="slot-legend">
                <span><span className="slot-dot" style={{ background: "var(--available)" }} />{isAr ? "متاح" : "Libre"}</span>
                <span><span className="slot-dot" style={{ background: "var(--booked-border)" }} />{isAr ? "محجوز" : "Reservado"}</span>
                <span><span className="slot-dot" style={{ background: "var(--crimson)" }} />{isAr ? "مختار" : "Seleccionado"}</span>
              </div>
            </div>
          )}

          {!selectedDate && (
            <div style={{ marginTop: "20px", padding: "20px", background: "var(--gray-100)", borderRadius: "var(--r-md)", textAlign: "center", color: "var(--gray-400)", fontSize: "13px" }}>
              <Calendar size={22} style={{ margin: "0 auto 8px", display: "block", opacity: 0.5 }} />
              {isAr ? "اختر يوماً لرؤية الأوقات المتاحة" : "Selecciona un día para ver los horarios"}
            </div>
          )}
        </div>

        {/* RIGHT – Form */}
        <div className={`booking-right ${formReady ? "unlocked" : "locked"}`} style={{ position: "relative" }}>
          {!formReady && (
            <div className="booking-prompt" style={{ position: "absolute", inset: 0, zIndex: 2, background: "rgba(255,255,255,0.92)", backdropFilter: "blur(4px)", borderRadius: "0 var(--r-xl) var(--r-xl) 0" }}>
              <div className="booking-prompt-icon">
                <Calendar size={26} style={{ color: "var(--gray-300)" }} />
              </div>
              <h4 style={{ fontFamily: "'Playfair Display',serif", fontSize: "17px", color: "var(--charcoal)", marginBottom: "6px" }}>
                {isAr ? "اختر موعدك أولاً" : "Selecciona fecha y hora"}
              </h4>
              <p style={{ fontSize: "13px", color: "var(--gray-400)", maxWidth: "220px" }}>
                {isAr ? "بمجرد اختيار الوقت، ستظهر لك استمارة الحجز" : "El formulario aparece al elegir un horario"}
              </p>
            </div>
          )}

          <div>
            <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: "18px", color: "var(--charcoal)", marginBottom: "4px" }}>
              {isAr ? "بيانات الموكل" : "Datos del Cliente"}
            </h3>
            <p style={{ fontSize: "12.5px", color: "var(--gray-400)", marginBottom: "18px" }}>
              {isAr ? "أكمل بياناتك لتأكيد الموعد" : "Completa tu información para confirmar"}
            </p>

            {formReady && (
              <div className="booking-summary-pill" style={{ animation: "slideUp 0.2s var(--ease)" }}>
                <Calendar size={15} />
                <span>{selectedDateDisplay} — {selectedTime}</span>
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {/* Name */}
              <div className="form-group">
                <label className="form-label">
                  <User size={11} style={{ display: "inline", marginRight: "4px", verticalAlign: "middle" }} />
                  {isAr ? "الاسم الكامل *" : "Nombre Completo *"}
                </label>
                <input className="form-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                  placeholder={isAr ? "الاسم الكامل" : "ej. Mohamed El Amrani"} />
              </div>

              {/* Phone */}
              <div className="form-group">
                <label className="form-label">
                  <Phone size={11} style={{ display: "inline", marginRight: "4px", verticalAlign: "middle" }} />
                  {isAr ? "رقم الهاتف *" : "Teléfono *"}
                </label>
                <div className="input-group">
                  <div className="country-code">🇪🇸 +34</div>
                  <input className="form-input" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                    placeholder="600 000 000" style={{ borderRadius: "0 var(--r-sm) var(--r-sm) 0" }} />
                </div>
              </div>

              {/* Email */}
              <div className="form-group">
                <label className="form-label">
                  <Mail size={11} style={{ display: "inline", marginRight: "4px", verticalAlign: "middle" }} />
                  {isAr ? "البريد الإلكتروني *" : "Correo Electrónico *"}
                </label>
                <input className="form-input" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                  placeholder="correo@ejemplo.com" />
              </div>

              {/* Service */}
              <div className="form-group">
                <label className="form-label">
                  <Scale size={11} style={{ display: "inline", marginRight: "4px", verticalAlign: "middle" }} />
                  {isAr ? "نوع الخدمة القانونية *" : "Área Legal *"}
                </label>
                <select className="form-select" value={form.service} onChange={e => setForm({...form, service: e.target.value})}>
                  <option value="">{isAr ? "اختر المجال..." : "Seleccionar..."}</option>
                  {SERVICE_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* Notes */}
              <div className="form-group">
                <label className="form-label">
                  <FileText size={11} style={{ display: "inline", marginRight: "4px", verticalAlign: "middle" }} />
                  {isAr ? "تفاصيل القضية (اختياري)" : "Descripción del Caso (Opcional)"}
                </label>
                <textarea className="form-textarea" rows={3} value={form.notes} onChange={e => setForm({...form, notes: e.target.value})}
                  placeholder={isAr ? "اشرح لنا موقفك باختصار..." : "Describe brevemente tu situación..."} />
              </div>

              {/* Submit */}
              <button
                className="btn btn-primary btn-lg"
                onClick={handleSubmit}
                disabled={!canSubmit || loading}
                style={{ width: "100%", justifyContent: "center", marginTop: "4px", opacity: canSubmit && !loading ? 1 : 0.5, cursor: canSubmit && !loading ? "pointer" : "not-allowed" }}
              >
                {loading ? (
                  <>
                    <span style={{ width: "17px", height: "17px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" }} />
                    {isAr ? "جاري الإرسال..." : "Enviando..."}
                  </>
                ) : (
                  <>
                    <CheckCircle size={18} />
                    {isAr ? "تأكيد الموعد" : "Confirmar Consulta"}
                  </>
                )}
              </button>

              <p style={{ fontSize: "11.5px", color: "var(--gray-400)", textAlign: "center" }}>
                🔒 {isAr ? "بياناتك محمية وسرية تمامًا" : "Tus datos están protegidos y son confidenciales"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
