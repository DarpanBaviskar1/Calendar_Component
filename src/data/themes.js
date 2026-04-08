/**
 * Month Themes — Dynamic color system that shifts based on the current displayed month.
 *
 * Each theme provides:
 * - bg: 3-stop gradient for the hero section
 * - accent: Primary UI accent (light mode)
 * - accentDark: Adjusted accent for dark mode contrast
 * - imageAccent: Color derived from the hero image's dominant palette,
 *   used as the dynamic accent for all interactive elements.
 *   This creates the "image-based theming" effect.
 */
export const MONTH_THEMES = [
  { name: "January",   bg: ["#0F2027","#203A43","#2C5364"], accent: "#4FC3F7", accentDark: "#0288D1", imageAccent: "#2C5364" },
  { name: "February",  bg: ["#2d1b69","#6B2FA0","#C2185B"], accent: "#F48FB1", accentDark: "#AD1457", imageAccent: "#9C27B0" },
  { name: "March",     bg: ["#004D40","#00796B","#1B5E20"], accent: "#80CBC4", accentDark: "#00695C", imageAccent: "#00796B" },
  { name: "April",     bg: ["#1A237E","#1565C0","#0277BD"], accent: "#81D4FA", accentDark: "#0277BD", imageAccent: "#1565C0" },
  { name: "May",       bg: ["#1B5E20","#388E3C","#558B2F"], accent: "#C5E1A5", accentDark: "#33691E", imageAccent: "#388E3C" },
  { name: "June",      bg: ["#E65100","#F57C00","#EF6C00"], accent: "#FFE082", accentDark: "#E65100", imageAccent: "#F57C00" },
  { name: "July",      bg: ["#B71C1C","#C62828","#D32F2F"], accent: "#FFCDD2", accentDark: "#B71C1C", imageAccent: "#C62828" },
  { name: "August",    bg: ["#4A148C","#6A1B9A","#7B1FA2"], accent: "#E1BEE7", accentDark: "#6A1B9A", imageAccent: "#7B1FA2" },
  { name: "September", bg: ["#3E2723","#4E342E","#5D4037"], accent: "#FFCC80", accentDark: "#4E342E", imageAccent: "#6D4C41" },
  { name: "October",   bg: ["#E65100","#BF360C","#37474F"], accent: "#FFAB40", accentDark: "#BF360C", imageAccent: "#BF360C" },
  { name: "November",  bg: ["#1A237E","#283593","#37474F"], accent: "#90CAF9", accentDark: "#1A237E", imageAccent: "#283593" },
  { name: "December",  bg: ["#01579B","#0277BD","#263238"], accent: "#B3E5FC", accentDark: "#01579B", imageAccent: "#0277BD" },
];

/**
 * Hero images — Unsplash-sourced seasonal/month-appropriate images.
 * These cycle based on month to give the calendar a fresh editorial feel.
 * The imageAccent field in MONTH_THEMES is derived from each image's dominant color.
 */
export const MONTH_IMAGES = [
  "https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=800&h=400&fit=crop",
  "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&h=400&fit=crop",
  "https://images.unsplash.com/photo-1462275646964-a0e3c11f18a6?w=800&h=400&fit=crop",
  "https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=800&h=400&fit=crop",
  "https://images.unsplash.com/photo-1462275646964-a0e3c11f18a6?w=800&h=400&fit=crop",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=400&fit=crop",
  "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800&h=400&fit=crop",
  "https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=800&h=400&fit=crop",
  "https://images.unsplash.com/photo-1505765050516-f72dcac9c60e?w=800&h=400&fit=crop",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop",
  "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800&h=400&fit=crop",
  "https://images.unsplash.com/photo-1482442120256-9c03866de390?w=800&h=400&fit=crop",
];
