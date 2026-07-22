import { CanvasElement } from '../types';

export function alignElements(
  elements: CanvasElement[],
  selectedIds: string[],
  alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom'
): CanvasElement[] {
  if (selectedIds.length < 2) return elements;

  const selected = elements.filter((el) => selectedIds.includes(el.id));
  if (selected.length === 0) return elements;

  let minX = Math.min(...selected.map((el) => el.x));
  let maxX = Math.max(...selected.map((el) => el.x + el.width));
  let minY = Math.min(...selected.map((el) => el.y));
  let maxY = Math.max(...selected.map((el) => el.y + el.height));

  const centerX = minX + (maxX - minX) / 2;
  const centerY = minY + (maxY - minY) / 2;

  return elements.map((el) => {
    if (!selectedIds.includes(el.id) || el.locked) return el;

    let newX = el.x;
    let newY = el.y;

    switch (alignment) {
      case 'left':
        newX = minX;
        break;
      case 'center':
        newX = centerX - el.width / 2;
        break;
      case 'right':
        newX = maxX - el.width;
        break;
      case 'top':
        newY = minY;
        break;
      case 'middle':
        newY = centerY - el.height / 2;
        break;
      case 'bottom':
        newY = maxY - el.height;
        break;
    }

    return { ...el, x: newX, y: newY, updatedAt: Date.now() };
  });
}

export function distributeElements(
  elements: CanvasElement[],
  selectedIds: string[],
  axis: 'horizontal' | 'vertical'
): CanvasElement[] {
  if (selectedIds.length < 3) return elements;

  const selected = elements.filter((el) => selectedIds.includes(el.id));
  if (selected.length < 3) return elements;

  const copy = [...selected];

  if (axis === 'horizontal') {
    copy.sort((a, b) => a.x - b.x);
    const first = copy[0];
    const last = copy[copy.length - 1];

    const totalWidths = copy.reduce((sum, el) => sum + el.width, 0);
    const totalSpan = last.x + last.width - first.x;
    const availableSpace = totalSpan - totalWidths;
    const gap = availableSpace / (copy.length - 1);

    let currentX = first.x;
    const newPositions = new Map<string, number>();

    copy.forEach((el, idx) => {
      if (idx === 0) {
        newPositions.set(el.id, el.x);
        currentX += el.width + gap;
      } else if (idx === copy.length - 1) {
        newPositions.set(el.id, el.x);
      } else {
        newPositions.set(el.id, currentX);
        currentX += el.width + gap;
      }
    });

    return elements.map((el) => {
      if (newPositions.has(el.id) && !el.locked) {
        return { ...el, x: newPositions.get(el.id)!, updatedAt: Date.now() };
      }
      return el;
    });
  } else {
    copy.sort((a, b) => a.y - b.y);
    const first = copy[0];
    const last = copy[copy.length - 1];

    const totalHeights = copy.reduce((sum, el) => sum + el.height, 0);
    const totalSpan = last.y + last.height - first.y;
    const availableSpace = totalSpan - totalHeights;
    const gap = availableSpace / (copy.length - 1);

    let currentY = first.y;
    const newPositions = new Map<string, number>();

    copy.forEach((el, idx) => {
      if (idx === 0) {
        newPositions.set(el.id, el.y);
        currentY += el.height + gap;
      } else if (idx === copy.length - 1) {
        newPositions.set(el.id, el.y);
      } else {
        newPositions.set(el.id, currentY);
        currentY += el.height + gap;
      }
    });

    return elements.map((el) => {
      if (newPositions.has(el.id) && !el.locked) {
        return { ...el, y: newPositions.get(el.id)!, updatedAt: Date.now() };
      }
      return el;
    });
  }
}

export function groupElements(elements: CanvasElement[], selectedIds: string[]): CanvasElement[] {
  if (selectedIds.length < 2) return elements;
  const groupId = `grp_${Date.now()}`;

  return elements.map((el) => {
    if (selectedIds.includes(el.id)) {
      return { ...el, groupId, updatedAt: Date.now() };
    }
    return el;
  });
}

export function ungroupElements(elements: CanvasElement[], selectedIds: string[]): CanvasElement[] {
  if (selectedIds.length === 0) return elements;

  return elements.map((el) => {
    if (selectedIds.includes(el.id)) {
      const { groupId, ...rest } = el;
      return { ...rest, updatedAt: Date.now() };
    }
    return el;
  });
}
