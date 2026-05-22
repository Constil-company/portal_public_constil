# TODO: Fix PDF Download Alignment in invoice1.html

## Information Gathered
- File: src/components/template/invoice 2/invoice1.html
- Issue: Alignment is poor when downloading the invoice as PDF using html2pdf.js.
- Cause: html2pdf renders the current view, and responsive styles may cause misalignment in PDF. Need to add print-specific styles to force desktop layout in PDF.

## Plan
- Add @media print styles to override responsive changes and ensure proper alignment in PDF (use desktop layout).
- Force signature right-align, logo position, and other elements to desktop styles in print.

## Dependent Files
- src/components/template/invoice 2/invoice1.html

## Followup Steps
- [x] Added @media print styles to force desktop layout in PDF.
- Test PDF download to verify alignment is fixed.
