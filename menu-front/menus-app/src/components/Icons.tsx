import React from "react";

type Props = {
  size?: number;
  filled?: boolean;
};

const base = (size = 18) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});


export const IconX = ({ size = 18 }) => (
  <svg {...base(size)}>
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

export const IconLink = ({ size = 18 }) => (
  <svg {...base(size)}>
    <path d="M10 13a5 5 0 0 1 0-7l1-1a5 5 0 0 1 7 7l-1 1"/>
    <path d="M14 11a5 5 0 0 1 0 7l-1 1a5 5 0 0 1-7-7l1-1"/>
  </svg>
);

export const IconMusic = ({ size = 18 }) => (
  <svg {...base(size)}>
    <path d="M9 18V5l10-2v13"/>
    <circle cx="6" cy="18" r="3"/>
    <circle cx="19" cy="16" r="3"/>
  </svg>
);

export const IconMessageCircle = ({ size = 18 }) => (
  <svg {...base(size)}>
    <path d="M21 11.5a8.5 8.5 0 1 1-4.5-7.5"/>
    <path d="M22 2l-9 9"/>
    <path d="M22 2l-6 18-3-8-8-3z"/>
  </svg>
);

export const IconMenuList = ({ size }: Props) => (
  <svg {...base(size)}>
    <line x1="4" y1="6" x2="20" y2="6" />
    <line x1="4" y1="12" x2="20" y2="12" />
    <line x1="4" y1="18" x2="20" y2="18" />
  </svg>
);

export const IconEdit = ({ size }: Props) => (
  <svg {...base(size)}>
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
  </svg>
);

export const IconImage = ({ size }: Props) => (
  <svg {...base(size)}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <path d="M21 15l-5-5L5 21" />
  </svg>
);

export const IconTrash = ({ size }: Props) => (
  <svg {...base(size)}>
    <polyline points="3 6 5 6 21 6"/>
    <path d="M8 6V4h8v2"/>
    <path d="M19 6l-1 14H6L5 6"/>
    <line x1="10" y1="11" x2="10" y2="17"/>
    <line x1="14" y1="11" x2="14" y2="17"/>
  </svg>
);

export const IconChart = ({ size }: Props) => (
  <svg {...base(size)}>
    <line x1="6" y1="20" x2="6" y2="10"/>
    <line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="18" y1="20" x2="18" y2="14"/>
  </svg>
);

export const IconBuilding = ({ size }: Props) => (
  <svg {...base(size)}>
    <rect x="4" y="3" width="16" height="18"/>
    <line x1="8" y1="7" x2="8" y2="7"/>
    <line x1="12" y1="7" x2="12" y2="7"/>
    <line x1="16" y1="7" x2="16" y2="7"/>
    <line x1="8" y1="11" x2="8" y2="11"/>
    <line x1="12" y1="11" x2="12" y2="11"/>
    <line x1="16" y1="11" x2="16" y2="11"/>
    <path d="M10 21v-4h4v4"/>
  </svg>
);

export const IconCard = ({ size }: Props) => (
  <svg {...base(size)}>
    <rect x="2" y="5" width="20" height="14" rx="2"/>
    <line x1="2" y1="10" x2="22" y2="10"/>
  </svg>
);

export const IconSettings = ({ size }: Props) => (
  <svg {...base(size)}>
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.2a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.2a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9A1.6 1.6 0 0 0 10 3.2V3a2 2 0 1 1 4 0v.2a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9c0 .7.4 1.3 1.1 1.5H21a2 2 0 1 1 0 4h-.2a1.6 1.6 0 0 0-1.4.5z"/>
  </svg>
);

export const IconLogout = ({ size }: Props) => (
  <svg {...base(size)}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

export const IconGlobe = ({ size }: Props) => (
  <svg {...base(size)}>
    <circle cx="12" cy="12" r="10"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15 15 0 0 1 0 20"/>
    <path d="M12 2a15 15 0 0 0 0 20"/>
  </svg>
);

export const IconBulb = ({ size }: Props) => (
  <svg {...base(size)}>
    <path d="M9 18h6"/>
    <path d="M10 22h4"/>
    <path d="M12 2a7 7 0 0 0-4 13c.6.6 1 1.5 1 2h6c0-.5.4-1.4 1-2A7 7 0 0 0 12 2z"/>
  </svg>
);

export const IconArrowRight = ({ size }: Props) => (
  <svg {...base(size)}>
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
);

export const IconArrowLeft = ({ size }: Props) => (
  <svg {...base(size)}>
    <line x1="19" y1="12" x2="5" y2="12"/>
    <polyline points="12 5 5 12 12 19"/>
  </svg>
);

export const IconEye = ({ size }: Props) => (
  <svg {...base(size)}>
    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

export const IconSearch = ({ size }: Props) => (
  <svg {...base(size)}>
    <circle cx="11" cy="11" r="7"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

export const IconRefresh = ({ size }: Props) => (
  <svg {...base(size)}>
    <polyline points="23 4 23 10 17 10"/>
    <polyline points="1 20 1 14 7 14"/>
    <path d="M3.5 9A9 9 0 0 1 21 10"/>
    <path d="M20.5 15A9 9 0 0 1 3 14"/>
  </svg>
);

export const IconSave = ({ size }: Props) => (
  <svg {...base(size)}>
    <path d="M19 21H5V3h11l3 3z"/>
    <polyline points="17 21 17 13 7 13 7 21"/>
    <polyline points="7 3 7 8 15 8"/>
  </svg>
);

export const IconCheck = ({ size }: Props) => (
  <svg {...base(size)}>
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

export const IconLock = ({ size }: Props) => (
  <svg {...base(size)}>
    <rect x="5" y="11" width="14" height="10" rx="2"/>
    <path d="M8 11V8a4 4 0 0 1 8 0v3"/>
  </svg>
);

export const IconUser = ({ size }: Props) => (
  <svg {...base(size)}>
    <circle cx="12" cy="8" r="4"/>
    <path d="M4 20c2-4 14-4 16 0"/>
  </svg>
);

export const IconCamera = ({ size }: Props) => (
  <svg {...base(size)}>
    <path d="M23 19V7a2 2 0 0 0-2-2h-4l-2-2H9L7 5H3a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2z"/>
    <circle cx="12" cy="13" r="4"/>
  </svg>
);

export const IconPhone = ({ size }: Props) => (
  <svg {...base(size)}>
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7l.5 3a2 2 0 0 1-.6 1.8l-1.3 1.3a16 16 0 0 0 6.4 6.4l1.3-1.3a2 2 0 0 1 1.8-.6l3 .5a2 2 0 0 1 1.8 2z"/>
  </svg>
);

export const IconMapPin = ({ size }: Props) => (
  <svg {...base(size)}>
    <path d="M12 22s7-6 7-12a7 7 0 1 0-14 0c0 6 7 12 7 12z"/>
    <circle cx="12" cy="10" r="2"/>
  </svg>
);

export const IconClock = ({ size }: Props) => (
  <svg {...base(size)}>
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

export const IconAlert = ({ size }: Props) => (
  <svg {...base(size)}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="13" />
    <circle cx="12" cy="17" r="1" fill="currentColor" stroke="none" />
  </svg>
);

export const IconClipboard = ({ size }: Props) => (
  <svg {...base(size)}>
    <rect x="8" y="3" width="8" height="4" rx="1" />
    <path d="M9 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3" />
    <path d="M9 12h6" />
    <path d="M9 16h4" />
  </svg>
);

export const IconPackage = ({ size }: Props) => (
  <svg {...base(size)}>
    <path d="M21 8.5L12 13 3 8.5" />
    <path d="M21 16V8l-9-5-9 5v8l9 5 9-5z" />
    <path d="M12 13v8" />
  </svg>
);

export const IconStar = ({ size, filled }: Props) => (
  <svg
    width={size || 18}
    height={size || 18}
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="12 2 15.1 8.6 22 9.3 17 14.1 18.3 21 12 17.5 5.7 21 7 14.1 2 9.3 8.9 8.6 12 2" />
  </svg>
);

export const IconHeart = ({ size, filled }: Props) => (
  <svg
    width={size || 18}
    height={size || 18}
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M12 21s-7-4.4-9.5-8A5.5 5.5 0 0 1 12 5a5.5 5.5 0 0 1 9.5 8C19 16.6 12 21 12 21z"/>
  </svg>


);


export const IconRestaurante = ({ size = 36 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="8" />
    <circle cx="12" cy="12" r="3.2" />
    <path d="M3 3l3.5 3.5M21 3l-3.5 3.5" />
  </svg>
);

export const IconCafeteria = ({ size = 36 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 8h13v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V8z" />
    <path d="M17 9h1.5a2.5 2.5 0 0 1 0 5H17" />
    <path d="M8 3.5c-.6.7-.6 1.3 0 2M12 3.5c-.6.7-.6 1.3 0 2" />
  </svg>
);

export const IconPostres = ({ size = 36 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 10h12l-1.2 9.5a1.5 1.5 0 0 1-1.5 1.3H8.7a1.5 1.5 0 0 1-1.5-1.3L6 10z" />
    <path d="M7 10c0-3 2-5.5 5-5.5S17 7 17 10" />
    <path d="M12 4.5V2" />
  </svg>
);

export const IconItaliano = ({ size = 36 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4l7 7M11 4l7 7" />
    <path d="M4 4c0 5 3 8 7 8s7-3 7-8" />
    <path d="M12 12v8" />
    <path d="M9 20h6" />
  </svg>
);

export const IconModernoCat = ({ size = 36 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="4" width="16" height="16" rx="3" />
    <path d="M4 15h16" />
    <path d="M9 4v11" />
  </svg>
);

export const IconMexicano = ({ size = 36 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12c0-4 4-7 9-7s9 3 9 7" />
    <path d="M4.5 12c1.5 3 4 5.5 7.5 5.5s6-2.5 7.5-5.5" />
    <path d="M8 12v2M12 12v3M16 12v2" />
  </svg>
);

export const IconJapones = ({ size = 36 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="12" cy="15" rx="9" ry="4" />
    <path d="M4.5 15c0-4.5 2-9 7.5-9s7.5 4.5 7.5 9" />
    <circle cx="12" cy="11" r="1.3" fill="currentColor" stroke="none" />
  </svg>
);

export const IconVegano = ({ size = 36 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 19c-1-7 2-13 14-14-1 12-7 15-14 14z" />
    <path d="M6 18c3-4 6-7 12-11" />
  </svg>
);

const ICONO_POR_CATEGORIA: Record<string, (props: { size?: number }) => React.ReactElement> = {
  "Restaurante": IconRestaurante,
  "Cafetería": IconCafeteria,
  "Postres": IconPostres,
  "Italiano": IconItaliano,
  "Moderno": IconModernoCat,
  "Mexicano": IconMexicano,
  "Japonés": IconJapones,
  "Vegano": IconVegano,
};

export const IconoPlantilla = ({ categoria, size = 36 }: { categoria: string; size?: number }) => {
  const Icono = ICONO_POR_CATEGORIA[categoria] || IconRestaurante;
  return <Icono size={size} />;
};