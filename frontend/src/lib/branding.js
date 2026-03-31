export const BOOKY_THEME_LOGOS = {
  light: "/booky-logo-light.png",
  dark: "/booky-logo-dark.png",
};

export function getThemeLogo(isDark) {
  return isDark ? BOOKY_THEME_LOGOS.dark : BOOKY_THEME_LOGOS.light;
}
