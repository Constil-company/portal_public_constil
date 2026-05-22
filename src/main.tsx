import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { InvoiceContextProvider } from './context/invoice-context.tsx'
import { GlobalContextProvider } from './context/global-context.tsx'
import { pdfjs } from 'react-pdf'

const CLIENT_ID = import.meta.env.VITE_APP_GOOGLE_CLIENT_ID;
pdfjs.GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.min.js";
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <GlobalContextProvider>
          <InvoiceContextProvider>
            <App />
          </InvoiceContextProvider>
      </GlobalContextProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
)
