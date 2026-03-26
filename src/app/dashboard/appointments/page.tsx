"use client";
import { useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  CheckCircle,
  XCircle,
  AlertCircle,
  X,
  Save,
} from "lucide-react";
import {
  getAppointments,
  updateAppointment,
  deleteAppointment,
  createAppointment,
  SERVICE_TYPES,
  TIME_SLOTS,
  type Appointment,
} from "@/lib/data";

const STATUS_OPTS = [
  { value: "all", label: "Todos" },
  { value: "pending", label: "Pendientes" },
  { value: "confirmed", label: "Confirmadas" },
  { value: "cancelled", label: "Canceladas" },
];

const STATUS_BADGE: Record<string, { label: string; cls: string; icon: React.ReactNode }> = {
  pending: {
    label: "Pendiente",
    cls: "badge-yellow",
    icon: <AlertCircle size={12} />,
  },
  confirmed: {
    label: "Confirmada",
    cls: "badge-green",
    icon: <CheckCircle size={12} />,
  },
  cancelled: {
    label: "Cancelada",
    cls: "badge-red",
    icon: <XCircle size={12} />,
  },
};

const EMPTY_FORM = {
  clientName: "",
  clientEmail: "",
  clientPhone: "",
  serviceType: "",
  date: "",
  time: "",
  status: "pending" as "pending" | "confirmed" | "cancelled",
  notes: "",
};

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>(getAppointments());
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
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
    setAppointments(getAppointments());
  }

  const filtered = appointments.filter((a) => {
    const matchSearch =
      a.clientName.toLowerCase().includes(search.toLowerCase()) ||
      a.clientEmail.toLowerCase().includes(search.toLowerCase()) ||
      a.serviceType.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || a.status === filterStatus;
    return matchSearch && matchStatus;
  });

  function openCreate() {
    setEditingId(null);
    setForm({ ...EMPTY_FORM });
    setShowModal(true);
  }

  function openEdit(apt: Appointment) {
    setEditingId(apt.id);
    setForm({
      clientName: apt.clientName,
      clientEmail: apt.clientEmail,
      clientPhone: apt.clientPhone,
      serviceType: apt.serviceType,
      date: apt.date,
      time: apt.time,
      status: apt.status,
      notes: apt.notes ?? "",
    });
    setShowModal(true);
  }

  function handleSave() {
    if (!form.clientName || !form.clientEmail || !form.serviceType || !form.date || !form.time) {
      showToast("Por favor completa todos los campos requeridos.", "error");
      return;
    }
    if (editingId) {
      updateAppointment(editingId, form);
      showToast("Cita actualizada correctamente. ✓");
    } else {
      createAppointment(form);
      showToast("Nueva cita creada. ✓");
    }
    setShowModal(false);
    refresh();
  }

  function handleDelete(id: string) {
    deleteAppointment(id);
    setDeleteConfirm(null);
    refresh();
    showToast("Cita eliminada.", "error");
  }

  function handleStatusChange(id: string, status: "pending" | "confirmed" | "cancelled") {
    updateAppointment(id, { status });
    refresh();
    showToast(`Estado actualizado a "${STATUS_BADGE[status].label}". ✓`);
  }

  return (
    <div>
      {/* Header */}
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
              color: "var(--charcoal)",
            }}
          >
            Gestión de Citas
          </h2>
          <p style={{ fontSize: "13px", color: "var(--gray-400)", marginTop: "4px" }}>
            {filtered.length} cita{filtered.length !== 1 ? "s" : ""} encontrada{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <Plus size={18} />
          Nueva Cita
        </button>
      </div>

      {/* Filters */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          marginBottom: "20px",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <div style={{ position: "relative", flex: 1, minWidth: "220px" }}>
          <Search
            size={15}
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--gray-400)",
            }}
          />
          <input
            className="form-input"
            placeholder="Buscar por nombre, email o servicio..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: "36px" }}
          />
        </div>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {STATUS_OPTS.map((s) => (
            <button
              key={s.value}
              className={filterStatus === s.value ? "btn btn-primary btn-sm" : "btn btn-ghost btn-sm"}
              onClick={() => setFilterStatus(s.value)}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Servicio</th>
              <th>Fecha & Hora</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: "40px", color: "var(--gray-400)" }}>
                  No se encontraron citas con los filtros actuales.
                </td>
              </tr>
            ) : (
              filtered.map((apt) => {
                const s = STATUS_BADGE[apt.status];
                return (
                  <tr key={apt.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div
                          style={{
                            width: "36px",
                            height: "36px",
                            background: "var(--charcoal)",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "var(--crimson-light)",
                            fontSize: "14px",
                            fontWeight: "700",
                            flexShrink: 0,
                          }}
                        >
                          {apt.clientName.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontWeight: "600", fontSize: "14px", color: "var(--charcoal)" }}>
                            {apt.clientName}
                          </div>
                          <div style={{ fontSize: "12px", color: "var(--gray-400)" }}>
                            {apt.clientEmail}
                          </div>
                          {apt.clientPhone && (
                            <div style={{ fontSize: "12px", color: "var(--gray-400)" }}>
                              {apt.clientPhone}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: "13px",
                          color: "var(--charcoal)",
                          fontWeight: "500",
                          padding: "4px 10px",
                          background: "rgba(155,28,46,0.06)",
                          borderRadius: "100px",
                          display: "inline-block",
                        }}
                      >
                        {apt.serviceType}
                      </span>
                      {apt.notes && (
                        <div
                          style={{
                            fontSize: "11px",
                            color: "var(--gray-400)",
                            marginTop: "4px",
                            maxWidth: "200px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {apt.notes}
                        </div>
                      )}
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--charcoal)", fontWeight: "500" }}>
                        <Calendar size={14} style={{ color: "var(--crimson)" }} />
                        {new Date(apt.date + "T12:00:00").toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" })}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "var(--gray-400)", marginTop: "3px" }}>
                        <Clock size={12} />
                        {apt.time}
                      </div>
                    </td>
                    <td>
                      <select
                        value={apt.status}
                        onChange={(e) =>
                          handleStatusChange(apt.id, e.target.value as "pending" | "confirmed" | "cancelled")
                        }
                        style={{
                          padding: "5px 10px",
                          borderRadius: "100px",
                          border: "none",
                          fontSize: "12px",
                          fontWeight: "700",
                          cursor: "pointer",
                          background:
                            apt.status === "pending"
                              ? "rgba(245,158,11,0.12)"
                              : apt.status === "confirmed"
                              ? "rgba(16,185,129,0.12)"
                              : "rgba(239,68,68,0.12)",
                          color:
                            apt.status === "pending"
                              ? "var(--warning)"
                              : apt.status === "confirmed"
                              ? "var(--success)"
                              : "var(--danger)",
                          outline: "none",
                        }}
                      >
                        <option value="pending">Pendiente</option>
                        <option value="confirmed">Confirmada</option>
                        <option value="cancelled">Cancelada</option>
                      </select>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => openEdit(apt)}
                          title="Editar"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          className="btn btn-sm"
                          onClick={() => setDeleteConfirm(apt.id)}
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
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* CREATE/EDIT MODAL */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: "20px", color: "var(--charcoal)" }}>
                {editingId ? "Editar Cita" : "Nueva Cita"}
              </h3>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setShowModal(false)}
                style={{ padding: "6px" }}
              >
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">
                      <User size={13} style={{ display: "inline", marginRight: "4px" }} />
                      Nombre *
                    </label>
                    <input
                      className="form-input"
                      value={form.clientName}
                      onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                      placeholder="Nombre completo"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      <Phone size={13} style={{ display: "inline", marginRight: "4px" }} />
                      Teléfono
                    </label>
                    <input
                      className="form-input"
                      value={form.clientPhone}
                      onChange={(e) => setForm({ ...form, clientPhone: e.target.value })}
                      placeholder="+34 600 000 000"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <Mail size={13} style={{ display: "inline", marginRight: "4px" }} />
                    Email *
                  </label>
                  <input
                    className="form-input"
                    type="email"
                    value={form.clientEmail}
                    onChange={(e) => setForm({ ...form, clientEmail: e.target.value })}
                    placeholder="correo@ejemplo.com"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Área Legal *</label>
                  <select
                    className="form-select"
                    value={form.serviceType}
                    onChange={(e) => setForm({ ...form, serviceType: e.target.value })}
                  >
                    <option value="">Seleccionar área...</option>
                    {SERVICE_TYPES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">
                      <Calendar size={13} style={{ display: "inline", marginRight: "4px" }} />
                      Fecha *
                    </label>
                    <input
                      className="form-input"
                      type="date"
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      <Clock size={13} style={{ display: "inline", marginRight: "4px" }} />
                      Hora *
                    </label>
                    <select
                      className="form-select"
                      value={form.time}
                      onChange={(e) => setForm({ ...form, time: e.target.value })}
                    >
                      <option value="">Seleccionar hora...</option>
                      {TIME_SLOTS.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                {editingId && (
                  <div className="form-group">
                    <label className="form-label">Estado</label>
                    <select
                      className="form-select"
                      value={form.status}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          status: e.target.value as "pending" | "confirmed" | "cancelled",
                        })
                      }
                    >
                      <option value="pending">Pendiente</option>
                      <option value="confirmed">Confirmada</option>
                      <option value="cancelled">Cancelada</option>
                    </select>
                  </div>
                )}
                <div className="form-group">
                  <label className="form-label">Notas</label>
                  <textarea
                    className="form-textarea"
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    placeholder="Observaciones adicionales..."
                    rows={3}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>
                Cancelar
              </button>
              <button className="btn btn-primary" onClick={handleSave}>
                <Save size={16} />
                {editingId ? "Actualizar Cita" : "Crear Cita"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div
            className="modal"
            style={{ maxWidth: "400px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3 style={{ fontFamily: "'Playfair Display',serif", color: "var(--danger)" }}>
                ¿Eliminar Cita?
              </h3>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setDeleteConfirm(null)}
                style={{ padding: "6px" }}
              >
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <p style={{ color: "var(--gray-600)" }}>
                Esta acción no se puede deshacer. ¿Estás segura de que deseas eliminar esta cita?
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setDeleteConfirm(null)}>
                Cancelar
              </button>
              <button className="btn btn-danger" onClick={() => handleDelete(deleteConfirm)}>
                <Trash2 size={16} />
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.type === "error" ? <XCircle size={16} /> : <CheckCircle size={16} />}
          <span style={{ marginLeft: "8px" }}>{toast.msg}</span>
        </div>
      )}
    </div>
  );
}
