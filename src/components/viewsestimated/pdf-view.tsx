import React from 'react';
import { Viewer, Worker, LoadError, SpecialZoomLevel } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';

interface PdfViewProps {
  pdfUrl: Uint8Array;
}

export const PdfComponent: React.FC<PdfViewProps> = ({ pdfUrl }) => {
  const handleRenderError = (error: LoadError) => {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          color: '#e53e3e',
          flexDirection: 'column',
          gap: '8px',
        }}>
        <p style={{ fontSize: '16px', fontWeight: 'bold' }}>Erro ao carregar PDF</p>
        <p style={{ fontSize: '14px' }}>
          {error.name === 'InvalidPDFException'
            ? 'PDF inválido ou corrompido'
            : error.name === 'MissingPDFException'
            ? 'PDF não encontrado'
            : 'Erro ao carregar o PDF'}
        </p>
      </div>
    );
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100vh',
        overflow: 'auto',
      }}>
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
        <Viewer
          fileUrl={pdfUrl}
          renderError={handleRenderError}
          defaultScale={SpecialZoomLevel.PageWidth}
          withCredentials={true}
        />
      </Worker>
    </div>
  );
};
