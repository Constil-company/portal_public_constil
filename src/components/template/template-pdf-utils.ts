import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

/** Margens do documento: 1,5 cm em todos os lados */
export const PDF_MARGINS_MM = {
  top: 20,
  bottom: 20,
  left: 15,
  right: 15,
} as const;

export const PDF_A4_WIDTH_MM = 210;
export const PDF_A4_HEIGHT_MM = 297;

/** Largura de renderização no DOM (≈ A4 a 96dpi) */
export const PDF_RENDER_WIDTH_PX = 794;

/** Área útil de conteúdo no PDF (mm) */
export const PDF_CONTENT_WIDTH_MM =
  PDF_A4_WIDTH_MM - PDF_MARGINS_MM.left - PDF_MARGINS_MM.right;

export const PDF_CONTENT_HEIGHT_MM =
  PDF_A4_HEIGHT_MM - PDF_MARGINS_MM.top - PDF_MARGINS_MM.bottom;

/**
 * Altura útil por página no DOM (px), alinhada à largura de conteúdo (180mm).
 * Deve coincidir com o corte do canvas no PDF (267mm × 794px / 180mm).
 */
export const PDF_CONTENT_HEIGHT_PX = Math.round(
  (PDF_CONTENT_HEIGHT_MM * PDF_RENDER_WIDTH_PX) / PDF_CONTENT_WIDTH_MM
);

/** @deprecated Use PDF_CONTENT_HEIGHT_PX */
export const PDF_PAGE_HEIGHT_PX = PDF_CONTENT_HEIGHT_PX;

const PAGE_BREAK_BUFFER_PX = 48;

export function createPdfDocument(): jsPDF {
  return new jsPDF("p", "mm", "a4");
}

/** Recorta o canvas em páginas e coloca cada uma com margens fixas de 1,5 cm */
export function appendCanvasPagesToPdf(
  pdf: jsPDF,
  canvas: HTMLCanvasElement
): void {
  const sliceHeightPx =
    (PDF_CONTENT_HEIGHT_MM * canvas.width) / PDF_CONTENT_WIDTH_MM;

  let sourceY = 0;
  let pageIndex = 0;

  while (sourceY < canvas.height - 0.5) {
    if (pageIndex > 0) {
      pdf.addPage();
    }

    const chunkPx = Math.min(sliceHeightPx, canvas.height - sourceY);
    const chunkHeightMm = (chunkPx * PDF_CONTENT_WIDTH_MM) / canvas.width;

    const pageCanvas = document.createElement("canvas");
    pageCanvas.width = canvas.width;
    pageCanvas.height = Math.ceil(chunkPx);
    const ctx = pageCanvas.getContext("2d");
    if (!ctx) {
      throw new Error("Canvas 2d context unavailable");
    }

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
    ctx.drawImage(
      canvas,
      0,
      sourceY,
      canvas.width,
      chunkPx,
      0,
      0,
      canvas.width,
      chunkPx
    );

    const chunkData = pageCanvas.toDataURL("image/jpeg", 0.95);
    pdf.addImage(
      chunkData,
      "JPEG",
      PDF_MARGINS_MM.left,
      PDF_MARGINS_MM.top,
      PDF_CONTENT_WIDTH_MM,
      chunkHeightMm
    );

    sourceY += chunkPx;
    pageIndex += 1;
  }
}

export function applySmartPageBreaks(
  container: HTMLElement,
  doc: Document,
  pageContentHeightPx = PDF_CONTENT_HEIGHT_PX
): void {
  const selector = [
    ".constil-items-table thead tr",
    "tr.constil-item-row",
    "tr.invoice-item-row",
    ".invoice-item-row:not(.grid)",
    ".doc-summary-section",
    ".doc-footer-section",
  ].join(", ");

  const elements = Array.from(container.querySelectorAll(selector)) as HTMLElement[];
  if (!elements.length) return;

  const containerRect = container.getBoundingClientRect();

  const sorted = elements
    .map((el) => {
      const rect = el.getBoundingClientRect();
      return { el, rowTop: rect.top - containerRect.top, rowHeight: rect.height };
    })
    .filter((x) => x.rowHeight > 0)
    .sort((a, b) => b.rowTop - a.rowTop);

  sorted.forEach(({ el, rowTop, rowHeight }) => {
    const rowBottom = rowTop + rowHeight;
    const pageIndex = Math.floor(rowTop / pageContentHeightPx);
    const nextBreak = (pageIndex + 1) * pageContentHeightPx;

    if (rowBottom > nextBreak - PAGE_BREAK_BUFFER_PX && rowTop < nextBreak - 16) {
      const spacer = doc.createElement("div");
      spacer.className = "pdf-page-spacer";
      spacer.setAttribute("aria-hidden", "true");
      const gap = Math.max(0, nextBreak - rowTop + PAGE_BREAK_BUFFER_PX);
      spacer.style.cssText = `height:${gap}px;width:100%;display:block;flex-shrink:0;background:#ffffff;margin:0;padding:0;border:none;`;
      el.parentNode?.insertBefore(spacer, el);
    }
  });
}

export async function waitForDocumentImages(doc: Document): Promise<void> {
  const images = doc.getElementsByTagName("img");
  await Promise.all(
    Array.from(images).map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete) {
            resolve();
            return;
          }
          img.onload = () => resolve();
          img.onerror = () => resolve();
        })
    )
  );
}

export function buildPdfRootContainer(doc: Document): HTMLDivElement {
  const container = doc.createElement("div");
  container.id = "pdf-root";
  container.style.width = `${PDF_RENDER_WIDTH_PX}px`;
  container.style.margin = "0 auto";
  container.style.background = "#ffffff";
  container.style.boxSizing = "border-box";

  while (doc.body.firstChild) {
    container.appendChild(doc.body.firstChild);
  }
  doc.body.appendChild(container);
  return container;
}

export type HtmlToPdfResult = {
  pdf: jsPDF;
  blob: Blob;
  canvas: HTMLCanvasElement;
  cleanup: () => void;
};

export type HtmlToPdfOptions = {
  scale?: number;
  parseDelayMs?: number;
};

/**
 * Renderiza HTML em PDF multi-página com margens consistentes de 1,5 cm.
 */
export async function generatePdfFromHtml(
  html: string,
  options: HtmlToPdfOptions = {}
): Promise<HtmlToPdfResult> {
  const { scale = 2, parseDelayMs = 500 } = options;

  const iframe = document.createElement("iframe");
  iframe.style.cssText =
    "position:fixed;left:-9999px;top:0;width:1024px;height:auto;border:none;";
  document.body.appendChild(iframe);

  const cleanup = () => {
    if (iframe.parentNode) {
      document.body.removeChild(iframe);
    }
  };

  try {
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) {
      throw new Error("PDF iframe document unavailable");
    }

    doc.open();
    doc.write(html);
    doc.close();

    await new Promise((r) => setTimeout(r, parseDelayMs));

    const breakStyle = doc.createElement("style");
    breakStyle.textContent = `
      .constil-items-table thead { display: table-header-group !important; }
      .pdf-page-spacer {
        margin: 0 !important;
        padding: 0 !important;
        border: none !important;
        background: #ffffff !important;
      }
      .constil-items-table .item-desc {
        word-break: break-word !important;
        overflow-wrap: anywhere !important;
      }
    `;
    doc.head.appendChild(breakStyle);

    await waitForDocumentImages(doc);

    const container = buildPdfRootContainer(doc);
    applySmartPageBreaks(container, doc);
    await waitForDocumentImages(container.ownerDocument);

    const canvas = await html2canvas(container, {
      scale,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
    });

    const pdf = createPdfDocument();
    appendCanvasPagesToPdf(pdf, canvas);
    const blob = pdf.output("blob");

    return { pdf, blob, canvas, cleanup };
  } catch (err) {
    cleanup();
    throw err;
  }
}
