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

export const IconFileText = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
    <path d="M14 3v5h5" />
    <path d="M9 13h6M9 17h6" />
  </svg>
);

export const IconRocket = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 19 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-1 2z" />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
  </svg>
);

export const IconBookOpen = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 5c2-1 5-1 7 0v14c-2-1-5-1-7 0z" />
    <path d="M22 5c-2-1-5-1-7 0v14c2-1 5-1 7 0z" />
  </svg>
);

export const IconPalette = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3a9 9 0 1 0 0 18c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.3-.3-.4-.5-.8-.5-1.2 0-.9.7-1.5 1.5-1.5H16a4 4 0 0 0 4-4c0-4.4-3.6-8-8-8z" />
    <circle cx="7.5" cy="10.5" r="1.2" fill="currentColor" stroke="none" />
    <circle cx="10.5" cy="7" r="1.2" fill="currentColor" stroke="none" />
    <circle cx="15" cy="7.5" r="1.2" fill="currentColor" stroke="none" />
  </svg>
);

export const IconWhatsapp = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.02 2C6.5 2 2.03 6.47 2.03 12c0 1.83.48 3.53 1.33 5.02L2 22l5.12-1.34A9.94 9.94 0 0 0 12.02 22C17.55 22 22 17.53 22 12S17.55 2 12.02 2zm0 18.1c-1.63 0-3.14-.46-4.43-1.24l-.32-.19-3.04.8.81-2.96-.21-.31A8.07 8.07 0 0 1 3.93 12c0-4.47 3.63-8.1 8.09-8.1S20.1 7.53 20.1 12s-3.62 8.1-8.08 8.1zm4.44-6.05c-.24-.12-1.44-.71-1.66-.79-.22-.08-.39-.12-.55.12-.16.24-.63.79-.78.95-.14.16-.29.18-.53.06-.24-.12-1.02-.38-1.94-1.21-.72-.64-1.2-1.43-1.35-1.67-.14-.24-.02-.37.11-.49.11-.11.24-.29.36-.43.12-.14.16-.24.24-.4.08-.16.04-.31-.02-.43-.06-.12-.55-1.34-.76-1.83-.2-.48-.4-.42-.55-.42-.14 0-.31-.02-.47-.02-.16 0-.43.06-.65.31-.22.24-.86.84-.86 2.05s.88 2.38 1 2.54c.12.16 1.73 2.65 4.2 3.71.59.25 1.05.4 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.44-.59 1.64-1.15.2-.57.2-1.05.14-1.15-.06-.1-.22-.16-.46-.28z"/>
  </svg>
);

export const IconFacebook = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M13.5 22v-8.4h2.8l.4-3.3h-3.2V8.1c0-.95.26-1.6 1.63-1.6H17V3.5c-.3-.04-1.28-.13-2.44-.13-2.42 0-4.06 1.47-4.06 4.17v2.33H7.7v3.3h2.8V22h3z"/>
  </svg>
);

export const IconXSocial = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.9 2H22l-7.6 8.7L23.3 22h-7.1l-5.5-7.2L4.3 22H1.2l8.2-9.3L1 2h7.3l5 6.6L18.9 2zm-1.25 18h1.96L7.44 4H5.34l12.3 16z"/>
  </svg>
);

export const IconPlus = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);