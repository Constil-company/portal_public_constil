import { useEffect, useState } from 'react';
import { useGetLegalInfoQuery, useUploadLegalInfoMutation } from '../../services/rtkapi/invoiceApi';
import { toast } from 'react-toastify';

/* eslint-disable @typescript-eslint/no-explicit-any */

const inputStyle =
  'w-full mt-1 px-3 py-2 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500';

const selectStyle =
  'w-full mt-1 px-3 py-2 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500';

const Row = ({ label, value, right }: any) => (
  <div className="grid grid-cols-12 gap-4 py-4 border-b border-gray-300 last:border-b-0 items-center">
    <div className="col-span-12 md:col-span-4 text-sm text-gray-500">{label}</div>
    <div className="col-span-12 md:col-span-6">{value}</div>
    {right && <div className="col-span-12 md:col-span-2 text-right text-sm text-indigo-600">{right}</div>}
  </div>
);

const LegalInfo = () => {
  const { data } = useGetLegalInfoQuery();
  const [uploadLegalInfo, { isLoading }] = useUploadLegalInfoMutation();

  const [form, setForm] = useState<any>({
    company_legal_name: '',
    tax_id_number: '', // Note: This column is missing from DB
    address: '',
    industry: 'Other',
  });

  useEffect(() => {
    if (data?.data) {
      const info = data.data;
      setForm({
        company_legal_name: info.company_legal_name || '',
        tax_id_number: info.tax_id_number || '',
        address: info.address || '',
        industry: info.industry || 'Other',
      });
    }
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        toast.error("Session expired. Please log in again.");
        return;
      }
      
      const decoded: any = JSON.parse(atob(token.split('.')[1]));
      const userId = decoded.sub;
      const userEmail = decoded.email;

      // Start with existing data to satisfy NOT NULL constraints
      const payload: any = {
        ...(data?.data || {}),
        user_id: userId,
        company_legal_name: form.company_legal_name,
        address: form.address,
        industry: form.industry,
        tax_id_number: form.tax_id_number,
      };

      // Ensure required fields are not null
      if (!payload.company_email) payload.company_email = userEmail || "";
      if (!payload.company_phone) payload.company_phone = "";
      
      // Remove any unwanted internal fields if they exist
      delete payload.id;
      delete payload.created_at;

      await uploadLegalInfo(payload).unwrap();

      toast.success('Legal info updated successfully');
    } catch (err: any) {
      console.error("Legal info update error:", err);
      toast.error(err?.data?.message || err?.data?.detail || "Failed to update legal info");
    }
  };

  return (
    <>
      <div className="flex justify-between mb-4">
        <div>
          <div className="text-sm font-semibold">Legal Info</div>
          <div className="text-xs text-gray-500">This is the information your business uses for tax.</div>
        </div>

        <button
          onClick={handleUpdate}
          className="text-sm text-indigo-600 cursor-pointer hover:text-indigo-700 font-bold"
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : 'Save'}
        </button>
      </div>

      <Row
        label="Legal business name"
        value={
          <input
            name="company_legal_name"
            value={form.company_legal_name}
            onChange={handleChange}
            className={inputStyle}
            placeholder="Official business name"
          />
        }
      />

      <Row
        label="EIN / SSN"
        value={
          <input
            name="tax_id_number"
            value={form.tax_id_number}
            onChange={handleChange}
            className={inputStyle}
            placeholder="12-3456789"
          />
        }
      />

      <Row
        label="Business type / Industry"
        value={
          <select
            name="industry"
            value={form.industry}
            onChange={handleChange}
            className={selectStyle}
          >
            <option value="Construction">Construction</option>
            <option value="Real Estate">Real Estate</option>
            <option value="Consulting">Consulting</option>
            <option value="Retail">Retail</option>
            <option value="Other">Other</option>
          </select>
        }
      />

      <Row
        label="Legal address"
        value={
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            className={inputStyle}
            placeholder="Official registered address"
          />
        }
      />
    </>
  );
};

export default LegalInfo;