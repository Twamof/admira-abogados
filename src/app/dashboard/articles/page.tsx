"use client";
import { useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Eye,
  EyeOff,
  X,
  Save,
  CheckCircle,
  XCircle,
  FileText,
} from "lucide-react";
import {
  getArticles,
  updateArticle,
  deleteArticle,
  createArticle,
  type Article,
} from "@/lib/data";

const CATEGORIES = [
  "Derecho de Familia",
  "Derecho Laboral",
  "Derecho Bancario",
  "Extranjería",
  "Derecho Mercantil",
  "Derecho Civil",
  "Derecho Penal",
  "Derecho Administrativo",
  "Derecho Inmobiliario",
];

const EMPTY_FORM = {
  title: "",
  titleAr: "",
  summary: "",
  summaryAr: "",
  content: "",
  contentAr: "",
  category: "",
  published: false,
  author: "Aziza Maghni",
};

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>(getArticles());
  const [search, setSearch] = useState("");
  const [filterPublished, setFilterPublished] = useState<"all" | "published" | "draft">("all");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: string } | null>(null);
  const [tab, setTab] = useState<"es" | "ar">("es");

  function showToast(msg: string, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  function refresh() {
    setArticles(getArticles());
  }

  const filtered = articles.filter((a) => {
    const matchSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.category.toLowerCase().includes(search.toLowerCase()) ||
      a.titleAr.includes(search);
    const matchPub =
      filterPublished === "all" ||
      (filterPublished === "published" && a.published) ||
      (filterPublished === "draft" && !a.published);
    return matchSearch && matchPub;
  });

  function openCreate() {
    setEditingId(null);
    setForm({ ...EMPTY_FORM });
    setTab("es");
    setShowModal(true);
  }

  function openEdit(art: Article) {
    setEditingId(art.id);
    setForm({
      title: art.title,
      titleAr: art.titleAr,
      summary: art.summary,
      summaryAr: art.summaryAr,
      content: art.content,
      contentAr: art.contentAr,
      category: art.category,
      published: art.published,
      author: art.author,
    });
    setTab("es");
    setShowModal(true);
  }

  function handleSave() {
    if (!form.title || !form.category || !form.summary) {
      showToast("Completa los campos requeridos (título, categoría, resumen).", "error");
      return;
    }
    if (editingId) {
      updateArticle(editingId, form);
      showToast("Artículo actualizado. ✓");
    } else {
      createArticle(form);
      showToast("Artículo creado. ✓");
    }
    setShowModal(false);
    refresh();
  }

  function handleDelete(id: string) {
    deleteArticle(id);
    setDeleteConfirm(null);
    refresh();
    showToast("Artículo eliminado.", "error");
  }

  function togglePublish(id: string, published: boolean) {
    updateArticle(id, { published: !published });
    refresh();
    showToast(!published ? "Artículo publicado. ✓" : "Artículo despublicado.");
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
            Gestión de Artículos
          </h2>
          <p style={{ fontSize: "13px", color: "var(--gray-400)", marginTop: "4px" }}>
            {filtered.length} artículo{filtered.length !== 1 ? "s" : ""} ·{" "}
            {articles.filter((a) => a.published).length} publicados
          </p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <Plus size={18} />
          Nuevo Artículo
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
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
            placeholder="Buscar artículos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: "36px" }}
          />
        </div>
        {(["all", "published", "draft"] as const).map((f) => (
          <button
            key={f}
            className={filterPublished === f ? "btn btn-primary btn-sm" : "btn btn-ghost btn-sm"}
            onClick={() => setFilterPublished(f)}
          >
            {f === "all" ? "Todos" : f === "published" ? "Publicados" : "Borradores"}
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      <div className="grid-3">
        {filtered.length === 0 ? (
          <div
            style={{
              gridColumn: "1/-1",
              textAlign: "center",
              padding: "60px",
              color: "var(--gray-400)",
            }}
          >
            No se encontraron artículos.
          </div>
        ) : (
          filtered.map((art) => (
            <div
              key={art.id}
              style={{
                background: "white",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--gray-200)",
                overflow: "hidden",
                boxShadow: "var(--shadow-sm)",
                transition: "all 0.2s ease",
                display: "flex",
                flexDirection: "column",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-md)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-sm)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              }}
            >
              {/* Card top */}
              <div
                style={{
                  background: "linear-gradient(135deg, var(--navy), var(--navy-mid))",
                  height: "100px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "40px",
                  position: "relative",
                }}
              >
                {art.category === "Derecho de Familia"
                  ? "👨‍👩‍👧"
                  : art.category === "Derecho Laboral"
                  ? "💼"
                  : art.category === "Extranjería"
                  ? "🌍"
                  : art.category === "Derecho Bancario"
                  ? "💰"
                  : "⚖️"}
                <div
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                  }}
                >
                  <span className={`badge ${art.published ? "badge-success" : "badge-warning"}`}>
                    {art.published ? "Publicado" : "Borrador"}
                  </span>
                </div>
              </div>

              <div style={{ padding: "18px", flex: 1 }}>
                <div
                  style={{
                    fontSize: "10px",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    color: "var(--gold)",
                    marginBottom: "8px",
                  }}
                >
                  {art.category}
                </div>
                <h3
                  style={{
                    fontFamily: "'Playfair Display',serif",
                    fontSize: "16px",
                    color: "var(--navy)",
                    marginBottom: "8px",
                    lineHeight: "1.35",
                  }}
                >
                  {art.title}
                </h3>
                <p
                  style={{
                    fontSize: "13px",
                    color: "var(--gray-600)",
                    lineHeight: "1.5",
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {art.summary}
                </p>
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
                <span style={{ fontSize: "11px", color: "var(--gray-400)" }}>
                  {new Date(art.createdAt).toLocaleDateString("es-ES", { day: "2-digit", month: "short" })}
                </span>
                <div style={{ display: "flex", gap: "6px" }}>
                  <button
                    className="btn btn-ghost btn-sm"
                    title={art.published ? "Despublicar" : "Publicar"}
                    onClick={() => togglePublish(art.id, art.published)}
                    style={{
                      color: art.published ? "var(--success)" : "var(--gray-400)",
                    }}
                  >
                    {art.published ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => openEdit(art)}
                    title="Editar"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    className="btn btn-sm"
                    onClick={() => setDeleteConfirm(art.id)}
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
          ))
        )}
      </div>

      {/* CREATE/EDIT MODAL */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div
            className="modal"
            style={{ maxWidth: "760px" }}
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
                <FileText size={20} style={{ color: "var(--gold)" }} />
                {editingId ? "Editar Artículo" : "Nuevo Artículo"}
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
              {/* Language Tabs */}
              <div
                style={{
                  display: "flex",
                  gap: "4px",
                  marginBottom: "20px",
                  background: "var(--gray-100)",
                  padding: "4px",
                  borderRadius: "var(--radius-sm)",
                  width: "fit-content",
                }}
              >
                <button
                  className={`btn btn-sm ${tab === "es" ? "btn-primary" : "btn-ghost"}`}
                  onClick={() => setTab("es")}
                >
                  🇪🇸 Español
                </button>
                <button
                  className={`btn btn-sm ${tab === "ar" ? "btn-primary" : "btn-ghost"}`}
                  onClick={() => setTab("ar")}
                >
                  🇲🇦 عربي
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {tab === "es" ? (
                  <>
                    <div className="grid-2">
                      <div className="form-group">
                        <label className="form-label">Título (ES) *</label>
                        <input
                          className="form-input"
                          value={form.title}
                          onChange={(e) => setForm({ ...form, title: e.target.value })}
                          placeholder="Título del artículo"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Categoría *</label>
                        <select
                          className="form-select"
                          value={form.category}
                          onChange={(e) => setForm({ ...form, category: e.target.value })}
                        >
                          <option value="">Seleccionar...</option>
                          {CATEGORIES.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Resumen (ES) *</label>
                      <textarea
                        className="form-textarea"
                        value={form.summary}
                        onChange={(e) => setForm({ ...form, summary: e.target.value })}
                        placeholder="Breve resumen del artículo..."
                        rows={2}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Contenido (ES)</label>
                      <textarea
                        className="form-textarea"
                        value={form.content}
                        onChange={(e) => setForm({ ...form, content: e.target.value })}
                        placeholder="Contenido completo del artículo..."
                        rows={6}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="form-group">
                      <label className="form-label" style={{ direction: "rtl" }}>العنوان (AR)</label>
                      <input
                        className="form-input"
                        value={form.titleAr}
                        onChange={(e) => setForm({ ...form, titleAr: e.target.value })}
                        placeholder="عنوان المقال"
                        dir="rtl"
                        style={{ fontFamily: "'Amiri', serif" }}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ direction: "rtl" }}>الملخص (AR)</label>
                      <textarea
                        className="form-textarea"
                        value={form.summaryAr}
                        onChange={(e) => setForm({ ...form, summaryAr: e.target.value })}
                        placeholder="ملخص قصير للمقال..."
                        rows={2}
                        dir="rtl"
                        style={{ fontFamily: "'Amiri', serif" }}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ direction: "rtl" }}>المحتوى (AR)</label>
                      <textarea
                        className="form-textarea"
                        value={form.contentAr}
                        onChange={(e) => setForm({ ...form, contentAr: e.target.value })}
                        placeholder="المحتوى الكامل للمقال..."
                        rows={6}
                        dir="rtl"
                        style={{ fontFamily: "'Amiri', serif" }}
                      />
                    </div>
                  </>
                )}

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "14px 18px",
                    background: "var(--gray-100)",
                    borderRadius: "var(--radius-sm)",
                  }}
                >
                  <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={form.published}
                      onChange={(e) => setForm({ ...form, published: e.target.checked })}
                      style={{ width: "18px", height: "18px", accentColor: "var(--gold)", cursor: "pointer" }}
                    />
                    <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--navy)" }}>
                      Publicar artículo (visible en el sitio web)
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>
                Cancelar
              </button>
              <button className="btn btn-primary" onClick={handleSave}>
                <Save size={16} />
                {editingId ? "Actualizar" : "Crear Artículo"}
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
                ¿Eliminar Artículo?
              </h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setDeleteConfirm(null)} style={{ padding: "6px" }}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <p style={{ color: "var(--gray-600)" }}>
                Esta acción eliminará el artículo permanentemente y no se puede deshacer.
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

      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.type === "error" ? <XCircle size={16} /> : <CheckCircle size={16} />}
          <span style={{ marginLeft: "8px" }}>{toast.msg}</span>
        </div>
      )}
    </div>
  );
}
