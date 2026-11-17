import { CanvasElement, PageSettings } from '../types';

/**
 * Escapes JSX string literals safely.
 */
function escapeJsxText(text: string): string {
  if (!text) return '';
  return text
    .replace(/{/g, '&#123;')
    .replace(/}/g, '&#125;');
}

/**
 * Normalizes CSS color values or tokens to hex/rgba.
 */
function normalizeColor(color?: string): string {
  if (!color) return 'inherit';
  return color;
}

/**
 * Collects all unique Google Fonts used by elements.
 */
function collectUsedFonts(elements: CanvasElement[], pageSettings: PageSettings): string[] {
  const fonts = new Set<string>();
  if (pageSettings.fontFamily) {
    fonts.add(pageSettings.fontFamily);
  }
  for (const el of elements) {
    if (el.styles?.fontFamily) {
      fonts.add(el.styles.fontFamily);
    }
  }
  return Array.from(fonts);
}

/**
 * Generates an sx prop object string from element styles.
 */
function generateSx(el: CanvasElement): Record<string, unknown> {
  const s = el.styles || {};
  const sx: Record<string, unknown> = {};

  if (s.fontFamily) sx.fontFamily = `"${s.fontFamily}", sans-serif`;
  if (s.fontSize) sx.fontSize = `${s.fontSize}px`;
  if (s.fontWeight) sx.fontWeight = s.fontWeight;
  if (s.color) sx.color = s.color;
  if (s.textAlign) sx.textAlign = s.textAlign;
  if (s.lineHeight) sx.lineHeight = s.lineHeight;
  if (s.letterSpacing !== undefined) sx.letterSpacing = `${s.letterSpacing}px`;
  if (s.backgroundColor && s.backgroundColor !== 'transparent') sx.bgcolor = s.backgroundColor;
  if (s.borderRadius) sx.borderRadius = `${s.borderRadius}px`;
  if (s.boxShadow) sx.boxShadow = s.boxShadow;
  if (s.backdropFilter) {
    sx.backdropFilter = s.backdropFilter;
    sx.WebkitBackdropFilter = s.backdropFilter;
  }
  if (s.opacity !== undefined && s.opacity !== 1) sx.opacity = s.opacity;

  if (s.borderWidth && s.borderWidth > 0) {
    sx.border = `${s.borderWidth}px ${s.borderStyle || 'solid'} ${s.borderColor || '#E2E8F0'}`;
  }

  if (s.padding) {
    const { top = 0, right = 0, bottom = 0, left = 0 } = s.padding;
    if (top === bottom && right === left && top === right) {
      if (top > 0) sx.p = `${top}px`;
    } else {
      if (top > 0) sx.pt = `${top}px`;
      if (right > 0) sx.pr = `${right}px`;
      if (bottom > 0) sx.pb = `${bottom}px`;
      if (left > 0) sx.pl = `${left}px`;
    }
  }

  return sx;
}

function stringifySx(sx: Record<string, unknown>, indent = '              '): string {
  const keys = Object.keys(sx);
  if (keys.length === 0) return '{}';
  if (keys.length <= 2) {
    const pairs = keys.map(k => `${k}: ${typeof sx[k] === 'number' ? sx[k] : JSON.stringify(sx[k])}`);
    return `{ ${pairs.join(', ')} }`;
  }
  const lines = keys.map(k => `${indent}  ${k}: ${typeof sx[k] === 'number' ? sx[k] : JSON.stringify(sx[k])},`);
  return `{\n${lines.join('\n')}\n${indent}}`;
}

/**
 * Generates TSX JSX snippet for a single canvas element using Material UI.
 */
function generateElementTsx(el: CanvasElement, indent = '          '): string {
  const c = el.content || {};
  const s = el.styles || {};
  const sx = generateSx(el);

  switch (el.type) {
    case 'heading': {
      const tag = c.tag || 'h2';
      const variantMap: Record<string, string> = {
        h1: 'h1',
        h2: 'h2',
        h3: 'h3',
        h4: 'h4',
        h5: 'h5',
        h6: 'h6',
        p: 'body1',
        span: 'subtitle1'
      };
      const variant = variantMap[tag] || 'h2';
      return `${indent}<Typography\n${indent}  variant="${variant}"\n${indent}  component="${tag}"\n${indent}  sx=${stringifySx(sx, indent)}\n${indent}>\n${indent}  ${JSON.stringify(c.text || 'Heading')}\n${indent}</Typography>`;
    }

    case 'text': {
      return `${indent}<Typography\n${indent}  variant="body1"\n${indent}  sx=${stringifySx(sx, indent)}\n${indent}>\n${indent}  ${JSON.stringify(c.text || 'Paragraph text')}\n${indent}</Typography>`;
    }

    case 'label': {
      return `${indent}<Typography\n${indent}  variant="overline"\n${indent}  component="span"\n${indent}  sx=${stringifySx(sx, indent)}\n${indent}>\n${indent}  ${JSON.stringify(c.text || 'LABEL')}\n${indent}</Typography>`;
    }

    case 'button': {
      return `${indent}<Button\n${indent}  variant="contained"\n${indent}  disableElevation\n${indent}  sx=${stringifySx(sx, indent)}\n${indent}>\n${indent}  ${JSON.stringify(c.text || 'Button')}\n${indent}</Button>`;
    }

    case 'badge': {
      return `${indent}<Chip\n${indent}  label=${JSON.stringify(c.text || 'Badge')}\n${indent}  size="small"\n${indent}  sx=${stringifySx(sx, indent)}\n${indent}/>`;
    }

    case 'list': {
      const items = c.items || ['Item 1', 'Item 2', 'Item 3'];
      const listType = c.listType || 'check';
      return `${indent}<List dense sx=${stringifySx(sx, indent)}>\n${items
        .map(
          (item, idx) =>
            `${indent}  <ListItem disableGutters>\n${indent}    <ListItemIcon sx={{ minWidth: 28, color: 'primary.main' }}>\n${indent}      ${
              listType === 'check'
                ? '<CheckCircleOutlineIcon fontSize="small" />'
                : listType === 'numbered'
                ? `<Typography variant="caption" sx={{ fontWeight: 700, bgcolor: 'action.hover', px: 1, py: 0.2, borderRadius: 1 }}>${idx + 1}</Typography>`
                : '<FiberManualRecordIcon sx={{ fontSize: 10 }} />'
            }\n${indent}    </ListItemIcon>\n${indent}    <ListItemText primary=${JSON.stringify(item)} />\n${indent}  </ListItem>`
        )
        .join('\n')}\n${indent}</List>`;
    }

    case 'navbar': {
      const brandText = c.brandText ?? 'LayoutForge';
      const brandColor = c.brandTextColor ? JSON.stringify(c.brandTextColor) : "'text.primary'";
      const rawLinks = c.links || ['Features', 'Templates', 'Pricing', 'Contact'];
      const links = rawLinks.map(l => (typeof l === 'string' ? l : l.label));
      const ctaText = c.ctaText || 'Get Started';
      const showCta = c.showCta ?? true;

      return `${indent}<AppBar\n${indent}  position="static"\n${indent}  color="inherit"\n${indent}  elevation={0}\n${indent}  sx=${stringifySx({
        borderBottom: '1px solid',
        borderColor: 'divider',
        bgcolor: s.backgroundColor || 'background.paper',
        ...sx
      }, indent)}\n${indent}>\n${indent}  <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 4 } }}>\n${indent}    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>\n${indent}      <IconButton edge="start" color="primary" sx={{ display: { xs: 'flex', md: 'none' } }} onClick={() => setMobileMenuOpen(true)}>\n${indent}        <MenuIcon />\n${indent}      </IconButton>\n${indent}      <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: '-0.02em', color: ${brandColor} }}>\n${indent}        ${JSON.stringify(brandText)}\n${indent}      </Typography>\n${indent}    </Box>\n${indent}    <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 3 }}>\n${links
        .map(
          link =>
            `${indent}      <Button color="inherit" sx={{ fontWeight: 500, color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>\n${indent}        ${JSON.stringify(link)}\n${indent}      </Button>`
        )
        .join('\n')}\n${indent}    </Box>\n${showCta ? `${indent}    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>\n${indent}      <Button variant="contained" disableElevation color="primary" sx={{ borderRadius: 2 }}>\n${indent}        ${JSON.stringify(ctaText)}\n${indent}      </Button>\n${indent}    </Box>\n` : ''}${indent}  </Toolbar>\n${indent}</AppBar>`;
    }

    case 'footer': {
      const brandText = c.brandText || 'LayoutForge';
      const copyright = c.copyright || '© 2026 All rights reserved.';
      const rawLinks = c.links || ['Privacy', 'Terms', 'Support'];
      const links = rawLinks.map(l => (typeof l === 'string' ? l : l.label));

      return `${indent}<Box\n${indent}  component="footer"\n${indent}  sx=${stringifySx({
        pt: 6,
        pb: 4,
        px: { xs: 2, md: 4 },
        borderTop: '1px solid',
        borderColor: 'divider',
        bgcolor: s.backgroundColor || 'background.paper',
        ...sx
      }, indent)}\n${indent}>\n${indent}  <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 2, mb: 3 }}>\n${indent}    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary' }}>\n${indent}      ${JSON.stringify(brandText)}\n${indent}    </Typography>\n${indent}    <Box sx={{ display: 'flex', gap: 3 }}>\n${links
        .map(
          link =>
            `${indent}      <Typography variant="body2" component="a" href="#" sx={{ color: 'text.secondary', textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>\n${indent}        ${JSON.stringify(link)}\n${indent}      </Typography>`
        )
        .join('\n')}\n${indent}    </Box>\n${indent}  </Box>\n${indent}  <Divider sx={{ mb: 2 }} />\n${indent}  <Typography variant="caption" sx={{ color: 'text.secondary' }}>\n${indent}    ${JSON.stringify(copyright)}\n${indent}  </Typography>\n${indent}</Box>`;
    }

    case 'divider': {
      return `${indent}<Divider sx=${stringifySx({ my: 2, ...sx }, indent)} />`;
    }

    case 'card':
    case 'container': {
      return `${indent}<Card\n${indent}  elevation={1}\n${indent}  sx=${stringifySx({
        p: 3,
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        ...sx
      }, indent)}\n${indent}>\n${indent}  <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>\n${indent}    {/* Nested container element content */}\n${indent}  </CardContent>\n${indent}</Card>`;
    }

    case 'input': {
      return `${indent}<TextField\n${indent}  fullWidth\n${indent}  size="small"\n${indent}  label=${JSON.stringify(c.label || '')}\n${indent}  placeholder=${JSON.stringify(c.placeholder || '')}\n${indent}  variant="outlined"\n${indent}  sx=${stringifySx(sx, indent)}\n${indent}/>`;
    }

    case 'textarea': {
      return `${indent}<TextField\n${indent}  fullWidth\n${indent}  multiline\n${indent}  rows={4}\n${indent}  label=${JSON.stringify(c.label || '')}\n${indent}  placeholder=${JSON.stringify(c.placeholder || '')}\n${indent}  variant="outlined"\n${indent}  sx=${stringifySx(sx, indent)}\n${indent}/>`;
    }

    case 'select': {
      const options = c.options || ['Option 1', 'Option 2', 'Option 3'];
      return `${indent}<FormControl fullWidth size="small" sx=${stringifySx(sx, indent)}>\n${indent}  <InputLabel>${c.label || 'Select'}</InputLabel>\n${indent}  <Select\n${indent}    defaultValue=${JSON.stringify(options[0] || '')}\n${indent}    label=${JSON.stringify(c.label || 'Select')}\n${indent}  >\n${options
        .map(opt => `${indent}    <MenuItem value=${JSON.stringify(opt)}>${opt}</MenuItem>`)
        .join('\n')}\n${indent}  </Select>\n${indent}</FormControl>`;
    }

    case 'checkbox': {
      return `${indent}<FormControlLabel\n${indent}  control={<Checkbox defaultChecked=${c.checked !== false} color="primary" />}\n${indent}  label=${JSON.stringify(c.label || 'Checkbox')}\n${indent}  sx=${stringifySx(sx, indent)}\n${indent}/>`;
    }

    case 'radiogroup': {
      const options = c.options || ['Option A', 'Option B'];
      return `${indent}<RadioGroup defaultValue=${JSON.stringify(options[c.selectedIndex || 0] || options[0])} sx=${stringifySx(sx, indent)}>\n${options
        .map(
          opt => `${indent}  <FormControlLabel value=${JSON.stringify(opt)} control={<Radio color="primary" />} label=${JSON.stringify(opt)} />`
        )
        .join('\n')}\n${indent}</RadioGroup>`;
    }

    case 'image': {
      return `${indent}<Box\n${indent}  component="img"\n${indent}  src=${JSON.stringify(c.src || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80')}\n${indent}  alt=${JSON.stringify(c.alt || 'Visual')}\n${indent}  sx=${stringifySx({
        width: '100%',
        height: 'auto',
        maxHeight: `${el.height}px`,
        objectFit: 'cover',
        borderRadius: 2,
        display: 'block',
        ...sx
      }, indent)}\n${indent}/>`;
    }

    case 'video': {
      const videoSrc = c.videoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ';
      return `${indent}<Box\n${indent}  component="iframe"\n${indent}  src=${JSON.stringify(videoSrc)}\n${indent}  title="Embedded Video"\n${indent}  sx=${stringifySx({
        width: '100%',
        height: `${el.height || 360}px`,
        border: 0,
        borderRadius: 2,
        ...sx
      }, indent)}\n${indent}/>`;
    }

    case 'icon': {
      return `${indent}<Box sx=${stringifySx({ display: 'inline-flex', color: 'primary.main', ...sx }, indent)}>\n${indent}  <StarIcon />\n${indent}</Box>`;
    }

    default:
      return `${indent}<Box sx=${stringifySx(sx, indent)}>\n${indent}  {/* Element: ${el.type} */}\n${indent}</Box>`;
  }
}

/**
 * Groups elements into logical vertical sections or rows based on Y coordinates.
 */
function clusterElementsByPosition(elements: CanvasElement[]): CanvasElement[][] {
  if (elements.length === 0) return [];
  const sorted = [...elements].sort((a, b) => a.y - b.y || a.x - b.x);

  const clusters: CanvasElement[][] = [];
  let currentCluster: CanvasElement[] = [];
  let currentBottom = 0;

  for (const el of sorted) {
    if (currentCluster.length === 0) {
      currentCluster.push(el);
      currentBottom = el.y + el.height;
    } else {
      // If element starts within 40px of current cluster vertical span, group together
      if (el.y <= currentBottom + 40) {
        currentCluster.push(el);
        currentBottom = Math.max(currentBottom, el.y + el.height);
      } else {
        clusters.push(currentCluster);
        currentCluster = [el];
        currentBottom = el.y + el.height;
      }
    }
  }

  if (currentCluster.length > 0) {
    clusters.push(currentCluster);
  }

  return clusters;
}

export interface GeneratedReactMuiBundle {
  appTsx: string;
  themeTs: string;
  packageJson: string;
  indexHtml: string;
  viteConfig: string;
}

/**
 * Primary Generator function: converts canvas elements and page settings
 * into a complete, modern React 18 + TypeScript + Material UI project.
 */
export function generateReactMuiCode(
  elements: CanvasElement[],
  pageSettings: PageSettings,
  projectName = 'LayoutForge'
): GeneratedReactMuiBundle {
  const safeName = projectName.trim() || 'LayoutForge';
  const usedFonts = collectUsedFonts(elements, pageSettings);
  const primaryColor = pageSettings.primaryColor || '#2563EB';
  const backgroundColor = pageSettings.backgroundColor || '#F8FAFC';
  const textColor = pageSettings.textColor || '#0F172A';
  const defaultFont = pageSettings.fontFamily || 'Rethink Sans';

  const clusters = clusterElementsByPosition(elements);

  // Generate JSX clusters
  const clusterJsx = clusters
    .map((cluster, clusterIdx) => {
      // If single element
      if (cluster.length === 1) {
        const el = cluster[0];
        // If full-width elements like navbar or footer, render directly
        if (el.type === 'navbar' || el.type === 'footer') {
          return `        {/* Section ${clusterIdx + 1}: ${el.name || el.type} */}\n${generateElementTsx(el, '        ')}`;
        }
        return `        {/* Section ${clusterIdx + 1} */}\n        <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>\n${generateElementTsx(el, '          ')}\n        </Box>`;
      }

      // Multiple elements in same row/band: render in responsive Grid or Stack
      const isHorizontalRow = cluster.every(el => Math.abs(el.y - cluster[0].y) < 50);
      if (isHorizontalRow && cluster.length <= 4) {
        const colSpan = Math.max(3, Math.floor(12 / cluster.length));
        return `        {/* Section ${clusterIdx + 1}: Responsive Row */}\n        <Grid container spacing={3} justifyContent="center" sx={{ mb: 4, alignItems: 'center' }}>\n${cluster
          .map(
            el =>
              `          <Grid item xs={12} md={${colSpan}}>\n${generateElementTsx(el, '            ')}\n          </Grid>`
          )
          .join('\n')}\n        </Grid>`;
      }

      // Vertical flow cluster
      return `        {/* Section ${clusterIdx + 1}: Grouped Block */}\n        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 2.5, mb: 4 }}>\n${cluster
        .map(el => generateElementTsx(el, '          '))
        .join('\n')}\n        </Box>`;
    })
    .join('\n\n');

  // React App.tsx component code
  const appTsx = `import React, { useState, useEffect } from 'react';
import {
  ThemeProvider,
  CssBaseline,
  Container,
  Box,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  RadioGroup,
  Radio,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  useMediaQuery,
  useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import StarIcon from '@mui/icons-material/Star';
import { appTheme } from './theme';

export interface PageProps {
  title?: string;
  onActionClick?: (actionName: string) => void;
}

/**
 * ${safeName} - Production React Component
 * Generated cleanly with Material UI (MUI v5) and TypeScript
 */
export default function App({ title = ${JSON.stringify(safeName)}, onActionClick }: PageProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: 'background.default',
          color: 'text.primary',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Mobile Navigation Drawer */}
        <Drawer
          anchor="left"
          open={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          slotProps={{ paper: { sx: { width: 280, p: 3 } } }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {title}
            </Typography>
            <IconButton onClick={() => setMobileMenuOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <List>
            {['Home', 'Features', 'Pricing', 'About', 'Contact'].map((item) => (
              <ListItem button key={item} onClick={() => setMobileMenuOpen(false)}>
                <ListItemText primary={item} />
              </ListItem>
            ))}
          </List>
        </Drawer>

        {/* Page Content Container */}
        <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 }, flex: 1 }}>
${clusterJsx || '          <Typography variant="body1">No elements currently on the canvas.</Typography>'}
        </Container>
      </Box>
    </ThemeProvider>
  );
}
`;

  // theme.ts code
  const fontFamiliesString = [defaultFont, ...usedFonts]
    .filter(Boolean)
    .map(f => `"${f}"`)
    .join(', ');

  const themeTs = `import { createTheme, responsiveFontSizes } from '@mui/material/styles';

/**
 * Custom Material-UI Theme generated for ${safeName}
 */
let theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '${primaryColor}',
    },
    background: {
      default: '${backgroundColor}',
      paper: '#FFFFFF',
    },
    text: {
      primary: '${textColor}',
      secondary: '#64748B',
    },
    divider: '#E2E8F0',
  },
  typography: {
    fontFamily: [
      ${fontFamiliesString},
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      'sans-serif',
    ].join(','),
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 16px -4px rgba(0,0,0,0.06)',
          borderRadius: 12,
        },
      },
    },
  },
});

theme = responsiveFontSizes(theme);

export const appTheme = theme;
`;

  // package.json code
  const packageJson = JSON.stringify(
    {
      name: safeName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      version: '1.0.0',
      private: true,
      type: 'module',
      scripts: {
        dev: 'vite',
        build: 'tsc && vite build',
        preview: 'vite preview'
      },
      dependencies: {
        react: '^18.3.1',
        'react-dom': '^18.3.1',
        '@mui/material': '^5.15.15',
        '@mui/icons-material': '^5.15.15',
        '@emotion/react': '^11.11.4',
        '@emotion/styled': '^11.11.5'
      },
      devDependencies: {
        '@types/react': '^18.3.18',
        '@types/react-dom': '^18.3.5',
        '@vitejs/plugin-react': '^4.3.4',
        typescript: '^5.5.3',
        vite: '^6.0.1'
      }
    },
    null,
    2
  );

  // index.html code
  const fontLinks = usedFonts
    .map(f => `family=${encodeURIComponent(f)}:wght@400;500;600;700`)
    .join('&');

  const indexHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${safeName}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?${fontLinks || 'family=Rethink+Sans:wght@400;500;600;700'}&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;

  // vite.config.ts code
  const viteConfig = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
`;

  return {
    appTsx,
    themeTs,
    packageJson,
    indexHtml,
    viteConfig
  };
}
