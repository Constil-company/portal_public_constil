/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import {
  TextField,
  Checkbox,
  Autocomplete,
  Chip,
  CircularProgress,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import GroupIcon from '@mui/icons-material/Group';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { toast } from "react-toastify";
import {
  useCreateEstimateEmailMutation,
  useCreateInvoiceEmailMutation,
  useGetClientsQuery,
  useGetUserProfileQuery,
} from '../../services/rtkapi/invoiceApi';
// import InvoiceShareModal from '../../components/modal/invoice-share-modal';

export function ClientSupport() {
  const navigate = useNavigate();
  const path = useLocation();
  const activeRoute = path.pathname;
  const { data: allclients } = useGetClientsQuery();
  const { data: userprofile } = useGetUserProfileQuery();
  const [openTemplateModal, setOpenTemplateModal] = useState(false);
  // const [selectedTemplateId, setSelectedTemplateId] = useState(null);

  const [createInvoiceEmail] = useCreateInvoiceEmailMutation();
  const [createEstimateEmail] = useCreateEstimateEmailMutation();

  const [sendEmailCopy, setSendEmailCopy] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedClients, setSelectedClients] = useState<any[]>([]);
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const senderEmail = userprofile?.data?.register?.email || '';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
    }

  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedClients.length) {
      toast.error('Please select at least one client');
      return;
    }

    if (!file) {
      toast.error('Please upload a file');
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      selectedClients.forEach((client) => {
        formData.append('clients', client.id);
      });
      formData.append('file', file);
      formData.append('summary', summary);
      formData.append('description', description);
      formData.append('copy', sendEmailCopy ? 'True' : 'False');

      const isEstimatePage = activeRoute === '/estimates/support';
      const response = isEstimatePage
        ? await createEstimateEmail(formData).unwrap()
        : await createInvoiceEmail(formData).unwrap();

      toast.success('Email sent successfully!');
      navigate(-1);
    } catch (error) {
      const err = error as any;
      const message =
        err?.data?.message ||
        (Array.isArray(err?.data) ? err.data[0] : undefined) ||
        err?.message ||
        'Failed to send email';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex flex-col lg:flex-row gap-6 overflow-hidden">
      <div className="w-full bg-white rounded-2xl shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-12 h-full gap-6 p-6">
            {/* LEFT SECTION */}
            <div className="col-span-12 lg:col-span-7 space-y-6 overflow-y-auto pr-4">
              {/* FROM */}
              <div>
                <h1 className="text-gray-900 font-semibold uppercase text-sm mb-2">
                  FROM
                </h1>
                <TextField
                  type="email"
                  value={senderEmail}
                  fullWidth
                  disabled
                  variant="outlined"
                  InputProps={{ className: 'h-12' }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                />
              </div>

              {/* SEND TO */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h1 className="text-gray-900 font-semibold uppercase text-sm">
                    SEND TO
                  </h1>
                  <button
                    type="button"
                    className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg flex items-center justify-center gap-2 text-gray-700 font-medium whitespace-nowrap transition-colors"
                  >
                    <GroupIcon />
                    <span className="hidden sm:inline">Company/Client List</span>
                    <span className="sm:hidden">List</span>
                  </button>
                </div>

                <Autocomplete
                  multiple
                  options={allclients?.data || []}
                  getOptionLabel={(option) => `${option.name} (${option.email})`}
                  value={selectedClients}
                  onChange={(_, newValue) => setSelectedClients(newValue)}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        label={option.email}
                        {...getTagProps({ index })}
                        key={option.id}
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Select multiple clients"
                      variant="outlined"
                      fullWidth
                      InputProps={{
                        ...params.InputProps,
                        className: 'h-12',
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                        },
                      }}
                    />
                  )}
                />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={sendEmailCopy}
                  onChange={(e) => setSendEmailCopy(e.target.checked)}
                  sx={{
                    color: '#1A1E50',
                    '&.Mui-checked': { color: '#1A1E50' },
                  }}
                />
                <h1 className="text-gray-700 text-sm">Send me email copy</h1>
              </div>

              {/* SUMMARY */}
              <div>
                <h1 className="text-gray-900 font-semibold uppercase text-sm mb-2">
                  SUMMARY
                </h1>
                <TextField
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputProps={{ className: 'h-12' }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                    },
                  }}
                />
              </div>

              {/* DESCRIPTION */}
              <div>
                <h1 className="text-gray-900 font-semibold uppercase text-sm mb-2">
                  DESCRIPTION
                </h1>
                <TextField
                  multiline
                  rows={6}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  fullWidth
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                    },
                  }}
                />
              </div>
            </div>

            {/* RIGHT SECTION (ATTACHMENT) */}
            <div className="col-span-12 lg:col-span-5 space-y-6 overflow-y-auto border-l-0 lg:border-l border-dashed border-gray-300 pl-0 lg:pl-6">
              <div>
                <h1 className="text-gray-900 font-semibold uppercase text-sm mb-3">
                  ATTACHMENT
                </h1>

                {/* Preview */}
                {file ? (
                  <div className="border border-gray-200 rounded-xl p-4 mb-4 text-sm text-gray-700">
                    <p>
                      <strong>File:</strong> {file.name}
                    </p>
                    <p>{(file.size / 1024).toFixed(2)} KB</p>
                  </div>
                ) : (
                  <div className="border border-gray-200 rounded-xl p-4 mb-4 text-gray-500">
                    No file selected
                  </div>
                )}

                {/* Upload Button */}
                <div className="grid gap-4">
                  <label
                    onClick={() => setOpenTemplateModal(true)}
                    className="cursor-pointer border-2 border-dashed border-gray-300 hover:border-[#448AFF] rounded-xl p-6 flex flex-col items-center justify-center gap-2 text-gray-500 hover:text-[#448AFF] transition-colors"
                  >
                    <UploadFileIcon />
                    <span className="text-sm font-medium">
                      Upload new file
                    </span>
                  </label>
                </div>

              </div>
            </div>
          </div>

          {/* FOOTER BUTTONS */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto cursor-pointer px-6 py-3 bg-[#FDD1D1] hover:bg-[#fbc8c8] text-white rounded-xl font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto cursor-pointer px-6 py-3 bg-[#1A1E50] hover:bg-[#252a60] text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-70"
            >
              {loading ? (
                <>
                  <CircularProgress size={20} color="inherit" />
                  Sending...
                </>
              ) : (
                'Send the email'
              )}
            </button>
          </div>
        </form>
      </div>
      {/* <InvoiceShareModal
        open={openTemplateModal}
        onClose={() => setOpenTemplateModal(false)}
        onSelect={(id) => {
          setSelectedTemplateId(id);
          setOpenTemplateModal(false);
        }}
      /> */}

    </div>
  );
}
