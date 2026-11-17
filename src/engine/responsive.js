/**
 * LayoutForge Responsive Layout Engine
 * Converts absolute 1440px desktop coordinates into a clean, semantic Flexbox/Grid responsive layout.
 */

export const BASE_DESKTOP_WIDTH = 1440;

/**
 * Calculates a CSS clamp() expression for responsive typography.
 * Scales fluidly between mobile (375px) and desktop (1440px).
 */
export function calculateFluidTypography(fontSizePx) {
  if (!fontSizePx || fontSizePx <= 16) {
    return `${fontSizePx || 16}px`;
  }
  const minSizePx = Math.max(14, Math.round(fontSizePx * 0.65));
  const minRem = (minSizePx / 16).toFixed(2);
  const maxRem = (fontSizePx / 16).toFixed(2);
  const preferredVw = ((fontSizePx / BASE_DESKTOP_WIDTH) * 100).toFixed(2);
  return `clamp(${minRem}rem, ${preferredVw}vw + 0.5rem, ${maxRem}rem)`;
}

/**
 * Checks if two vertical ranges [y1, y1 + h1] and [y2, y2 + h2] overlap meaningfully.
 */
export function hasVerticalOverlap(y1, h1, y2, h2, thresholdRatio = 0.3) {
  const overlapTop = Math.max(y1, y2);
  const overlapBottom = Math.min(y1 + h1, y2 + h2);
  const overlapHeight = overlapBottom - overlapTop;
  if (overlapHeight <= 0) return false;
  const minHeight = Math.min(h1, h2);
  return (overlapHeight / minHeight) >= thresholdRatio;
}

/**
 * Groups elements into horizontal rows based on vertical overlap.
 */
export function groupElementsByRows(elements, baseWidth = BASE_DESKTOP_WIDTH) {
  if (!elements || elements.length === 0) return [];

  // Filter top-level elements only (nested elements belong to their parent container)
  const topLevel = elements
    .filter(el => !el.parentId)
    .sort((a, b) => a.y - b.y || a.x - b.x);

  const rows = [];
  let currentRow = null;

  topLevel.forEach((el) => {
    if (!currentRow) {
      currentRow = {
        minY: el.y,
        maxY: el.y + el.height,
        elements: [el]
      };
      return;
    }

    if (hasVerticalOverlap(currentRow.minY, currentRow.maxY - currentRow.minY, el.y, el.height)) {
      currentRow.elements.push(el);
      currentRow.minY = Math.min(currentRow.minY, el.y);
      currentRow.maxY = Math.max(currentRow.maxY, el.y + el.height);
    } else {
      // Sort elements left-to-right within completed row
      currentRow.elements.sort((a, b) => a.x - b.x);
      rows.push(currentRow);
      currentRow = {
        minY: el.y,
        maxY: el.y + el.height,
        elements: [el]
      };
    }
  });

  if (currentRow && currentRow.elements.length > 0) {
    currentRow.elements.sort((a, b) => a.x - b.x);
    rows.push(currentRow);
  }

  // Calculate layout metrics for each row
  return rows.map((row, index) => {
    const totalRowWidth = row.elements.reduce((sum, e) => sum + e.width, 0);
    const rowElementsWithMetrics = row.elements.map((el, elIndex) => {
      const widthPercent = Math.min(100, Math.max(5, +((el.width / baseWidth) * 100).toFixed(2)));
      return {
        ...el,
        widthPercent,
        isFullWidth: widthPercent > 80,
        order: elIndex + 1
      };
    });

    const previousRow = index > 0 ? rows[index - 1] : null;
    const marginTop = previousRow ? Math.max(0, row.minY - previousRow.maxY) : row.minY;

    return {
      rowIndex: index + 1,
      minY: row.minY,
      maxY: row.maxY,
      height: row.maxY - row.minY,
      marginTop,
      elementsCount: row.elements.length,
      elements: rowElementsWithMetrics
    };
  });
}

/**
 * Builds responsive layout data including rows, nested child mapping, and media rules.
 */
export function buildResponsiveLayout(elements, pageSettings = {}, baseWidth = BASE_DESKTOP_WIDTH) {
  const visibleElements = (elements || []).filter(e => !e.hidden);
  const rows = groupElementsByRows(visibleElements, baseWidth);

  // Group nested children by parent ID
  const nestedChildrenMap = {};
  visibleElements.forEach(el => {
    if (el.parentId) {
      if (!nestedChildrenMap[el.parentId]) {
        nestedChildrenMap[el.parentId] = [];
      }
      nestedChildrenMap[el.parentId].push(el);
    }
  });

  // Sort nested children by y and x
  Object.keys(nestedChildrenMap).forEach(parentId => {
    nestedChildrenMap[parentId].sort((a, b) => a.y - b.y || a.x - b.x);
  });

  return {
    baseWidth,
    pageSettings,
    rows,
    nestedChildrenMap,
    totalElements: visibleElements.length
  };
}

export const DEVICE_WIDTHS = {
  desktop: 1440,
  tablet: 768,
  mobile: 375
};

/**
 * Calculates automatic responsive geometry (x, y, width, height, font sizes)
 * for an element when rendered in desktop, tablet, or mobile viewport modes.
 */
export function getResponsiveElementGeometry(element, activeDevice = 'desktop', allElements = [], baseWidth = BASE_DESKTOP_WIDTH) {
  if (!element) return { x: 0, y: 0, width: 100, height: 40, styles: {} };
  if (activeDevice === 'desktop' || !activeDevice) {
    return {
      ...element,
      x: element.x,
      y: element.y,
      width: element.width,
      height: element.height,
      styles: element.styles || {}
    };
  }

  const targetWidth = DEVICE_WIDTHS[activeDevice] || 1440;
  const isTablet = activeDevice === 'tablet';
  const isMobile = activeDevice === 'mobile';
  const override = element.responsiveOverride?.[activeDevice] || {};

  // If the user already provided an explicit override for this device, honor it
  if (override.x !== undefined && override.y !== undefined && override.width !== undefined && override.height !== undefined) {
    return {
      ...element,
      x: override.x,
      y: override.y,
      width: override.width,
      height: override.height,
      styles: { ...(element.styles || {}), ...(override.styles || {}) }
    };
  }

  const s = element.styles || {};
  let resX = element.x;
  let resY = element.y;
  let resWidth = element.width;
  let resHeight = element.height;
  let resStyles = { ...s };

  // --- 1. NAVBAR ---
  if (element.type === 'navbar') {
    resX = 0;
    resY = 0;
    resWidth = targetWidth;
    resHeight = isMobile ? Math.max(60, element.height || 60) : Math.max(64, element.height || 64);
  }
  // --- 2. FOOTER ---
  else if (element.type === 'footer') {
    resX = 0;
    resWidth = targetWidth;
    if (isMobile) {
      resHeight = Math.max(140, element.height || 140);
    }
  }
  // --- 3. CARDS & CONTAINERS ---
  else if (element.type === 'card' || element.type === 'container') {
    // Find sibling cards in the same horizontal row on desktop
    const siblingCards = (allElements || [])
      .filter(el => (el.type === 'card' || el.type === 'container') && !el.parentId && Math.abs(el.y - element.y) < 60)
      .sort((a, b) => a.x - b.x);

    const cardIndex = siblingCards.findIndex(c => c.id === element.id);
    const rowCardsCount = siblingCards.length;

    if (isMobile) {
      // Mobile (375px): Full-width cards (335px), stacked vertically with 20px gaps
      const padding = 20;
      resWidth = targetWidth - (padding * 2);
      resX = padding;

      if (rowCardsCount > 1 && cardIndex >= 0) {
        const cardH = Math.max(element.height || 220, 200);
        resHeight = cardH;
        resY = element.y + (cardIndex * (cardH + 20));
      } else {
        resWidth = Math.min(element.width, targetWidth - (padding * 2));
        resX = padding;
      }
    } else if (isTablet) {
      // Tablet (768px): 2-column or fluid grid
      const padding = 20;
      const availableWidth = targetWidth - (padding * 2);

      if (rowCardsCount <= 1 || cardIndex === -1) {
        resWidth = Math.min(element.width, availableWidth);
        resX = Math.max(padding, Math.round((targetWidth - resWidth) / 2));
      } else if (rowCardsCount === 2) {
        const gap = 20;
        const colW = Math.floor((availableWidth - gap) / 2);
        resWidth = colW;
        resX = padding + cardIndex * (colW + gap);
      } else if (rowCardsCount >= 3) {
        const gap = 20;
        const colW = Math.floor((availableWidth - gap) / 2);
        if (cardIndex < 2) {
          resWidth = colW;
          resX = padding + cardIndex * (colW + gap);
          resY = element.y;
        } else {
          // 3rd card on second row
          resWidth = availableWidth;
          resX = padding;
          resY = element.y + element.height + 20;
        }
      }
    }
  }
  // --- 4. HEADINGS & TEXT ---
  else if (element.type === 'heading' || element.type === 'text') {
    const padding = 20;
    const maxContentWidth = targetWidth - (padding * 2);
    resWidth = Math.min(element.width, maxContentWidth);

    const isDesktopCentered = Math.abs((element.x + element.width / 2) - (baseWidth / 2)) < 80;
    if (isDesktopCentered) {
      resX = Math.max(padding, Math.round((targetWidth - resWidth) / 2));
    } else {
      resX = Math.max(padding, Math.min(targetWidth - resWidth - padding, Math.round(element.x * (targetWidth / baseWidth))));
    }

    if (s.fontSize) {
      const origSize = Number(s.fontSize);
      if (isMobile) {
        resStyles.fontSize = origSize > 32
          ? Math.max(22, Math.round(origSize * 0.65))
          : origSize > 20
          ? Math.max(16, Math.round(origSize * 0.8))
          : Math.max(13, origSize);
      } else if (isTablet) {
        resStyles.fontSize = origSize > 28
          ? Math.max(20, Math.round(origSize * 0.82))
          : origSize;
      }
    }
  }
  // --- 5. BUTTONS, BADGES, LABELS ---
  else if (element.type === 'button' || element.type === 'badge' || element.type === 'label') {
    const padding = 20;
    const maxContentWidth = targetWidth - (padding * 2);
    resWidth = Math.min(element.width, maxContentWidth);

    const isDesktopCentered = Math.abs((element.x + element.width / 2) - (baseWidth / 2)) < 80;
    if (isDesktopCentered) {
      resX = Math.max(padding, Math.round((targetWidth - resWidth) / 2));
    } else {
      resX = Math.max(padding, Math.min(targetWidth - resWidth - padding, Math.round(element.x * (targetWidth / baseWidth))));
    }
  }
  // --- 6. OTHER ELEMENTS ---
  else {
    const padding = 20;
    const maxContentWidth = targetWidth - (padding * 2);
    resWidth = Math.min(element.width, maxContentWidth);
    resX = Math.max(padding, Math.min(targetWidth - resWidth - padding, Math.round(element.x * (targetWidth / baseWidth))));
  }

  // Adjust Y on mobile for elements that appear below stacked cards
  if (isMobile && element.type !== 'navbar') {
    const siblingCardsAbove = (allElements || []).filter(el =>
      (el.type === 'card' || el.type === 'container') &&
      !el.parentId &&
      el.y < element.y - 40
    );

    const cardRows = {};
    siblingCardsAbove.forEach(c => {
      const rowKey = Math.round(c.y / 60) * 60;
      if (!cardRows[rowKey]) cardRows[rowKey] = [];
      cardRows[rowKey].push(c);
    });

    let extraYOffset = 0;
    Object.values(cardRows).forEach(cardsInRow => {
      if (cardsInRow.length > 1) {
        const avgH = cardsInRow.reduce((sum, c) => sum + (c.height || 220), 0) / cardsInRow.length;
        extraYOffset += (cardsInRow.length - 1) * (avgH + 20);
      }
    });

    if (element.y > 80 && extraYOffset > 0) {
      resY += extraYOffset;
    }
  }

  return {
    ...element,
    x: override.x !== undefined ? override.x : resX,
    y: override.y !== undefined ? override.y : resY,
    width: override.width !== undefined ? override.width : resWidth,
    height: override.height !== undefined ? override.height : resHeight,
    styles: { ...resStyles, ...(override.styles || {}) }
  };
}

/**
 * Calculates total responsive artboard height, taking into account stacked cards on mobile.
 */
export function getResponsiveArtboardMinHeight(elements, activeDevice = 'desktop', baseHeight = 960) {
  if (activeDevice === 'desktop' || !activeDevice) {
    return baseHeight;
  }
  const responsiveElements = (elements || []).map(el =>
    getResponsiveElementGeometry(el, activeDevice, elements)
  );
  const maxBottom = responsiveElements.reduce(
    (max, el) => Math.max(max, (el.y || 0) + (el.height || 0)),
    0
  );
  return Math.max(baseHeight, maxBottom + 80);
}
