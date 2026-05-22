/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import React, { useMemo, useState } from 'react';
import { Modal, Box, IconButton, Typography, Grid, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckIcon from '@mui/icons-material/Check';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedTemplate } from '../../redux/templateSlice';
import { AppDispatch } from '../../redux/store';
import { S3UploadService } from "../../components/data/s3-data";
import { 
  useGetClientsQuery, 
  useGetUserProfileQuery, 
  useGetProductsQuery, 
  useGetTaxesQuery, 
  useGetDiscountsQuery,
  useGetActiveTemplatesQuery
} from "../../services/rtkapi/invoiceApi";

// Assets
import Invoice1 from "../../assets/Invoice 1.png";
import Invoice2 from "../../assets/Invoice 2.png";
import Invoice3 from "../../assets/Invoice 3.png";
import Invoice4 from "../../assets/Invoice 4.png";
import Invoice5 from "../../assets/Invoice 5.png";
import Invoice6 from "../../assets/Invoice 6.png";
import Invoice7 from "../../assets/Invoice 7.png";
import Invoice8 from "../../assets/invoice 8.png";
import Invoice9 from '../../assets/invoice 9.png';

// Import templates
import template1 from "../template/estimate 2/template1.html?raw";
import template2 from "../template/estimate 2/template2.html?raw";
import template3 from "../template/estimate 2/template3.html?raw";
import template4 from "../template/estimate 2/template4.html?raw";
import template5 from "../template/estimate 2/template5.html?raw";
import template6 from "../template/estimate 2/template6.html?raw";
import template7 from "../template/estimate 2/template7.html?raw";
import template8 from "../template/estimate 2/template8.html?raw";
import template9 from "../template/estimate 2/template9.html?raw";
import templatePremium from '../template/invoice 2/invoice_premium.html?raw';
import { replacePlaceholders } from '../template/template-document-utils';

export { replacePlaceholders };

export const templates: any[] = [
  { id: 1, src: Invoice1, alt: "Estimate Template 1", html: template1 },
  { id: 2, src: Invoice2, alt: "Estimate Template 2", html: template2 },
  { id: 3, src: Invoice3, alt: "Estimate Template 3", html: template3 },
  { id: 4, src: Invoice4, alt: "Estimate Template 4", html: template4 },
  { id: 5, src: Invoice5, alt: "Estimate Template 5", html: template5 },
  { id: 6, src: Invoice6, alt: "Estimate Template 6", html: template6 },
  { id: 7, src: Invoice7, alt: "Estimate Template 7", html: template7 },
  { id: 8, src: Invoice8, alt: "Estimate Template 8", html: template8 },
  { id: 9, src: Invoice9, alt: 'Estimate Template 9', html: template9 },
  { id: 10, src: Invoice1, alt: 'Premium Paybue Template', html: templatePremium },
];

const SelectTemplateEstimate: React.FC<any> = ({ open, onClose, previewData, setModalOpen, onConfirmActions }) => {
  const [downloadChecked, setDownloadChecked] = useState(false);
  const [emailChecked, setEmailChecked] = useState(false);
  const [loadingTemplateId, setLoadingTemplateId] = useState(null);
  const [previewFullOpen, setPreviewFullOpen] = useState(false);
  const [selectedTemplateOne, setSelectedTemplateOne] = useState(null);
  const [fullPreviewHtml, setFullPreviewHtml] = useState('');

  const dispatch = useDispatch<AppDispatch>();
  const { data: allClientsRes } = useGetClientsQuery();
  const allClientsGet = allClientsRes?.data || [];
  const { data: getCurrentUserRes } = useGetUserProfileQuery();
  const user = getCurrentUserRes?.data || getCurrentUserRes;
  const { data: allProductsRes } = useGetProductsQuery();
  const { data: allTaxesRes } = useGetTaxesQuery();
  const { data: allDiscountsRes } = useGetDiscountsQuery();

  const handleView = async (id: number) => {
    setLoadingTemplateId(id);
    setSelectedTemplateOne(id);

    const template = templates.find((t) => t.id === id);
    if (!template) return;

    const res = previewData;
    const selectedClientObj = previewData.clientObj || allClientsGet.find((c) => String(c.id) === String(res.client));
    
    const mappedItems = res.items.map((item) => {
      const productObj = allProductsRes?.data?.find((p) => p.id === item.product);
      return {
        ...item,
        productName: productObj?.name || item.product || 'Unknown Product',
      };
    });

    const logoSource = res?.logo_url || res?.logo || res?.company_logo || "";
    const signatureSource = res?.signature_url || res?.signature || "";
    const logoUrl = await S3UploadService.getFileAsBase64(logoSource, 'paybue-invoice-estimation/logos');
    const signatureUrl = await S3UploadService.getFileAsBase64(signatureSource, 'paybue-invoice-estimation/signatures');

    const transformed = {
      from: previewData.user || user,
      billTo: selectedClientObj || {},
      invoiceNumber: res.number,
      invoiceDate: res.invoiceDate,
      expirationDate: res.invoiceDue,
      terms: res.notes,
      logo: logoUrl,
      signature: signatureUrl,
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

  return (
    <>
      <Modal open={open} onClose={(e, r) => r !== 'backdropClick' && onClose()}>
        <Box sx={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: '95%', maxWidth: 1300, bgcolor: '#fff', borderRadius: 3, boxShadow: 24,
          overflow: 'hidden', maxHeight: '95vh', display: 'flex'
        }}>
          <Box sx={{ flex: 1, p: 3, overflowY: 'auto' }}>
            <Box sx={{
              background: '#0b0e3f', p: 2, borderRadius: 2, mb: 3, textAlign: 'center', color: '#fff', position: 'relative'
            }}>
              <Typography variant="h6">Select the Estimate template</Typography>
              <IconButton onClick={onClose} sx={{ position: 'absolute', top: 10, right: 10, color: '#fff' }}>
                <CloseIcon />
              </IconButton>
            </Box>

            <Grid container spacing={3}>
              {templates.map((t) => (
                <Grid item xs={12} sm={6} md={6} lg={4} key={t.id}>
                  <Box sx={{
                    border: selectedTemplateOne === t.id ? '2px solid #22c55e' : '1px solid #ddd',
                    borderRadius: 2, overflow: 'hidden', cursor: 'pointer', position: 'relative'
                  }} onClick={() => handleSelectTemplate(t.id)}>
                    {selectedTemplateOne === t.id && (
                      <Box sx={{ position: 'absolute', top: 10, right: 10, background: '#22c55e', p: 0.8, borderRadius: '50%' }}>
                        <CheckIcon sx={{ color: '#fff', fontSize: 16 }} />
                      </Box>
                    )}
                    <img src={t.src} style={{ width: '100%', height: '400px', objectFit: 'contain' }} />
                    <Box sx={{ textAlign: 'center', py: 2, fontWeight: '600' }}>{t.alt}</Box>
                    <Box textAlign="center" pb={2} display="flex" justifyContent="center" gap={1}>
                      <button onClick={(e) => { e.stopPropagation(); handleView(t.id); }}
                        style={{ background: '#0b0e3f', color: 'white', padding: '8px 14px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}>
                        {loadingTemplateId === t.id ? 'Loading...' : 'View'}
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); handleSelectTemplate(t.id); }}
                        style={{ background: '#22c55e', color: 'white', padding: '8px 14px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}>
                        Select
                      </button>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>

            <Box sx={{ borderTop: '1px solid #e5e7eb', pt: 2, mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ color: '#6b7280' }}>
                {selectedTemplateOne ? '1 template selected' : 'Please select a template'}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                {selectedTemplateOne && (
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mr: 2 }}>
                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                      <input type="checkbox" checked={downloadChecked} onChange={(e) => setDownloadChecked(e.target.checked)} style={{ marginRight: '8px' }} />
                      <Typography variant="body2">Download document</Typography>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                      <input type="checkbox" checked={emailChecked} onChange={(e) => setEmailChecked(e.target.checked)} style={{ marginRight: '8px' }} />
                      <Typography variant="body2">Send by email</Typography>
                    </label>
                  </Box>
                )}
                <button onClick={onClose} style={{ background: '#f3f4f6', color: '#111827', padding: '10px 18px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                  Cancel
                </button>
                <button disabled={!selectedTemplateOne || (!downloadChecked && !emailChecked)}
                  onClick={() => {
                    if (onConfirmActions) onConfirmActions(selectedTemplateOne, downloadChecked, emailChecked);
                    else { dispatch(setSelectedTemplate(selectedTemplateOne)); onClose(); }
                  }}
                  style={{
                    background: (selectedTemplateOne && (downloadChecked || emailChecked)) ? '#0b0e3f' : '#9ca3af',
                    color: 'white', padding: '10px 24px', borderRadius: '8px', border: 'none',
                    cursor: (selectedTemplateOne && (downloadChecked || emailChecked)) ? 'pointer' : 'not-allowed', fontWeight: 600
                  }}>
                  Confirm Select
                </button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Modal>

      <Modal open={previewFullOpen} onClose={() => setPreviewFullOpen(false)}>
        <Box sx={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: '70%', maxWidth: 1000, bgcolor: '#fff', borderRadius: 3, p: 3, boxShadow: 24,
          overflowY: 'auto', maxHeight: '95vh'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <IconButton onClick={() => { setPreviewFullOpen(false); setModalOpen(true); }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" sx={{ ml: 1 }}>Preview Template</Typography>
          </Box>
          <iframe title="Template Preview" srcDoc={fullPreviewHtml} style={{ width: '100%', height: '75vh', border: 'none' }} />
        </Box>
      </Modal>
    </>
  );
};

export default SelectTemplateEstimate;