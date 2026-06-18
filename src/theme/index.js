// Centralizar as cores e estilos aqui é uma boa prática:
// facilita mudar o visual do app inteiro em um único lugar

export const colors = {
  // Paleta principal — tema escuro inspirado em sala de cinema
  bg: "#0a0a0f",          // preto quase puro — fundo principal
  surface: "#141420",     // cinza muito escuro — cards e modais
  surfaceAlt: "#1e1e2e",  // um tom mais claro — inputs e bordas
  border: "#2a2a3e",      // borda sutil

  // Acento principal: dourado "oscar" — remete a troféus e estrelas de avaliação
  primary: "#f5c518",     // amarelo IMDb — reconhecível e cinematográfico
  primaryDark: "#d4a017", // versão mais escura pra estados pressed

  // Cores semânticas
  success: "#4ade80",     // verde — assistido
  error: "#f87171",       // vermelho — erros e deletar
  warning: "#fb923c",     // laranja

  // Texto
  textPrimary: "#f0f0f5",   // quase branco — títulos e destaque
  textSecondary: "#8888aa", // cinza médio — legendas e metadados
  textMuted: "#55556a",     // cinza escuro — placeholder e desabilitado

  // Gradiente de fundo do header
  gradientTop: "#0a0a0f",
  gradientBottom: "#141420",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};

export const typography = {
  // Tamanhos de fonte
  xs: 11,
  sm: 13,
  base: 15,
  md: 17,
  lg: 20,
  xl: 24,
  xxl: 30,
  xxxl: 36,

  // Pesos — React Native aceita string ou número
  regular: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
  extrabold: "800",
};

// Sombra padrão dos cards — vai bem no dark theme
export const shadow = {
  shadowColor: colors.primary,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 8,
  elevation: 4,
};
