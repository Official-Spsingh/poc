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

export interface HomepageColors {
  hero: HeroColors;
  header: HeaderColors;
  pageWrapper: PageWrapperColors;
  card: CardColors;
  table: TableColors;
  toolbar: ToolbarColors;
  emptyState: EmptyStateColors;
  tipsSection: TipsSectionColors;
}

export interface ModuleColors {
  homepage: HomepageColors;
  [key: string]: any; // Allows future expansion e.g., workflowBuilder
}

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
    secondaryText: 'text-violet-700',
    secondaryBg: 'hover:bg-violet-50'
  },
  tipsSection: { iconBg: 'bg-teal-50', iconText: 'text-teal-600' }
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
    primaryBtn: 'bg-sky-800 text-white shadow-sky-100 hover:bg-sky-800',
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
    secondaryText: 'text-teal-700',
    secondaryBg: 'hover:bg-teal-50'
  },
  tipsSection: { iconBg: 'bg-sky-50', iconText: 'text-sky-700' }
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
    secondaryText: 'text-indigo-700',
    secondaryBg: 'hover:bg-indigo-50'
  },
  tipsSection: { iconBg: 'bg-violet-50', iconText: 'text-violet-600' }
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
    secondaryText: 'text-sky-700',
    secondaryBg: 'hover:bg-sky-50'
  },
  tipsSection: { iconBg: 'bg-indigo-50', iconText: 'text-indigo-600' }
});

export const studioThemeColors: Record<string, ModuleColors> = {
  workflow: {
    homepage: generateTealColors(),
    workflowBuilder: {}
  },
  apps: {
    homepage: generateSkyColors(),
  },
  agents: {
    homepage: generateVioletColors(),
  },
  vibecoding: {
    homepage: generateIndigoColors(),
  }
};
