// LayoutForge TypeScript Type Definitions

export type DeviceType = 'desktop' | 'tablet' | 'mobile';

export type ElementType =
  | 'heading'
  | 'text'
  | 'label'
  | 'button'
  | 'badge'
  | 'list'
  | 'card'
  | 'container'
  | 'navbar'
  | 'footer'
  | 'divider'
  | 'input'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'radiogroup'
  | 'image'
  | 'video'
  | 'icon';

export interface SpacingConfig {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}

export interface ElementStyles {
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string | number;
  color?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  lineHeight?: number;
  letterSpacing?: number;
  backgroundColor?: string;
  borderRadius?: number;
  borderWidth?: number;
  borderStyle?: 'none' | 'solid' | 'dashed' | 'dotted';
  borderColor?: string;
  boxShadow?: string;
  opacity?: number;
  padding?: SpacingConfig;
  margin?: SpacingConfig;
  animation?: string;
  animationTrigger?: 'on-load' | 'on-scroll' | 'on-hover';
  animationDuration?: number;
  animationDelay?: number;
  display?: string;
  flexDirection?: 'row' | 'column';
  alignItems?: string;
  justifyContent?: string;
  gap?: number;
  zIndex?: number;
  [key: string]: unknown;
}

export interface ElementContent {
  text?: string;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  label?: string;
  placeholder?: string;
  src?: string;
  alt?: string;
  items?: string[];
  listType?: 'check' | 'bullet' | 'numbered';
  options?: string[];
  selectedIndex?: number;
  checked?: boolean;
  videoUrl?: string;
  iconName?: string;
  brandText?: string;
  brandTextColor?: string;
  brandTag?: string;
  logoUrl?: string;
  logoHeight?: number;
  logoShape?: 'circle' | 'square' | 'rounded';
  showLogoImage?: boolean;
  links?: Array<string | { label: string; url?: string }>;
  linksAlignment?: 'left' | 'center' | 'right';
  showSearch?: boolean;
  searchPlaceholder?: string;
  showCta?: boolean;
  ctaText?: string;
  ctaVariant?: 'primary' | 'outline' | 'subtle';
  showAvatar?: boolean;
  avatarUrl?: string;
  avatarName?: string;
  avatarShape?: 'circle' | 'square' | 'rounded';
  avatarSize?: number;
  showStatusDot?: boolean;
  copyright?: string;
  [key: string]: unknown;
}

export interface HoverStyles {
  scale?: number;
  yShift?: number;
  boxShadow?: string;
  backgroundColor?: string;
  borderColor?: string;
  color?: string;
  transitionDuration?: number;
}

export interface PageDefinition {
  id: string;
  name: string;
  path: string;
  elements: CanvasElement[];
  pageSettings: PageSettings;
}

export interface CanvasElement {
  id: string;
  type: ElementType;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  styles: ElementStyles;
  hoverStyles?: HoverStyles;
  content: ElementContent;
  parentId?: string | null;
  groupId?: string | null;
  children?: string[];
  visibleOn?: {
    desktop?: boolean;
    tablet?: boolean;
    mobile?: boolean;
  };
  responsiveOverride?: {
    tablet?: Partial<{ x: number; y: number; width: number; height: number; styles: Partial<ElementStyles> }>;
    mobile?: Partial<{ x: number; y: number; width: number; height: number; styles: Partial<ElementStyles> }>;
  };
  locked?: boolean;
  hidden?: boolean;
  isFlexContainer?: boolean;
  [key: string]: unknown;
}

export interface PageSettings {
  backgroundColor?: string;
  textColor?: string;
  primaryColor?: string;
  fontFamily?: string;
  defaultFont?: string;
  canvasWidth?: number;
  canvasHeight?: number;
  pageWidth?: number;
  minHeight?: number;
  padding?: SpacingConfig;
  metaTitle?: string;
  metaDescription?: string;
  backgroundGradient?: string | null;
  backgroundImage?: string | null;
  activeVibeId?: string | null;
  [key: string]: unknown;
}

export interface ProjectState {
  projectName: string;
  elements: CanvasElement[];
  selectedElementId: string | null;
  selectedElementIds: string[];
  pageSettings: PageSettings;
  activeDevice: DeviceType;
  zoom: number;
  snapToGrid: boolean;
  gridSize: number;
  gridType: 'dots' | 'lines' | 'columns';
  showGrid: boolean;
  showSnapGuides: boolean;
  history: Array<{ elements: CanvasElement[]; pageSettings: PageSettings }>;
  future: Array<{ elements: CanvasElement[]; pageSettings: PageSettings }>;
}
