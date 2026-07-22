import { CanvasElement, DrawingProject } from '../types';

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

  elements.forEach((el) => {
    if (el.hidden) return;

    const stroke = el.strokeColor || '#000000';
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
        if (el.points && el.points.length >= 2) {
          const p1 = el.points[0];
          const p2 = el.points[1];
          svgContent += `<line x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}" stroke="${stroke}" stroke-width="${sw}" opacity="${opacity}" ${dashAttr}/>`;
        } else {
          svgContent += `<line x1="${el.x}" y1="${el.y}" x2="${el.x + el.width}" y2="${el.y + el.height}" stroke="${stroke}" stroke-width="${sw}" opacity="${opacity}" ${dashAttr}/>`;
        }
        break;

      case 'rectangle':
      case 'wireframe-card':
      case 'wireframe-input':
        svgContent += `<rect x="${el.x}" y="${el.y}" width="${el.width}" height="${el.height}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" opacity="${opacity}" ${dashAttr} ${rotTransform}/>`;
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

      default:
        svgContent += `<rect x="${el.x}" y="${el.y}" width="${el.width}" height="${el.height}" rx="6" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" opacity="${opacity}" ${rotTransform}/>`;
        break;
    }

    // Text rendering inside or for standalone text
    if (el.text) {
      const fontSize = el.fontSize || 14;
      const fontFamily = el.fontFamily === 'serif' ? 'Georgia, serif' : el.fontFamily === 'mono' ? 'monospace' : 'system-ui, sans-serif';
      const textColor = el.textColor || (el.type === 'sticky-note' ? '#1e293b' : '#0f172a');
      const textX = el.x + el.width / 2;
      const textY = el.y + el.height / 2 + fontSize / 3;

      const lines = el.text.split('\n');
      lines.forEach((line, idx) => {
        const lineY = textY + (idx - (lines.length - 1) / 2) * (fontSize * 1.2);
        svgContent += `<text x="${textX}" y="${lineY}" font-size="${fontSize}" font-family="${fontFamily}" fill="${textColor}" text-anchor="middle" opacity="${opacity}" ${rotTransform}>${escapeXml(line)}</text>`;
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
