import React, { useEffect, useState, useMemo } from "react";
import { useClient } from "sanity";
import { apiVersion } from "../env";

export function viewsDashboardWidget() {
  return {
    name: "views-dashboard",
    component: ViewsDashboard,
    layout: { width: "full" },
  };
}

function ViewsDashboard() {
  const client = useClient({ apiVersion });
  
  const [models, setModels] = useState([]);
  const [sortField, setSortField] = useState("viewsAll");
  const [sortDir, setSortDir] = useState("desc");

  useEffect(() => {
    async function load() {
      const data = await client.fetch(`
        *[_type == "model"]{
          _id,
          name,
          slug,
          viewsAll,
          viewsHuman
        } | order(viewsAll desc)
      `);
      setModels(data);
    }
    load();
  }, []);

  // Funkcja sortująca
  const sorted = useMemo(() => {
    return [...models].sort((a, b) => {
      const A = a[sortField] ?? 0;
      const B = b[sortField] ?? 0;

      if (A < B) return sortDir === "asc" ? -1 : 1;
      if (A > B) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [models, sortField, sortDir]);

  // Kliknięcie w nagłówek kolumny
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const arrow = (field) =>
    sortField === field ? (sortDir === "asc" ? "▲" : "▼") : "";

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Statystyki odsłon modeli</h2>

      <table
        style={{ width: "100%", marginTop: "1rem", borderCollapse: "collapse" }}
      >
        <thead>
          <tr>
            <th style={th} onClick={() => handleSort("name")}>
              Model {arrow("name")}
            </th>
            <th style={th} onClick={() => handleSort("slug")}>
              Slug {arrow("slug")}
            </th>
            <th style={th} onClick={() => handleSort("viewsAll")}>
              Wszystkie wejścia {arrow("viewsAll")}
            </th>
            <th style={th} onClick={() => handleSort("viewsHuman")}>
              Wejścia (bez botów) {arrow("viewsHuman")}
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((m) => (
            <tr key={m._id}>
              <td style={td}>{m.name}</td>
              <td style={td}>{m.slug?.current}</td>
              <td style={td}>{m.viewsAll ?? 0}</td>
              <td style={td}>{m.viewsHuman ?? 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const th = {
  borderBottom: "1px solid #ccc",
  padding: "8px",
  textAlign: "left",
};

const td = {
  borderBottom: "1px solid #eee",
  padding: "8px",
};
