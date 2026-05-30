import { useState, useEffect, useMemo } from "react";
import * as XLSX from "xlsx";

const STATUSES = ["To Do", "In Progress", "Done"];
const TYPES = ["Story", "Bug", "Task"];
const MIN_POINTS = 8;
const MAX_POINTS = 20;
const POINT_OPTIONS = [1, 2, 3, 5, 8, 13];

function exportIterationToExcel(iter, iterData) {
  const { items } = iterData;

  const headers = ["Item ID", "Title", "Type", "Story Points", "Iteration"];
  const rows = items.map(item => [
    item.id            || "",
    item.title         || "",
    item.type          || "",
    Number(item.points) || 0,
    iter,
  ]);

  const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  ws["!cols"] = [
    { wch: 14 },  // Item ID
    { wch: 40 },  // Title
    { wch: 12 },  // Type
    { wch: 14 },  // Story Points
    { wch: 20 },  // Iteration
  ];
  ws["!freeze"] = { xSplit: 0, ySplit: 1 };

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, iter.replace(/[\\/:*?[\]]/g, "_").slice(0, 31));

  const safeName = iter.replace(/[\\/:*?[\]]/g, "_");
  XLSX.writeFile(wb, `${safeName}_iteration_details.xlsx`);
}

const STATUS_CFG = {
  "To Do":       { dot: "#6b7280", bg: "rgba(107,114,128,0.12)", color: "#9ca3af", border: "rgba(107,114,128,0.25)" },
  "In Progress": { dot: "#f59e0b", bg: "rgba(245,158,11,0.1)",  color: "#fbbf24", border: "rgba(245,158,11,0.25)" },
  "Done":        { dot: "#10b981", bg: "rgba(16,185,129,0.1)",  color: "#34d399", border: "rgba(16,185,129,0.25)" },
};
const TYPE_CFG = {
  "Story": { bg: "rgba(99,102,241,0.12)", color: "#a5b4fc", border: "rgba(99,102,241,0.3)" },
  "Bug":   { bg: "rgba(239,68,68,0.1)",   color: "#fca5a5", border: "rgba(239,68,68,0.25)" },
  "Task":  { bg: "rgba(20,184,166,0.1)",  color: "#5eead4", border: "rgba(20,184,166,0.25)" },
};

const G = {
  bg: "#0a0a0f",
  surface: "#111118",
  card: "#16161f",
  cardHover: "#1c1c28",
  border: "rgba(255,255,255,0.07)",
  borderHover: "rgba(255,255,255,0.14)",
  text: "#f1f0ff",
  muted: "#7c7a9a",
  subtle: "#3a3850",
  accent: "#7c6ff7",
  accentGlow: "rgba(124,111,247,0.2)",
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
@keyframes fadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
* { box-sizing: border-box; margin: 0; padding: 0; }
.tracker { background: #0a0a0f; min-height: 100vh; padding: 2rem 1.5rem; font-family: 'DM Sans', sans-serif; color: #f1f0ff; }
.fade-up { animation: fadeUp 0.35s ease both; }
input, select, textarea, button { font-family: 'DM Sans', sans-serif; }
input[type=date]::-webkit-calendar-picker-indicator { filter: invert(0.4); }
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #3a3850; border-radius: 4px; }
.item-row { transition: background 0.15s, border-color 0.15s; }
.item-row:hover { background: #1c1c28 !important; border-color: rgba(255,255,255,0.14) !important; }
.icon-btn:hover { color: #f1f0ff !important; background: rgba(255,255,255,0.07) !important; }
.add-btn:hover { background: rgba(124,111,247,0.85) !important; box-shadow: 0 0 24px rgba(124,111,247,0.35) !important; }
.filter-pill { transition: all 0.15s; cursor: pointer; user-select: none; }
.filter-pill:hover { border-color: rgba(255,255,255,0.2) !important; color: #f1f0ff !important; }
.filter-pill.on { background: rgba(124,111,247,0.15) !important; border-color: rgba(124,111,247,0.4) !important; color: #c4bbff !important; }
.modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.72); backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center; z-index: 200; }
.modal-box { background: #16161f; border-radius: 18px; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 32px 80px rgba(0,0,0,0.7); padding: 1.75rem; width: 460px; max-width: 95vw; max-height: 90vh; overflow-y: auto; }
`;

const fieldStyle = {
  width: "100%", fontSize: 13, padding: "9px 12px",
  borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)",
  background: "rgba(255,255,255,0.04)", color: "#f1f0ff",
  outline: "none",
};

function Badge({ label, cfg }) {
  return (
    <span style={{
      fontSize: 11, padding: "3px 10px", borderRadius: 20,
      background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
      fontWeight: 500, letterSpacing: "0.02em", whiteSpace: "nowrap",
      fontFamily: "'DM Mono', monospace",
    }}>{label}</span>
  );
}

function StatCard({ value, label, accent }) {
  return (
    <div style={{
      background: G.card, border: `1px solid ${G.border}`, borderRadius: 14,
      padding: "1rem 1.25rem", borderTop: `2px solid ${accent}`,
    }}>
      <div style={{ fontSize: 26, fontWeight: 600, color: G.text, letterSpacing: "-0.02em" }}>{value}</div>
      <div style={{ fontSize: 12, color: G.muted, marginTop: 2 }}>{label}</div>
    </div>
  );
}

function FieldLabel({ children }) {
  return (
    <div style={{ fontSize: 11, color: G.muted, marginBottom: 5, marginTop: 14, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase" }}>
      {children}
    </div>
  );
}

function ItemForm({ initial, iterations, onSave, onClose }) {
  const [form, setForm] = useState(initial || {
    id: "", title: "", description: "", type: "Story", status: "To Do",
    iteration: "", startDate: "", endDate: "", createdDate: new Date().toISOString().slice(0, 10),
    points: 1,
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 10 }}>
        <div>
          <FieldLabel>Item ID</FieldLabel>
          <input style={fieldStyle} value={form.id} onChange={e => set("id", e.target.value)} placeholder="US-001" />
        </div>
        <div>
          <FieldLabel>Title *</FieldLabel>
          <input style={fieldStyle} value={form.title} onChange={e => set("title", e.target.value)} placeholder="Short description" />
        </div>
      </div>
      <FieldLabel>Description</FieldLabel>
      <textarea style={{ ...fieldStyle, minHeight: 72, resize: "vertical" }} value={form.description} onChange={e => set("description", e.target.value)} placeholder="Details, acceptance criteria…" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        <div>
          <FieldLabel>Type</FieldLabel>
          <select style={{ ...fieldStyle, background: "#1a1a2e", cursor: "pointer" }} value={form.type} onChange={e => set("type", e.target.value)}>
            {TYPES.map(t => <option key={t} style={{ background: "#1a1a2e" }}>{t}</option>)}
          </select>
        </div>
        <div>
          <FieldLabel>Status</FieldLabel>
          <select style={{ ...fieldStyle, background: "#1a1a2e", cursor: "pointer" }} value={form.status} onChange={e => set("status", e.target.value)}>
            {STATUSES.map(s => <option key={s} style={{ background: "#1a1a2e" }}>{s}</option>)}
          </select>
        </div>
        <div>
          <FieldLabel>Story Points</FieldLabel>
          <select style={{ ...fieldStyle, background: "#1a1a2e", cursor: "pointer" }} value={form.points} onChange={e => set("points", Number(e.target.value))}>
            {POINT_OPTIONS.map(p => <option key={p} value={p} style={{ background: "#1a1a2e" }}>{p} pt{p !== 1 ? "s" : ""}</option>)}
          </select>
        </div>
      </div>
      <FieldLabel>Iteration / Sprint</FieldLabel>
      <input style={fieldStyle} value={form.iteration} onChange={e => set("iteration", e.target.value)}
        placeholder="e.g. Sprint 3" list="iter-opts" />
      <datalist id="iter-opts">{iterations.map(i => <option key={i} value={i} />)}</datalist>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        <div>
          <FieldLabel>Sprint Start</FieldLabel>
          <input type="date" style={fieldStyle} value={form.startDate} onChange={e => set("startDate", e.target.value)} />
        </div>
        <div>
          <FieldLabel>Sprint End</FieldLabel>
          <input type="date" style={fieldStyle} value={form.endDate} onChange={e => set("endDate", e.target.value)} />
        </div>
        <div>
          <FieldLabel>Created</FieldLabel>
          <input type="date" style={fieldStyle} value={form.createdDate} onChange={e => set("createdDate", e.target.value)} />
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: "1.5rem", justifyContent: "flex-end" }}>
        <button onClick={onClose} style={{
          padding: "8px 18px", borderRadius: 10, border: `1px solid ${G.border}`,
          background: "transparent", color: G.muted, cursor: "pointer", fontSize: 13,
        }}>Cancel</button>
        <button className="add-btn" onClick={() => form.title.trim() && onSave(form)} style={{
          padding: "8px 22px", borderRadius: 10, border: "none",
          background: G.accent, color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600,
        }}>Save item</button>
      </div>
    </div>
  );
}

function PointsResultModal({ iter, points, onClose }) {
  const isUnder = points < MIN_POINTS;
  const isOver  = points > MAX_POINTS;
  const isOk    = !isUnder && !isOver;
  const diff    = isUnder ? MIN_POINTS - points : isOver ? points - MAX_POINTS : 0;

  const cfg = isOk
    ? { icon: "✅", accent: "#10b981", bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.2)",
        headline: "You're within the required range!",
        sub: `${iter} has ${points} point${points !== 1 ? "s" : ""} — perfectly between ${MIN_POINTS} and ${MAX_POINTS}.` }
    : isUnder
    ? { icon: "⚠️", accent: "#f59e0b", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.2)",
        headline: "Below minimum points",
        sub: `${iter} has only ${points} point${points !== 1 ? "s" : ""}. Add at least ${diff} more point${diff !== 1 ? "s" : ""} to meet the minimum of ${MIN_POINTS}.` }
    : { icon: "🚫", accent: "#ef4444", bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.2)",
        headline: "Exceeds maximum points",
        sub: `${iter} has ${points} points. Remove at least ${diff} point${diff !== 1 ? "s" : ""} to stay within the maximum of ${MAX_POINTS}.` };

  const pct = Math.min(100, Math.round((points / MAX_POINTS) * 100));
  const barColor = isOk ? "#10b981" : isUnder ? "#f59e0b" : "#ef4444";

  return (
    <div className="modal-backdrop">
      <div className="modal-box fade-up" style={{ width: 400 }}>
        <div style={{ textAlign: "center", padding: "0.5rem 0 1.25rem" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>{cfg.icon}</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: G.text, marginBottom: 8 }}>{cfg.headline}</div>
          <div style={{
            background: cfg.bg, border: `1px solid ${cfg.border}`,
            borderRadius: 12, padding: "12px 16px", margin: "0 0 1.25rem",
          }}>
            <div style={{ fontSize: 13, color: G.muted, lineHeight: 1.6 }}>{cfg.sub}</div>
          </div>

          {/* Point range bar */}
          <div style={{ marginBottom: "1.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: G.muted, marginBottom: 6, fontFamily: "'DM Mono', monospace" }}>
              <span>0</span><span style={{ color: "#f59e0b" }}>min {MIN_POINTS}</span>
              <span style={{ fontWeight: 600, color: cfg.accent }}>{points} pts</span>
              <span style={{ color: "#ef4444" }}>max {MAX_POINTS}</span>
            </div>
            <div style={{ height: 8, borderRadius: 8, background: "rgba(255,255,255,0.07)", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", left: `${(MIN_POINTS/MAX_POINTS)*100}%`, top: 0, bottom: 0, width: 2, background: "rgba(245,158,11,0.5)" }} />
              <div style={{ height: "100%", width: `${pct}%`, borderRadius: 8, background: barColor, transition: "width 0.4s ease" }} />
            </div>
          </div>

          {/* Breakdown */}
          <div style={{ display: "flex", justifyContent: "center", gap: 24, marginBottom: "1.25rem" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 600, color: cfg.accent }}>{points}</div>
              <div style={{ fontSize: 11, color: G.muted }}>Current</div>
            </div>
            <div style={{ width: 1, background: G.border }} />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 600, color: "#7c7a9a" }}>{MIN_POINTS}–{MAX_POINTS}</div>
              <div style={{ fontSize: 11, color: G.muted }}>Required range</div>
            </div>
            {!isOk && (
              <>
                <div style={{ width: 1, background: G.border }} />
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 22, fontWeight: 600, color: cfg.accent }}>{diff}</div>
                  <div style={{ fontSize: 11, color: G.muted }}>{isUnder ? "Points needed" : "Points over"}</div>
                </div>
              </>
            )}
          </div>

          <button onClick={onClose} className="add-btn" style={{
            padding: "9px 28px", borderRadius: 10, border: "none",
            background: cfg.accent, color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600,
          }}>Got it</button>
        </div>
      </div>
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div className="modal-backdrop">
      <div className="modal-box fade-up">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <span style={{ fontWeight: 600, fontSize: 15, color: G.text }}>{title}</span>
          <button onClick={onClose} style={{
            background: "rgba(255,255,255,0.06)", border: "none", cursor: "pointer",
            color: G.muted, width: 28, height: 28, borderRadius: 8, fontSize: 16,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default function WorkTracker() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [pointsResult, setPointsResult] = useState(null); // { iter, points }
  const [search, setSearch] = useState("");
  const [filterIter, setFilterIter] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await window.storage.get("work_items_dark");
        if (res?.value) setItems(JSON.parse(res.value));
      } catch (_) {}
      setLoading(false);
    })();
  }, []);

  const persist = async (updated) => {
    setItems(updated);
    try { await window.storage.set("work_items_dark", JSON.stringify(updated)); } catch (_) {}
  };

  const addItem = (form) => { persist([{ ...form, _key: Date.now().toString() }, ...items]); setShowAdd(false); };
  const updateItem = (form) => { persist(items.map(i => i._key === form._key ? form : i)); setEditItem(null); };
  const deleteItem = (key) => { if (confirm("Delete this item?")) persist(items.filter(i => i._key !== key)); };

  const iterations = useMemo(() => [...new Set(items.map(i => i.iteration).filter(Boolean))].sort(), [items]);

  const filtered = useMemo(() => items.filter(item => {
    if (search) {
      const q = search.toLowerCase();
      if (!item.title?.toLowerCase().includes(q) && !item.id?.toLowerCase().includes(q) && !item.description?.toLowerCase().includes(q)) return false;
    }
    if (filterIter !== "All" && item.iteration !== filterIter) return false;
    if (filterStatus !== "All" && item.status !== filterStatus) return false;
    if (filterType !== "All" && item.type !== filterType) return false;
    if (dateFrom && item.createdDate && item.createdDate < dateFrom) return false;
    if (dateTo && item.createdDate && item.createdDate > dateTo) return false;
    return true;
  }), [items, search, filterIter, filterStatus, filterType, dateFrom, dateTo]);

  const grouped = useMemo(() => {
    const map = {};
    filtered.forEach(item => {
      const key = item.iteration || "No Iteration";
      if (!map[key]) map[key] = { items: [], startDate: item.startDate, endDate: item.endDate };
      map[key].items.push(item);
    });
    return map;
  }, [filtered]);

  const iterKeys = Object.keys(grouped).sort((a, b) => {
    if (a === "No Iteration") return 1;
    if (b === "No Iteration") return -1;
    return (grouped[b].startDate || "").localeCompare(grouped[a].startDate || "");
  });

  const hasFilters = filterIter !== "All" || filterStatus !== "All" || filterType !== "All" || dateFrom || dateTo;
  const stats = {
    total: items.length,
    inProgress: items.filter(i => i.status === "In Progress").length,
    done: items.filter(i => i.status === "Done").length,
    sprints: iterations.length,
  };

  if (loading) return (
    <div style={{ background: G.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif" }}>
      <span style={{ color: G.muted, fontSize: 14 }}>Loading…</span>
    </div>
  );

  return (
    <>
      <style>{CSS}</style>
      <div className="tracker">

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 34, height: 34, borderRadius: 10,
                background: "linear-gradient(135deg, #7c6ff7, #a78bfa)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17,
              }}>⚡</div>
              <span style={{ fontSize: 18, fontWeight: 600, color: G.text, letterSpacing: "-0.02em" }}>Sprint Tracker</span>
            </div>
            <div style={{ fontSize: 12, color: G.muted, marginTop: 4, marginLeft: 44 }}>Work items · Iterations · Dates</div>
          </div>
          <button className="add-btn" onClick={() => setShowAdd(true)} style={{
            display: "flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 600,
            padding: "9px 20px", borderRadius: 12, border: "none",
            background: G.accent, color: "#fff", cursor: "pointer", letterSpacing: "0.01em",
            transition: "background 0.15s, box-shadow 0.15s",
          }}>
            <span style={{ fontSize: 17, lineHeight: 1 }}>+</span> Add item
          </button>
        </div>

        {/* Stats */}
        {items.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px,1fr))", gap: 10, marginBottom: "2rem" }}>
            <StatCard value={stats.total} label="Total items" accent="#7c6ff7" />
            <StatCard value={stats.inProgress} label="In progress" accent="#f59e0b" />
            <StatCard value={stats.done} label="Completed" accent="#10b981" />
            <StatCard value={stats.sprints} label="Sprints" accent="#6366f1" />
          </div>
        )}

        {/* Search */}
        <div style={{ position: "relative", marginBottom: 10 }}>
          <span style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: G.muted, fontSize: 14, pointerEvents: "none" }}>🔍</span>
          <input
            style={{
              ...fieldStyle, paddingLeft: 38, width: "100%",
              background: G.surface, border: `1px solid ${G.border}`,
              borderRadius: 12, fontSize: 14, height: 44,
            }}
            placeholder="Search ID, title or description…"
            value={search} onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Sprint pills + filter toggle */}
        <div style={{ display: "flex", gap: 7, marginBottom: "1.5rem", flexWrap: "wrap", alignItems: "center" }}>
          {["All", ...iterations].map(iter => (
            <span key={iter}
              className={`filter-pill${filterIter === iter ? " on" : ""}`}
              onClick={() => setFilterIter(iter)}
              style={{
                fontSize: 12, padding: "5px 13px", borderRadius: 20,
                border: `1px solid ${G.border}`, color: G.muted,
                background: "transparent", fontWeight: 500,
              }}>
              {iter === "All" ? "All sprints" : iter}
            </span>
          ))}
          <span style={{ flex: 1 }} />
          <button onClick={() => setShowFilters(f => !f)} style={{
            display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 500,
            padding: "5px 13px", borderRadius: 20, cursor: "pointer",
            border: `1px solid ${showFilters ? "rgba(124,111,247,0.4)" : G.border}`,
            background: showFilters ? "rgba(124,111,247,0.1)" : "transparent",
            color: showFilters ? "#c4bbff" : G.muted,
            position: "relative",
          }}>
            ⚙ Filters
            {hasFilters && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#f59e0b", marginLeft: 2 }} />}
          </button>
          {hasFilters && (
            <button onClick={() => { setFilterStatus("All"); setFilterType("All"); setDateFrom(""); setDateTo(""); }} style={{
              fontSize: 12, padding: "5px 12px", borderRadius: 20,
              border: `1px solid ${G.border}`, background: "transparent",
              color: G.muted, cursor: "pointer",
            }}>Clear</button>
          )}
        </div>

        {/* Advanced filter panel */}
        {showFilters && (
          <div className="fade-up" style={{
            background: G.surface, border: `1px solid ${G.border}`,
            borderRadius: 14, padding: "1.25rem", marginBottom: "1.5rem",
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px,1fr))", gap: 12,
          }}>
            {[
              { label: "Status", val: filterStatus, set: setFilterStatus, opts: ["All", ...STATUSES] },
              { label: "Type", val: filterType, set: setFilterType, opts: ["All", ...TYPES] },
            ].map(({ label, val, set, opts }) => (
              <div key={label}>
                <div style={{ fontSize: 11, color: G.muted, marginBottom: 6, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase" }}>{label}</div>
                <select style={{ ...fieldStyle, background: "#1a1a2e", cursor: "pointer" }} value={val} onChange={e => set(e.target.value)}>
                  {opts.map(o => <option key={o} style={{ background: "#1a1a2e" }}>{o === "All" ? `All ${label.toLowerCase()}s` : o}</option>)}
                </select>
              </div>
            ))}
            <div>
              <div style={{ fontSize: 11, color: G.muted, marginBottom: 6, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase" }}>Created from</div>
              <input type="date" style={{ ...fieldStyle, background: "#1a1a2e" }} value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
            </div>
            <div>
              <div style={{ fontSize: 11, color: G.muted, marginBottom: 6, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase" }}>Created to</div>
              <input type="date" style={{ ...fieldStyle, background: "#1a1a2e" }} value={dateTo} onChange={e => setDateTo(e.target.value)} />
            </div>
          </div>
        )}

        {/* Empty states */}
        {items.length === 0 && (
          <div style={{ textAlign: "center", padding: "5rem 1rem" }}>
            <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.25 }}>📋</div>
            <div style={{ color: G.muted, fontSize: 15, fontWeight: 500, marginBottom: 8 }}>No items yet</div>
            <div style={{ color: G.subtle, fontSize: 13 }}>
              Click <span style={{ color: G.accent, fontWeight: 500 }}>+ Add item</span> to track your first user story
            </div>
          </div>
        )}
        {items.length > 0 && filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "3rem", color: G.muted, fontSize: 14 }}>
            Nothing matches your filters.
          </div>
        )}

        {/* Iteration groups */}
        {iterKeys.map((iter, gi) => (
          <div key={iter} className="fade-up" style={{ marginBottom: "2rem", animationDelay: `${gi * 0.05}s` }}>

            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{ height: 1, width: 14, background: G.subtle }} />
              <span style={{
                fontSize: 11, fontWeight: 600, color: G.muted,
                letterSpacing: "0.08em", textTransform: "uppercase",
                fontFamily: "'DM Mono', monospace",
              }}>{iter}</span>
              {grouped[iter].startDate && (
                <span style={{ fontSize: 11, color: G.subtle, fontFamily: "'DM Mono', monospace" }}>
                  {grouped[iter].startDate}{grouped[iter].endDate ? ` → ${grouped[iter].endDate}` : ""}
                </span>
              )}
              <div style={{ height: 1, flex: 1, background: G.border }} />
              {(() => {
                const totalPts = grouped[iter].items.reduce((s, i) => s + (Number(i.points) || 0), 0);
                const isOk = totalPts >= MIN_POINTS && totalPts <= MAX_POINTS;
                const isOver = totalPts > MAX_POINTS;
                const ptColor = totalPts === 0 ? G.subtle : isOk ? "#10b981" : isOver ? "#ef4444" : "#f59e0b";
                return (
                  <span style={{ fontSize: 11, color: ptColor, fontFamily: "'DM Mono', monospace", display: "flex", alignItems: "center", gap: 6 }}>
                    {totalPts} pts
                    <button
                      onClick={() => setPointsResult({ iter, points: totalPts })}
                      title="Check iteration points"
                      style={{
                        fontSize: 11, padding: "3px 10px", borderRadius: 20, cursor: "pointer",
                        border: `1px solid ${ptColor}`,
                        background: "transparent", color: ptColor,
                        fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
                        transition: "background 0.15s",
                      }}
                    >Check points</button>
                    <button
                      onClick={() => exportIterationToExcel(iter, grouped[iter])}
                      title="Download iteration as Excel"
                      style={{
                        fontSize: 11, padding: "3px 10px", borderRadius: 20, cursor: "pointer",
                        border: "1px solid rgba(99,102,241,0.4)",
                        background: "transparent", color: "#a5b4fc",
                        fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
                        display: "inline-flex", alignItems: "center", gap: 4,
                        transition: "background 0.15s, border-color 0.15s",
                      }}
                    >⬇ Excel</button>
                  </span>
                );
              })()}
              <span style={{ fontSize: 11, color: G.subtle, fontFamily: "'DM Mono', monospace" }}>
                {grouped[iter].items.length} item{grouped[iter].items.length !== 1 ? "s" : ""}
              </span>
            </div>

            {grouped[iter].items.map((item, ii) => (
              <div key={item._key} className="item-row" style={{
                background: G.card, border: `1px solid ${G.border}`,
                borderRadius: 14, padding: "14px 16px", marginBottom: 8,
                display: "flex", alignItems: "flex-start", gap: 14,
              }}>
                <span style={{
                  width: 7, height: 7, borderRadius: "50%", flexShrink: 0, marginTop: 6,
                  background: STATUS_CFG[item.status]?.dot || G.subtle,
                }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap", marginBottom: 5 }}>
                    {item.id && (
                      <span style={{ fontSize: 11, color: G.subtle, fontFamily: "'DM Mono', monospace", flexShrink: 0 }}>{item.id}</span>
                    )}
                    <span style={{ fontSize: 14, color: G.text, fontWeight: 500, wordBreak: "break-word" }}>{item.title}</span>
                  </div>
                  {item.description && (
                    <div style={{ fontSize: 12, color: G.muted, marginBottom: 8, lineHeight: 1.6 }}>{item.description}</div>
                  )}
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                    <Badge label={item.type} cfg={TYPE_CFG[item.type] || { bg: "rgba(255,255,255,0.05)", color: G.muted, border: G.border }} />
                    <Badge label={item.status} cfg={STATUS_CFG[item.status] || { bg: "rgba(255,255,255,0.05)", color: G.muted, border: G.border }} />
                    {item.points != null && (
                      <span style={{
                        fontSize: 11, padding: "3px 9px", borderRadius: 20,
                        background: "rgba(124,111,247,0.1)", color: "#a5b4fc",
                        border: "1px solid rgba(124,111,247,0.25)",
                        fontFamily: "'DM Mono', monospace", fontWeight: 500,
                      }}>{item.points} pt{item.points !== 1 ? "s" : ""}</span>
                    )}
                    {item.createdDate && (
                      <span style={{ fontSize: 11, color: G.subtle, fontFamily: "'DM Mono', monospace", marginLeft: 2 }}>{item.createdDate}</span>
                    )}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 2, flexShrink: 0 }}>
                  <button className="icon-btn" onClick={() => setEditItem(item)} title="Edit" style={{
                    background: "none", border: "none", cursor: "pointer",
                    color: G.subtle, padding: "5px 7px", borderRadius: 8, fontSize: 14, transition: "color 0.15s, background 0.15s",
                  }}>✏️</button>
                  <button className="icon-btn" onClick={() => deleteItem(item._key)} title="Delete" style={{
                    background: "none", border: "none", cursor: "pointer",
                    color: G.subtle, padding: "5px 7px", borderRadius: 8, fontSize: 14, transition: "color 0.15s, background 0.15s",
                  }}>🗑</button>
                </div>
              </div>
            ))}
          </div>
        ))}

        {showAdd && (
          <Modal title="New work item" onClose={() => setShowAdd(false)}>
            <ItemForm iterations={iterations} onSave={addItem} onClose={() => setShowAdd(false)} />
          </Modal>
        )}
        {editItem && (
          <Modal title="Edit work item" onClose={() => setEditItem(null)}>
            <ItemForm initial={editItem} iterations={iterations} onSave={updateItem} onClose={() => setEditItem(null)} />
          </Modal>
        )}
        {pointsResult && (
          <PointsResultModal
            iter={pointsResult.iter}
            points={pointsResult.points}
            onClose={() => setPointsResult(null)}
          />
        )}
      </div>
    </>
  );
}
