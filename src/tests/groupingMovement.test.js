import { describe, it, expect, beforeEach } from 'vitest';
import {
  isElementInsideContainer,
  getContainedElements,
  getParentContainer,
  getRelatedGroupIds,
  doBoxesIntersect
} from '../utils/groupingUtils';
import { useProjectStore } from '../store/useProjectStore';

describe('Card and Group Movement with Shift + Mouse', () => {
  const mockCard = {
    id: 'test_card_1',
    type: 'card',
    x: 100,
    y: 200,
    width: 400,
    height: 300
  };

  const mockLabel = {
    id: 'test_label_1',
    type: 'label',
    parentId: 'test_card_1',
    x: 120,
    y: 220,
    width: 150,
    height: 30
  };

  const mockText = {
    id: 'test_text_1',
    type: 'text',
    parentId: 'test_card_1',
    x: 120,
    y: 260,
    width: 360,
    height: 80
  };

  const mockOutsideButton = {
    id: 'test_btn_outside',
    type: 'button',
    parentId: null,
    x: 600,
    y: 200,
    width: 140,
    height: 44
  };

  const allElements = [mockCard, mockLabel, mockText, mockOutsideButton];

  it('correctly detects elements spatially contained inside a card', () => {
    expect(isElementInsideContainer(mockCard, mockLabel)).toBe(true);
    expect(isElementInsideContainer(mockCard, mockText)).toBe(true);
    expect(isElementInsideContainer(mockCard, mockOutsideButton)).toBe(false);
  });

  it('finds all contained elements (label and text) for a card', () => {
    const contained = getContainedElements(mockCard, allElements);
    const containedIds = contained.map(e => e.id);
    expect(containedIds).toContain('test_label_1');
    expect(containedIds).toContain('test_text_1');
    expect(containedIds).not.toContain('test_btn_outside');
  });

  it('finds the parent card of a label or text', () => {
    const parent = getParentContainer(mockLabel, allElements);
    expect(parent).not.toBeNull();
    expect(parent.id).toBe('test_card_1');
  });

  it('when moving a card, automatically groups all contained elements (label and text)', () => {
    const relatedIds = getRelatedGroupIds(mockCard, allElements, [], false);
    expect(relatedIds).toContain('test_label_1');
    expect(relatedIds).toContain('test_text_1');
    expect(relatedIds).not.toContain('test_btn_outside');
  });

  it('when dragging a label inside a card with Shift key, shifts the card and sibling text as a group', () => {
    const relatedIdsWithShift = getRelatedGroupIds(mockLabel, allElements, [], true);
    // Shift + drag on label should include parent card and sibling text
    expect(relatedIdsWithShift).toContain('test_card_1');
    expect(relatedIdsWithShift).toContain('test_text_1');
  });

  it('calculates bounding box intersection for marquee selection', () => {
    const selectionBox = { x: 90, y: 190, width: 200, height: 100 };
    expect(doBoxesIntersect(selectionBox, mockCard)).toBe(true);
    expect(doBoxesIntersect(selectionBox, mockLabel)).toBe(true);
    expect(doBoxesIntersect(selectionBox, mockOutsideButton)).toBe(false);
  });

  it('useProjectStore.moveElementsGroup moves all group elements together with exact relative offsets', () => {
    const store = useProjectStore.getState();

    // Set test elements
    useProjectStore.setState({
      elements: [
        { id: 'c1', type: 'card', x: 100, y: 100, width: 300, height: 200 },
        { id: 'l1', type: 'label', parentId: 'c1', x: 120, y: 120, width: 100, height: 20 },
        { id: 't1', type: 'text', parentId: 'c1', x: 120, y: 150, width: 200, height: 50 },
        { id: 'o1', type: 'button', x: 600, y: 600, width: 100, height: 40 }
      ]
    });

    // Move card by dx: 50, dy: 70
    useProjectStore.getState().moveElementsGroup('c1', ['l1', 't1'], 50, 70);

    const updated = useProjectStore.getState().elements;
    const updatedCard = updated.find(e => e.id === 'c1');
    const updatedLabel = updated.find(e => e.id === 'l1');
    const updatedText = updated.find(e => e.id === 't1');
    const updatedOther = updated.find(e => e.id === 'o1');

    expect(updatedCard.x).toBe(150);
    expect(updatedCard.y).toBe(170);
    expect(updatedLabel.x).toBe(170);
    expect(updatedLabel.y).toBe(190);
    expect(updatedText.x).toBe(170);
    expect(updatedText.y).toBe(220);

    // Unrelated element must not move
    expect(updatedOther.x).toBe(600);
    expect(updatedOther.y).toBe(600);
  });

  it('groups and ungroups elements correctly with groupElements and ungroupElements', () => {
    useProjectStore.setState({
      elements: [
        { id: 'el1', x: 10, y: 10, width: 50, height: 50 },
        { id: 'el2', x: 70, y: 10, width: 50, height: 50 }
      ],
      selectedElementIds: ['el1', 'el2']
    });

    useProjectStore.getState().groupElements();
    let els = useProjectStore.getState().elements;
    expect(els[0].groupId).toBeDefined();
    expect(els[0].groupId).toBe(els[1].groupId);

    useProjectStore.getState().ungroupElements(['el1', 'el2']);
    els = useProjectStore.getState().elements;
    expect(els[0].groupId).toBeNull();
    expect(els[1].groupId).toBeNull();
  });
});
