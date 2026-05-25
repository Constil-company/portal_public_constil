/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */

import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Download,
  FileText,
  Layers,
  Loader2,
  MessageCircle,
  Send,
  Sparkles,
  Table2,
  X,
} from 'lucide-react';
import {
  useAiTableDataMutation,
  useEstimateAiUpdateMutation,
  useGetAiChatHistoryQuery,
  invoiceApi
} from '../../services/rtkapi/invoiceApi';
import { toast } from 'react-toastify';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import 'jspdf/dist/polyfills.es.js';
// @ts-ignore
import 'jspdf/dist/jspdf.es.min.js';
import { useNavigate } from 'react-router-dom';

type XlsxLib = typeof import('xlsx-js-style');

interface TableRowType {
  [key: string]: string | number;
}

interface TableData {
  table_name: string;
  headers: string[];
  description?: string;
  rows: TableRowType[];
  color?: 'orange' | 'yellow' | 'green' | 'blue';
  id?: string | number;
}

const colorMap = {
  orange: 'text-orange-500',
  yellow: 'text-yellow-500',
  green: 'text-green-500',
  blue: 'text-blue-500',
};

const bgColorMap = {
  orange: 'bg-orange-50 hover:bg-orange-100',
  yellow: 'bg-yellow-50 hover:bg-yellow-100',
  green: 'bg-green-50 hover:bg-green-100',
  blue: 'bg-blue-50 hover:bg-blue-100',
};

const isNumericHeader = (header: string) => {
  const h = header.toLowerCase();
  return ['quantity', 'wastage', 'unit', 'qty', 'total', 'amount', 'cost', 'material', 'labor', 'price'].some(
    (term) => h.includes(term),
  );
};

const isEditableHeader = (header: string) => {
  const h = header.toLowerCase();
  return ['quantity', 'wastage', 'unit material', 'unit labor'].some(
    (col) => h === col || h.includes(col),
  );
};

const getTableHeaders = (table: TableData): string[] => {
  if (Array.isArray(table.headers) && table.headers.length > 0) {
    return table.headers;
  }
  const firstRow = table.rows?.[0];
  return firstRow ? Object.keys(firstRow) : [];
};

const getTableSubtotal = (table: TableData) => {
  const costKey = getTableHeaders(table).find((h) =>
    ['total cost', 'total', 'amount'].includes(h.toLowerCase()),
  );
  if (!costKey) return 0;
  return table.rows.reduce((sum, r) => {
    const c = r[costKey]?.toString().replace(/[$,]/g, '') || '0';
    return sum + (parseFloat(c) || 0);
  }, 0);
};


// helper to export markdown description as PDF
const exportDescriptionPDF = (table: any) => {
  if (!table?.description) return;

  const doc = new jsPDF('p', 'mm', 'a4');
  const PAGE_MARGIN = 20;
  const PAGE_WIDTH = doc.internal.pageSize.getWidth();
  const PAGE_HEIGHT = doc.internal.pageSize.getHeight();
  const CONTENT_WIDTH = PAGE_WIDTH - PAGE_MARGIN * 2;

  let currentY = PAGE_MARGIN;

  // ===== TITLE =====
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(table.table_name, PAGE_MARGIN, currentY);
  currentY += 10;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);

  const textLines = doc.splitTextToSize(
    table.description.replace(/[#_*`]/g, ''),
    CONTENT_WIDTH
  );

  textLines.forEach((line: any) => {
    if (currentY > PAGE_HEIGHT - PAGE_MARGIN) {
      doc.addPage();
      currentY = PAGE_MARGIN;
    }
    doc.text(line, PAGE_MARGIN, currentY, { align: 'justify' });
    currentY += 6; // line height
  });

  doc.save(`${table.table_name}-description.pdf`);
};

/** Excel sheet names cannot contain * ? : / \ [ ] */
const sanitizeExcelSheetName = (name: string) =>
  name.substring(0, 31).replace(/[*?:/\\[\]]/g, '');

const EXCEL_HEADER_FILL_RGB = '0088FF';
const EXCEL_HEADER_FONT_RGB = 'FFFFFF';

const createStyledHeaderCell = (value: string) => ({
  v: value,
  t: 's' as const,
  s: {
    fill: {
      patternType: 'solid' as const,
      fgColor: { rgb: EXCEL_HEADER_FILL_RGB },
      bgColor: { rgb: EXCEL_HEADER_FILL_RGB },
    },
    font: {
      bold: true,
      color: { rgb: EXCEL_HEADER_FONT_RGB },
    },
    alignment: {
      horizontal: 'center' as const,
      vertical: 'center' as const,
      wrapText: false,
    },
  },
});

/** Column width in characters — sized to fit header + data without wrapping */
const applyWorksheetColumnWidths = (
  ws: import('xlsx-js-style').WorkSheet,
  headers: string[],
  rows: TableRowType[],
) => {
  ws['!cols'] = headers.map((header) => {
    let maxLen = String(header).length;
    for (const row of rows) {
      const cellLen = String(row[header] ?? '').length;
      if (cellLen > maxLen) maxLen = cellLen;
    }
    const wch = Math.min(Math.max(Math.ceil(maxLen * 1.2) + 4, 14), 60);
    return { wch };
  });
};

const ensureCell = (ws: import('xlsx-js-style').WorkSheet, ref: string) => {
  if (!ws[ref]) {
    ws[ref] = { t: 'n', v: 0 };
  }
  return ws[ref];
};

const createWorksheetFromTable = (XLSX: XlsxLib, table: TableData) => {
  const headers = getTableHeaders(table);
  const rows = table.rows ?? [];
  const headerRow = headers.map(createStyledHeaderCell);
  const dataRows = rows.map((row) =>
    headers.map((h) => row[h] ?? '')
  );
  const ws = XLSX.utils.aoa_to_sheet([headerRow, ...dataRows]);
  applyWorksheetColumnWidths(ws, headers, rows);
  return ws;
};

const loadXlsxLib = async (): Promise<XlsxLib> => {
  const mod = await import('xlsx-js-style');
  const lib = (mod as { default?: XlsxLib }).default ?? mod;
  if (!lib?.utils?.book_new) {
    throw new Error('Excel library failed to load');
  }
  return lib;
};

const File = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedPage, setSelectedPage] = useState<any | null>(null);
  const [expandedTables, setExpandedTables] = useState<string[]>([]);
  const [rawChatHistory, setRawChatHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [triggerAiUpdate, { isLoading }] = useEstimateAiUpdateMutation();
  const [aiTableData] = useAiTableDataMutation();
  const estimate = useSelector((state: RootState) => state.estimate.tables as any);
  const estimateId = estimate?.id || (Array.isArray(estimate) ? estimate[0]?.id : null);

  // Fetch results from DB if they aren't already in the Redux state
  const { data: dbResults, isLoading: dbLoading, refetch: refetchDbResults } = invoiceApi.useGetAiEstimateResultsQuery(
    { ai_estimate_id: estimateId },
    { skip: !estimateId }
  );

  const [chatOpen, setChatOpen] = useState(false);
  const [selectedEstimateId, setSelectedEstimateId] = useState<string | null>(null);

  // Fetch chat history via RTK Query
  const { data: historyData, refetch: refetchHistory } = useGetAiChatHistoryQuery(
    { estimate_page_id: selectedEstimateId || '' },
    { skip: !selectedEstimateId || !chatOpen }
  );

  useEffect(() => {
    if (historyData) {
      setRawChatHistory(historyData);
      const formatted: { from: 'user' | 'bot'; text: string }[] = historyData
        .map((item: any) => [
          { from: 'user' as const, text: item.query },
          { from: 'bot' as const, text: item?.response?.text || '' },
        ])
        .flat();
      setChatMessages(formatted);
    }
  }, [historyData]);

  // estimate can be:
  //   (a) the full estimate object: { id, name, results: [{ output_json, ... }] }
  //   (b) a single result page directly: { output_json, ... } (legacy)
  const [selectedPageIndex, setSelectedPageIndex] = useState(0);

  useEffect(() => {
    if (!estimate) return;

    // Use DB results if available and Redux state is just the shell
    const resultsSource = (estimate?.results && Array.isArray(estimate.results)) 
      ? estimate.results 
      : (dbResults || []);

    if (resultsSource.length > 0) {
      setSelectedPage(resultsSource[selectedPageIndex] || null);
    } else if (estimate.output_json) {
       // Single page direct object (e.g. from creation flow)
       setSelectedPage(estimate);
    }
  }, [dispatch, estimate, dbResults, selectedPageIndex]);

  const resultPages: any[] = (estimate?.results && Array.isArray(estimate.results)) 
    ? estimate.results 
    : (dbResults || []);

  // Robustly extract tables from the selected page
  const getTables = () => {
    if (!selectedPage?.output_json) return [];
    
    // Check various common nesting patterns
    const data = selectedPage.output_json;
    const tablesList = data.tables || data.tables_json?.tables || data.json_data?.tables || [];
    
    return Array.isArray(tablesList) ? tablesList : [];
  };

  const tables: TableData[] = getTables().map((t: any) => ({
    ...t,
    id: selectedPage?.id || t?.id,
  }));

  const estimateName = estimate?.name || 'AI Estimate';
  const lineItemCount = tables.reduce((acc, t) => acc + t.rows.length, 0);
  const allExpanded = tables.length > 0 && expandedTables.length === tables.length;

  useEffect(() => {
    if (tables.length > 0) {
      setExpandedTables(tables.map((t) => t.table_name));
    }
  }, [selectedPage?.id, selectedPageIndex]);

  const toggleTable = (name: string) => {
    setExpandedTables((prev) => (prev.includes(name) ? prev.filter((t) => t !== name) : [...prev, name]));
  };

  const toggleAllTables = () => {
    if (allExpanded) {
      setExpandedTables([]);
    } else {
      setExpandedTables(tables.map((t) => t.table_name));
    }
  };

  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{ from: 'user' | 'bot'; text: string }[]>([]);
  const [chatPosition, setChatPosition] = useState<{ top: number; left: number } | null>(null);
  const [chatSending, setChatSending] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, chatSending]);

  const buildConversationHistory = () => {
    return {
      messages: rawChatHistory.map((item: any) => ({
        human: item.query,
        ai: item?.response?.text || '',
      })),
    };
  };
  const startProgress = () => {
    setProgress(1);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 50);

    return interval;
  };

  const fetchChatHistory = async (estimatePageId: string) => {
    setSelectedEstimateId(estimatePageId);
  };
  const sendConversationToAI = async () => {
    if (!selectedPage?.id || rawChatHistory.length === 0) {
      toast.error('No conversation found');
      return;
    }

    setLoading(true);
    const interval = startProgress();

    try {
      const response = await aiTableData({
        action: 'apply',
        estimate_page_id: selectedPage?.id,
        conversation_history: buildConversationHistory(),
      }).unwrap();

      clearInterval(interval);
      setProgress(100);

      if (response?.status === true) {
        setSelectedPage(response?.ai_response);
        toast.success('Conversation applied successfully');
      } else {
        toast.error(response?.message || 'Something went wrong');
      }
    } catch (err: any) {
      clearInterval(interval);
      toast.error(err?.data?.error_log || 'AI processing failed');
    } finally {
      setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 400);
    }
  };

  const openChatbot = (estimateId: string, event: React.MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const CHAT_WIDTH = 400;
    const CHAT_HEIGHT = 520;
    const GAP = 12;
    let left = rect.right + GAP;
    let top = rect.top + window.scrollY;
    if (left + CHAT_WIDTH > window.innerWidth) {
      left = rect.left - CHAT_WIDTH - GAP;
    }
    if (top + CHAT_HEIGHT > window.scrollY + window.innerHeight) {
      top = window.scrollY + window.innerHeight - CHAT_HEIGHT - 12;
    }

    if (top < window.scrollY + 10) {
      top = window.scrollY + 10;
    }

    setChatPosition({ top, left });
    setSelectedEstimateId(estimateId);
    setChatOpen(true);
    setChatMessages([]);
    fetchChatHistory(estimateId);
  };

  const sendMessage = async () => {
    if (!chatInput.trim() || !selectedEstimateId || chatSending) return;

    const userMsg = chatInput.trim();

    setChatMessages((prev) => [...prev, { from: 'user', text: userMsg }]);
    setChatInput('');
    setChatSending(true);

    try {
      const result = await aiTableData({
        action: 'chat',
        estimate_page_id: selectedEstimateId,
        query: userMsg
      }).unwrap();
      
      if (result.status === true && result.ai_response) {
        setSelectedPage(result.ai_response);
        setChatMessages((prev) => [...prev, { from: 'bot', text: 'Estimate updated successfully!' }]);
        refetchDbResults(); // Force refresh the main data
      }
      
      if (result.error) {
        setChatMessages((prev) => [...prev, { from: 'bot', text: result.error }]);
      }
      refetchHistory();
    } catch {
      setChatMessages((prev) => [...prev, { from: 'bot', text: 'Something went wrong. Please try again.' }]);
    } finally {
      setChatSending(false);
    }
  };

  const totalEstimate = tables.reduce(
    (sum, table) => {
      // Skip summary tables to avoid double counting
      if (!table.table_name || table.table_name.toUpperCase().includes('SUMMARY')) return sum;
      
      return sum + table.rows.reduce((rowSum, row) => {
        const cost = row['Total Cost']?.toString().replace('$', '').replace(',', '') || '0';
        return rowSum + parseFloat(cost);
      }, 0);
    },
    0
  );

  const exportPDF = () => {
    try {
    const doc = new jsPDF('l', 'mm', 'a4');
    let currentY = 20;

    tables.forEach((table) => {
      const headers = getTableHeaders(table);
      doc.setFontSize(14);
      doc.text(table.table_name, 14, currentY);
      currentY += 6;

      autoTable(doc, {
        startY: currentY,
        head: [headers],
        body: table.rows.map((row) => headers.map((h) => row[h] || '')),
        theme: 'grid',
        styles: { fontSize: 10 },
        headStyles: { 
          fillColor: [0, 136, 255], // #0088FF
          textColor: [255, 255, 255]
        },
      });

      // @ts-ignore
      currentY = doc.lastAutoTable.finalY + 10;
    });

    doc.save('estimate.pdf');
    } catch (err) {
      console.error('PDF export failed:', err);
      toast.error('PDF download failed');
    }
  };
  const exportExcel = async (filterName?: string) => {
    try {
      const XLSX = await loadXlsxLib();

      const tablesToExport = filterName ? tables.filter(t => t.table_name === filterName) : tables;
      if (tablesToExport.length === 0) {
        toast.error('No tables available to export');
        return;
      }

      const wb = XLSX.utils.book_new();
      const tableMeta: Record<string, { sheetName: string, tcCol: string, lastRow: number }> = {};

      const getColLetter = (n: number) => {
        let letter = '';
        while (n >= 0) {
          letter = String.fromCharCode((n % 26) + 65) + letter;
          n = Math.floor(n / 26) - 1;
        }
        return letter;
      };

      const findColInWs = (ws: any, terms: string[]) => {
        const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
        if (!range.e.c) return null;
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const cell = ws[XLSX.utils.encode_cell({ r: 0, c: C })];
          if (cell && cell.v && terms.some(t => String(cell.v).toLowerCase().includes(t.toLowerCase()))) {
            return getColLetter(C);
          }
        }
        return null;
      };

      // Create all worksheets first
      const worksheets = tablesToExport.map(table => {
        const ws = createWorksheetFromTable(XLSX, table);
        const sheetName = sanitizeExcelSheetName(table.table_name);
        return { table, ws, sheetName };
      });

      // Pass 1: Process detailed line-item tables
      worksheets.forEach(({ table, ws, sheetName }) => {
        const isSummary = table.table_name.toLowerCase().includes('summary');
        if (isSummary) return;

        const tcCol = findColInWs(ws, ['total cost', 'amount', 'total']);
        const qCol = findColInWs(ws, ['quantity']);
        const wCol = findColInWs(ws, ['wastage']);
        const umCol = findColInWs(ws, ['unit material']);
        const ulCol = findColInWs(ws, ['unit labor']);
        const qwCol = findColInWs(ws, ['qty w/', 'qty with']);
        const tmCol = findColInWs(ws, ['total material']);
        const tlCol = findColInWs(ws, ['total labor']);

        for (let i = 0; i < table.rows.length; i++) {
          const R = i + 2;
          const cleanCell = (col: string | null) => {
            if (!col) return;
            const ref = col + R;
            if (ws[ref]) {
              const val = String(ws[ref].v).replace(/[$,%]/g, '').trim();
              const num = parseFloat(val);
              if (!isNaN(num)) {
                ws[ref].t = 'n';
                ws[ref].v = num;
              }
            }
          };
          [qCol, wCol, umCol, ulCol, qwCol, tmCol, tlCol, tcCol].forEach(cleanCell);

          if (qwCol && qCol && wCol) {
            ensureCell(ws, qwCol + R).f = `${qCol}${R}*(1+${wCol}${R}/100)`;
          }
          if (tmCol && qwCol && umCol) {
            const cell = ensureCell(ws, tmCol + R);
            cell.f = `${qwCol}${R}*${umCol}${R}`;
            cell.z = '"$"#,##0.00';
          }
          if (tlCol && qwCol && ulCol) {
            const cell = ensureCell(ws, tlCol + R);
            cell.f = `${qwCol}${R}*${ulCol}${R}`;
            cell.z = '"$"#,##0.00';
          }
          if (tcCol) {
            const cell = ensureCell(ws, tcCol + R);
            if (tmCol && tlCol) cell.f = `${tmCol}${R}+${tlCol}${R}`;
            else if (qwCol && umCol && ulCol) cell.f = `${qwCol}${R}*(${umCol}${R}+${ulCol}${R})`;
            cell.z = '"$"#,##0.00';
          }
        }

        if (tcCol) {
          tableMeta[table.table_name.toLowerCase()] = { sheetName, tcCol, lastRow: table.rows.length + 1 };
        }
      });

      // Pass 2: Process summary tables
      worksheets.forEach(({ table, ws }) => {
        const isSummary = table.table_name.toLowerCase().includes('summary');
        if (!isSummary) return;

        const tcCol = findColInWs(ws, ['amount', 'total cost', 'total']);
        const descCol = findColInWs(ws, ['description', 'item', 'name']);

        if (tcCol && descCol) {
          let subtotalRow = 0;
          for (let i = 0; i < table.rows.length; i++) {
            const R = i + 2;
            const amountRef = tcCol + R;
            const desc = String(ws[descCol + R]?.v || '').trim();
            const descLower = desc.toLowerCase();

            // Force numeric type for all amount cells in summary
            if (ws[amountRef]) {
              const val = String(ws[amountRef].v).replace(/[$,%]/g, '').trim();
              const num = parseFloat(val);
              ws[amountRef].t = 'n';
              ws[amountRef].v = isNaN(num) ? 0 : num;
            } else {
              ws[amountRef] = { t: 'n', v: 0 };
            }

            // Link to category sheets using SUM of their range
            const matchedKey = Object.keys(tableMeta).find(name => {
              const cleanN = name.replace(/division \d+ - /g, '').toLowerCase();
              const cleanD = descLower.replace(/division \d+ - /g, '').toLowerCase();
              return cleanD.includes(cleanN) || cleanN.includes(cleanD);
            });

            const amountCell = ensureCell(ws, amountRef);

            if (matchedKey) {
              const meta = tableMeta[matchedKey];
              amountCell.f = `SUM('${meta.sheetName}'!${meta.tcCol}2:${meta.tcCol}${meta.lastRow})`;
            } else if (descLower.includes('subtotal')) {
              subtotalRow = R;
              amountCell.f = `SUM(${tcCol}2:${tcCol}${R - 1})`;
            } else if (descLower.includes('total') && !descLower.includes('subtotal')) {
              if (subtotalRow) amountCell.f = `SUM(${tcCol}${subtotalRow}:${tcCol}${R - 1})`;
            } else if (desc.includes('%')) {
              const match = desc.match(/(\d+\.?\d*)%/);
              if (match && subtotalRow) {
                const percent = parseFloat(match[1]) / 100;
                amountCell.f = `${tcCol}${subtotalRow}*${percent}`;
              }
            }
            amountCell.z = '"$"#,##0.00';
          }
        }
      });

      worksheets.forEach(({ ws, sheetName }) => {
        XLSX.utils.book_append_sheet(wb, ws, sheetName);
      });

      const filename = `${filterName || 'Estimate'}-${Date.now()}.xlsx`;
      XLSX.writeFile(wb, filename);
      toast.success('Excel exported successfully with live formulas');
    } catch (err) {
      console.error('Excel export failed:', err);
      toast.error('Excel download failed');
    }
  };



  const updateCellValue = (tableIndex: number, rowIndex: number, key: string, value: string) => {
    setSelectedPage((prev: any) => {
      if (!prev?.output_json) return prev;
      const updated = structuredClone(prev);
      const data = updated.output_json;

      // Find where the tables array actually lives
      let targetTables = null;
      if (Array.isArray(data.tables)) targetTables = data.tables;
      else if (Array.isArray(data.tables_json?.tables)) targetTables = data.tables_json.tables;
      else if (Array.isArray(data.json_data?.tables)) targetTables = data.json_data.tables;

      if (targetTables && targetTables[tableIndex]) {
        const row = targetTables[tableIndex].rows[rowIndex];
        row[key] = value;

        // --- Real-time Recalculation Logic ---
        const parseNum = (v: any) => parseFloat(v?.toString().replace(/[$,% ]/g, '') || '0');
        
        if (key === 'Quantity' || key === 'Wastage %' || key === 'Unit Material' || key === 'Unit Labor') {
          const qty = parseNum(row['Quantity'] || row['QUANTITY']);
          const wastage = parseNum(row['Wastage %'] || row['WASTAGE %']) / 100;
          const unitMat = parseNum(row['Unit Material'] || row['UNIT MATERIAL']);
          const unitLab = parseNum(row['Unit Labor'] || row['UNIT LABOR']);

          const qtyWithWastage = qty * (1 + wastage);
          
          // Update Qty w/ Wastage if the column exists
          const qtyWastageKey = Object.keys(row).find(k => k.toLowerCase().includes('qty w/') || k.toLowerCase().includes('qty with'));
          if (qtyWastageKey) row[qtyWastageKey] = Math.round(qtyWithWastage);

          // Update Total Material
          const totalMatKey = Object.keys(row).find(k => k.toLowerCase() === 'total material');
          if (totalMatKey) row[totalMatKey] = `$${(qtyWithWastage * unitMat).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

          // Update Total Labor
          const totalLabKey = Object.keys(row).find(k => k.toLowerCase() === 'total labor');
          if (totalLabKey) row[totalLabKey] = `$${(qtyWithWastage * unitLab).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

          // Update Total Cost
          const totalCostKey = Object.keys(row).find(k => ['Total Cost', 'TOTAL COST', 'Amount', 'Total'].includes(k));
          if (totalCostKey) {
            const finalTotal = (qtyWithWastage * unitMat) + (qtyWithWastage * unitLab);
            row[totalCostKey] = `$${finalTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
          }
        }
      }

      return updated;
    });
  };

  const getFormulaHint = (header: string, tableName: string) => {
    const h = header.toLowerCase();
    const isSummary = tableName.toLowerCase().includes('summary');
    
    // Summary tables don't follow the per-row line item calculation logic
    if (isSummary) return undefined;

    if (h.includes('qty w/') || h.includes('qty with')) return 'Quantity * (1 + Wastage %)';
    if (h === 'total material') return 'Qty w/ Wastage * Unit Material';
    if (h === 'total labor') return 'Qty w/ Wastage * Unit Labor';
    if (['total cost', 'total', 'amount'].includes(h)) return 'Total Material + Total Labor';
    return undefined;
  };
  const saveUpdatedEstimate = async () => {
    if (!selectedPage?.id) return;
    try {
      await triggerAiUpdate({
        ai_estimate_id: String(selectedPage.id),
        body: {
          output_json: selectedPage.output_json,
        },
      }).unwrap();
      
      toast.success('Estimate updated successfully');
    } catch (err) {
      toast.error('Failed to update estimate');
    }
  };

  if (dbLoading && !selectedPage) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4" />
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest italic">Fetching Project Data...</p>
      </div>
    );
  }

  return (
    <section className="w-full min-h-full bg-white">
      <div className="w-full max-w-[1600px] mx-auto px-3 sm:px-5 lg:px-8 py-4 pb-28">
        {selectedPage ? (
          <>
            {/* Header */}
            <div className="pb-6 mb-6 border-b border-gray-200">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0">
                  <button
                    onClick={() => navigate('/estimates/ai')}
                    className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline mb-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to AI Estimates
                  </button>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">{estimateName}</h1>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                      Reviewed
                    </span>
                    {resultPages.length > 1 && (
                      <span className="text-xs text-gray-500">
                        Page {selectedPage.page_number || selectedPageIndex + 1} of {resultPages.length}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 shrink-0">
                  <button
                    onClick={toggleAllTables}
                    className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white hover:bg-gray-50"
                  >
                    {allExpanded ? 'Collapse all' : 'Expand all'}
                  </button>
                  <button
                    onClick={exportPDF}
                    className="px-4 py-2 text-sm border border-gray-200 rounded-lg bg-white hover:bg-gray-50"
                  >
                    Export PDF
                  </button>
                  <button
                    onClick={() => exportExcel()}
                    className="px-4 py-2 text-sm border border-gray-200 rounded-lg bg-white text-green-700 hover:bg-green-50"
                  >
                    Export Excel
                  </button>
                  <button
                    disabled={isLoading}
                    onClick={saveUpdatedEstimate}
                    className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-60"
                  >
                    {isLoading ? 'Saving…' : 'Save changes'}
                  </button>
                </div>
              </div>
            </div>

            {/* Page tabs */}
            {resultPages.length > 1 && (
              <div className="flex gap-2 mb-6 flex-wrap">
                {resultPages.map((page: any, idx: number) => (
                  <button
                    key={page.id || idx}
                    onClick={() => setSelectedPageIndex(idx)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                      selectedPageIndex === idx
                        ? 'bg-primary text-white border-primary'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-primary/40'
                    }`}
                  >
                    Page {page.page_number || idx + 1}
                  </button>
                ))}
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
              <div className="border border-gray-200 p-4 rounded-xl bg-white">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Total estimate</p>
                <p className="text-2xl font-bold text-gray-900 mt-1 font-mono tabular-nums">
                  ${totalEstimate.toLocaleString()}
                </p>
              </div>
              <div className="border border-gray-200 p-4 rounded-xl bg-white">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Line items</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{lineItemCount}</p>
              </div>
              <div className="border border-gray-200 p-4 rounded-xl bg-white">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Tables</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{tables.length}</p>
              </div>
              <div className="border border-gray-200 p-4 rounded-xl bg-white">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Source page</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {selectedPage.page_number || selectedPageIndex + 1}
                </p>
              </div>
            </div>

            <div className="w-full space-y-5">
                {tables.map((table, idx) => {
                  const isExpanded = expandedTables.includes(table.table_name);
                  const subtotal = getTableSubtotal(table);

                  return (
                    <div
                      key={`${table.table_name}-${idx}`}
                      className="border border-gray-200 rounded-xl overflow-hidden bg-white"
                    >
                      <button
                        type="button"
                        onClick={() => toggleTable(table.table_name)}
                        className={`w-full flex flex-wrap justify-between items-center gap-3 px-5 py-4 ${bgColorMap[table.color || 'blue']}`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <ChevronDown
                            className={`w-5 h-5 shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                          />
                          <div className="text-left min-w-0">
                            <span className={`font-semibold block truncate ${colorMap[table.color || 'blue']}`}>
                              {table.table_name}
                            </span>
                            <span className="text-xs text-gray-500 mt-0.5 block">
                              {table.rows.length} rows · {getTableHeaders(table).length} columns
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {subtotal > 0 && (
                            <span className="font-bold text-gray-900 font-mono tabular-nums">
                              ${subtotal.toLocaleString()}
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              exportExcel(table.table_name);
                            }}
                            className="p-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
                            title="Export this table to Excel"
                          >
                            <Download size={16} />
                          </button>
                          {table.description && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                exportDescriptionPDF(table);
                              }}
                              className="p-2 rounded-lg bg-primary text-white hover:opacity-90"
                              title="Download description PDF"
                            >
                              <FileText size={16} />
                            </button>
                          )}
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="border-t border-gray-100">
                          <div className="overflow-x-auto max-h-[min(70vh,720px)] overflow-y-auto thin-scrollbar">
                            <table className="w-full min-w-[900px] border-collapse text-sm">
                              <thead className="sticky top-0 z-10">
                                <tr className="bg-gray-100 border-b border-gray-200">
                                  {table.headers.map((header, i) => (
                                    <th
                                      key={i}
                                      className={`px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-600 whitespace-nowrap ${
                                        isNumericHeader(header) ? 'text-right' : 'text-left'
                                      }`}
                                    >
                                      {header}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {table.rows.map((row, rowIdx) => (
                                  <tr
                                    key={rowIdx}
                                    className={`border-b border-gray-100 hover:bg-blue-50/40 ${
                                      rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                                    }`}
                                  >
                                    {table.headers.map((h, colIdx) => {
                                      const formulaHint = getFormulaHint(h, table.table_name);
                                      const numeric = isNumericHeader(h);
                                      const editable = isEditableHeader(h);

                                      return (
                                        <td
                                          key={colIdx}
                                          className={`px-4 py-2.5 align-middle ${
                                            numeric ? 'text-right font-mono tabular-nums' : 'text-left'
                                          } ${formulaHint ? 'bg-blue-50/30' : ''}`}
                                          title={formulaHint}
                                        >
                                          {editable ? (
                                            <input
                                              type="text"
                                              value={String(row[h] ?? '')}
                                              onChange={(e) => updateCellValue(idx, rowIdx, h, e.target.value)}
                                              className={`border border-gray-200 rounded-md px-2 py-1.5 text-sm bg-white focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none ${
                                                numeric ? 'w-28 ml-auto text-right' : 'w-full min-w-[140px]'
                                              }`}
                                            />
                                          ) : (
                                            <span className="block max-w-[320px] truncate" title={String(row[h] ?? '')}>
                                              {row[h] ?? '—'}
                                            </span>
                                          )}
                                        </td>
                                      );
                                    })}
                                  </tr>
                                ))}
                              </tbody>
                              {subtotal > 0 && (
                                <tfoot>
                                  <tr className="bg-gray-100 font-semibold">
                                    <td
                                      colSpan={Math.max(1, table.headers.length - 1)}
                                      className="px-4 py-3 text-right text-gray-700"
                                    >
                                      Subtotal
                                    </td>
                                    <td className="px-4 py-3 text-right font-mono tabular-nums text-gray-900">
                                      ${subtotal.toLocaleString()}
                                    </td>
                                  </tr>
                                </tfoot>
                              )}
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {tables.length === 0 && (
                  <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
                    <Table2 className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">No extracted tables found for this page.</p>
                  </div>
                )}
            </div>

            {/* Floating actions */}
            <div className="fixed bottom-6 right-6 z-40 flex gap-3">
              <button
                type="button"
                onClick={(e) => openChatbot(String(selectedPage.id), e)}
                className="w-14 h-14 rounded-full bg-primary text-white shadow-lg hover:opacity-90 flex items-center justify-center"
                title="Open chat assistant"
              >
                <MessageCircle size={22} />
              </button>
              <button
                type="button"
                onClick={sendConversationToAI}
                className="w-14 h-14 rounded-full bg-purple-600 text-white shadow-lg hover:bg-purple-700 flex items-center justify-center"
                title="Apply AI changes from conversation"
              >
                <Check size={22} />
              </button>
            </div>
          </>
        ) : (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-16 text-center">
            <Layers className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 font-medium mb-2">No estimate data loaded</p>
            <button
              onClick={() => navigate('/estimates/ai')}
              className="text-sm text-primary hover:underline"
            >
              Go to AI Estimates
            </button>
          </div>
        )}
      </div>

      {chatOpen && (
        <>
          <button
            type="button"
            aria-label="Close chat"
            className="fixed inset-0 z-40 bg-gray-900/20 backdrop-blur-[2px]"
            onClick={() => setChatOpen(false)}
          />

          <div
            className="fixed z-50 flex w-[min(100vw-1.5rem,400px)] h-[min(520px,calc(100vh-5rem))] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white"
            style={{
              top: chatPosition?.top,
              left: chatPosition?.left,
            }}
            role="dialog"
            aria-labelledby="estimate-assistant-title"
          >
            <header className="flex items-center gap-3 border-b border-gray-100 px-4 py-3.5 bg-white">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Sparkles className="h-5 w-5" strokeWidth={2} />
              </div>
              <div className="min-w-0 flex-1">
                <p id="estimate-assistant-title" className="text-sm font-semibold text-gray-900">
                  Estimate Assistant
                </p>
                <p className="text-xs text-gray-500 truncate">Edit quantities, costs & line items</p>
              </div>
              <button
                type="button"
                onClick={() => setChatOpen(false)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto thin-scrollbar bg-slate-50/80 px-4 py-4 space-y-4">
              {chatMessages.length === 0 ? (
                <div className="flex h-full min-h-[200px] flex-col items-center justify-center text-center px-2">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-gray-100 shadow-sm">
                    <MessageCircle className="h-6 w-6 text-primary/70" />
                  </div>
                  <p className="text-sm font-medium text-gray-800">How can I help?</p>
                  <p className="mt-1 text-xs text-gray-500 max-w-[260px] leading-relaxed">
                    Ask to adjust quantities, update costs, or explain any row in your estimate.
                  </p>
                </div>
              ) : (
                chatMessages.map((m, i) => (
                  <div
                    key={i}
                    className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[88%] px-3.5 py-2.5 text-sm leading-relaxed ${
                        m.from === 'user'
                          ? 'rounded-2xl rounded-br-md bg-primary text-white shadow-sm'
                          : 'rounded-2xl rounded-bl-md border border-gray-200 bg-white text-gray-800 shadow-sm'
                      }`}
                    >
                      {m.from === 'bot' ? (
                        <div className="prose prose-sm prose-gray max-w-none [&_p]:my-1 [&_ul]:my-1 [&_ol]:my-1">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.text}</ReactMarkdown>
                        </div>
                      ) : (
                        <p className="whitespace-pre-wrap break-words">{m.text}</p>
                      )}
                    </div>
                  </div>
                ))
              )}

              {chatSending && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-500 shadow-sm">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    Thinking…
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            <footer className="border-t border-gray-100 bg-white p-3">
              <div className="flex items-end gap-2 rounded-xl border border-gray-200 bg-gray-50/80 px-3 py-2 focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/15 transition-shadow">
                <textarea
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Message the assistant…"
                  rows={1}
                  disabled={chatSending}
                  className="flex-1 max-h-24 resize-none bg-transparent text-sm text-gray-900 placeholder:text-gray-400 outline-none disabled:opacity-60"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={sendMessage}
                  disabled={!chatInput.trim() || chatSending}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-white hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
                  aria-label="Send message"
                >
                  {chatSending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </button>
              </div>
              <p className="mt-2 text-center text-[10px] text-gray-400">
                Enter to send · Shift+Enter for new line
              </p>
            </footer>
          </div>
        </>
      )}
      {loading && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[320px] p-6 rounded-xl">
            <p className="text-center text-sm font-semibold mb-3">Processing AI…</p>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-blue-600 h-3 rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-center text-xs mt-2">{progress}%</p>
          </div>
        </div>
      )}
    </section>
  );
};

export default File;
