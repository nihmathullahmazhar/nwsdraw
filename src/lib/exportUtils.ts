import { CanvasElement, DrawingProject } from '../types';

/* ------------------------------------------------------------------ *
 * Text measurement & wrapping — SVG <text> has no auto-wrap, so we
 * reproduce the app's padded, wrapped, overflow-hidden text box.
 * ------------------------------------------------------------------ */
let measureCtx: CanvasRenderingContext2D | null = null;
function measureWidth(text: string, font: string): number {
  if (!measureCtx) measureCtx = document.createElement('canvas').getContext('2d');
  if (!measureCtx) return text.length * 8;
  measureCtx.font = font;
  return measureCtx.measureText(text).width;
}

function wrapText(text: string, maxWidth: number, font: string): string[] {
  const lines: string[] = [];
  for (const para of text.split('\n')) {
    if (para.trim() === '') {
      lines.push('');
      continue;
    }
    let line = '';
    for (const word of para.split(/\s+/)) {
      const candidate = line ? `${line} ${word}` : word;
      if (measureWidth(candidate, font) <= maxWidth) {
        line = candidate;
      } else if (!line && measureWidth(word, font) > maxWidth) {
        // single word wider than the box — hard-break it
        let chunk = '';
        for (const ch of word) {
          if (chunk && measureWidth(chunk + ch, font) > maxWidth) {
            lines.push(chunk);
            chunk = ch;
          } else {
            chunk += ch;
          }
        }
        line = chunk;
      } else {
        lines.push(line);
        line = word;
      }
    }
    lines.push(line);
  }
  return lines;
}

/** Perceived luminance of a hex/rgb color (0 dark … 1 light). */
function colorLuminance(color: string): number {
  let r = 255;
  let g = 255;
  let b = 255;
  const hex = color.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i)?.[1];
  if (hex) {
    const full = hex.length === 3 ? hex.split('').map((c) => c + c).join('') : hex;
    r = parseInt(full.slice(0, 2), 16);
    g = parseInt(full.slice(2, 4), 16);
    b = parseInt(full.slice(4, 6), 16);
  } else {
    const rgb = color.match(/rgba?\((\d+)[,\s]+(\d+)[,\s]+(\d+)/);
    if (rgb) {
      r = +rgb[1];
      g = +rgb[2];
      b = +rgb[3];
    }
  }
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

/**
 * Generates an SVG string representation of the elements on the canvas
 */
export function generateSvgFromElements(
  elements: CanvasElement[],
  backgroundColor: string = '#ffffff'
): string {
  // Calculate bounding box
  if (elements.length === 0) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect width="100%" height="100%" fill="${backgroundColor}"/></svg>`;
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  elements.forEach((el) => {
    if (el.hidden) return;
    minX = Math.min(minX, el.x);
    minY = Math.min(minY, el.y);
    maxX = Math.max(maxX, el.x + el.width);
    maxY = Math.max(maxY, el.y + el.height);

    if (el.points) {
      el.points.forEach((p) => {
        minX = Math.min(minX, p.x);
        minY = Math.min(minY, p.y);
        maxX = Math.max(maxX, p.x);
        maxY = Math.max(maxY, p.y);
      });
    }
  });

  const padding = 40;
  minX = Math.floor(minX - padding);
  minY = Math.floor(minY - padding);
  const width = Math.ceil(maxX - minX + padding * 2) || 800;
  const height = Math.ceil(maxY - minY + padding * 2) || 600;

  let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${minX} ${minY} ${width} ${height}">`;
  svgContent += `<rect x="${minX}" y="${minY}" width="${width}" height="${height}" fill="${backgroundColor}"/>`;

  // Match the app's dark/light default colors to the export background
  const isDarkBg = colorLuminance(backgroundColor) < 0.5;
  const defaultStroke = isDarkBg ? '#e2e8f0' : '#0f172a';
  const defaultText = isDarkBg ? '#f8fafc' : '#0f172a';

  elements.forEach((el) => {
    if (el.hidden) return;

    const stroke = el.strokeColor || defaultStroke;
    const fill = el.fillColor || 'none';
    const sw = el.strokeWidth ?? 2;
    const opacity = el.opacity ?? 1;

    let dashAttr = '';
    if (el.strokeStyle === 'dashed') dashAttr = `stroke-dasharray="6,6"`;
    if (el.strokeStyle === 'dotted') dashAttr = `stroke-dasharray="2,4"`;

    const rotTransform = el.rotation
      ? `transform="rotate(${el.rotation} ${el.x + el.width / 2} ${el.y + el.height / 2})"`
      : '';

    switch (el.type) {
      case 'pencil':
      case 'pen':
      case 'highlighter':
        if (el.points && el.points.length > 0) {
          const pathData = el.points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
          const highOp = el.type === 'highlighter' ? 0.4 : opacity;
          svgContent += `<path d="${pathData}" stroke="${stroke}" stroke-width="${sw}" fill="none" opacity="${highOp}" stroke-linecap="round" stroke-linejoin="round" ${dashAttr}/>`;
        }
        break;

      case 'line':
      case 'arrow':
      case 'double-arrow':
      case 'connector': {
        // Resolve element-bound connectors just like the live canvas does
        let p1 = el.points?.[0] || { x: el.x, y: el.y };
        let p2 = el.points?.[1] || { x: el.x + el.width, y: el.y + el.height };
        if (el.startElementId) {
          const startEl = elements.find((s) => s.id === el.startElementId);
          const endEl = elements.find((s) => s.id === el.endElementId);
          if (startEl) p1 = { x: startEl.x + startEl.width / 2, y: startEl.y + startEl.height / 2 };
          if (endEl) p2 = { x: endEl.x + endEl.width / 2, y: endEl.y + endEl.height / 2 };
        }
        svgContent += `<line x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}" stroke="${stroke}" stroke-width="${sw}" opacity="${opacity}" ${dashAttr}/>`;

        const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
        const head = (hx: number, hy: number, a: number) => {
          const s = 10;
          return `${hx},${hy} ${hx - s * Math.cos(a - 0.45)},${hy - s * Math.sin(a - 0.45)} ${hx - s * Math.cos(a + 0.45)},${hy - s * Math.sin(a + 0.45)}`;
        };
        if (el.type === 'arrow' || el.type === 'double-arrow' || el.type === 'connector') {
          svgContent += `<polygon points="${head(p2.x, p2.y, angle)}" fill="${stroke}" opacity="${opacity}"/>`;
        }
        if (el.type === 'double-arrow') {
          svgContent += `<polygon points="${head(p1.x, p1.y, angle + Math.PI)}" fill="${stroke}" opacity="${opacity}"/>`;
        }
        // Label at the midpoint (connector text like Yes / No)
        if (el.text) {
          const mx = (p1.x + p2.x) / 2;
          const my = (p1.y + p2.y) / 2 - 7;
          svgContent += `<text x="${mx}" y="${my}" text-anchor="middle" font-size="${el.fontSize || 12}" font-weight="600" font-family="system-ui, sans-serif" fill="${el.textColor || stroke}" stroke="${backgroundColor}" stroke-width="4" paint-order="stroke" opacity="${opacity}">${escapeXml(el.text)}</text>`;
        }
        break;
      }

      case 'rectangle':
      case 'wireframe-card':
        svgContent += `<rect x="${el.x}" y="${el.y}" width="${el.width}" height="${el.height}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" opacity="${opacity}" ${dashAttr} ${rotTransform}/>`;
        break;

      case 'wireframe-input':
        svgContent += `<g opacity="${opacity}" ${rotTransform}><rect x="${el.x}" y="${el.y}" width="${el.width}" height="${el.height}" rx="6" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" ${dashAttr}/><line x1="${el.x + 10}" y1="${el.y + el.height * 0.25}" x2="${el.x + 10}" y2="${el.y + el.height * 0.75}" stroke="${stroke}" stroke-width="1.5" opacity="0.7"/></g>`;
        break;

      case 'rounded-rectangle':
      case 'flowchart-start':
      case 'flowchart-process':
      case 'sticky-note':
      case 'mindmap-node':
      case 'wireframe-button':
        const rx = el.type === 'flowchart-start' ? el.height / 2 : el.type === 'sticky-note' ? 4 : 8;
        svgContent += `<rect x="${el.x}" y="${el.y}" width="${el.width}" height="${el.height}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" opacity="${opacity}" ${dashAttr} ${rotTransform}/>`;
        break;

      case 'circle':
      case 'ellipse':
        const cx = el.x + el.width / 2;
        const cy = el.y + el.height / 2;
        svgContent += `<ellipse cx="${cx}" cy="${cy}" rx="${el.width / 2}" ry="${el.height / 2}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" opacity="${opacity}" ${dashAttr} ${rotTransform}/>`;
        break;

      case 'triangle':
        const tPoints = `${el.x + el.width / 2},${el.y} ${el.x + el.width},${el.y + el.height} ${el.x},${el.y + el.height}`;
        svgContent += `<polygon points="${tPoints}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" opacity="${opacity}" ${dashAttr} ${rotTransform}/>`;
        break;

      case 'diamond':
      case 'flowchart-decision':
        const dPoints = `${el.x + el.width / 2},${el.y} ${el.x + el.width},${el.y + el.height / 2} ${el.x + el.width / 2},${el.y + el.height} ${el.x},${el.y + el.height / 2}`;
        svgContent += `<polygon points="${dPoints}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" opacity="${opacity}" ${dashAttr} ${rotTransform}/>`;
        break;

      case 'image':
        if (el.src) {
          svgContent += `<image href="${el.src}" x="${el.x}" y="${el.y}" width="${el.width}" height="${el.height}" preserveAspectRatio="none" opacity="${opacity}" ${rotTransform}/>`;
        }
        break;

      case 'star': {
        const cx2 = el.x + el.width / 2;
        const cy2 = el.y + el.height / 2;
        const outerR = Math.min(el.width, el.height) / 2;
        const innerR = outerR * 0.4;
        const pts: string[] = [];
        for (let i = 0; i < 10; i++) {
          const r = i % 2 === 0 ? outerR : innerR;
          const a = (Math.PI / 5) * i - Math.PI / 2;
          pts.push(`${(cx2 + r * Math.cos(a)).toFixed(1)},${(cy2 + r * Math.sin(a)).toFixed(1)}`);
        }
        svgContent += `<polygon points="${pts.join(' ')}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round" opacity="${opacity}" ${dashAttr} ${rotTransform}/>`;
        break;
      }

      case 'hexagon':
        svgContent += `<polygon points="${el.x + el.width * 0.25},${el.y} ${el.x + el.width * 0.75},${el.y} ${el.x + el.width},${el.y + el.height / 2} ${el.x + el.width * 0.75},${el.y + el.height} ${el.x + el.width * 0.25},${el.y + el.height} ${el.x},${el.y + el.height / 2}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" opacity="${opacity}" ${dashAttr} ${rotTransform}/>`;
        break;

      case 'flowchart-input':
        svgContent += `<polygon points="${el.x + el.width * 0.2},${el.y} ${el.x + el.width},${el.y} ${el.x + el.width * 0.8},${el.y + el.height} ${el.x},${el.y + el.height}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" opacity="${opacity}" ${dashAttr} ${rotTransform}/>`;
        break;

      case 'flowchart-db': {
        const ry2 = el.height * 0.15;
        svgContent += `<g opacity="${opacity}" ${rotTransform}><path d="M ${el.x} ${el.y + ry2} L ${el.x} ${el.y + el.height - ry2} A ${el.width / 2} ${ry2} 0 0 0 ${el.x + el.width} ${el.y + el.height - ry2} L ${el.x + el.width} ${el.y + ry2}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/><ellipse cx="${el.x + el.width / 2}" cy="${el.y + ry2}" rx="${el.width / 2}" ry="${ry2}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/></g>`;
        break;
      }

      case 'flowchart-doc':
        svgContent += `<path d="M ${el.x} ${el.y} L ${el.x + el.width} ${el.y} L ${el.x + el.width} ${el.y + el.height * 0.82} Q ${el.x + el.width * 0.75} ${el.y + el.height * 1.02} ${el.x + el.width * 0.5} ${el.y + el.height * 0.87} Q ${el.x + el.width * 0.25} ${el.y + el.height * 0.72} ${el.x} ${el.y + el.height * 0.87} Z" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" opacity="${opacity}" ${dashAttr} ${rotTransform}/>`;
        break;

      case 'uml-class':
      case 'erd-entity':
        svgContent += `<g opacity="${opacity}" ${rotTransform}><rect x="${el.x}" y="${el.y}" width="${el.width}" height="${el.height}" rx="4" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
        if (el.type === 'uml-class') {
          svgContent += `<line x1="${el.x}" y1="${el.y + el.height * 0.3}" x2="${el.x + el.width}" y2="${el.y + el.height * 0.3}" stroke="${stroke}" stroke-width="1"/><line x1="${el.x}" y1="${el.y + el.height * 0.65}" x2="${el.x + el.width}" y2="${el.y + el.height * 0.65}" stroke="${stroke}" stroke-width="1"/>`;
        }
        svgContent += `</g>`;
        break;

      case 'erd-relation':
        svgContent += `<polygon points="${el.x + el.width / 2},${el.y} ${el.x + el.width},${el.y + el.height / 2} ${el.x + el.width / 2},${el.y + el.height} ${el.x},${el.y + el.height / 2}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" opacity="${opacity}" ${rotTransform}/>`;
        break;

      case 'wireframe-browser':
        svgContent += `<g opacity="${opacity}" ${rotTransform}><rect x="${el.x}" y="${el.y}" width="${el.width}" height="${el.height}" rx="8" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/><line x1="${el.x}" y1="${el.y + 36}" x2="${el.x + el.width}" y2="${el.y + 36}" stroke="${stroke}" stroke-width="1"/><circle cx="${el.x + 16}" cy="${el.y + 18}" r="4" fill="#ef4444"/><circle cx="${el.x + 32}" cy="${el.y + 18}" r="4" fill="#f59e0b"/><circle cx="${el.x + 48}" cy="${el.y + 18}" r="4" fill="#10b981"/></g>`;
        break;

      case 'wireframe-mobile':
        svgContent += `<g opacity="${opacity}" ${rotTransform}><rect x="${el.x}" y="${el.y}" width="${el.width}" height="${el.height}" rx="24" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/><rect x="${el.x + el.width / 2 - 25}" y="${el.y + 12}" width="50" height="12" rx="6" fill="${stroke}"/></g>`;
        break;

      case 'wireframe-navbar':
        svgContent += `<g opacity="${opacity}" ${rotTransform}><rect x="${el.x}" y="${el.y}" width="${el.width}" height="${el.height}" rx="8" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/><circle cx="${el.x + el.height / 2}" cy="${el.y + el.height / 2}" r="${el.height * 0.22}" fill="${stroke}" opacity="0.7"/><rect x="${el.x + el.width * 0.55}" y="${el.y + el.height * 0.38}" width="${Math.min(28, el.width * 0.1)}" height="${el.height * 0.24}" rx="3" fill="${stroke}" opacity="0.45"/><rect x="${el.x + el.width * 0.7}" y="${el.y + el.height * 0.38}" width="${Math.min(28, el.width * 0.1)}" height="${el.height * 0.24}" rx="3" fill="${stroke}" opacity="0.45"/><rect x="${el.x + el.width * 0.85}" y="${el.y + el.height * 0.38}" width="${Math.min(28, el.width * 0.1)}" height="${el.height * 0.24}" rx="3" fill="${stroke}" opacity="0.45"/></g>`;
        break;

      case 'wireframe-sidebar':
        svgContent += `<g opacity="${opacity}" ${rotTransform}><rect x="${el.x}" y="${el.y}" width="${el.width}" height="${el.height}" rx="8" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/><rect x="${el.x + el.width * 0.12}" y="${el.y + el.height * 0.15}" width="${el.width * 0.76}" height="${el.height * 0.06}" rx="3" fill="${stroke}" opacity="0.7"/><rect x="${el.x + el.width * 0.12}" y="${el.y + el.height * 0.28}" width="${el.width * 0.76}" height="${el.height * 0.06}" rx="3" fill="${stroke}" opacity="0.35"/><rect x="${el.x + el.width * 0.12}" y="${el.y + el.height * 0.41}" width="${el.width * 0.76}" height="${el.height * 0.06}" rx="3" fill="${stroke}" opacity="0.35"/><rect x="${el.x + el.width * 0.12}" y="${el.y + el.height * 0.54}" width="${el.width * 0.76}" height="${el.height * 0.06}" rx="3" fill="${stroke}" opacity="0.35"/></g>`;
        break;

      case 'wireframe-image':
        svgContent += `<g opacity="${opacity}" ${rotTransform}><rect x="${el.x}" y="${el.y}" width="${el.width}" height="${el.height}" rx="6" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/><line x1="${el.x}" y1="${el.y}" x2="${el.x + el.width}" y2="${el.y + el.height}" stroke="${stroke}" stroke-width="1" opacity="0.6"/><line x1="${el.x + el.width}" y1="${el.y}" x2="${el.x}" y2="${el.y + el.height}" stroke="${stroke}" stroke-width="1" opacity="0.6"/></g>`;
        break;

      case 'wireframe-toggle':
        svgContent += `<g opacity="${opacity}" ${rotTransform}><rect x="${el.x}" y="${el.y}" width="${el.width}" height="${el.height}" rx="${el.height / 2}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/><circle cx="${el.x + el.width - el.height / 2}" cy="${el.y + el.height / 2}" r="${el.height * 0.34}" fill="${stroke}"/></g>`;
        break;

      case 'wireframe-badge':
        svgContent += `<rect x="${el.x}" y="${el.y}" width="${el.width}" height="${el.height}" rx="${el.height / 2}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" opacity="${opacity}" ${rotTransform}/>`;
        break;

      case 'wireframe-dropdown':
        svgContent += `<g opacity="${opacity}" ${rotTransform}><rect x="${el.x}" y="${el.y}" width="${el.width}" height="${el.height}" rx="6" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/><polyline points="${el.x + el.width - 22},${el.y + el.height * 0.42} ${el.x + el.width - 15},${el.y + el.height * 0.58} ${el.x + el.width - 8},${el.y + el.height * 0.42}" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round"/></g>`;
        break;

      case 'asset-icon':
        svgContent += `<rect x="${el.x}" y="${el.y}" width="${el.width}" height="${el.height}" rx="12" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" opacity="${opacity}" ${rotTransform}/>`;
        break;

      default:
        svgContent += `<rect x="${el.x}" y="${el.y}" width="${el.width}" height="${el.height}" rx="6" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" opacity="${opacity}" ${rotTransform}/>`;
        break;
    }

    // Text rendering — wrapped, padded and clipped exactly like the app's
    // text box (flex-centered, p-2, overflow-hidden). Line-family labels are
    // drawn at their midpoint inside the case above instead.
    const isLineFamily =
      el.type === 'line' || el.type === 'arrow' || el.type === 'double-arrow' || el.type === 'connector';
    if (el.text && !isLineFamily) {
      const fontSize = el.fontSize || 14;
      const fontFamily = el.fontFamily === 'serif' ? 'Georgia, serif' : el.fontFamily === 'mono' ? 'monospace' : 'system-ui, sans-serif';
      const fontWeight = el.fontWeight === 'bold' ? '700' : '400';
      const textColor = el.textColor || (el.type === 'sticky-note' ? '#854d0e' : defaultText);
      const font = `${fontWeight} ${fontSize}px ${fontFamily}`;
      const lineHeight = fontSize * 1.3;
      const pad = 8;

      const maxTextWidth = Math.max(12, el.width - pad * 2);
      let lines = wrapText(el.text, maxTextWidth, font);

      // Clip to the element like overflow-hidden, ellipsizing the last line
      const maxLines = Math.max(1, Math.floor((el.height - pad * 2) / lineHeight));
      if (lines.length > maxLines) {
        lines = lines.slice(0, maxLines);
        let last = lines[lines.length - 1];
        while (last.length > 1 && measureWidth(`${last}…`, font) > maxTextWidth) {
          last = last.slice(0, -1);
        }
        lines[lines.length - 1] = `${last}…`;
      }

      const align = el.textAlign || 'center';
      const anchor = align === 'left' ? 'start' : align === 'right' ? 'end' : 'middle';
      const textX = align === 'left' ? el.x + pad : align === 'right' ? el.x + el.width - pad : el.x + el.width / 2;

      // Vertically center the block (asset-icon chips bottom-align under their
      // glyph, matching the app), first line's baseline offset ~0.35em
      const firstY =
        el.type === 'asset-icon'
          ? el.y + el.height - pad - (lines.length - 1) * lineHeight - fontSize * 0.2
          : el.y + el.height / 2 - ((lines.length - 1) / 2) * lineHeight + fontSize * 0.35;

      lines.forEach((line, idx) => {
        if (line === '') return;
        const lineY = firstY + idx * lineHeight;
        svgContent += `<text x="${textX}" y="${lineY}" font-size="${fontSize}" font-weight="${fontWeight}" font-family="${fontFamily}" fill="${textColor}" text-anchor="${anchor}" opacity="${opacity}" ${rotTransform}>${escapeXml(line)}</text>`;
      });
    }
  });

  svgContent += `</svg>`;
  return svgContent;
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

/**
 * Export canvas to PNG / JPG download
 */
export function exportToImage(
  svgString: string,
  filename: string,
  format: 'png' | 'jpeg',
  backgroundColor: string = '#ffffff'
): void {
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const img = new Image();

  img.onload = () => {
    const canvas = document.createElement('canvas');
    // Scale up for crisp retina export
    const scale = 2;
    canvas.width = img.width * scale;
    canvas.height = img.height * scale;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(scale, scale);
      if (format === 'jpeg' || backgroundColor !== 'transparent') {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, img.width, img.height);
      }
      ctx.drawImage(img, 0, 0);

      const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
      const dataUrl = canvas.toDataURL(mimeType, 0.95);
      downloadFile(dataUrl, `${filename}.${format}`);
    }
    URL.revokeObjectURL(url);
  };

  img.src = url;
}

/**
 * Export SVG file download
 */
export function exportToSvgFile(svgString: string, filename: string): void {
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  downloadFile(url, `${filename}.svg`);
  URL.revokeObjectURL(url);
}

/**
 * Export PDF using print-to-pdf or canvas
 */
export function exportToPdf(svgString: string, filename: string): void {
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const img = new Image();

  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, img.width, img.height);
      ctx.drawImage(img, 0, 0);

      const imgData = canvas.toDataURL('image/png');
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>${filename}</title>
              <style>
                body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #fff; }
                img { max-width: 100%; max-height: 100vh; object-fit: contain; }
                @media print {
                  body { margin: 0; }
                  img { width: 100%; height: auto; }
                }
              </style>
            </head>
            <body>
              <img src="${imgData}" onload="window.print(); window.close();" />
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    }
    URL.revokeObjectURL(url);
  };
  img.src = url;
}

/**
 * Export a whole slide deck as a multi-page PDF (one slide per page)
 * via the browser print pipeline.
 */
export function exportSlidesToPdf(svgStrings: string[], filename: string): void {
  if (svgStrings.length === 0) return;

  const renderOne = (svgString: string): Promise<string> =>
    new Promise((resolve, reject) => {
      const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          URL.revokeObjectURL(url);
          reject(new Error('Canvas unavailable'));
          return;
        }
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, img.width, img.height);
        ctx.drawImage(img, 0, 0);
        URL.revokeObjectURL(url);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Could not render slide'));
      };
      img.src = url;
    });

  Promise.all(svgStrings.map(renderOne)).then((pages) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    const pageImgs = pages
      .map((p) => `<div class="page"><img src="${p}" /></div>`)
      .join('');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${filename}</title>
          <style>
            body { margin: 0; background: #fff; }
            .page { display: flex; justify-content: center; align-items: center; min-height: 100vh; page-break-after: always; }
            .page:last-child { page-break-after: auto; }
            img { max-width: 100%; max-height: 100vh; object-fit: contain; }
            @media print {
              .page { min-height: auto; height: 100vh; }
            }
          </style>
        </head>
        <body>
          ${pageImgs}
          <script>window.onload = () => { window.print(); window.close(); };</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  });
}

/**
 * Export native .nwsdraw project file
 */
export function exportNativeProjectFile(project: DrawingProject): void {
  const jsonStr = JSON.stringify(project, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const sanitizeName = project.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  downloadFile(url, `${sanitizeName}.nwsdraw`);
  URL.revokeObjectURL(url);
}

/**
 * Import native .nwsdraw project file
 */
export function importNativeProjectFile(file: File): Promise<DrawingProject> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const project = JSON.parse(content) as DrawingProject;
        if (!project.id || !Array.isArray(project.elements)) {
          throw new Error('Invalid NWS Draw project structure');
        }
        resolve(project);
      } catch (err) {
        reject(new Error('Failed to parse .nwsdraw file. Please check file validity.'));
      }
    };
    reader.onerror = () => reject(new Error('Error reading file.'));
    reader.readAsText(file);
  });
}

function downloadFile(url: string, filename: string): void {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
