"use client";
import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL;

type DescargasData = {
  plan: string;
  descargasRealizadas: number;
  limiteDescargas: number | null;
  descargasRestantes: number | null;
};

// HU-99 / CA-03: muestra las descargas utilizadas y restantes del usuario.
export default function DescargasInfo({ refreshKey }: { refreshKey?: number }) {
  const [data, setData] = useState<DescargasData | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setCargando(false);
      return;
    }
    setCargando(true);
    fetch(`${API}/api/descargas`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((res) => {
        if (res.ok) setData(res);
      })
      .catch(() => {})
      .finally(() => setCargando(false));
  }, [refreshKey]);

  if (cargando) {
    return <div style={{ color: "#666", fontSize: 12 }}>Cargando descargas...</div>;
  }
  if (!data) return null;

  const ilimitado = data.limiteDescargas === null;

  return (
    <div>
      <div style={{ color: "white", fontSize: 24, fontWeight: 700 }}>
        {ilimitado ? "∞" : `${data.descargasRealizadas} / ${data.limiteDescargas}`}
      </div>
      <div style={{ color: "#666", fontSize: 12, marginTop: 4 }}>
        {ilimitado ? "Descargas ilimitadas" : `Descargas usadas · ${data.descargasRestantes} restantes`}
      </div>
    </div>
  );
}