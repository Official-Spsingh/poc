/**
 * SINGLE SOURCE OF TRUTH: THEME REGISTRY
 * 
 * This file contains all visual tokens, color palettes, and theme definitions 
 * for the Lumenore Studio platform. 
 */

// ==========================================
// 1. CORE COMPONENT INTERFACES
// ==========================================

export interface HeroColors {
  badge: string;
  gradient: string;
  shadow: string;
  button: string;
  secondaryHover: string;
  iconColor: string;
}

export interface HeaderColors {
  iconBg: string;
  primaryBtn: string;
}

export interface PageWrapperColors {
  blurs: string[];
}

export interface CardColors {
  border: string;
  shadow: string;
  accent: string;
  iconBg: string;
  iconText: string;
  titleHover: string;
  chevronBg: string;
  chevronText: string;
  menuHover: string;
  statusBg: string;
  statusText: string;
}

export interface TableColors {
  hoverBg: string;
  menuHover: string;
}

export interface ToolbarColors {
  focusRing: string;
  activeText: string;
  bgLight: string;
}

export interface EmptyStateColors {
  glow: string;
  iconBg: string;
  button: string;
  secondaryText: string;
  secondaryBg: string;
}

export interface TipsSectionColors {
  iconBg: string;
  iconText: string;
}

export interface StatusBadgeColors {
  active: string;
  training?: string;
  idle?: string;
  published?: string;
  draft?: string;
  error?: string;
}

export interface ModalColors {
  headerBg: string;
  headerText: string;
  iconBg: string;
  primaryBtn: string;
  secondaryBtn: string;
}

export interface LineageColors {
  mainIconBg: string;
  mainIconText: string;
  cardBorder: string;
  cardHoverBg: string;
  badgeBg: string;
}

export interface BuilderHeaderColors {
  bg: string;
  border: string;
  buttonActive: string;
  buttonInactive: string;
  iconActive: string;
  iconInactive: string;
  primaryBtn: string;
  actionMenuHover: string;
  actionMenuIcon: string;
  lockActive: string;
}

export interface BuilderNodeColors {
  selectedBorder: string;
  selectedRing: string;
  errorBorder: string;
  errorRing: string;
  handleHover: string;
  hoverBorder: string;
}

export interface BuilderRunPanelColors {
  bg: string;
  border: string;
  headerIconBg: string;
  headerIconText: string;
  tabActive: string;
  tabInactive: string;
  tabActiveText: string;
  successBadge: string;
}

export interface BuilderDrawerColors {
  bg: string;
  headerBg: string;
  border: string;
  inputFocus: string;
  itemHoverBorder: string;
  itemHoverText: string;
}

// ==========================================
// 2. MODULE THEME INTERFACES
// ==========================================

export interface WorkflowBuilderColors {
  header: BuilderHeaderColors;
  nodes: BuilderNodeColors;
  runPanel: BuilderRunPanelColors;
  drawers: BuilderDrawerColors;
  canvas: { bg: string; grid: string };
}

export interface HomepageColors {
  hero: HeroColors;
  header: HeaderColors;
  pageWrapper: PageWrapperColors;
  card: CardColors;
  table: TableColors;
  toolbar: ToolbarColors;
  emptyState: EmptyStateColors;
  tipsSection: TipsSectionColors;
  statusBadges: StatusBadgeColors;
  modal: ModalColors;
  lineage: LineageColors;
  layoutBorder: string;
  sidebarHoverIcon: string;
}

export interface CombinedTheme {
  homepage: HomepageColors;
  builder: WorkflowBuilderColors;
}

export interface DataColors {
  layoutBorder: string;
  card: {
    border: string;
    shadow: string;
    accent: string;
    statusText: string;
    iconBg: string;
    iconText: string;
    chevronBg: string;
    chevronText: string;
    menuHover: string;
    titleHover: string;
  };
  toolbar: {
    focusRing: string;
    bgLight: string;
  };
  header: {
    primaryBtn: string;
  };
  statusBadges: {
    active: string;
    draft: string;
  };
  hero: {
    secondaryHover: string;
    button: string;
  };
  pageWrapper: {
    blurs: string[];
  };
  sidebarHoverIcon: string;
}

export interface GlobalTheme {
  auth: {
    bg: string;
    cardBg: string;
    primaryBtn: string;
    primaryBtnHover: string;
    shadow: string;
    textPrimary: string;
    textSecondary: string;
    inputBg: string;
    inputBorder: string;
    focusRing: string;
    errorBg: string;
    errorText: string;
    accentGradient: string;
    accentText: string;
    link: string;
    linkHover: string;
    badgeBg: string;
    badgeText: string;
    badgeBorder: string;
    glow: string;
    selection: string;
    activeBorder: string;
    activeBg: string;
    activeIcon: string;
    activeIconBg: string;
  };
  sidebar: {
    bg: string;
    border: string;
    activeBg: string;
    activeText: string;
    activeShadow: string;
    hoverBg: string;
    textDefault: string;
  };
  brand: {
    logoBg: string;
    logoText: string;
    logoSecondary: string;
  };
}

export interface DashboardTheme {
  page: {
    bg: string;
    blurs: string[];
  };
  header: {
    title: string;
    subtext: string;
  };
  toolCard: {
    bg: string;
    border: string;
    shadow: string;
    tagBadge: string;
    link: string;
  };
  recentActivity: {
    title: string;
    viewAll: string;
    icon: string;
    card: {
      bg: string;
      border: string;
      shadow: string;
    };
  };
  promoCard: {
    bg: string;
    title: string;
    subtext: string;
    button: string;
    buttonHover: string;
    glow: string;
    iconGlow: string;
  };
  usage: {
    title: string;
    label: string;
    value: string;
    barContainer: string;
  };
  modules: {
    workflow: HomepageColors;
    apps: HomepageColors;
    agents: HomepageColors;
    data: DataColors;
    vibecoding: HomepageColors;
  };
  aiBot: {
    buttonBg: string;
    buttonShadow: string;
    icon: string;
    themeColorName: string;
  };
}

/**
 * ROOT REGISTRY INTERFACE
 */
export interface StudioTheme {
  workflow: {
    homepage: HomepageColors;
    builder: WorkflowBuilderColors;
  };
  apps: {
    homepage: HomepageColors;
  };
  agents: {
    homepage: HomepageColors;
  };
  vibecoding: {
    homepage: HomepageColors;
  };
  data: {
    homepage: DataColors;
  };
  dashboard: {
    homepage: DashboardTheme;
  };
  global: GlobalTheme;
}

// ==========================================
// 3. THEME GENERATORS (IMPLEMENTATION)
// ==========================================

// --- Shared Homepage Generators ---

const generateTealColors = (): HomepageColors => ({
  hero: {
    badge: 'bg-teal-50 text-teal-600',
    gradient: 'from-teal-700 to-emerald-700',
    shadow: 'shadow-teal-50/5',
    button: 'bg-teal-600 hover:bg-teal-700 shadow-teal-200/50',
    secondaryHover: 'hover:text-teal-700 hover:bg-teal-50',
    iconColor: 'text-teal-500'
  },
  header: {
    iconBg: 'bg-slate-50 text-teal-600 border-slate-100',
    primaryBtn: 'bg-teal-600 text-white shadow-teal-100 hover:bg-teal-700',
  },
  pageWrapper: {
    blurs: ['bg-teal-400/10', 'bg-emerald-400/10', 'bg-teal-400/5']
  },
  card: {
    border: 'hover:border-teal-400',
    shadow: 'hover:shadow-teal-100/30',
    accent: 'from-teal-400 to-teal-400',
    iconBg: 'group-hover:bg-teal-50',
    iconText: 'group-hover:text-teal-600',
    titleHover: 'group-hover:text-teal-700',
    chevronBg: 'group-hover:bg-teal-50',
    chevronText: 'group-hover:text-teal-600',
    menuHover: 'hover:bg-teal-50 hover:text-teal-700',
    statusBg: 'bg-teal-50',
    statusText: 'text-teal-700'
  },
  table: {
    hoverBg: 'hover:bg-teal-50/30',
    menuHover: 'hover:bg-teal-50 hover:text-teal-700',
  },
  toolbar: {
    focusRing: 'focus:ring-teal-100 focus:border-teal-400',
    activeText: 'text-teal-600',
    bgLight: 'bg-teal-50'
  },
  emptyState: {
    glow: 'bg-teal-400',
    iconBg: 'bg-teal-50 text-teal-600',
    button: 'bg-teal-600 hover:bg-teal-700 shadow-teal-100',
    secondaryText: 'text-teal-700',
    secondaryBg: 'hover:bg-teal-50'
  },
  tipsSection: { iconBg: 'bg-teal-50', iconText: 'text-teal-600' },
  statusBadges: {
    active: 'bg-teal-50 text-teal-600 border-teal-100',
    published: 'bg-teal-50 text-teal-600 border-teal-100',
    draft: 'bg-slate-50 text-slate-500 border-slate-100',
    error: 'bg-rose-50 text-rose-600 border-rose-100'
  },
  modal: {
    headerBg: 'bg-teal-50',
    headerText: 'text-teal-900',
    iconBg: 'bg-teal-600',
    primaryBtn: 'bg-teal-600 hover:bg-teal-700',
    secondaryBtn: 'hover:bg-teal-50 text-teal-600'
  },
  lineage: {
    mainIconBg: 'bg-teal-600',
    mainIconText: 'text-white',
    cardBorder: 'hover:border-teal-200',
    cardHoverBg: 'hover:bg-teal-50/20',
    badgeBg: 'bg-teal-50 text-teal-600'
  },
  layoutBorder: 'border-slate-100',
  sidebarHoverIcon: 'hover:text-teal-600'
});

const generateSkyColors = (): HomepageColors => ({
  hero: {
    badge: 'bg-sky-50 text-sky-800',
    gradient: 'from-sky-700 to-sky-400',
    shadow: 'shadow-sky-50/10',
    button: 'bg-sky-800 hover:bg-sky-900 shadow-sky-200/50',
    secondaryHover: 'hover:text-sky-800 hover:bg-sky-50',
    iconColor: 'text-sky-800'
  },
  header: {
    iconBg: 'bg-slate-50 text-sky-800 border-slate-100',
    primaryBtn: 'bg-sky-800 text-white shadow-sky-100 hover:bg-sky-900',
  },
  pageWrapper: {
    blurs: ['bg-sky-400/10', 'bg-indigo-400/10', 'bg-blue-400/5']
  },
  card: {
    border: 'hover:border-sky-400',
    shadow: 'hover:shadow-sky-100/30',
    accent: 'from-sky-700 to-sky-700',
    iconBg: 'group-hover:bg-sky-50',
    iconText: 'group-hover:text-sky-800',
    titleHover: 'group-hover:text-sky-800',
    chevronBg: 'group-hover:bg-sky-50',
    chevronText: 'group-hover:text-sky-800',
    menuHover: 'hover:bg-sky-50 hover:text-sky-800',
    statusBg: 'bg-sky-50',
    statusText: 'text-sky-800'
  },
  table: {
    hoverBg: 'hover:bg-sky-50/30',
    menuHover: 'hover:bg-sky-50 hover:text-sky-800',
  },
  toolbar: {
    focusRing: 'focus:ring-sky-100 focus:border-sky-800/40',
    activeText: 'text-sky-800',
    bgLight: 'bg-sky-50'
  },
  emptyState: {
    glow: 'bg-sky-400',
    iconBg: 'bg-sky-50 text-sky-800',
    button: 'bg-sky-800 hover:bg-sky-900 shadow-sky-100',
    secondaryText: 'text-sky-700',
    secondaryBg: 'hover:bg-sky-50'
  },
  tipsSection: { iconBg: 'bg-sky-50', iconText: 'text-sky-700' },
  statusBadges: {
    active: 'bg-sky-50 text-sky-800 border-sky-100',
    published: 'bg-sky-50 text-sky-800 border-sky-100',
    draft: 'bg-slate-50 text-slate-500 border-slate-100',
    error: 'bg-rose-50 text-rose-600 border-rose-100'
  },
  modal: {
    headerBg: 'bg-sky-50',
    headerText: 'text-sky-900',
    iconBg: 'bg-sky-800',
    primaryBtn: 'bg-sky-800 hover:bg-sky-900',
    secondaryBtn: 'hover:bg-sky-50 text-sky-800'
  },
  lineage: {
    mainIconBg: 'bg-sky-800',
    mainIconText: 'text-white',
    cardBorder: 'hover:border-sky-200',
    cardHoverBg: 'hover:bg-sky-50/20',
    badgeBg: 'bg-sky-50 text-sky-800'
  },
  layoutBorder: 'border-sky-100',
  sidebarHoverIcon: 'hover:text-sky-800'
});

const generateBlueColors = (): HomepageColors => ({
  hero: {
    badge: 'bg-blue-50 text-blue-700',
    gradient: 'from-blue-700 to-indigo-600',
    shadow: 'shadow-blue-50/10',
    button: 'bg-blue-700 hover:bg-blue-800 shadow-blue-200/50',
    secondaryHover: 'hover:text-blue-800 hover:bg-blue-50',
    iconColor: 'text-blue-700'
  },
  header: {
    iconBg: 'bg-slate-50 text-blue-700 border-slate-100',
    primaryBtn: 'bg-blue-700 text-white shadow-blue-100 hover:bg-blue-800',
  },
  pageWrapper: {
    blurs: ['bg-blue-400/10', 'bg-sky-400/10', 'bg-blue-400/5']
  },
  card: {
    border: 'hover:border-blue-400',
    shadow: 'hover:shadow-blue-100/30',
    accent: 'from-blue-700 to-blue-700',
    iconBg: 'group-hover:bg-blue-50',
    iconText: 'group-hover:text-blue-800',
    titleHover: 'group-hover:text-blue-800',
    chevronBg: 'group-hover:bg-blue-50',
    chevronText: 'group-hover:text-blue-800',
    menuHover: 'hover:bg-blue-50 hover:text-blue-800',
    statusBg: 'bg-blue-50',
    statusText: 'text-blue-800'
  },
  table: {
    hoverBg: 'hover:bg-blue-50/30',
    menuHover: 'hover:bg-blue-50 hover:text-blue-800',
  },
  toolbar: {
    focusRing: 'focus:ring-blue-100 focus:border-blue-800/40',
    activeText: 'text-blue-800',
    bgLight: 'bg-blue-50'
  },
  emptyState: {
    glow: 'bg-blue-400',
    iconBg: 'bg-blue-50 text-blue-800',
    button: 'bg-blue-700 hover:bg-blue-800 shadow-blue-100',
    secondaryText: 'text-blue-700',
    secondaryBg: 'hover:bg-blue-50'
  },
  tipsSection: { iconBg: 'bg-blue-50', iconText: 'text-blue-700' },
  statusBadges: {
    active: 'bg-blue-50 text-blue-800 border-blue-100',
    published: 'bg-blue-50 text-blue-800 border-blue-100',
    draft: 'bg-slate-50 text-slate-500 border-slate-100',
    error: 'bg-rose-50 text-rose-600 border-rose-100'
  },
  modal: {
    headerBg: 'bg-blue-50',
    headerText: 'text-blue-900',
    iconBg: 'bg-blue-800',
    primaryBtn: 'bg-blue-800 hover:bg-blue-900',
    secondaryBtn: 'hover:bg-blue-50 text-blue-800'
  },
  lineage: {
    mainIconBg: 'bg-blue-800',
    mainIconText: 'text-white',
    cardBorder: 'hover:border-blue-200',
    cardHoverBg: 'hover:bg-blue-50/20',
    badgeBg: 'bg-blue-50 text-blue-800'
  },
  layoutBorder: 'border-blue-100',
  sidebarHoverIcon: 'hover:text-blue-700'
});

const generateVioletColors = (): HomepageColors => ({
  hero: {
    badge: 'bg-violet-50 text-violet-700',
    gradient: 'from-violet-400 to-fuchsia-300',
    shadow: 'shadow-violet-50/5',
    button: 'bg-violet-700 hover:bg-violet-800 shadow-violet-200/50',
    secondaryHover: 'hover:text-violet-700 hover:bg-violet-50',
    iconColor: 'text-violet-500'
  },
  header: {
    iconBg: 'bg-slate-50 text-violet-700 border-slate-100',
    primaryBtn: 'bg-violet-700 text-white shadow-violet-100 hover:bg-violet-800',
  },
  pageWrapper: {
    blurs: ['bg-violet-400/10', 'bg-purple-400/10', 'bg-indigo-400/5']
  },
  card: {
    border: 'hover:border-violet-400',
    shadow: 'hover:shadow-violet-100/30',
    accent: 'from-violet-400 to-violet-400',
    iconBg: 'group-hover:bg-violet-50',
    iconText: 'group-hover:text-violet-600',
    titleHover: 'group-hover:text-violet-700',
    chevronBg: 'group-hover:bg-violet-50',
    chevronText: 'group-hover:text-violet-600',
    menuHover: 'hover:bg-violet-50 hover:text-violet-700',
    statusBg: 'bg-violet-50',
    statusText: 'text-violet-700'
  },
  table: {
    hoverBg: 'hover:bg-violet-50/30',
    menuHover: 'hover:bg-violet-50 hover:text-violet-700',
  },
  toolbar: {
    focusRing: 'focus:ring-violet-50 focus:border-violet-700/40',
    activeText: 'text-violet-700',
    bgLight: 'bg-violet-50'
  },
  emptyState: {
    glow: 'bg-violet-400',
    iconBg: 'bg-violet-50 text-violet-700',
    button: 'bg-violet-700 hover:bg-violet-800 shadow-violet-100',
    secondaryText: 'text-violet-700',
    secondaryBg: 'hover:bg-violet-50'
  },
  tipsSection: { iconBg: 'bg-violet-50', iconText: 'text-violet-600' },
  statusBadges: {
    active: 'bg-violet-50 text-violet-700 border-violet-100',
    published: 'bg-violet-50 text-violet-700 border-violet-100',
    training: 'bg-blue-50 text-blue-600 border-blue-100',
    idle: 'bg-slate-50 text-slate-400 border-slate-100',
    draft: 'bg-slate-50 text-slate-500 border-slate-100',
    error: 'bg-rose-50 text-rose-600 border-rose-100'
  },
  modal: {
    headerBg: 'bg-violet-50',
    headerText: 'text-violet-900',
    iconBg: 'bg-violet-700',
    primaryBtn: 'bg-violet-700 hover:bg-violet-800',
    secondaryBtn: 'hover:bg-violet-50 text-violet-700'
  },
  lineage: {
    mainIconBg: 'bg-violet-700',
    mainIconText: 'text-white',
    cardBorder: 'hover:border-violet-200',
    cardHoverBg: 'hover:bg-violet-50/20',
    badgeBg: 'bg-violet-50 text-violet-700'
  },
  layoutBorder: 'border-violet-100',
  sidebarHoverIcon: 'hover:text-violet-700'
});

const generatePurpleColors = (): HomepageColors => ({
  hero: {
    badge: 'bg-purple-50 text-purple-700',
    gradient: 'from-purple-700 to-fuchsia-600',
    shadow: 'shadow-purple-50/10',
    button: 'bg-purple-700 hover:bg-purple-800 shadow-purple-200/50',
    secondaryHover: 'hover:text-purple-700 hover:bg-purple-50',
    iconColor: 'text-purple-600'
  },
  header: {
    iconBg: 'bg-slate-50 text-purple-700 border-slate-100',
    primaryBtn: 'bg-purple-700 text-white shadow-purple-100 hover:bg-purple-800',
  },
  pageWrapper: {
    blurs: ['bg-purple-400/10', 'bg-violet-400/10', 'bg-purple-400/5']
  },
  card: {
    border: 'hover:border-purple-400',
    shadow: 'hover:shadow-purple-100/30',
    accent: 'from-purple-700 to-purple-700',
    iconBg: 'group-hover:bg-purple-50',
    iconText: 'group-hover:text-purple-600',
    titleHover: 'group-hover:text-purple-700',
    chevronBg: 'group-hover:bg-purple-50',
    chevronText: 'group-hover:text-purple-600',
    menuHover: 'hover:bg-purple-50 hover:text-purple-700',
    statusBg: 'bg-purple-50',
    statusText: 'text-purple-700'
  },
  table: {
    hoverBg: 'hover:bg-purple-50/30',
    menuHover: 'hover:bg-purple-50 hover:text-purple-700',
  },
  toolbar: {
    focusRing: 'focus:ring-purple-50 focus:border-purple-700/40',
    activeText: 'text-purple-700',
    bgLight: 'bg-purple-50'
  },
  emptyState: {
    glow: 'bg-purple-400',
    iconBg: 'bg-purple-50 text-purple-700',
    button: 'bg-purple-700 hover:bg-purple-800 shadow-purple-100',
    secondaryText: 'text-purple-700',
    secondaryBg: 'hover:bg-purple-50'
  },
  tipsSection: { iconBg: 'bg-purple-50', iconText: 'text-purple-600' },
  statusBadges: {
    active: 'bg-purple-50 text-purple-700 border-purple-100',
    published: 'bg-purple-50 text-purple-700 border-purple-100',
    training: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    idle: 'bg-slate-50 text-slate-400 border-slate-100',
    draft: 'bg-slate-50 text-slate-500 border-slate-100',
    error: 'bg-rose-50 text-rose-600 border-rose-100'
  },
  modal: {
    headerBg: 'bg-purple-50',
    headerText: 'text-purple-900',
    iconBg: 'bg-purple-700',
    primaryBtn: 'bg-purple-700 hover:bg-purple-800',
    secondaryBtn: 'hover:bg-purple-50 text-purple-700'
  },
  lineage: {
    mainIconBg: 'bg-purple-700',
    mainIconText: 'text-white',
    cardBorder: 'hover:border-purple-200',
    cardHoverBg: 'hover:bg-purple-50/20',
    badgeBg: 'bg-purple-50 text-purple-700'
  },
  layoutBorder: 'border-purple-100',
  sidebarHoverIcon: 'hover:text-purple-700'
});

const generateIndigoColors = (): HomepageColors => ({
  hero: {
    badge: 'bg-indigo-50 text-indigo-600',
    gradient: 'from-indigo-600 to-purple-500',
    shadow: 'shadow-indigo-50/10',
    button: 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200/50',
    secondaryHover: 'hover:text-indigo-800 hover:bg-indigo-50',
    iconColor: 'text-indigo-600'
  },
  header: {
    iconBg: 'bg-slate-50 text-indigo-600 border-slate-100',
    primaryBtn: 'bg-indigo-600 text-white shadow-indigo-100 hover:bg-indigo-700',
  },
  pageWrapper: {
    blurs: ['bg-indigo-400/10', 'bg-purple-400/10', 'bg-blue-400/5']
  },
  card: {
    border: 'hover:border-indigo-400',
    shadow: 'hover:shadow-indigo-100/30',
    accent: 'from-indigo-600 to-indigo-600',
    iconBg: 'group-hover:bg-indigo-50',
    iconText: 'group-hover:text-indigo-600',
    titleHover: 'group-hover:text-indigo-600',
    chevronBg: 'group-hover:bg-indigo-50',
    chevronText: 'group-hover:text-indigo-600',
    menuHover: 'hover:bg-indigo-50 hover:text-indigo-700',
    statusBg: 'bg-emerald-50',
    statusText: 'text-emerald-700'
  },
  table: {
    hoverBg: 'hover:bg-indigo-50/30',
    menuHover: 'hover:bg-indigo-50 hover:text-indigo-700',
  },
  toolbar: {
    focusRing: 'focus:ring-indigo-100 focus:border-indigo-600/40',
    activeText: 'text-indigo-600',
    bgLight: 'bg-indigo-50'
  },
  emptyState: {
    glow: 'bg-indigo-400',
    iconBg: 'bg-indigo-50 text-indigo-600',
    button: 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100',
    secondaryText: 'text-indigo-700',
    secondaryBg: 'hover:bg-indigo-50'
  },
  tipsSection: { iconBg: 'bg-indigo-50', iconText: 'text-indigo-600' },
  statusBadges: {
    active: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    published: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    draft: 'bg-slate-50 text-slate-500 border-slate-100',
    error: 'bg-rose-50 text-rose-600 border-rose-100'
  },
  modal: {
    headerBg: 'bg-indigo-50',
    headerText: 'text-indigo-900',
    iconBg: 'bg-indigo-600',
    primaryBtn: 'bg-indigo-600 hover:bg-indigo-700',
    secondaryBtn: 'hover:bg-indigo-50 text-indigo-600'
  },
  lineage: {
    mainIconBg: 'bg-indigo-600',
    mainIconText: 'text-white',
    cardBorder: 'hover:border-indigo-200',
    cardHoverBg: 'hover:bg-indigo-50/20',
    badgeBg: 'bg-indigo-50 text-indigo-600'
  },
  layoutBorder: 'border-indigo-100',
  sidebarHoverIcon: 'hover:text-indigo-600'
});

const generateSlateColors = (): HomepageColors => ({
  hero: {
    badge: 'bg-slate-100 text-slate-700',
    gradient: 'from-slate-700 to-slate-500',
    shadow: 'shadow-slate-50/10',
    button: 'bg-slate-800 hover:bg-slate-900 shadow-slate-200/50',
    secondaryHover: 'hover:text-slate-800 hover:bg-slate-100',
    iconColor: 'text-slate-600'
  },
  header: {
    iconBg: 'bg-white text-slate-800 border-slate-200',
    primaryBtn: 'bg-slate-800 text-white hover:bg-slate-900',
  },
  pageWrapper: {
    blurs: ['bg-slate-200/20', 'bg-slate-300/10', 'bg-slate-100/10']
  },
  card: {
    border: 'hover:border-slate-400',
    shadow: 'hover:shadow-slate-100/30',
    accent: 'from-slate-700 to-slate-700',
    iconBg: 'group-hover:bg-slate-100',
    iconText: 'group-hover:text-slate-800',
    titleHover: 'group-hover:text-slate-800',
    chevronBg: 'group-hover:bg-slate-100',
    chevronText: 'group-hover:text-slate-800',
    menuHover: 'hover:bg-slate-100 hover:text-slate-800',
    statusBg: 'bg-slate-100',
    statusText: 'text-slate-800'
  },
  table: {
    hoverBg: 'hover:bg-slate-100/30',
    menuHover: 'hover:bg-slate-100 hover:text-slate-800',
  },
  toolbar: {
    focusRing: 'focus:ring-slate-100 focus:border-slate-800/40',
    activeText: 'text-slate-800',
    bgLight: 'bg-slate-100'
  },
  emptyState: {
    glow: 'bg-slate-400',
    iconBg: 'bg-slate-100 text-slate-800',
    button: 'bg-slate-800 hover:bg-slate-900 shadow-slate-100',
    secondaryText: 'text-slate-700',
    secondaryBg: 'hover:bg-slate-100'
  },
  tipsSection: { iconBg: 'bg-slate-100', iconText: 'text-slate-700' },
  statusBadges: {
    active: 'bg-slate-100 text-slate-800 border-slate-200',
    published: 'bg-slate-100 text-slate-800 border-slate-200',
    draft: 'bg-slate-50 text-slate-400 border-slate-100',
    error: 'bg-rose-50 text-rose-600 border-rose-100'
  },
  modal: {
    headerBg: 'bg-slate-100',
    headerText: 'text-slate-900',
    iconBg: 'bg-slate-800',
    primaryBtn: 'bg-slate-800 hover:bg-slate-900',
    secondaryBtn: 'hover:bg-slate-100 text-slate-800'
  },
  lineage: {
    mainIconBg: 'bg-slate-800',
    mainIconText: 'text-white',
    cardBorder: 'hover:border-slate-200',
    cardHoverBg: 'hover:bg-slate-50/20',
    badgeBg: 'bg-slate-100 text-slate-800'
  },
  layoutBorder: 'border-slate-100',
  sidebarHoverIcon: 'hover:text-slate-700'
});

// --- Workflow Specific ---

const generateTealWorkflowBuilderColors = (): WorkflowBuilderColors => ({
  header: {
    bg: 'bg-white',
    border: 'border-gray-100',
    buttonActive: 'bg-teal-50 border-teal-200 text-teal-700 shadow-sm',
    buttonInactive: 'bg-white border-transparent text-gray-600 hover:bg-gray-50',
    iconActive: 'bg-teal-600 text-white',
    iconInactive: 'bg-gray-50 text-gray-400',
    primaryBtn: 'bg-teal-600 text-white shadow-teal-100 hover:bg-teal-700',
    actionMenuHover: 'hover:bg-teal-50',
    actionMenuIcon: 'text-gray-900',
    lockActive: 'text-amber-600'
  },
  nodes: {
    selectedBorder: 'border-teal-500',
    selectedRing: 'ring-teal-50/50',
    errorBorder: 'border-rose-400',
    errorRing: 'ring-rose-50',
    handleHover: 'hover:bg-teal-500 hover:border-teal-500',
    hoverBorder: 'hover:border-teal-300'
  },
  runPanel: {
    bg: 'bg-white',
    border: 'border-gray-200',
    headerIconBg: 'bg-teal-50',
    headerIconText: 'text-teal-600',
    tabActive: 'bg-white',
    tabInactive: 'text-gray-500 hover:text-gray-700',
    tabActiveText: 'text-teal-700',
    successBadge: 'bg-teal-50 text-teal-600 border-teal-100'
  },
  drawers: {
    bg: 'bg-[#fcfdfe]',
    headerBg: 'bg-white',
    border: 'border-gray-200',
    inputFocus: 'focus:ring-teal-100 focus:border-teal-400',
    itemHoverBorder: 'hover:border-teal-300',
    itemHoverText: 'hover:text-teal-700'
  },
  canvas: {
    bg: '#ffffff',
    grid: '#f1f5f9'
  }
});

const generateSkyWorkflowBuilderColors = (): WorkflowBuilderColors => ({
  header: {
    bg: 'bg-white',
    border: 'border-gray-100',
    buttonActive: 'bg-sky-50 border-sky-200 text-sky-800 shadow-sm',
    buttonInactive: 'bg-white border-transparent text-gray-600 hover:bg-gray-50',
    iconActive: 'bg-sky-800 text-white',
    iconInactive: 'bg-gray-50 text-gray-400',
    primaryBtn: 'bg-sky-800 text-white shadow-sky-100 hover:bg-sky-900',
    actionMenuHover: 'hover:bg-sky-50',
    actionMenuIcon: 'text-gray-900',
    lockActive: 'text-amber-600'
  },
  nodes: {
    selectedBorder: 'border-sky-500',
    selectedRing: 'ring-sky-50/50',
    errorBorder: 'border-rose-400',
    errorRing: 'ring-rose-50',
    handleHover: 'hover:bg-sky-500 hover:border-sky-500',
    hoverBorder: 'hover:border-sky-300'
  },
  runPanel: {
    bg: 'bg-white',
    border: 'border-gray-200',
    headerIconBg: 'bg-sky-50',
    headerIconText: 'text-sky-800',
    tabActive: 'bg-white',
    tabInactive: 'text-gray-500 hover:text-gray-700',
    tabActiveText: 'text-sky-800',
    successBadge: 'bg-sky-50 text-sky-800 border-sky-100'
  },
  drawers: {
    bg: 'bg-white',
    headerBg: 'bg-sky-50',
    border: 'border-gray-100',
    inputFocus: 'focus:ring-sky-100 focus:border-sky-800/40',
    itemHoverBorder: 'hover:border-sky-200',
    itemHoverText: 'hover:text-sky-800'
  },
  canvas: {
    bg: '#f8fafc',
    grid: '#e2e8f0'
  }
});

// --- Data Specific ---

const generateDataSlateColors = (): DataColors => ({
  layoutBorder: 'border-slate-100',
  card: {
    border: 'hover:border-slate-400',
    shadow: 'hover:shadow-slate-100/30',
    accent: 'from-slate-700 to-slate-700',
    statusText: 'text-slate-800',
    iconBg: 'group-hover:bg-slate-100',
    iconText: 'group-hover:text-slate-800',
    chevronBg: 'group-hover:bg-slate-100',
    chevronText: 'group-hover:text-slate-800',
    menuHover: 'hover:bg-slate-100 hover:text-slate-800',
    titleHover: 'group-hover:text-slate-800'
  },
  toolbar: {
    focusRing: 'focus:ring-slate-100 focus:border-slate-800/40',
    bgLight: 'bg-slate-100'
  },
  header: {
    primaryBtn: 'bg-slate-800 text-white hover:bg-slate-900'
  },
  statusBadges: {
    active: 'bg-slate-100 text-slate-800 border-slate-200',
    draft: 'bg-slate-50 text-slate-400 border-slate-100'
  },
  hero: {
    secondaryHover: 'hover:text-slate-800 hover:bg-slate-100',
    button: 'bg-slate-800 hover:bg-slate-900 shadow-slate-200/50'
  },
  pageWrapper: {
    blurs: ['bg-slate-200/20', 'bg-slate-300/10', 'bg-slate-100/10']
  },
  sidebarHoverIcon: 'hover:text-slate-700'
});

const generateDataSkyColors = (): DataColors => ({
  layoutBorder: 'border-sky-100',
  card: {
    border: 'hover:border-sky-400',
    shadow: 'hover:shadow-sky-100/30',
    accent: 'from-sky-700 to-sky-700',
    statusText: 'text-sky-800',
    iconBg: 'group-hover:bg-sky-50',
    iconText: 'group-hover:text-sky-800',
    chevronBg: 'group-hover:bg-sky-50',
    chevronText: 'group-hover:text-sky-800',
    menuHover: 'hover:bg-sky-50 hover:text-sky-800',
    titleHover: 'group-hover:text-sky-800'
  },
  toolbar: {
    focusRing: 'focus:ring-sky-100 focus:border-sky-800/40',
    bgLight: 'bg-sky-50'
  },
  header: {
    primaryBtn: 'bg-sky-800 text-white shadow-sky-100 hover:bg-sky-900'
  },
  statusBadges: {
    active: 'bg-sky-50 text-sky-800 border-sky-100',
    draft: 'bg-slate-50 text-slate-500 border-slate-100'
  },
  hero: {
    secondaryHover: 'hover:text-sky-800 hover:bg-sky-50',
    button: 'bg-sky-800 hover:bg-sky-900 shadow-sky-200/50'
  },
  pageWrapper: {
    blurs: ['bg-sky-400/10', 'bg-indigo-400/10', 'bg-blue-400/5']
  },
  sidebarHoverIcon: 'hover:text-sky-800'
});

// --- Global Specific ---

const generateGlobalBlueColors = (): GlobalTheme => ({
  auth: {
    bg: 'bg-[#F1F5F9]',
    cardBg: 'bg-white',
    primaryBtn: 'bg-blue-600',
    primaryBtnHover: 'hover:bg-blue-700',
    shadow: 'shadow-blue-600/20',
    textPrimary: 'text-slate-900',
    textSecondary: 'text-slate-500',
    inputBg: 'bg-slate-50',
    inputBorder: 'border-slate-200',
    focusRing: 'focus:ring-blue-500/10 focus:border-blue-500/50',
    errorBg: 'bg-rose-50',
    errorText: 'text-rose-600',
    accentGradient: 'from-blue-600 via-blue-600 to-teal-600',
    accentText: 'text-blue-600',
    link: 'text-blue-600',
    linkHover: 'hover:text-blue-500',
    badgeBg: 'bg-blue-50',
    badgeText: 'text-blue-600',
    badgeBorder: 'border-blue-100',
    glow: 'bg-blue-400/10',
    selection: 'selection:bg-blue-500/30',
    activeBorder: 'border-blue-500',
    activeBg: 'bg-blue-50/50',
    activeIcon: 'text-blue-600',
    activeIconBg: 'bg-blue-100'
  },
  sidebar: {
    bg: 'bg-white',
    border: 'border-slate-200',
    activeBg: 'bg-blue-700',
    activeText: 'text-white',
    activeShadow: 'shadow-lg shadow-blue-100',
    hoverBg: 'hover:bg-slate-50/80',
    textDefault: 'text-slate-400'
  },
  brand: {
    logoBg: 'bg-blue-600',
    logoText: 'text-slate-900',
    logoSecondary: 'text-blue-600'
  }
});

const generateGlobalSlateColors = (): GlobalTheme => ({
  auth: {
    bg: 'bg-slate-50',
    cardBg: 'bg-white',
    primaryBtn: 'bg-slate-800',
    primaryBtnHover: 'hover:bg-slate-900',
    shadow: 'shadow-slate-800/10',
    textPrimary: 'text-slate-900',
    textSecondary: 'text-slate-500',
    inputBg: 'bg-white',
    inputBorder: 'border-slate-200',
    focusRing: 'focus:ring-slate-500/10 focus:border-slate-500/50',
    errorBg: 'bg-rose-50',
    errorText: 'text-rose-600',
    accentGradient: 'from-slate-700 via-slate-800 to-slate-900',
    accentText: 'text-slate-800',
    link: 'text-slate-800',
    linkHover: 'hover:text-black',
    badgeBg: 'bg-slate-100',
    badgeText: 'text-slate-800',
    badgeBorder: 'border-slate-200',
    glow: 'bg-slate-400/10',
    selection: 'selection:bg-slate-900/30',
    activeBorder: 'border-slate-900',
    activeBg: 'bg-slate-50/50',
    activeIcon: 'text-slate-900',
    activeIconBg: 'bg-slate-100'
  },
  sidebar: {
    bg: 'bg-white',
    border: 'border-slate-200',
    activeBg: 'bg-slate-800',
    activeText: 'text-white',
    activeShadow: 'shadow-lg shadow-slate-200',
    hoverBg: 'hover:bg-slate-50/80',
    textDefault: 'text-slate-400'
  },
  brand: {
    logoBg: 'bg-slate-800',
    logoText: 'text-slate-900',
    logoSecondary: 'text-slate-700'
  }
});

// ==========================================
// 4. THEME REGISTRIES
// ==========================================

export const workflowTheme = {
  homepage: {
    teal: generateTealColors(),
    sky: generateSkyColors()
  },
  builder: {
    teal: generateTealWorkflowBuilderColors(),
    sky: generateSkyWorkflowBuilderColors()
  }
};

export const appsTheme = {
  homepage: {
    sky: generateSkyColors(),
    blue: generateBlueColors()
  }
};

export const agentsTheme = {
  homepage: {
    violet: generateVioletColors(),
    purple: generatePurpleColors()
  }
};

export const vibecodingTheme = {
  homepage: {
    indigo: generateIndigoColors(),
    slate: generateSlateColors()
  }
};

export const dataTheme = {
  homepage: {
    slate: generateDataSlateColors(),
    sky: generateDataSkyColors()
  }
};

export const globalThemes = {
  blue: generateGlobalBlueColors(),
  slate: generateGlobalSlateColors()
};

// ==========================================
// 5. ACTIVE MODULE THEMES (Must come before Dashboard Generators)
// ==========================================

const workflowModuleTheme = {
  homepage: workflowTheme.homepage['teal'], // acceptable values: teal, sky
  builder: workflowTheme.builder['teal']    // acceptable values: teal, sky
};

const appsModuleTheme = {
  homepage: appsTheme.homepage['sky'],      // acceptable values: sky, blue
};

const agentsModuleTheme = {
  homepage: agentsTheme.homepage['violet'], // acceptable values: violet, purple
};

const vibecodingModuleTheme = {
  homepage: vibecodingTheme.homepage['indigo'], // acceptable values: indigo, slate
};

const dataModuleTheme = {
  homepage: dataTheme.homepage['slate'],    // acceptable values: slate, sky
};

// ==========================================
// 6. DASHBOARD GENERATORS (Depends on Step 5)
// ==========================================

const generateDashboardBlueColors = (): DashboardTheme => ({
  page: {
    bg: 'bg-white/40',
    blurs: [
      'bg-sky-400/10',
      'bg-violet-400/10',
      'bg-teal-400/5'
    ]
  },
  header: {
    title: 'text-gray-900',
    subtext: 'text-gray-500'
  },
  toolCard: {
    bg: 'bg-white',
    border: 'border-gray-100',
    shadow: 'shadow-sm hover:shadow-xl',
    tagBadge: 'text-[9px] font-bold uppercase tracking-wider text-gray-400',
    link: 'text-gray-400'
  },
  recentActivity: {
    title: 'text-gray-900',
    viewAll: 'text-blue-700 hover:underline',
    icon: 'text-blue-500',
    card: {
      bg: 'bg-white',
      border: 'border-gray-100',
      shadow: 'shadow-sm hover:shadow-md'
    }
  },
  promoCard: {
    bg: 'bg-slate-900',
    title: 'text-white',
    subtext: 'text-slate-400',
    button: 'bg-white text-slate-900',
    buttonHover: 'hover:bg-slate-50',
    glow: 'bg-violet-700',
    iconGlow: 'shadow-violet-500/20'
  },
  usage: {
    title: 'text-gray-900',
    label: 'text-gray-500',
    value: 'text-gray-900',
    barContainer: 'bg-gray-100'
  },
  modules: {
    workflow: workflowModuleTheme.homepage,
    apps: appsModuleTheme.homepage,
    agents: agentsModuleTheme.homepage,
    data: dataModuleTheme.homepage,
    vibecoding: vibecodingModuleTheme.homepage
  },
  aiBot: {
    buttonBg: 'bg-blue-600',
    buttonShadow: 'shadow-blue-600/20',
    icon: 'text-white',
    themeColorName: 'blue'
  }
});

const generateDashboardSlateColors = (): DashboardTheme => ({
  page: {
    bg: 'bg-slate-50/40',
    blurs: [
      'bg-slate-400/10',
      'bg-slate-600/10',
      'bg-slate-400/5'
    ]
  },
  header: {
    title: 'text-slate-900',
    subtext: 'text-slate-500'
  },
  toolCard: {
    bg: 'bg-white',
    border: 'border-slate-100',
    shadow: 'shadow-sm hover:shadow-xl',
    tagBadge: 'text-[9px] font-bold uppercase tracking-wider text-slate-400',
    link: 'text-slate-400'
  },
  recentActivity: {
    title: 'text-slate-900',
    viewAll: 'text-slate-700 hover:underline',
    icon: 'text-slate-800',
    card: {
      bg: 'bg-white',
      border: 'border-slate-100',
      shadow: 'shadow-sm hover:shadow-md'
    }
  },
  promoCard: {
    bg: 'bg-slate-800',
    title: 'text-white',
    subtext: 'text-slate-300',
    button: 'bg-white text-slate-800',
    buttonHover: 'hover:bg-slate-50',
    glow: 'bg-slate-700',
    iconGlow: 'shadow-slate-500/20'
  },
  usage: {
    title: 'text-slate-900',
    label: 'text-slate-500',
    value: 'text-slate-900',
    barContainer: 'bg-slate-100'
  },
  modules: {
    workflow: workflowModuleTheme.homepage,
    apps: appsModuleTheme.homepage,
    agents: agentsModuleTheme.homepage,
    data: dataModuleTheme.homepage,
    vibecoding: vibecodingModuleTheme.homepage
  },
  aiBot: {
    buttonBg: 'bg-slate-800',
    buttonShadow: 'shadow-slate-800/20',
    icon: 'text-white',
    themeColorName: 'slate'
  }
});

export const dashboardTheme = {
  homepage: {
    blue: generateDashboardBlueColors(),
    slate: generateDashboardSlateColors()
  }
};

const dashboardModuleTheme = {
  homepage: dashboardTheme.homepage['blue'],    // acceptable values: blue, slate
};

const globalModuleTheme = globalThemes['blue']; // acceptable values: blue, slate

// ==========================================
// 7. THE CENTRAL REGISTRY (STUDIO THEME COLORS)
// ==========================================

export const studioThemeColors: StudioTheme = {
  workflow: workflowModuleTheme,
  apps: appsModuleTheme,
  agents: agentsModuleTheme,
  vibecoding: vibecodingModuleTheme,
  data: dataModuleTheme,
  dashboard: dashboardModuleTheme,
  global: globalModuleTheme
};
