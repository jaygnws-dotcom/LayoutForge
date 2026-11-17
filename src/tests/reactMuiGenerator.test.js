import { describe, it, expect } from 'vitest';
import { generateReactMuiCode } from '../engine/reactMuiGenerator';

describe('reactMuiGenerator Engine', () => {
  const sampleElements = [
    {
      id: 'el-nav',
      type: 'navbar',
      name: 'Main Navbar',
      x: 0,
      y: 0,
      width: 1200,
      height: 64,
      styles: {
        backgroundColor: '#FFFFFF',
        fontFamily: 'Rethink Sans',
        fontSize: 15
      },
      content: {
        brandText: 'Atelier Verra',
        links: ['Architecture', 'Philosophy', 'Projects', 'Contact'],
        showCta: true,
        ctaText: 'Start a Project'
      }
    },
    {
      id: 'el-heading',
      type: 'heading',
      name: 'Hero Title',
      x: 80,
      y: 120,
      width: 700,
      height: 90,
      styles: {
        fontFamily: 'Playfair Display',
        fontSize: 48,
        fontWeight: '700',
        color: '#1A1A18'
      },
      content: {
        tag: 'h1',
        text: 'Architecture of Quiet Permanence'
      }
    },
    {
      id: 'el-text',
      type: 'text',
      name: 'Hero Subtitle',
      x: 80,
      y: 220,
      width: 600,
      height: 60,
      styles: {
        fontFamily: 'Inter',
        fontSize: 16,
        color: '#4D4D4D'
      },
      content: {
        text: 'We design bespoke residences rooted in stone, timber, and spatial silence.'
      }
    },
    {
      id: 'el-btn',
      type: 'button',
      name: 'CTA Button',
      x: 80,
      y: 300,
      width: 180,
      height: 48,
      styles: {
        backgroundColor: '#B4573A',
        color: '#FFFFFF',
        borderRadius: 8
      },
      content: {
        text: 'Explore Monograph'
      }
    },
    {
      id: 'el-list',
      type: 'list',
      name: 'Services List',
      x: 80,
      y: 380,
      width: 500,
      height: 120,
      styles: {
        fontSize: 14
      },
      content: {
        listType: 'check',
        items: ['Residential Monoliths', 'Landscape Integration', 'Historic Restoration']
      }
    },
    {
      id: 'el-footer',
      type: 'footer',
      name: 'Footer',
      x: 0,
      y: 600,
      width: 1200,
      height: 100,
      styles: {
        backgroundColor: '#F6F3EE'
      },
      content: {
        brandText: 'Atelier Verra Studio',
        copyright: '© 2026 Atelier Verra. All rights reserved.'
      }
    }
  ];

  const samplePageSettings = {
    backgroundColor: '#F6F3EE',
    textColor: '#1A1A18',
    primaryColor: '#B4573A',
    fontFamily: 'Playfair Display',
    canvasWidth: 1200,
    canvasHeight: 800,
    padding: { top: 0, right: 0, bottom: 0, left: 0 }
  };

  it('generates a complete React TSX + MUI bundle with all required files', () => {
    const bundle = generateReactMuiCode(sampleElements, samplePageSettings, 'Atelier Verra');

    expect(bundle).toHaveProperty('appTsx');
    expect(bundle).toHaveProperty('themeTs');
    expect(bundle).toHaveProperty('packageJson');
    expect(bundle).toHaveProperty('indexHtml');
    expect(bundle).toHaveProperty('viteConfig');
  });

  it('includes proper React hooks and TypeScript interfaces in appTsx', () => {
    const bundle = generateReactMuiCode(sampleElements, samplePageSettings, 'Atelier Verra');
    const { appTsx } = bundle;

    expect(appTsx).toContain("import React, { useState, useEffect } from 'react';");
    expect(appTsx).toContain('export interface PageProps');
    expect(appTsx).toContain('useTheme()');
    expect(appTsx).toContain('useMediaQuery(');
    expect(appTsx).toContain('ThemeProvider');
    expect(appTsx).toContain('CssBaseline');
  });

  it('transforms canvas elements into semantic Material-UI v5 components', () => {
    const bundle = generateReactMuiCode(sampleElements, samplePageSettings, 'Atelier Verra');
    const { appTsx } = bundle;

    // Navbar -> AppBar + Toolbar
    expect(appTsx).toContain('<AppBar');
    expect(appTsx).toContain('<Toolbar');
    expect(appTsx).toContain('Atelier Verra');

    // Heading -> Typography variant="h1"
    expect(appTsx).toContain('<Typography');
    expect(appTsx).toContain('variant="h1"');
    expect(appTsx).toContain('Architecture of Quiet Permanence');

    // Button -> Button variant="contained"
    expect(appTsx).toContain('<Button');
    expect(appTsx).toContain('Explore Monograph');

    // List -> MUI List, ListItem, ListItemIcon, ListItemText
    expect(appTsx).toContain('<List dense');
    expect(appTsx).toContain('<ListItem');
    expect(appTsx).toContain('Residential Monoliths');

    // Footer -> Box component="footer"
    expect(appTsx).toContain('component="footer"');
    expect(appTsx).toContain('Atelier Verra Studio');
  });

  it('generates a valid theme.ts matching design tokens and primary colors', () => {
    const bundle = generateReactMuiCode(sampleElements, samplePageSettings, 'Atelier Verra');
    const { themeTs } = bundle;

    expect(themeTs).toContain("createTheme");
    expect(themeTs).toContain("responsiveFontSizes");
    expect(themeTs).toContain("#B4573A"); // Terracotta accent color
    expect(themeTs).toContain("#F6F3EE"); // Off-white background
  });

  it('includes MUI v5 dependencies in package.json', () => {
    const bundle = generateReactMuiCode(sampleElements, samplePageSettings, 'Atelier Verra');
    const pkg = JSON.parse(bundle.packageJson);

    expect(pkg.dependencies).toHaveProperty('@mui/material');
    expect(pkg.dependencies).toHaveProperty('@mui/icons-material');
    expect(pkg.dependencies).toHaveProperty('@emotion/react');
    expect(pkg.dependencies).toHaveProperty('@emotion/styled');
    expect(pkg.devDependencies).toHaveProperty('typescript');
  });

  it('supports custom navbar header title text color (brandTextColor)', () => {
    const navbarWithColor = [
      {
        id: 'el-nav-colored',
        type: 'navbar',
        name: 'Custom Nav',
        x: 0,
        y: 0,
        width: 1200,
        height: 64,
        styles: { backgroundColor: '#FFFFFF' },
        content: {
          brandText: 'NeonBrand',
          brandTextColor: '#2563EB',
          links: ['Home', 'About']
        }
      }
    ];

    const bundle = generateReactMuiCode(navbarWithColor, samplePageSettings, 'NeonBrand App');
    expect(bundle.appTsx).toContain('color: "#2563EB"');
    expect(bundle.appTsx).toContain('"NeonBrand"');
  });
});
