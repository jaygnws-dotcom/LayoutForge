/**
 * Grouping and Spatial Containment Utilities for Canvas Elements
 */

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Checks whether an element is spatially contained inside (or substantially inside) a container.
 */
export function isElementInsideContainer(
  container: BoundingBox,
  element: BoundingBox,
  tolerance: number = 20
): boolean {
  return (
    element.x >= container.x - tolerance &&
    element.y >= container.y - tolerance &&
    element.x + element.width <= container.x + container.width + tolerance &&
    element.y + element.height <= container.y + container.height + tolerance
  );
}

/**
 * Checks whether two bounding boxes intersect (used for marquee selection).
 */
export function doBoxesIntersect(a: BoundingBox, b: BoundingBox): boolean {
  return !(
    a.x + a.width < b.x ||
    b.x + b.width < a.x ||
    a.y + a.height < b.y ||
    b.y + b.height < a.y
  );
}

/**
 * Finds all elements that are children of or contained inside a card/container.
 */
export function getContainedElements(container: any, allElements: any[]): any[] {
  if (!container) return [];
  return allElements.filter(el => {
    if (el.id === container.id || el.hidden || el.locked) return false;
    // 1. Explicit parentId
    if (el.parentId === container.id) return true;
    // 2. Explicit groupId match
    if (container.groupId && el.groupId === container.groupId) return true;
    // 3. Spatial containment inside card bounds
    if (isElementInsideContainer(container, el)) return true;
    return false;
  });
}

/**
 * Finds the parent container (card, container, section) that encloses the target element.
 */
export function getParentContainer(element: any, allElements: any[]): any | null {
  if (!element) return null;
  // 1. Check parentId
  if (element.parentId) {
    const parent = allElements.find(e => e.id === element.parentId);
    if (parent) return parent;
  }
  // 2. Check spatial enclosing containers
  const containerTypes = ['card', 'container', 'section'];
  const possibleContainers = allElements.filter(
    e => e.id !== element.id && containerTypes.includes(e.type) && !e.hidden
  );

  for (const c of possibleContainers) {
    if (isElementInsideContainer(c, element)) {
      return c;
    }
  }
  return null;
}

/**
 * Resolves all element IDs that should move together as a group when dragging targetElement.
 * 
 * Supports:
 * - Card/container moving along with its labels, texts, and buttons
 * - Shift + mouse drag: shifts the enclosing card and all sibling elements
 * - Multi-selected elements moving simultaneously
 * - Explicitly grouped elements (via groupId)
 */
export function getRelatedGroupIds(
  targetElement: any,
  allElements: any[],
  selectedElementIds: string[] = [],
  isShiftActive: boolean = false
): string[] {
  if (!targetElement) return [];
  const groupIds = new Set<string>();

  // 1. Multi-Selection: If this element is selected and other elements are also selected
  if (selectedElementIds.includes(targetElement.id) && selectedElementIds.length > 1) {
    selectedElementIds.forEach(id => {
      if (id !== targetElement.id) groupIds.add(id);
    });
  }

  // 2. Explicit Group: Elements sharing the same groupId
  if (targetElement.groupId) {
    allElements.forEach(el => {
      if (el.groupId === targetElement.groupId && el.id !== targetElement.id && !el.locked) {
        groupIds.add(el.id);
      }
    });
  }

  // 3. If target is a container/card: include all its contained/child elements
  const isContainer = ['card', 'container', 'section'].includes(targetElement.type);
  if (isContainer) {
    const contained = getContainedElements(targetElement, allElements);
    contained.forEach(el => groupIds.add(el.id));
  }

  // 4. If target is an inner element (e.g. label or text inside a card):
  // When Shift is pressed (Shift + mouse drag), or if it has parentId:
  // Move the entire parent card AND all sister elements in the card!
  if (isShiftActive || targetElement.parentId) {
    const parent = getParentContainer(targetElement, allElements);
    if (parent && !parent.locked) {
      groupIds.add(parent.id);
      const siblings = getContainedElements(parent, allElements);
      siblings.forEach(el => {
        if (el.id !== targetElement.id) groupIds.add(el.id);
      });
    }
  }

  return Array.from(groupIds);
}
