/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { S3UploadService } from "../data/s3-data";
import React, { useMemo, useState } from 'react';
import { Modal, Box, IconButton, Typography, Grid, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckIcon from '@mui/icons-material/Check';

// IMAGES + HTML IMPORTS (your existing code)
import logoImage from '../template/estimate 3/assets/CONSTIL.svg'
import logoWhite from '../template/estimate 3/assets/CONSTILWHite.svg'
import Invoice1 from '../../assets/Invoice 1.png';
import Invoice2 from '../../assets/Invoice 2.png';
import Invoice3 from '../../assets/Invoice 3.png';
import Invoice4 from '../../assets/Invoice 4.png';
import Invoice5 from '../../assets/Invoice 5.png';
import Invoice6 from '../../assets/Invoice 6.png';
import Invoice7 from '../../assets/Invoice 7.png';
import Invoice8 from '../../assets/invoice 8.png';
import Invoice9 from '../../assets/invoice 9.png';

import template1 from '../template/invoice 3/invoice1.html?raw';
import template2 from '../template/invoice 3/invoice2.html?raw';
import template3 from '../template/invoice 3/Invoice3.html?raw';
import template4 from '../template/invoice 3/invoice4.html?raw';
import template5 from '../template/invoice 3/invoice5.html?raw';
import template6 from '../template/invoice 3/invoice6.html?raw';
import template7 from '../template/invoice 3/invoice7.html?raw';
import template8 from '../template/invoice 3/invoice8.html?raw';
import template9 from '../template/invoice 3/invoice9.html?raw';

import {
  useGetClientsQuery,
  useGetPackageBuyQuery,
  useGetProductsQuery,
  useGetUserProfileQuery,
  useGetTaxesQuery,
  useGetDiscountsQuery,
} from '../../services/rtkapi/invoiceApi';
import { InvoiceData } from '../../types/invoice';
import { useDispatch } from 'react-redux';
import { setSelectedTemplate } from '../../redux/templateSlice';
import { AppDispatch } from '../../redux/store';
import { replacePlaceholders } from '../template/template-document-utils';

export { replacePlaceholders };

export const templates = [
  { id: 1, src: Invoice1, alt: 'Invoice Template 1', html: template1 },
  { id: 2, src: Invoice2, alt: 'Invoice Template 2', html: template2 },
  { id: 3, src: Invoice3, alt: 'Invoice Template 3', html: template3 },
  { id: 4, src: Invoice4, alt: 'Invoice Template 4', html: template4 },
  { id: 5, src: Invoice5, alt: 'Invoice Template 5', html: template5 },
  { id: 6, src: Invoice6, alt: 'Invoice Template 6', html: template6 },
  { id: 7, src: Invoice7, alt: 'Invoice Template 7', html: template7 },
  { id: 8, src: Invoice8, alt: 'Invoice Template 8', html: template8 },
  { id: 9, src: Invoice9, alt: 'Invoice Template 9', html: template9 },
];

const SelectTemplate = ({ open, onClose, previewData, setModalOpen, onConfirmActions }) => {
  const [downloadChecked, setDownloadChecked] = useState(false);
  const [emailChecked, setEmailChecked] = useState(false);

  const [loadingTemplateId, setLoadingTemplateId] = useState(null);
  const dispatch = useDispatch<AppDispatch>();
  const [previewFullOpen, setPreviewFullOpen] = useState(false);
  const [selectedTemplateOne, setSelectedTemplateOne] = useState(null);
  const [fullPreviewHtml, setFullPreviewHtml] = useState('');
  const { data: allClients } = useGetClientsQuery();
  const allClientsGet = allClients?.data || [];
  const { data: getCurrentUser } = useGetUserProfileQuery();
  const { data: allproducts } = useGetProductsQuery();
  const { data: allTaxes } = useGetTaxesQuery();
  const { data: allDiscounts } = useGetDiscountsQuery();
  const { data, isLoading } = useGetPackageBuyQuery();

  const availableTemplates = useMemo(() => {
    const wallet = data?.wallet;
    if (!wallet) return [];

    // Prioritize boolean flags if they exist
    if (wallet.enterprise_templates) return templates;
    if (wallet.professional_templates) return templates;
    if (wallet.basic_templates) return templates.slice(0, 3);

    // If edge functions omit these keys, conservatively give access to templates 
    // to prevent blank screen bug
    return templates;
  }, [data]);
  const handleView = async (id: number) => {
    setLoadingTemplateId(id);
    setSelectedTemplateOne(id); // Automatically select when viewing to avoid mismatched downloads

    const template = templates.find((t) => t.id === id);
    if (!template) return;

    const res = previewData;
    const clientId = res.client;
    const selectedClientObj = allClientsGet.find((c) => c.id === clientId);
    
    // Enrich items with their calculated total rates for specific preview
    console.log("[Preview] Processing items for preview. Taxes available:", !!allTaxes, "Discounts available:", !!allDiscounts);
    const mappedItems = res.items.map((item, idx) => {
      const productObj = allproducts?.data?.find((p) => p.id === item.product);
      
      // Resolve discount rates
      let dRate = 0;
      if (Array.isArray(item.discount)) {
        item.discount.forEach(d => {
          if (typeof d === 'object' && d.rate !== undefined) {
            dRate += (parseFloat(d.rate) || 0);
          } else {
            const found = allDiscounts?.data?.find(x => String(x.id) === String(d));
            console.log(`[Preview] Item ${idx} discount lookup for ${d}:`, found ? found.rate : "NOT FOUND");
            if (found) dRate += (parseFloat(found.rate) || 0);
          }
        });
      } else if (typeof item.discount === 'number') {
        dRate = item.discount;
      }

      // Resolve tax rates
      let tRate = 0;
      if (Array.isArray(item.tax)) {
        item.tax.forEach(t => {
          if (typeof t === 'object' && t.rate !== undefined) {
            tRate += (parseFloat(t.rate) || 0);
          } else {
            const found = allTaxes?.data?.find(x => String(x.id) === String(t));
            if (found) tRate += (parseFloat(found.rate) || 0);
          }
        });
      } else if (typeof item.tax === 'number') {
        tRate = item.tax;
      }

      return {
        ...item,
        productName: productObj?.name || item.product || 'Unknown Product',
        discount: dRate,
        tax: tRate,
      };
    });

            const logoSource = res?.logo_url || res?.logo || res?.company_logo || res?.company?.logo_url || "";
    const signatureSource = res?.signature_url || res?.signature || res?.user?.signature_url || res?.user?.signature || "";
    
    const logoUrl = await S3UploadService.getFileAsBase64(logoSource, 'paybue-invoice-estimation/logos');
    const signatureUrl = await S3UploadService.getFileAsBase64(signatureSource, 'paybue-invoice-estimation/signatures');

    const transformed = {
      from: getCurrentUser?.data || getCurrentUser,
      billTo: selectedClientObj || {},
      invoiceNumber: res.number,
      invoiceDate: res.invoiceDate,
      expirationDate: res.invoiceDue,
      terms: res.notes,
      logo: logoUrl,
      signature: signatureUrl,
      amount: mappedItems.reduce((acc, item) => {
        const sub = item.price * item.quantity;
        const disc = (sub * item.discount) / 100;
        const tax = ((sub - disc) * item.tax) / 100;
        return acc + (sub - disc + tax);
      }, 0),
      items: mappedItems || [],
    };

    const finalHTML = replacePlaceholders(template.html, transformed as any);
    setFullPreviewHtml(finalHTML);
    onClose();
    setPreviewFullOpen(true);
    setLoadingTemplateId(null);
  };
  const handleSelectTemplate = (id) => {
    setSelectedTemplateOne(id);
  };

  const pathCheck = window.location.pathname === '/invoices/new' ? 'Invoice' : 'Estimate';

  return (
    <>
      {/* ---------------------------- MAIN TEMPLATE LIST MODAL ---------------------------- */}
      <Modal
        open={open}
        onClose={(event, reason) => {
          if (reason === 'backdropClick') return;
          onClose();
        }}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '95%',
            maxWidth: 1300,
            bgcolor: '#fff',
            borderRadius: 3,
            boxShadow: 24,
            overflow: 'hidden',
            maxHeight: '95vh',
            display: 'flex',
          }}>
          {/* LEFT SIDE */}
          <Box
            sx={{ flex: 1, p: 3, overflowY: 'auto' }}>
            <Box
              sx={{
                background: '#0b0e3f',
                p: 2,
                borderRadius: 2,
                mb: 3,
                textAlign: 'center',
                color: '#fff',
                position: 'relative',
              }}>
              <Typography variant="h6">Select the {pathCheck} template</Typography>

              <IconButton
                onClick={() => {
                  onClose();
                  setPreviewFullOpen(false);
                }}
                sx={{ position: 'absolute', top: 10, right: 10, color: '#fff' }}>
                <CloseIcon />
              </IconButton>
            </Box>

            {isLoading ? (
              <Box display="flex" justifyContent="center" py={5}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                <Grid container spacing={3}>
                  {availableTemplates.map((t) => (
                    <Grid item xs={12} sm={6} md={6} lg={4} key={t.id}>
                      <Box
                        sx={{
                          border: selectedTemplateOne === t.id ? '2px solid #22c55e' : '1px solid #ddd',
                          borderRadius: 2,
                          overflow: 'hidden',
                          cursor: 'pointer',
                          position: 'relative',
                        }}>
                        {selectedTemplateOne === t.id && (
                          <Box
                            sx={{
                              position: 'absolute',
                              top: 10,
                              right: 10,
                              background: '#22c55e',
                              p: 0.8,
                              borderRadius: '50%',
                            }}>
                            <CheckIcon sx={{ color: '#fff', fontSize: 16 }} />
                          </Box>
                        )}

                        <img
                          src={t.src}
                          style={{
                            width: '100%',
                            height: '400px',
                            // objectFit: "cover",
                          }}
                        />

                        <Box sx={{ textAlign: 'center', py: 2, fontWeight: '600' }}>{t.alt}</Box>

                        {/* VIEW BUTTON */}
                        <Box textAlign="center" pb={2}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleView(t.id);
                            }}
                            style={{
                              background: '#0b0e3f',
                              color: 'white',
                              padding: '8px 14px',
                              borderRadius: '6px',
                              border: 'none',
                              cursor: 'pointer',
                            }}>
                            {loadingTemplateId === t.id ? 'Loading...' : 'View'}
                          </button>
                        </Box>

                        <Box textAlign="center" pb={2}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectTemplate(t.id); // sirf local state
                            }}
                            style={{
                              background: '#22c55e',
                              color: 'white',
                              padding: '8px 14px',
                              borderRadius: '6px',
                              border: 'none',
                              cursor: 'pointer',
                            }}>
                            Select
                          </button>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
                <Box
                  sx={{
                    borderTop: '1px solid #e5e7eb',
                    pt: 2,
                    mt: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: '#fff',
                  }}
                >
                  <Typography variant="body2" sx={{ color: '#6b7280' }}>
                    {selectedTemplateOne
                      ? '1 template selected'
                      : 'Please select a template'}
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    {selectedTemplateOne && (
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mr: 2 }}>
                        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={downloadChecked}
                            onChange={(e) => setDownloadChecked(e.target.checked)}
                            style={{ marginRight: '8px' }}
                          />
                          <Typography variant="body2">Download document</Typography>
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={emailChecked}
                            onChange={(e) => setEmailChecked(e.target.checked)}
                            style={{ marginRight: '8px' }}
                          />
                          <Typography variant="body2">Send by email</Typography>
                        </label>
                      </Box>
                    )}

                    <button
                      onClick={onClose}
                      style={{
                        background: '#f3f4f6',
                        color: '#111827',
                        padding: '10px 18px',
                        borderRadius: '8px',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: 600,
                      }}
                    >
                      Cancel
                    </button>

                    <button
                      disabled={!selectedTemplateOne || (!downloadChecked && !emailChecked)}
                      onClick={() => {
                        if (onConfirmActions) {
                          onConfirmActions(selectedTemplateOne, downloadChecked, emailChecked);
                        } else {
                          dispatch(setSelectedTemplate(selectedTemplateOne));
                          onClose();
                        }
                      }}
                      style={{
                        background: (selectedTemplateOne && (downloadChecked || emailChecked)) ? '#0b0e3f' : '#9ca3af',
                        color: 'white',
                        padding: '10px 24px',
                        borderRadius: '8px',
                        border: 'none',
                        cursor: (selectedTemplateOne && (downloadChecked || emailChecked)) ? 'pointer' : 'not-allowed',
                        fontWeight: 600,
                      }}
                    >
                      Confirm Select
                    </button>
                  </Box>
                </Box>

              </>
            )}
          </Box>
        </Box>
      </Modal>

      <Modal open={previewFullOpen} onClose={() => setPreviewFullOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '60%',
            maxWidth: 1000,
            bgcolor: '#fff',
            borderRadius: 3,
            p: 2,
            boxShadow: 24,
            overflowY: 'auto',
            maxHeight: '95vh',
          }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <IconButton
              onClick={() => {
                setModalOpen(true);
              }}>
              <ArrowBackIcon />
            </IconButton>

            <Typography variant="h6" sx={{ ml: 1 }}>
              Preview Template
            </Typography>
          </Box>

          <iframe
            title="Invoice template preview"
            srcDoc={fullPreviewHtml}
            style={{ width: "100%", height: "75vh", border: "none", display: "block" }}
          />
        </Box>
      </Modal>
    </>
  );
};

export default SelectTemplate;
