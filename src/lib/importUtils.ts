import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

/** pdf.js is heavy (~1MB) — load it lazily, only when a PDF is imported. */
const loadPdfjs = async () => {
  const pdfjs = await import('pdfjs-dist');
  pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;
  return pdfjs;
};

export interface ImportedImage {
  src: string; // data URL
  width: number;
  height: number;
}

const MAX_DIMENSION = 1600; // downscale imports so IndexedDB stays lean
const MAX_PDF_PAGES = 60;

export const isImageFile = (file: File): boolean =>
  /^image\/(png|jpe?g|gif|webp|svg\+xml|bmp)$/.test(file.type);

export const isPdfFile = (file: File): boolean =>
  file.type === 'application/pdf' || /\.pdf$/i.test(file.name);

export const isProjectFile = (file: File): boolean => /\.nwsdraw$/i.test(file.name);

/**
 * Read an image file into a (possibly downscaled) data URL with dimensions.
 */
export function readImageFile(file: File): Promise<ImportedImage> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error(`Could not read ${file.name}`));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error(`Could not decode ${file.name}`));
      img.onload = () => {
        const scale = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height));
        if (scale === 1 && file.type !== 'image/svg+xml') {
          resolve({ src: reader.result as string, width: img.width, height: img.height });
          return;
        }
        const w = Math.max(1, Math.round(img.width * scale) || MAX_DIMENSION);
        const h = Math.max(1, Math.round(img.height * scale) || Math.round(MAX_DIMENSION * 0.75));
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas unavailable'));
          return;
        }
        ctx.drawImage(img, 0, 0, w, h);
        const mime = file.type === 'image/png' || file.type === 'image/svg+xml' ? 'image/png' : 'image/jpeg';
        resolve({ src: canvas.toDataURL(mime, 0.88), width: w, height: h });
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Render every page of a PDF file to an image (JPEG data URL).
 */
export async function pdfFileToImages(
  file: File,
  onProgress?: (done: number, total: number) => void
): Promise<ImportedImage[]> {
  const pdfjs = await loadPdfjs();
  const data = await file.arrayBuffer();
  const loadingTask = pdfjs.getDocument({ data });
  const pdf = await loadingTask.promise;
  const total = Math.min(pdf.numPages, MAX_PDF_PAGES);
  const pages: ImportedImage[] = [];

  for (let i = 1; i <= total; i++) {
    const page = await pdf.getPage(i);
    const base = page.getViewport({ scale: 1 });
    const scale = Math.min(2, MAX_DIMENSION / Math.max(base.width, base.height));
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    canvas.width = Math.round(viewport.width);
    canvas.height = Math.round(viewport.height);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas unavailable');

    await page.render({ canvas, canvasContext: ctx, viewport }).promise;
    pages.push({
      src: canvas.toDataURL('image/jpeg', 0.85),
      width: canvas.width,
      height: canvas.height,
    });
    onProgress?.(i, total);
  }

  await loadingTask.destroy();
  return pages;
}
