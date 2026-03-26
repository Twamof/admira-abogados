"use client";
import { useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Save,
  CheckCircle,
  XCircle,
  ToggleLeft,
  ToggleRight,
  Settings,
} from "lucide-react";
import {
  getServices,
  updateService,
  deleteService,
  createService,
  type Service,
} from "@/lib/data";

const ICON_OPTIONS = [
  { value: "Briefcase", label: "💼 Mercantil" },
  { value: "CreditCard", label: "💳 Bancario" },
  { value: "Users", label: "👥 Laboral" },
  { value: "Heart", label: "❤️ Familia" },
  { value: "FileText", label: "📄 Civil" },
  { value: "Shield", label: "🛡️ Penal" },
  { value: "Scale", label: "⚖️ Administrativo" },
  { value: "Globe", label: "🌍 Extranjería" },
];

const ICON_EMOJI: Record<string, string> = {
  Briefcase: "💼",
  CreditCard: "💳",
  Users: "👥",
  Heart: "❤️",
  FileText: "📄",
  Shield: "🛡️",
  Scale: "⚖️",
  Globe: "🌍",
};

const EMPTY_FORM = {
  name: "",
  nameAr: "",
  description: "",
  descriptionAr: "",
  icon: "Scale",
  price: "",
  active: true,
};

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>(getServices());
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: string } | null>(null);

  function showToast(msg: string, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  function refresh() {
    setServices(getServices());
  }

  function openCreate() {
    setEditingId(null);
    setForm({ ...EMPTY_FORM });
    setShowModal(true);
  }

  function openEdit(svc: Service) {
    setEditingId(svc.id);
    setForm({
      name: svc.name,
      nameAr: svc.nameAr,
      description: svc.description,
      descriptionAr: svc.descriptionAr,
      icon: svc.icon,
      price: svc.price ?? "",
      active: svc.active,
    });
    setShowModal(true);
  }

  function handleSave() {
    if (!form.name || !form.description) {
      showToast("Completa nombre y descripción.", "error");
      return;
    }
    if (editingId) {
      updateService(editingId, form);
      showToast("Servicio actualizado. ✓");
    } else {
      createService(form);
      showToast("Servicio creado. ✓");
    }
    setShowModal(false);
    refresh();
  }

  function handleDelete(id: string) {
    deleteService(id);
    setDeleteConfirm(null);
    refresh();
    showToast("Servicio eliminado.", "error");
  }

  function toggleActive(id: string, active: boolean) {
    updateService(id, { active: !active });
    refresh();
    showToast(!active ? "Servicio activado. ✓" : "Servicio desactivado.");
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <h2
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: "24px",
              color: "var(--navy)",
            }}
          >
            Gestión de Servicios
          </h2>
          <p style={{ fontSize: "13px", color: "var(--gray-400)", marginTop: "4px" }}>
            {services.filter((s) => s.active).length} activos · {services.length} total
          </p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <Plus size={18} />
          Nuevo Servicio
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid-3">
        {services.map((svc) => (
          <div
            key={svc.id}
            style={{
              background: "white",
              borderRadius: "var(--radius-md)",
              border: `1px solid ${svc.active ? "var(--gray-200)" : "var(--gray-100)"}`,
              boxShadow: "var(--shadow-sm)",
              overflow: "hidden",
              opacity: svc.active ? 1 : 0.6,
              transition: "all 0.2s ease",
            }}
          >
            {/* Card Header */}
            <div
              style={{
                background: svc.active
                  ? "linear-gradient(135deg, var(--navy), var(--navy-mid))"
                  : "var(--gray-100)",
                padding: "20px",
                display: "flex",
                alignItems: "center",
                gap: "14px",
              }}
            >
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "12px",
                  background: svc.active
                    ? "rgba(201,168,76,0.15)"
                    : "rgba(0,0,0,0.05)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "24px",
                  flexShrink: 0,
                }}
              >
                {ICON_EMOJI[svc.icon] ?? "⚖️"}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: "'Playfair Display',serif",
                    fontSize: "16px",
                    color: svc.active ? "white" : "var(--gray-600)",
                    fontWeight: "600",
                    lineHeight: "1.2",
                  }}
                >
                  {svc.name}
                </div>
                <div style={{ fontSize: "12px", color: svc.active ? "var(--gold)" : "var(--gray-400)", fontFamily: "'Amiri',serif", marginTop: "3px" }}>
                  {svc.nameAr}
                </div>
              </div>
              <span
                className={`badge ${svc.active ? "badge-success" : "badge-warning"}`}
                style={{ flexShrink: 0 }}
              >
                {svc.active ? "Activo" : "Inactivo"}
              </span>
            </div>

            <div style={{ padding: "18px" }}>
              <p style={{ fontSize: "13px", color: "var(--gray-600)", lineHeight: "1.5", marginBottom: "10px" }}>
                {svc.description}
              </p>
              <p style={{ fontSize: "13px", color: "var(--gray-400)", fontFamily: "'Amiri',serif", direction: "rtl", textAlign: "right" }}>
                {svc.descriptionAr}
              </p>
              {svc.price && (
                <div
                  style={{
                    display: "inline-block",
                    marginTop: "12px",
                    padding: "4px 12px",
                    background: "rgba(201,168,76,0.1)",
                    border: "1px solid rgba(201,168,76,0.2)",
                    borderRadius: "100px",
                    fontSize: "12px",
                    color: "var(--gold-dark)",
                    fontWeight: "700",
                  }}
                >
                  {svc.price}
                </div>
              )}
            </div>

            <div
              style={{
                padding: "12px 18px",
                borderTop: "1px solid var(--gray-100)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <button
                onClick={() => toggleActive(svc.id, svc.active)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "13px",
                  color: svc.active ? "var(--success)" : "var(--gray-400)",
                  fontWeight: "600",
                  padding: "4px 0",
                }}
              >
                {svc.active ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                {svc.active ? "Activo" : "Inactivo"}
              </button>
              <div style={{ display: "flex", gap: "6px" }}>
                <button className="btn btn-ghost btn-sm" onClick={() => openEdit(svc)} title="Editar">
                  <Edit2 size={14} />
                </button>
                <button
                  className="btn btn-sm"
                  onClick={() => setDeleteConfirm(svc.id)}
                  title="Eliminar"
                  style={{
                    background: "rgba(239,68,68,0.08)",
                    color: "var(--danger)",
                    border: "1px solid rgba(239,68,68,0.2)",
                  }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE/EDIT MODAL */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div
            className="modal"
            style={{ maxWidth: "640px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3
                style={{
                  fontFamily: "'Playfair Display',serif",
                  fontSize: "20px",
                  color: "var(--navy)",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <Settings size={20} style={{ color: "var(--gold)" }} />
                {editingId ? "Editar Servicio" : "Nuevo Servicio"}
              </h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowModal(false)} style={{ padding: "6px" }}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div className="form-group">
                  <label className="form-label">Icono</label>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
                    {ICON_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setForm({ ...form, icon: opt.value })}
                        style={{
                          padding: "10px",
                          borderRadius: "var(--radius-sm)",
                          border: `2px solid ${form.icon === opt.value ? "var(--gold)" : "var(--gray-200)"}`,
                          background: form.icon === opt.value ? "rgba(201,168,76,0.08)" : "white",
                          cursor: "pointer",
                          fontSize: "13px",
                          color: form.icon === opt.value ? "var(--gold-dark)" : "var(--gray-600)",
                          fontWeight: form.icon === opt.value ? "700" : "normal",
                          transition: "all 0.15s ease",
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Nombre (ES) *</label>
                    <input
                      className="form-input"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Commercial Law"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ direction: "rtl" }}>الاسم (AR)</label>
                    <input
                      className="form-input"
                      value={form.nameAr}
                      onChange={(e) => setForm({ ...form, nameAr: e.target.value })}
                      placeholder="القانون التجاري"
                      dir="rtl"
                      style={{ fontFamily: "'Amiri', serif" }}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Descripción (ES) *</label>
                  <textarea
                    className="form-textarea"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Descripción del servicio..."
                    rows={2}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ direction: "rtl" }}>الوصف (AR)</label>
                  <textarea
                    className="form-textarea"
                    value={form.descriptionAr}
                    onChange={(e) => setForm({ ...form, descriptionAr: e.target.value })}
                    placeholder="وصف الخدمة..."
                    rows={2}
                    dir="rtl"
                    style={{ fontFamily: "'Amiri', serif" }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Precio / Tarifa</label>
                  <input
                    className="form-input"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="Ej: Desde €150, Consulta gratuita..."
                  />
                </div>

                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "14px",
                    background: "var(--gray-100)",
                    borderRadius: "var(--radius-sm)",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={form.active}
                    onChange={(e) => setForm({ ...form, active: e.target.checked })}
                    style={{ width: "18px", height: "18px", accentColor: "var(--gold)", cursor: "pointer" }}
                  />
                  <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--navy)" }}>
                    Servicio activo (visible en el sitio web)
                  </span>
                </label>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>
                Cancelar
              </button>
              <button className="btn btn-primary" onClick={handleSave}>
                <Save size={16} />
                {editingId ? "Actualizar" : "Crear Servicio"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal" style={{ maxWidth: "400px" }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontFamily: "'Playfair Display',serif", color: "var(--danger)" }}>¿Eliminar Servicio?</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setDeleteConfirm(null)} style={{ padding: "6px" }}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <p style={{ color: "var(--gray-600)" }}>
                Esta acción eliminará el servicio y no se puede deshacer.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setDeleteConfirm(null)}>Cancelar</button>
              <button className="btn btn-danger" onClick={() => handleDelete(deleteConfirm)}>
                <Trash2 size={16} />
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.type === "error" ? <XCircle size={16} /> : <CheckCircle size={16} />}
          <span style={{ marginLeft: "8px" }}>{toast.msg}</span>
        </div>
      )}
    </div>
  );
}
