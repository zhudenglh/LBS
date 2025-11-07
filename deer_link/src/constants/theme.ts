// Theme Constants

export const colors = {
  primary: '#0285f0',
  secondary: '#FF5722',
  accent: '#FFD700',
  background: '#f6f8f7',
  backgroundGradientStart: '#0285f0',
  backgroundGradientEnd: '#f6f8f7',
  white: '#FFFFFF',
  black: '#000000',
  border: '#E0E0E0',

  // Local Tab - 黄色主题（精确Figma颜色）
  localYellow: '#f9de47',           // 黄色主色 (一键直连按钮、到站提醒按钮、渐变背景)
  localGradientEnd: '#f6f8f7',      // 渐变结束色

  // Figma精确文本颜色
  text: {
    primary: '#333333',
    secondary: '#666666',
    disabled: '#999999',
    placeholder: '#CCCCCC',
    figmaText1: '#1c1e21',          // Figma --text1 (WiFi标题、按钮文字)
    figmaText2: '#3a3c43',          // Figma --text2 (快捷操作标签)
    figmaText5: '#878c99',          // Figma --text5 ("附近有33个...")
    merchantTitle: '#333333',        // 商户标题 (--文本2)
    merchantSales: '#878c99',        // 销量文字
    busDirection: '#73705e',         // 公交方向文本
    searchPlaceholder: '#1a1b16',    // 搜索框文字
    busTitle: '#222222',             // 公交路线标题
  },

  // 价格和标签颜色（精确Figma）
  price: {
    current: '#ee6757',              // 当前价格红色
    original: '#878c99',             // 划线价灰色
    discount: '#ff3b30',             // 折扣标签红色 (--警示)
  },

  badge: {
    orange: '#ff6600',               // 团购标签橙色
    darkBg: 'rgba(0,0,0,0.4)',      // 距离标签半透明黑
  },

  // 其他精确颜色
  infoPanelBg: '#f4f6fa',           // 公交信息面板背景
  divider: '#e0e1e6',               // 分隔线颜色

  status: {
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    info: '#2196F3',
  },

  card: {
    background: '#FFFFFF',
    shadow: '#00000020',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const fontSize = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 20,
  xxxl: 24,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 999,
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
};
